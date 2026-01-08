import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailRequestDto {
  @ApiProperty({ example: 'token' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  token: string;
}
