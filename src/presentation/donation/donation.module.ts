import * as usecases from '@application/usecases/donation';
import { ICampaignRepository } from '@domain/campaign';
import { IDonationRepository } from '@domain/donation';
import { IUserRepository } from '@domain/user';
import { CampaignRepository } from '@infrastructure/repositories/campaign';
import { DonationRepository } from '@infrastructure/repositories/donation';
import { UserRepository } from '@infrastructure/repositories/user';
import { Module, Provider } from '@nestjs/common';

import * as controllers from './controllers';

const repositories: Provider[] = [
  {
    useClass: DonationRepository,
    provide: IDonationRepository,
  },
  {
    useClass: UserRepository,
    provide: IUserRepository,
  },
  {
    useClass: CampaignRepository,
    provide: ICampaignRepository,
  },
];

@Module({
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(usecases), ...Object.values(repositories)],
})
export class DonationModule {}
