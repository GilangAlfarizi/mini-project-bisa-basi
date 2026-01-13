import { IImageService } from '@application/services';
import { DB, Database } from '@database';
import { IUserRepository, UpdateUserProfilePictureRequest } from '@domain/user';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateUserProfilePictureUseCase {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly userRepository: IUserRepository,
    private readonly imageService: IImageService,
  ) {}

  async execute({
    userId,
    file,
  }: UpdateUserProfilePictureRequest): Promise<void> {
    return this.db.transaction(async (tx) => {
      const user = await this.userRepository.findOne(
        {
          select: {
            id: true,
            picUrl: true,
          },
          where: { id: userId },
        },
        tx,
      );

      if (!user) throw new Error('GET_USER_PROFILE_USECASE.USER_NOT_FOUND');

      const uploadResult = await this.imageService.uploadPicture({
        buffer: file.buffer,
        path: 'users',
      });

      if (user.picUrl) {
        await this.imageService.deleteOldPicture(user.picUrl);
      }

      await this.userRepository.update(
        {
          data: { picUrl: uploadResult.url },
          where: { id: userId },
        },
        tx,
      );
    });
  }
}
