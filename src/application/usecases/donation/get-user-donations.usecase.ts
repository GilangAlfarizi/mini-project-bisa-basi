import {
  GetUserDonationsRequest,
  GetUserDonationsResponse,
  IDonationRepository,
} from '@domain/donation';
import { IUserRepository } from '@domain/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserDonationsUseCase {
  constructor(
    private readonly donationRepository: IDonationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    req: GetUserDonationsRequest,
  ): Promise<GetUserDonationsResponse[]> {
    const user = await this.userRepository.findOne({
      select: { id: true },
      where: { id: req.userId },
    });

    if (!user) {
      throw new Error('GET_USER_DONATIONS_USECASE.USER_NOT_FOUND');
    }

    const donations =
      await this.donationRepository.userDonationsWithCampaignAndCategory(req);

    return donations;
  }
}
