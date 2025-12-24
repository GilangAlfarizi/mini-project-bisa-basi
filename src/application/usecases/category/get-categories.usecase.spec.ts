import { GetCategoriesResponse, ICategoryRepository } from '@domain/category';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { GetCategoriesUseCase } from './get-categories.usecase';

describe('[use case] get categories', () => {
  let usecase: GetCategoriesUseCase;
  const mockCategoryRepository: ICategoryRepository =
    mock<ICategoryRepository>();

  beforeAll(() => {
    usecase = new GetCategoriesUseCase(mockCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockCategoriesData: GetCategoriesResponse = {
    id: faker.string.uuid(),
    name: faker.book.title(),
  };

  describe('execute()', () => {
    test('should return data', async () => {
      mockCategoryRepository.findMany = jest
        .fn()
        .mockResolvedValue([mockCategoriesData]);

      expect(await usecase.execute()).toStrictEqual([mockCategoriesData]);
    });
  });
});
