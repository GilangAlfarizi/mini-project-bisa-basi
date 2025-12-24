import { GetCategoriesUseCase } from '@application/usecases/category';
import { envsConfig } from '@infrastructure/envs';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetCategoryResponseDto } from '../dto';

@ApiTags('Category')
@Controller({ version: '1' })
export class CategoryController {
  constructor(private readonly getCategoriesUseCase: GetCategoriesUseCase) {}

  @Get()
  async getListCategories(): Promise<GetCategoryResponseDto[]> {
    return await this.getCategoriesUseCase.execute();
  }
}
