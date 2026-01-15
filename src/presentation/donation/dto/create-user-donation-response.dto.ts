import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDonationResponseDto {
  @ApiProperty({ example: 'app.midtrans.com' })
  @IsString()
  midtransUrl: string;
}
