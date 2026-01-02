import { Database, DB } from '@database';
import {
  CreateCampaignRequest,
  CreateCampaignResponse,
  ICampaignRepository,
} from '@domain/campaign';
import { ICategoryRepository } from '@domain/category';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateCampaignUseCase {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly campaignRepository: ICampaignRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  execute(req: CreateCampaignRequest): Promise<CreateCampaignResponse> {
    return this.db.transaction(async (tx) => {
      const category = await this.categoryRepository.findOne({
        select: { id: true },
        where: { id: req.categoryId },
      });

      if (!category)
        throw new Error('CREATE_CAMPAIGN_USECASE.CATEGORY_NOT_FOUND');

      const campaign = await this.campaignRepository.create(
        {
          data: {
            categoryId: req.categoryId,
            name: req.name,
            description: req.description,
            thumbnail: req.thumbnail ?? '-',
            totalAmount: 0,
          },
        },
        tx,
      );
      return { id: campaign.id };
    });
  }
}
