import { GetCampaignsResponse, ICampaignRepository } from '@domain/campaign';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCampaignsUseCase {
  constructor(private readonly campaignRepository: ICampaignRepository) {}

  async execute(): Promise<GetCampaignsResponse[]> {
    return await this.campaignRepository.findMany({
      select: {
        id: true,
        categoryId: true,
        name: true,
        description: true,
        thumbnail: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
