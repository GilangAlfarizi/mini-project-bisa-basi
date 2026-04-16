import { Database, DB, DBTransaction } from '@database';
import { tfForms } from '@database/schema';
import {
  CreateRequest,
  DeleteRequest,
  FindAllRequest,
  FindRequest,
  SelectedFields,
  UpdateRequest,
} from '@domain/base';
import { ITfFormRepository } from '@domain/tf-form';
import { TfForm } from '@domain/tf-form/models';
import {
  transformDrizzleOrderByQuery,
  transformDrizzleWhereQuery,
} from '@infrastructure/utils';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TfFormRepository implements ITfFormRepository {
  constructor(@Inject(DB) private readonly db: Database) {}
  async findOne<Req extends FindRequest<TfForm>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<TfForm, Req['select']> | null> {
    const result = await (tx ?? this.db).query.tfForms.findFirst({
      columns: req.select,
      where: transformDrizzleWhereQuery(tfForms, req.where),
      orderBy: transformDrizzleOrderByQuery(tfForms, req.orderBy),
      offset: req.skip,
    });

    return (result as SelectedFields<TfForm, Req['select']>) ?? null;
  }

  async findMany<Req extends FindAllRequest<TfForm>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<TfForm, Req['select']>[]> {
    const result = await (tx ?? this.db).query.tfForms.findMany({
      columns: req.select,
      where: transformDrizzleWhereQuery(tfForms, req.where),
      orderBy: transformDrizzleOrderByQuery(tfForms, req.orderBy),
      offset: req.skip,
    });

    return result as SelectedFields<TfForm, Req['select']>[];
  }

  async create(
    req: CreateRequest<TfForm>,
    tx?: DBTransaction,
  ): Promise<TfForm> {
    const results = await (tx ?? this.db)
      .insert(tfForms)
      .values({
        id: req.data.id ?? '',
        ...req.data,
      })
      .returning();

    return results[0] as unknown as TfForm;
  }
  update(req: UpdateRequest<TfForm>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(req: DeleteRequest<TfForm>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
