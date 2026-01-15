import { ICampaignRepository } from '@domain/campaign';
import { IDonationRepository } from '@domain/donation';
import { PaymentStatus } from '@domain/enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookMidtransUseCase {
  constructor(
    private readonly donationRepository: IDonationRepository,
    private readonly campaignRepository: ICampaignRepository,
  ) {}

  async execute({
    order_id,
    transaction_status,
    payment_type,
    gross_amount,
  }): Promise<void> {
    const donation = await this.donationRepository.findOne({
      select: { id: true, campaignId: true },
      where: { orderId: order_id },
    });

    if (!donation) return;

    const campaign = await this.campaignRepository.findOne({
      select: { id: true, totalAmount: true },
      where: { id: donation.campaignId },
    });

    if (!campaign) return;

    let status: PaymentStatus;
    switch (transaction_status) {
      case 'settlement':
        status = PaymentStatus.SETTLEMENT;
        break;

      case 'expire':
        status = PaymentStatus.CANCEL;
        break;

      case 'cancel':
        status = PaymentStatus.CANCEL;
        break;

      case 'deny':
        status = PaymentStatus.CANCEL;
        break;

      default:
        status = PaymentStatus.UNKNOWN;
        break;
    }

    const amount = parseInt(gross_amount, 10);

    await this.donationRepository.update({
      data: {
        status,
        amount,
        paymentType: payment_type,
      },
      where: { id: donation.id },
    });

    if (status === PaymentStatus.SETTLEMENT) {
      await this.campaignRepository.update({
        data: { totalAmount: campaign.totalAmount + amount },
        where: { id: campaign.id },
      });
    }
  }
}
