import * as usecases from '@application/usecases/webhook';
import { ICampaignRepository } from '@domain/campaign';
import { IDonationRepository } from '@domain/donation';
import { ITfFormRepository } from '@domain/tf-form';
import { ITfResponseRepository } from '@domain/tf-responses';
import { CampaignRepository } from '@infrastructure/repositories/campaign';
import { DonationRepository } from '@infrastructure/repositories/donation';
import { TfFormRepository } from '@infrastructure/repositories/tf-form';
import { TfResponseRepository } from '@infrastructure/repositories/tf-response';
import { Module, Provider } from '@nestjs/common';

import * as controllers from './controllers';

const repositories: Provider[] = [
  { useClass: DonationRepository, provide: IDonationRepository },
  { useClass: CampaignRepository, provide: ICampaignRepository },
  { useClass: TfFormRepository, provide: ITfFormRepository },
  { useClass: TfResponseRepository, provide: ITfResponseRepository },
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
