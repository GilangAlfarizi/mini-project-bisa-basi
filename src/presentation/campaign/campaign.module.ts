import * as usecases from '@application/usecases/campaign';
import { ICampaignRepository } from '@domain/campaign';
import { CampaignRepository } from '@infrastructure/repositories/campaign/campaign.repository';
import { Module, Provider } from '@nestjs/common';

import * as controllers from './controllers';

const repositories: Provider[] = [
  {
    useClass: CampaignRepository,
    provide: ICampaignRepository,
  },
];

@Module({
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(usecases), ...Object.values(repositories)],
})
export class CampaignModule {}
