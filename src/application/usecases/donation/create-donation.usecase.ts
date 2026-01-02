import { Database, DB } from '@database';
import { CreateCampaignResponse, ICampaignRepository } from '@domain/campaign';
import { CreateDonationRequest, IDonationRepository } from '@domain/donation';
import { IUserRepository } from '@domain/user';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateDonationUseCase {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly donationRepository: IDonationRepository,
    private readonly userRepository: IUserRepository,
    private readonly campaignRepository: ICampaignRepository,
  ) {}

  execute(req: CreateDonationRequest): Promise<CreateCampaignResponse> {
    return this.db.transaction(async (tx) => {
      const user = await this.userRepository.findOne({
        select: { id: true },
        where: { id: req.userId },
      });

      if (!user) throw new Error('CREATE_DONATION_USECASE.USER_NOT_FOUND');

      const campaign = await this.campaignRepository.findOne({
        select: { id: true, totalAmount: true },
        where: { id: req.campaignId },
      });

      if (!campaign)
        throw new Error('CREATE_DONATION_USECASE.CAMPAIGN_NOT_FOUND');

      const donation = await this.donationRepository.create(
        {
          data: { ...req },
        },
        tx,
      );

      await this.campaignRepository.update(
        {
          data: { totalAmount: campaign.totalAmount + req.amount },
          where: { id: campaign.id },
        },
        tx,
      );

      return { id: donation.id };
    });
  }
}
