import { Database, DB, DBTransaction } from '@database';
import { users } from '@database/schema';
import {
  CreateRequest,
  DeleteRequest,
  FindAllRequest,
  FindRequest,
  SelectedFields,
  UpdateRequest,
} from '@domain/base';
import { IUserRepository, User } from '@domain/user';
import {
  transformDrizzleOrderByQuery,
  transformDrizzleWhereQuery,
} from '@infrastructure/utils';
import { Inject, Injectable } from '@nestjs/common';
import { v7 as uuid } from 'uuid';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  async findOne<Req extends FindRequest<User>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<User, Req['select']> | null> {
    const result = await (tx ?? this.db).query.users.findFirst({
      columns: req.select,
      where: transformDrizzleWhereQuery(users, req.where),
      orderBy: transformDrizzleOrderByQuery(users, req.orderBy),
      offset: req.skip,
    });

    return (result as SelectedFields<User, Req['select']>) ?? null;
  }
  async findMany<Req extends FindAllRequest<User>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<User, Req['select']>[]> {
    const result = await (tx ?? this.db).query.users.findMany({
      columns: req.select,
      where: transformDrizzleWhereQuery(users, req.where),
      orderBy: transformDrizzleOrderByQuery(users, req.orderBy),
      offset: req.skip,
      limit: req.take,
    });

    return result as SelectedFields<User, Req['select']>[];
  }
  async create(req: CreateRequest<User>, tx?: DBTransaction): Promise<User> {
    const results = await (tx ?? this.db)
      .insert(users)
      .values({
        id: uuid(),
        ...req.data,
      })
      .returning();

    return results[0] as unknown as User;
  }
  async update(req: UpdateRequest<User>, tx?: DBTransaction): Promise<void> {
    await (tx ?? this.db)
      .update(users)
      .set({
        ...req.data,
        name: req.data.name!,
        password: req.data.password!,
        email: req.data.email!,
        isVerified: req.data.isVerified!,
      })
      .where(transformDrizzleWhereQuery(users, req.where));
  }
  delete(req: DeleteRequest<User>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
