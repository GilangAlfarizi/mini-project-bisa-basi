import { ApiProperty } from '@nestjs/swagger';

export class GetUserProfileResponseDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@gmail.com' })
  email: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', nullable: true })
  picUrl: string;
}
