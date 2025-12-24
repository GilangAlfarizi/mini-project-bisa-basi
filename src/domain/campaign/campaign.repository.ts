import { IBaseRepository } from '@domain/base';

import { Campaign } from './models';

export abstract class ICampaignRepository extends IBaseRepository<Campaign> {}
