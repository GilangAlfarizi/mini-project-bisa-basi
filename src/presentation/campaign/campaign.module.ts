import * as usecases from '@application/usecases/campaign';
import { ICampaignRepository } from '@domain/campaign';
import { ICategoryRepository } from '@domain/category';
import { CampaignRepository } from '@infrastructure/repositories/campaign';
import { CategoryRepository } from '@infrastructure/repositories/category';
import { Module, Provider } from '@nestjs/common';

import * as controllers from './controllers';

const repositories: Provider[] = [
  {
    useClass: CampaignRepository,
    provide: ICampaignRepository,
  },
  {
    useClass: CategoryRepository,
    provide: ICategoryRepository,
  },
];

@Module({
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(usecases), ...Object.values(repositories)],
})
export class CampaignModule {}
