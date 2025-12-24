import { RegisterUseCase } from '@application/usecases/auth';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RegisterRequestDto, RegisterResponseDto } from '../dto';

@ApiTags('Auth')
@Controller({ version: '1' })
export class AuthController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  @Post('/register')
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.registerUseCase.execute(body);
  }
}
