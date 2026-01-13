import { IImageService } from '@application/services';
import { UploadImageRequest, UploadImageResponse } from '@domain/image';
import { CLOUDINARY } from '@infrastructure/symbols';
import { Inject, Injectable } from '@nestjs/common';
import { v2 as CloudinaryType, UploadApiResponse } from 'cloudinary';

@Injectable()
export class ImageService implements IImageService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryType,
  ) {}

  async uploadPicture(req: UploadImageRequest): Promise<UploadImageResponse> {
    const uploadResult: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        this.cloudinary.uploader
          .upload_stream({ folder: req.path }, (error, uploadResult) => {
            if (error) {
              return reject(error);
            }
            return resolve(uploadResult);
          })
          .end(req.buffer);
      },
    );
    return {
      url: uploadResult?.url ?? '',
      publicId: uploadResult?.public_id ?? '',
    };
  }

  async deleteOldPicture(url: string): Promise<void> {
    const publicId = url
      .split('/upload/')[1]
      .replace(/^v\d+\//, '')
      .replace(/\.\w+$/, '');

    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
