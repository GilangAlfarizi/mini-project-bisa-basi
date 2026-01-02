import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDonationResponseDto {
  @ApiProperty({ example: 'donation-id' })
  @IsString()
  id: string;
}
