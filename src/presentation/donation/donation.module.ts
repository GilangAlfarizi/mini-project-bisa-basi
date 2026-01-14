import { IPaymentService } from '@application/services';
import * as usecases from '@application/usecases/donation';
import { ICampaignRepository } from '@domain/campaign';
import { IDonationRepository } from '@domain/donation';
import { IUserRepository } from '@domain/user';
import { CampaignRepository } from '@infrastructure/repositories/campaign';
import { DonationRepository } from '@infrastructure/repositories/donation';
import { UserRepository } from '@infrastructure/repositories/user';
import { PaymentService } from '@infrastructure/services';
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

const services: Provider[] = [
  {
    useClass: PaymentService,
    provide: IPaymentService,
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
export class DonationModule {}
