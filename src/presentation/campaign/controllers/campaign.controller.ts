import { GetCampaignsUseCase } from '@application/usecases/campaign';
import { CreateCampaignUseCase } from '@application/usecases/campaign/create-campaign.usecase';
import { AuthGuard } from '@infrastructure/guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  CreateCampaignRequestDto,
  CreateCampaignResponseDto,
  GetCampaignResponseDto,
} from '../dto';

@ApiTags('Campaign')
@Controller({ version: '1' })
export class CampaignController {
  constructor(
    private readonly getCampaignsUseCase: GetCampaignsUseCase,
    private readonly createCampaignUseCase: CreateCampaignUseCase,
  ) {}

  @ApiOkResponse({
    type: [GetCampaignResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getListCampaigns(): Promise<GetCampaignResponseDto[]> {
    return await this.getCampaignsUseCase.execute();
  }

  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'Success',
    type: CreateCampaignResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCategory(
    @Body() body: CreateCampaignRequestDto,
  ): Promise<CreateCampaignResponseDto> {
    return await this.createCampaignUseCase.execute(body);
  }
}
