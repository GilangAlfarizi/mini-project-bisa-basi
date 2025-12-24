import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryResponseDto {
  @ApiProperty({ example: 'category-id' })
  id: string;

  @ApiProperty({ example: 'Natural Disaster' })
  name: string;
}
