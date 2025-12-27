import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCampaignResponseDto {
  @ApiProperty({ example: 'campaign-id' })
  @IsString()
  id: string;
}
