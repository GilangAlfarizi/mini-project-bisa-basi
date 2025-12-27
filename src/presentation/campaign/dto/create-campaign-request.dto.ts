import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCampaignRequestDto {
  @ApiProperty({ example: 'Bantu Pendidikan Yatim Piatu' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'category-id' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'lorem ipsum dolor sit amet' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'thumbnail.url' })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
