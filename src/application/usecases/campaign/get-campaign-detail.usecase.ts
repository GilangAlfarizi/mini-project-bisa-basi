import {
  GetCampaignDetailRequest,
  GetCampaignDetailResponse,
  ICampaignRepository,
} from '@domain/campaign';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCampaignDetailUseCase {
  constructor(private readonly campaignRepository: ICampaignRepository) {}

  async execute({
    id,
  }: GetCampaignDetailRequest): Promise<GetCampaignDetailResponse> {
    const campaign = await this.campaignRepository.findOne({
      select: {
        id: true,
        categoryId: true,
        name: true,
        description: true,
        thumbnail: true,
      },
      where: { id },
    });

    if (!campaign)
      throw new Error('GET_CAMPAIGN_DETAIL_USECASE.CAMPAIGN_NOT_FOUND');

    return { ...campaign, thumbnail: campaign.thumbnail ?? '-' };
  }
}
