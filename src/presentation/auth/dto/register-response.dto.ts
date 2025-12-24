import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: {
      id: 'user-id',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    },
  })
  user: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({ example: 'access-token' })
  accessToken: string;
}
