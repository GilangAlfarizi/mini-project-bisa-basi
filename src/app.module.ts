import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CampaignModules } from '@presentation/campaign/campaign.module';
import { CategoryModules } from '@presentation/category/category.module';

import { CommonModule } from './common.module';

@Module({
  imports: [
    CommonModule,
    CampaignModules,
    CategoryModules,
    RouterModule.register([
      {
        path: '/campaign',
        module: CampaignModules,
      },
      {
        path: '/category',
        module: CategoryModules,
      },
    ]),
  ],
  providers: [],
})
export class AppModule {}
