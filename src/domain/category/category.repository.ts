import { IBaseRepository } from '@domain/base';

import { Category } from './models';

export abstract class ICategoryRepository extends IBaseRepository<Category> {}
