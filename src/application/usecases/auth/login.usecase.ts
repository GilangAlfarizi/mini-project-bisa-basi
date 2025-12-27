import { IHashService, ITokenService } from '@application/services';
import { LoginRequest, LoginResponse, UserTokenPayload } from '@domain/auth';
import { IUserRepository } from '@domain/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(req: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
      where: { email: req.email },
    });

    if (!user) throw new Error('LOGIN_USECASE.USER_NOT_FOUND');

    const isPasswordMatch = await this.hashService.compare(
      req.password,
      user.password,
    );

    if (!isPasswordMatch) throw new Error('LOGIN_USECASE.INVALID_CREDENTIALS');

    const payload: UserTokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = await this.tokenService.generate({ payload });

    return { user: { ...payload }, accessToken };
  }
}
