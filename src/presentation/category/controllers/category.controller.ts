import {
  CreateCategoryUseCase,
  GetCategoriesUseCase,
} from '@application/usecases/category';
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
  CreateCategoryRequestDto,
  CreateCategoryResponseDto,
  GetCategoryResponseDto,
} from '../dto';

@ApiTags('Category')
@Controller({ version: '1' })
export class CategoryController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
  ) {}

  @ApiOkResponse({
    type: [GetCategoryResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getListCategories(): Promise<GetCategoryResponseDto[]> {
    return await this.getCategoriesUseCase.execute();
  }

  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'Success',
    type: CreateCategoryResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCategory(
    @Body() body: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    return await this.createCategoryUseCase.execute(body);
  }
}
