import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, Length } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'john@gmail.com' })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secretpassword' })
  @IsDefined()
  @IsString()
  @Length(6)
  password: string;
}
