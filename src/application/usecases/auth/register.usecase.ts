import {
  IHashService,
  IMailService,
  ITokenService,
} from '@application/services';
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
    private readonly mailService: IMailService,
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

      await this.mailService.sendEmail({
        from: { name: 'Bisa Basi', address: 'noreply@bisa.com' },
        to: [{ name: user.name, address: user.email }],
        subject: 'Welcome to Our Platform!',
        text: `Hello ${user.name},\n\nThank you for registering at our service!\n\nBest regards,\nThe Team`,
      });

      return {
        user: { ...payload },
        accessToken,
      };
    });
  }
}
