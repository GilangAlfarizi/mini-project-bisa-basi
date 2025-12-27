import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryRequestDto {
  @ApiProperty({ example: 'Natural Disaster' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;
}
