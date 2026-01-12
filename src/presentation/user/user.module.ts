import { IImageService } from '@application/services';
import * as usecases from '@application/usecases/user';
import { IUserRepository } from '@domain/user';
import { UserRepository } from '@infrastructure/repositories/user';
import { ImageService } from '@infrastructure/services';
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
    useClass: ImageService,
    provide: IImageService,
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
export class UserModule {}
