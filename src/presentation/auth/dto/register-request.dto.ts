import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'secretpassword' })
  @IsDefined()
  @IsString()
  @Length(6)
  password: string;

  @ApiProperty({ example: 'john@gmail.com' })
  @IsDefined()
  @IsEmail()
  email: string;
}
