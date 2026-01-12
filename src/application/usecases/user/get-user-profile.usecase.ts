import {
  GetUserProfileRequest,
  GetUserProfileResponse,
  IUserRepository,
} from '@domain/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        picUrl: true,
      },
      where: { id: userId },
    });

    if (!user) throw new Error('GET_USER_PROFILE_USECASE.USER_NOT_FOUND');

    return {
      name: user.name,
      email: user.email,
      picUrl: user.picUrl ?? '-',
    };
  }
}
