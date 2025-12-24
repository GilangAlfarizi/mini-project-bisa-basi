import { GetCampaignsUseCase } from '@application/usecases/campaign';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GetCampaignResponseDto } from '../dto';

@ApiTags('Campaign')
@Controller({ version: '1' })
export class CampaignController {
  constructor(private readonly getCampaignsUseCase: GetCampaignsUseCase) {}

  @ApiOkResponse({
    type: [GetCampaignResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getListCampaigns(): Promise<GetCampaignResponseDto[]> {
    return await this.getCampaignsUseCase.execute();
  }
}
