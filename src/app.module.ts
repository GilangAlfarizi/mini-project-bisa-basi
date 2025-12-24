import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from '@presentation/auth/auth.module';
import { CampaignModule } from '@presentation/campaign/campaign.module';
import { CategoryModule } from '@presentation/category/category.module';

import { CommonModule } from './common.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    CampaignModule,
    CategoryModule,
    RouterModule.register([
      {
        path: '/auth',
        module: AuthModule,
      },
      {
        path: '/campaign',
        module: CampaignModule,
      },
      {
        path: '/category',
        module: CategoryModule,
      },
    ]),
  ],
  providers: [],
})
export class AppModule {}
