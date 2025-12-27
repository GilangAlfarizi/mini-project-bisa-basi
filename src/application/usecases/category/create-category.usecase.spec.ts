import { Database } from '@database';
import {
  Category,
  CreateCategoryRequest,
  CreateCategoryResponse,
  ICategoryRepository,
} from '@domain/category';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { CreateCategoryUseCase } from './create-category.usecase';

describe('[use case] create category', () => {
  let usecase: CreateCategoryUseCase;
  const mockDatabase: Database = mock<Database>();
  const mockCategoryRepository: ICategoryRepository =
    mock<ICategoryRepository>();

  beforeAll(() => {
    usecase = new CreateCategoryUseCase(mockDatabase, mockCategoryRepository);
  });

  beforeEach(() => {
    mockDatabase.transaction = jest
      .fn()
      .mockImplementation((cb) => cb(mockDatabase));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestData: CreateCategoryRequest = {
    name: faker.book.title(),
  };

  const mockCategoryData: Pick<Category, 'id' | 'name'> = {
    id: faker.string.uuid(),
    name: mockRequestData.name,
  };

  describe('execute()', () => {
    test('throw error NAME_ALREADY_USED if category name is taken', async () => {
      mockCategoryRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCategoryData);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'CREATE_CATEGORY_USECASE.NAME_ALREADY_USED',
      );
    });

    test('should successfully create a category', async () => {
      mockCategoryRepository.findOne = jest.fn().mockResolvedValue(null);

      mockCategoryRepository.create = jest
        .fn()
        .mockResolvedValueOnce({ ...mockCategoryData });

      const result = await usecase.execute(mockRequestData);

      expect(mockCategoryRepository.create).toHaveBeenCalledWith(
        { data: mockRequestData },
        mockDatabase,
      );
      expect(result).toStrictEqual<CreateCategoryResponse>({
        id: result.id,
      });
    });
  });
});
