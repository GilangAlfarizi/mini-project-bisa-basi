import { ApiProperty } from '@nestjs/swagger';

export class GetUserDonationsResponseDto {
  @ApiProperty({ example: 'campaign-id' })
  id: string;

  @ApiProperty({ example: 'category-id' })
  campaignId: string;

  @ApiProperty({ example: 'Bantu Korban Banjir' })
  campaignName: string;

  @ApiProperty({ example: 10000 })
  donationAmount: number;

  @ApiProperty({ example: 30000 })
  campaignTotalAmount: number;
}
