import { GetCategoriesUseCase } from '@application/usecases/category';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GetCategoryResponseDto } from '../dto';

@ApiTags('Category')
@Controller({ version: '1' })
export class CategoryController {
  constructor(private readonly getCategoriesUseCase: GetCategoriesUseCase) {}

  @ApiOkResponse({
    type: [GetCategoryResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getListCategories(): Promise<GetCategoryResponseDto[]> {
    return await this.getCategoriesUseCase.execute();
  }
}
