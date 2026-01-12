import {
  CreateCampaignUseCase,
  GetCampaignDetailUseCase,
  GetCampaignsUseCase,
} from '@application/usecases/campaign';
import {
  TWO_MB_IN_BYTE,
  TWO_MB_VALIDATION_ERROR,
} from '@infrastructure/constants';
import { AuthGuard } from '@infrastructure/guards';
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
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
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Success',
    type: CreateCampaignResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(
    @Body() body: CreateCampaignRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/jpeg|image/png|image/webp',
          }),
          new MaxFileSizeValidator({
            maxSize: TWO_MB_IN_BYTE,
            message: TWO_MB_VALIDATION_ERROR,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<CreateCampaignResponseDto> {
    return await this.createCampaignUseCase.execute({
      ...body,
      thumbnail: file,
    });
  }
}
