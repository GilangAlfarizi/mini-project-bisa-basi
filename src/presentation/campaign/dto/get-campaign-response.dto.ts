import { ApiProperty } from '@nestjs/swagger';

export class GetCampaignResponseDto {
  @ApiProperty({ example: 'campaign-id' })
  id: string;

  @ApiProperty({ example: 'category-name' })
  categoryName: string;

  @ApiProperty({ example: 'Bantu Banjir Sumatera' })
  name: string;

  @ApiProperty({ example: 'Description example' })
  description: string;

  @ApiProperty({ example: 'thumbnail.url' })
  thumbnail: string;

  @ApiProperty({ example: 1000000 })
  totalAmount: number;
}
