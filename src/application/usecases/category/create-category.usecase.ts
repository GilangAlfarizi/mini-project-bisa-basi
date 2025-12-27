import { Database, DB } from '@database';
import {
  CreateCategoryRequest,
  CreateCategoryResponse,
  ICategoryRepository,
} from '@domain/category';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  execute(req: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    return this.db.transaction(async (tx) => {
      const categoryExist = await this.categoryRepository.findOne(
        {
          select: { id: true },
          where: { name: req.name },
        },
        tx,
      );

      if (categoryExist)
        throw new Error('CREATE_CATEGORY_USECASE.NAME_ALREADY_USED');

      const category = await this.categoryRepository.create(
        {
          data: { name: req.name },
        },
        tx,
      );

      return { id: category.id };
    });
  }
}
