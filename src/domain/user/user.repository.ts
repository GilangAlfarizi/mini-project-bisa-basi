import { IBaseRepository } from '@domain/base';

import { User } from './models';

export abstract class IUserRepository extends IBaseRepository<User> {}
