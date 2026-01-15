import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDonationRequestDto {
  @ApiProperty({ example: 'campaign-id' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  campaignId: string;

  @ApiProperty({ example: 10000 })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
