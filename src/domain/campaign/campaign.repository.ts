import { IBaseRepository } from '@domain/base';

import { Campaign, GetCampaignsResponse } from './models';

export abstract class ICampaignRepository extends IBaseRepository<Campaign> {
  abstract findManyWithCategoryName(
    tx?: unknown,
  ): Promise<GetCampaignsResponse[]>;
}
