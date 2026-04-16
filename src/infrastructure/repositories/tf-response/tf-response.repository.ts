import { Database, DB, DBTransaction } from '@database';
import { tfResponses } from '@database/schema';
import {
  CreateRequest,
  DeleteRequest,
  FindAllRequest,
  FindRequest,
  SelectedFields,
  UpdateRequest,
} from '@domain/base';
import { ITfResponseRepository } from '@domain/tf-responses';
import { TfResponse } from '@domain/tf-responses/models';
import {
  transformDrizzleOrderByQuery,
  transformDrizzleWhereQuery,
} from '@infrastructure/utils';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TfResponseRepository implements ITfResponseRepository {
  constructor(@Inject(DB) private readonly db: Database) {}
  async findOne<Req extends FindRequest<TfResponse>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<TfResponse, Req['select']> | null> {
    const result = await (tx ?? this.db).query.tfResponses.findFirst({
      columns: req.select,
      where: transformDrizzleWhereQuery(tfResponses, req.where),
      orderBy: transformDrizzleOrderByQuery(tfResponses, req.orderBy),
      offset: req.skip,
    });

    return (result as SelectedFields<TfResponse, Req['select']>) ?? null;
  }

  async findMany<Req extends FindAllRequest<TfResponse>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<TfResponse, Req['select']>[]> {
    const result = await (tx ?? this.db).query.tfResponses.findMany({
      columns: req.select,
      where: transformDrizzleWhereQuery(tfResponses, req.where),
      orderBy: transformDrizzleOrderByQuery(tfResponses, req.orderBy),
      offset: req.skip,
    });

    return result as SelectedFields<TfResponse, Req['select']>[];
  }

  async create(
    req: CreateRequest<TfResponse>,
    tx?: DBTransaction,
  ): Promise<TfResponse> {
    const results = await (tx ?? this.db)
      .insert(tfResponses)
      .values({
        id: req.data.id ?? '',
        ...req.data,
      })
      .returning();

    return results[0] as unknown as TfResponse;
  }
  update(req: UpdateRequest<TfResponse>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(req: DeleteRequest<TfResponse>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
