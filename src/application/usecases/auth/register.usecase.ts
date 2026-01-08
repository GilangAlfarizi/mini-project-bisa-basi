import {
  IHashService,
  IMailService,
  IMailTemplateService,
  ITokenService,
} from '@application/services';
import { DB, Database } from '@database';
import {
  RegisterRequest,
  RegisterResponse,
  UserTokenPayload,
} from '@domain/auth';
import { IUserRepository } from '@domain/user';
import {
  MAIL_CONFIRM_EMAIL_SUBJECT,
  MAIL_CONFIRM_URL,
  MAIL_SENDER_ADDRESS,
  MAIL_SENDER_NAME,
} from '@infrastructure/constants';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
    private readonly mailService: IMailService,
    private readonly mailTemplateService: IMailTemplateService,
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
      console.log('a');

      const hashedPassword = await this.hashService.hash(req.password);

      const user = await this.userRepository.create(
        {
          data: {
            name: req.name,
            password: hashedPassword,
            email: req.email,
            isVerified: false,
          },
        },
        tx,
      );

      console.log('b');
      const payload: UserTokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = await this.tokenService.generate({ payload });

      console.log('c');
      const mailTemplate = await this.mailTemplateService.verifyEmail({
        name: user.name,
        confirmUrl: `${MAIL_CONFIRM_URL}?token=${accessToken}`,
      });

      console.log('d');
      await this.mailService.sendEmail({
        from: { name: MAIL_SENDER_NAME, address: MAIL_SENDER_ADDRESS },
        to: [{ name: user.name, address: user.email }],
        subject: MAIL_CONFIRM_EMAIL_SUBJECT,
        html: mailTemplate,
      });

      return {
        user: { ...payload },
        accessToken,
      };
    });
  }
}
