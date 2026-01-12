import { UploadImageRequest } from '@domain/image';

export abstract class IImageService {
  abstract uploadPicture(req: UploadImageRequest): Promise<any>;
  abstract deleteOldPicture(publicId: string): Promise<any>;
}
