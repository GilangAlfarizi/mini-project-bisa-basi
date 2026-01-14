import { Database, DB, DBTransaction } from '@database';
import { campaigns, categories, donations } from '@database/schema';
import {
  CreateRequest,
  DeleteRequest,
  FindAllRequest,
  FindRequest,
  SelectedFields,
  UpdateRequest,
} from '@domain/base';
import {
  IDonationRepository,
  Donation,
  GetUserDonationsResponse,
  GetUserDonationsRequest,
} from '@domain/donation';
import {
  transformDrizzleOrderByQuery,
  transformDrizzleWhereQuery,
} from '@infrastructure/utils';
import { Inject, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { v7 as uuid } from 'uuid';

@Injectable()
export class DonationRepository implements IDonationRepository {
  constructor(@Inject(DB) private readonly db: Database) {}

  async userDonationsWithCampaignAndCategory(
    { userId }: GetUserDonationsRequest,
    tx?: DBTransaction,
  ): Promise<GetUserDonationsResponse[]> {
    const results = (tx ?? this.db)
      .select({
        categoryName: categories.name,
        campaignId: donations.campaignId,
        campaignName: campaigns.name,
        amount: donations.amount,
        totalAmount: campaigns.totalAmount,
        paymentType: donations.paymentType,
        status: donations.status,
      })
      .from(donations)
      .where(eq(donations.userId, userId))
      .leftJoin(campaigns, sql`${donations.campaignId} = ${campaigns.id}`)
      .leftJoin(categories, sql`${campaigns.categoryId} = ${categories.id}`);

    return results as unknown as GetUserDonationsResponse[];
  }

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
  async update(
    req: UpdateRequest<Donation>,
    tx?: DBTransaction,
  ): Promise<void> {
    await (tx ?? this.db)
      .update(donations)
      .set({
        ...req.data,
        userId: req.data.userId!,
        campaignId: req.data.campaignId!,
        paymentType: req.data.paymentType!,
        amount: req.data.amount!,
        status: req.data.status!,
      })
      .where(transformDrizzleWhereQuery(donations, req.where));
  }
  delete(req: DeleteRequest<Donation>, tx?: DBTransaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
