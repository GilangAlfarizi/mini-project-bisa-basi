import {
  GetUserDonationsRequest,
  GetUserDonationsResponse,
  IDonationRepository,
} from '@domain/donation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserDonationsUseCase {
  constructor(private readonly donationRepository: IDonationRepository) {}

  async execute(
    req: GetUserDonationsRequest,
  ): Promise<GetUserDonationsResponse[]> {
    const donations = await this.donationRepository.findMany({
      select: { id: true, campaignId: true, amount: true },
      where: { userId: req.userId },
    });

    return donations.map((donation) => ({
      id: donation.id,
      campaignId: donation.campaignId,
      campaignName: '-',
      donationAmount: donation.amount,
      campaignTotalAmount: 10000,
    }));
  }
}
