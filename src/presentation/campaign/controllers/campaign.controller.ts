import { GetCampaignsUseCase } from '@application/usecases/campaign';
import { envsConfig } from '@infrastructure/envs';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetCampaignResponseDto } from '../dto';

@ApiTags('Campaign')
@Controller({ version: '1' })
export class CampaignController {
  constructor(private readonly getCampaignsUseCase: GetCampaignsUseCase) {}

  @Get()
  async getListCampaigns(): Promise<GetCampaignResponseDto[]> {
    return await this.getCampaignsUseCase.execute();
  }
}
