import { IBaseRepository } from '@domain/base';

import { Donation } from './models';

export abstract class IDonationRepository extends IBaseRepository<Donation> {}
