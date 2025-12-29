import * as usecases from '@application/usecases/category';
import { ICategoryRepository } from '@domain/category';
import { CategoryRepository } from '@infrastructure/repositories/category';
import { Module, Provider } from '@nestjs/common';

import * as controllers from './controllers';

const repositories: Provider[] = [
  {
    useClass: CategoryRepository,
    provide: ICategoryRepository,
  },
];

@Module({
  controllers: [...Object.values(controllers)],
  providers: [...Object.values(usecases), ...Object.values(repositories)],
})
export class CategoryModule {}
