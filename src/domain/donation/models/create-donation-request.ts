import { PaymentStatus } from '@domain/enums';

export class CreateDonationRequest {
  userId: string;
  campaignId: string;
  paymentType: string;
  amount: number;
  status: PaymentStatus;
}
