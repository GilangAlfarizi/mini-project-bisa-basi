import { GetCategoriesResponse, ICategoryRepository } from '@domain/category';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<GetCategoriesResponse[]> {
    return await this.categoryRepository.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
