import { DBTransaction } from '@database';
import { IBaseRepository } from '@domain/base';

import {
  Donation,
  GetUserDonationsRequest,
  GetUserDonationsResponse,
} from './models';

export abstract class IDonationRepository extends IBaseRepository<Donation> {
  abstract userDonationsWithCampaignAndCategory(
    req: GetUserDonationsRequest,
    tx?: DBTransaction,
  ): Promise<GetUserDonationsResponse[]>;
}
