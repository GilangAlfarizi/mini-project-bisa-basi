import { Database, DB, DBTransaction } from '@database';
import { campaigns } from '@database/schema';
import {
  CreateRequest,
  DeleteRequest,
  FindAllRequest,
  FindRequest,
  SelectedFields,
  UpdateRequest,
} from '@domain/base';
import { Campaign, ICampaignRepository } from '@domain/campaign';
import {
  transformDrizzleOrderByQuery,
  transformDrizzleWhereQuery,
} from '@infrastructure/utils';
import { Inject, Injectable } from '@nestjs/common';
import { v7 as uuid } from 'uuid';

@Injectable()
export class CampaignRepository implements ICampaignRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  async findOne<Req extends FindRequest<Campaign>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Campaign, Req['select']> | null> {
    const result = await (tx ?? this.db).query.campaigns.findFirst({
      columns: req.select,
      where: transformDrizzleWhereQuery(campaigns, req.where),
      orderBy: transformDrizzleOrderByQuery(campaigns, req.orderBy),
      offset: req.skip,
    });

    return (result as SelectedFields<Campaign, Req['select']>) ?? null;
  }

  async findMany<Req extends FindAllRequest<Campaign>>(
    req: Req,
    tx?: DBTransaction,
  ): Promise<SelectedFields<Campaign, Req['select']>[]> {
    const result = await (tx ?? this.db).query.campaigns.findMany({
      columns: req.select,
      where: transformDrizzleWhereQuery(campaigns, req.where),
      orderBy: transformDrizzleOrderByQuery(campaigns, req.orderBy),
      offset: req.skip,
    });

    return result as SelectedFields<Campaign, Req['select']>[];
  }

  async create(
    req: CreateRequest<Campaign>,
    tx?: DBTransaction,
  ): Promise<Campaign> {
    const results = await (tx ?? this.db)
      .insert(campaigns)
      .values({
        id: req.data.id ?? uuid(),
        ...req.data,
      })
      .returning();

    return results[0] as unknown as Campaign;
  }
  async update(
    req: UpdateRequest<Campaign>,
    tx?: DBTransaction,
  ): Promise<void> {
    await (tx ?? this.db)
      .update(campaigns)
      .set({
        ...req.data,
        name: req.data.name!,
        categoryId: req.data.categoryId!,
        description: req.data.description!,
        totalAmount: req.data.totalAmount!,
      })
      .where(transformDrizzleWhereQuery(campaigns, req.where));
  }
  delete(req: DeleteRequest<Campaign>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
