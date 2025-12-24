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

  create(req: CreateRequest<Campaign>, tx?: DBTransaction): Promise<Campaign> {
    throw new Error('Method not implemented.');
  }
  update(req: UpdateRequest<Campaign>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(req: DeleteRequest<Campaign>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
