import {
  ConfirmEmailUseCase,
  LoginUseCase,
  RegisterUseCase,
} from '@application/usecases/auth';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  ConfirmEmailRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../dto';

@ApiTags('Auth')
@Controller({ version: '1' })
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly confirmEmailUseCase: ConfirmEmailUseCase,
  ) {}

  @ApiCreatedResponse({
    description: 'Success',
    type: RegisterResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.registerUseCase.execute(body);
  }

  @ApiOkResponse({
    description: 'Success',
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute(body);
  }

  @ApiOkResponse({
    description: 'Success',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/confirm-email')
  async confirmEmail(@Body() body: ConfirmEmailRequestDto): Promise<void> {
    return await this.confirmEmailUseCase.execute(body);
  }
}
