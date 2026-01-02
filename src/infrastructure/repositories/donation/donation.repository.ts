import { Database, DB, DBTransaction } from '@database';
import { donations } from '@database/schema';
import {
  CreateRequest,
  DeleteRequest,
  FindAllRequest,
  FindRequest,
  SelectedFields,
  UpdateRequest,
} from '@domain/base';
import { IDonationRepository, Donation } from '@domain/donation';
import {
  transformDrizzleOrderByQuery,
  transformDrizzleWhereQuery,
} from '@infrastructure/utils';
import { Inject, Injectable } from '@nestjs/common';
import { v7 as uuid } from 'uuid';

@Injectable()
export class DonationRepository implements IDonationRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  async findOne<Req extends FindRequest<Donation>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Donation, Req['select']> | null> {
    const result = await (tx ?? this.db).query.donations.findFirst({
      columns: req.select,
      where: transformDrizzleWhereQuery(donations, req.where),
      orderBy: transformDrizzleOrderByQuery(donations, req.orderBy),
      offset: req.skip,
    });

    return (result as SelectedFields<Donation, Req['select']>) ?? null;
  }

  async findMany<Req extends FindAllRequest<Donation>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Donation, Req['select']>[]> {
    const result = await (tx ?? this.db).query.donations.findMany({
      columns: req.select,
      where: transformDrizzleWhereQuery(donations, req.where),
      orderBy: transformDrizzleOrderByQuery(donations, req.orderBy),
      offset: req.skip,
    });

    return result as SelectedFields<Donation, Req['select']>[];
  }

  async create(
    req: CreateRequest<Donation>,
    tx?: DBTransaction,
  ): Promise<Donation> {
    const results = await (tx ?? this.db)
      .insert(donations)
      .values({ id: uuid(), ...req.data })
      .returning();

    return results[0] as unknown as Donation;
  }
  update(req: UpdateRequest<Donation>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(req: DeleteRequest<Donation>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
