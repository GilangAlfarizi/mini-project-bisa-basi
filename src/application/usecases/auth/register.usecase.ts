import { IHashService, ITokenService } from '@application/services';
import { DB, Database } from '@database';
import {
  RegisterRequest,
  RegisterResponse,
  UserTokenPayload,
} from '@domain/auth';
import { IUserRepository } from '@domain/user';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  execute(req: RegisterRequest): Promise<RegisterResponse> {
    return this.db.transaction(async (tx) => {
      const isUserExist = await this.userRepository.findOne(
        {
          select: { id: true },
          where: { email: req.email },
        },
        tx,
      );

      if (isUserExist) {
        throw new Error('REGISTER_USECASE.EMAIL_IS_ALREADY_IN_USE');
      }

      const hashedPassword = await this.hashService.hash(req.password);

      const user = await this.userRepository.create(
        {
          data: {
            name: req.name,
            password: hashedPassword,
            email: req.email,
          },
        },
        tx,
      );

      const payload: UserTokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = await this.tokenService.generate({ payload });

      return {
        user: { ...payload },
        accessToken,
      };
    });
  }
}
