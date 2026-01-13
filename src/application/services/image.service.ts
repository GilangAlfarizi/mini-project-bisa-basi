import { UploadImageRequest, UploadImageResponse } from '@domain/image';

export abstract class IImageService {
  abstract uploadPicture(req: UploadImageRequest): Promise<UploadImageResponse>;
  abstract deleteOldPicture(url: string): Promise<void>;
}
