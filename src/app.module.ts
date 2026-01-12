import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from '@presentation/auth/auth.module';
import { CampaignModule } from '@presentation/campaign/campaign.module';
import { CategoryModule } from '@presentation/category/category.module';
import { DonationModule } from '@presentation/donation/donation.module';
import { UserModule } from '@presentation/user/user.module';

import { CommonModule } from './common.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    CategoryModule,
    CampaignModule,
    DonationModule,
    RouterModule.register([
      {
        path: '/auth',
        module: AuthModule,
      },
      {
        path: '/user',
        module: UserModule,
      },
      {
        path: '/category',
        module: CategoryModule,
      },
      {
        path: '/campaign',
        module: CampaignModule,
      },
      {
        path: '/donation',
        module: DonationModule,
      },
    ]),
  ],
  providers: [],
})
export class AppModule {}
