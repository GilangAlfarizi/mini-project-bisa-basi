import {
  CreateCampaignUseCase,
  GetCampaignDetailUseCase,
  GetCampaignsUseCase,
} from '@application/usecases/campaign';
import { AuthGuard } from '@infrastructure/guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateCampaignRequestDto,
  CreateCampaignResponseDto,
  GetCampaignDetailResponseDto,
  GetCampaignResponseDto,
} from '../dto';

@ApiTags('Campaign')
@Controller({ version: '1' })
export class CampaignController {
  constructor(
    private readonly getCampaignsUseCase: GetCampaignsUseCase,
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly getCampaignDetailUseCase: GetCampaignDetailUseCase,
  ) {}

  @ApiOkResponse({
    type: [GetCampaignResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getListCampaigns(): Promise<GetCampaignResponseDto[]> {
    return await this.getCampaignsUseCase.execute();
  }

  @ApiParam({
    name: 'id',
    example: 'campaign-id',
  })
  @ApiOkResponse({
    type: GetCampaignDetailResponseDto,
  })
  @Get('/:id')
  async getCampaignDetails(
    @Param() param: { id: string },
  ): Promise<GetCampaignDetailResponseDto> {
    return await this.getCampaignDetailUseCase.execute(param);
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
