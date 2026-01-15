import { IPaymentService } from '@application/services';
import { Database, DB } from '@database';
import { ICampaignRepository } from '@domain/campaign';
import {
  CreateUserDonationRequest,
  CreateUserDonationResponse,
  IDonationRepository,
} from '@domain/donation';
import { PaymentStatus } from '@domain/enums';
import { IUserRepository } from '@domain/user';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserDonationUseCase {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly donationRepository: IDonationRepository,
    private readonly userRepository: IUserRepository,
    private readonly campaignRepository: ICampaignRepository,
    private readonly paymentService: IPaymentService,
  ) {}

  execute(req: CreateUserDonationRequest): Promise<CreateUserDonationResponse> {
    return this.db.transaction(async (tx) => {
      const user = await this.userRepository.findOne({
        select: { id: true, email: true, name: true },
        where: { id: req.userId },
      });

      if (!user) throw new Error('CREATE_USER_DONATION_USECASE.USER_NOT_FOUND');

      const campaign = await this.campaignRepository.findOne({
        select: { id: true, name: true, totalAmount: true },
        where: { id: req.campaignId },
      });

      if (!campaign)
        throw new Error('CREATE_USER_DONATION_USECASE.CAMPAIGN_NOT_FOUND');

      const orderId = this.paymentService.generateOrderId();

      const transactionDetails = {
        order_id: orderId,
        gross_amount: req.amount,
      };

      const customerDetails = {
        email: user.email,
        first_name: user.name,
        last_name: '',
        phone: '',
      };

      const itemsDetails = [
        {
          id: campaign.id,
          price: req.amount,
          quantity: 1,
          name: this.shortenTitle(campaign.name),
        },
      ];

      const midtransResult = await this.paymentService.createOrder({
        transactionDetails,
        customerDetails,
        itemsDetails,
      });

      await this.donationRepository.create(
        {
          data: {
            userId: user.id,
            campaignId: campaign.id,
            orderId: orderId,
            midtransToken: midtransResult.token,
            amount: req.amount,
            status: PaymentStatus.PENDING,
          },
        },
        tx,
      );

      return { midtransUrl: midtransResult.redirect_url };
    });
  }

  private shortenTitle(title: string) {
    if (title.length > 50) {
      return title.substring(0, 47) + '...';
    }

    return title;
  }
}
