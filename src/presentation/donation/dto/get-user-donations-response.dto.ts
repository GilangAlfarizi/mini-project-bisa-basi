import { PaymentStatus } from '@domain/enums';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDonationsResponseDto {
  @ApiProperty({ example: 'Natural Disaster' })
  categoryName: string;

  @ApiProperty({ example: 'campaign-id' })
  campaignId: string;

  @ApiProperty({ example: 'Bantu Korban Banjir' })
  campaignName: string;

  @ApiProperty({ example: 10000 })
  amount: number;

  @ApiProperty({ example: 30000 })
  totalAmount: number;

  @ApiProperty({ example: 'DANA' })
  paymentType: string;

  @ApiProperty({ example: PaymentStatus.SETTLEMENT })
  status: PaymentStatus;
}
