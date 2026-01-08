import {
  IHashService,
  IMailService,
  IMailTemplateService,
  ITokenService,
} from '@application/services';
import * as usecases from '@application/usecases/auth';
import { IUserRepository } from '@domain/user';
import { UserRepository } from '@infrastructure/repositories/user';
import {
  HashService,
  MailService,
  MailTemplateService,
  TokenService,
} from '@infrastructure/services';
import { Module, Provider } from '@nestjs/common';

import * as controllers from './controllers';

const repositories: Provider[] = [
  {
    useClass: UserRepository,
    provide: IUserRepository,
  },
];

const services: Provider[] = [
  {
    useClass: HashService,
    provide: IHashService,
  },
  {
    useClass: TokenService,
    provide: ITokenService,
  },
  {
    useClass: MailService,
    provide: IMailService,
  },
  {
    useClass: MailTemplateService,
    provide: IMailTemplateService,
  },
];

@Module({
  controllers: [...Object.values(controllers)],
  providers: [
    ...Object.values(usecases),
    ...Object.values(repositories),
    ...Object.values(services),
  ],
})
export class AuthModule {}
