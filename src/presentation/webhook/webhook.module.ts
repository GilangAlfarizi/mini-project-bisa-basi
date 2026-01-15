import * as usecases from '@application/usecases/webhook';
import { ICampaignRepository } from '@domain/campaign';
import { IDonationRepository } from '@domain/donation';
import { CampaignRepository } from '@infrastructure/repositories/campaign';
import { DonationRepository } from '@infrastructure/repositories/donation';
import { Module, Provider } from '@nestjs/common';

import * as controllers from './controllers';

const repositories: Provider[] = [
  { useClass: DonationRepository, provide: IDonationRepository },
  { useClass: CampaignRepository, provide: ICampaignRepository },
];

const services: Provider[] = [];

@Module({
  controllers: [...Object.values(controllers)],
  providers: [
    ...Object.values(usecases),
    ...Object.values(repositories),
    ...Object.values(services),
  ],
})
export class WebhookModule {}
