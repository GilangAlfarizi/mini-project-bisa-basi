import { ITokenService } from '@application/services';
import { DB, Database } from '@database';
import { ConfirmEmailRequest, ConfirmEmailTokenPayload } from '@domain/auth';
import { IUserRepository } from '@domain/user';
import { Injectable, Inject } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';

@Injectable()
export class ConfirmEmailUseCase {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
  ) {}

  execute({ token }: ConfirmEmailRequest): Promise<void> {
    return this.db.transaction(async (tx) => {
      try {
        const payload =
          await this.tokenService.verify<ConfirmEmailTokenPayload>(token);

        const user = await this.userRepository.findOne({
          select: { id: true },
          where: { email: payload.email },
        });

        if (!user) {
          throw new Error('CONFIRM_EMAIL_USECASE.USER_NOT_FOUND');
        }

        await this.userRepository.update(
          {
            data: { isVerified: true },
            where: { id: user.id },
          },
          tx,
        );
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new Error('CONFIRM_EMAIL_USECASE.INVALID_TOKEN');
        }

        throw error;
      }
    });
  }
}
