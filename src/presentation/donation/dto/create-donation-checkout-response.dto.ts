import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDonationCheckoutResponseDto {
  @ApiProperty({ example: 'app.midtrans.com' })
  @IsString()
  midtransUrl: string;
}
