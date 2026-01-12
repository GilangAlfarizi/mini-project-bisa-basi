import { IImageService } from '@application/services';
import { UploadImageRequest } from '@domain/image';
import { envsConfig } from '@infrastructure/envs';
import { v2 as cloudinary } from 'cloudinary';

export class ImageService implements IImageService {
  constructor() {
    cloudinary.config({
      cloud_name: envsConfig().cloudinaryCloudName,
      api_key: envsConfig().cloudinaryApiKey,
      api_secret: envsConfig().cloudinaryApiSecret,
    });
  }

  async uploadPicture(req: UploadImageRequest): Promise<any> {
    return await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: req.path,
            resource_type: 'image',
          },
          (error, uploadResult) => {
            if (error) {
              return reject(error);
            }
            return resolve(uploadResult);
          },
        )
        .end(req.buffer);
    }).catch((error) => {
      console.error(error);
    });
  }

  async deleteOldPicture(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
