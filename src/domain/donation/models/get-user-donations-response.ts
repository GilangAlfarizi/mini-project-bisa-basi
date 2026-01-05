import { PaymentStatus } from '@domain/enums';

export class GetUserDonationsResponse {
  categoryName: string;
  campaignId: string;
  campaignName: string;
  amount: number;
  totalAmount: number;
  paymentType: string;
  status: PaymentStatus;
}
