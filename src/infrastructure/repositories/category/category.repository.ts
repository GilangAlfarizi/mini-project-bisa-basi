import { Database, DB, DBTransaction } from '@database';
import { categories } from '@database/schema';
import {
  CreateRequest,
  DeleteRequest,
  FindAllRequest,
  FindRequest,
  SelectedFields,
  UpdateRequest,
} from '@domain/base';
import { Category, ICategoryRepository } from '@domain/category';
import {
  transformDrizzleOrderByQuery,
  transformDrizzleWhereQuery,
} from '@infrastructure/utils';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  async findOne<Req extends FindRequest<Category>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Category, Req['select']> | null> {
    const result = await (tx ?? this.db).query.categories.findFirst({
      columns: req.select,
      where: transformDrizzleWhereQuery(categories, req.where),
      orderBy: transformDrizzleOrderByQuery(categories, req.orderBy),
      offset: req.skip,
    });

    return (result as SelectedFields<Category, Req['select']>) ?? null;
  }

  async findMany<Req extends FindAllRequest<Category>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Category, Req['select']>[]> {
    const result = await (tx ?? this.db).query.categories.findMany({
      columns: req.select,
      where: transformDrizzleWhereQuery(categories, req.where),
      orderBy: transformDrizzleOrderByQuery(categories, req.orderBy),
      offset: req.skip,
    });

    return result as SelectedFields<Category, Req['select']>[];
  }

  create(req: CreateRequest<Category>, tx?: DBTransaction): Promise<Category> {
    throw new Error('Method not implemented.');
  }
  update(req: UpdateRequest<Category>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(req: DeleteRequest<Category>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
