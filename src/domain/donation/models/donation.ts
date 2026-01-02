import { PaymentStatus } from '@domain/enums';

export class Donation {
  createdAt: string;
  updatedAt: string;
  id: string;
  userId: string;
  campaignId: string;
  paymentType: string;
  amount: number;
  status: PaymentStatus;
}
