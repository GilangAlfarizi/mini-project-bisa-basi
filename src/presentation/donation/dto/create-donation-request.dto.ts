import { PaymentStatus } from '@domain/enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateDonationRequestDto {
  @ApiProperty({ example: 'user-id' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: 'category-id' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  campaignId: string;

  @ApiProperty({ example: 'DANA' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  paymentType: string;

  @ApiProperty({ example: 10000 })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: PaymentStatus.SETTLEMENT })
  @IsDefined()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
