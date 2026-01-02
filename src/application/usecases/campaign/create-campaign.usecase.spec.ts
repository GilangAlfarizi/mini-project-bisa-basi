import { Database } from '@database';
import {
  Campaign,
  CreateCampaignRequest,
  CreateCampaignResponse,
  ICampaignRepository,
} from '@domain/campaign';
import { ICategoryRepository } from '@domain/category';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { CreateCampaignUseCase } from './create-campaign.usecase';

describe('[use case] create campaign', () => {
  let usecase: CreateCampaignUseCase;
  const mockDatabase: Database = mock<Database>();
  const mockCampaignRepository: ICampaignRepository =
    mock<ICampaignRepository>();
  const mockCategoryRepository: ICategoryRepository =
    mock<ICategoryRepository>();

  beforeAll(() => {
    usecase = new CreateCampaignUseCase(
      mockDatabase,
      mockCampaignRepository,
      mockCategoryRepository,
    );
  });

  beforeEach(() => {
    mockDatabase.transaction = jest
      .fn()
      .mockImplementation((cb) => cb(mockDatabase));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestData: CreateCampaignRequest = {
    categoryId: 'category-id',
    name: faker.book.title(),
    description: faker.word.words(10),
    thumbnail: faker.internet.url(),
  };

  const mockCampaignData: Pick<
    Campaign,
    'id' | 'categoryId' | 'name' | 'description' | 'thumbnail'
  > = {
    categoryId: faker.string.uuid(),
    id: faker.string.uuid(),
    name: mockRequestData.name,
    description: mockRequestData.description,
    thumbnail: mockRequestData.thumbnail,
  };

  describe('execute()', () => {
    test('throw error CATEGORY_NOT_FOUND if category not found', async () => {
      mockCategoryRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'CREATE_CAMPAIGN_USECASE.CATEGORY_NOT_FOUND',
      );
    });

    test('should successfully create a campaign', async () => {
      mockCategoryRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: mockRequestData.categoryId });

      mockCampaignRepository.create = jest
        .fn()
        .mockResolvedValueOnce({ id: mockCampaignData.id });

      const result = await usecase.execute(mockRequestData);

      expect(mockCampaignRepository.create).toHaveBeenCalledWith(
        { data: { ...mockRequestData, totalAmount: 0 } },
        mockDatabase,
      );
      expect(result).toStrictEqual<CreateCampaignResponse>({
        id: result.id,
      });
    });

    test('should successfully create a category without thumbnail', async () => {
      mockCategoryRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: mockRequestData.categoryId });

      mockCampaignRepository.create = jest
        .fn()
        .mockResolvedValueOnce({ ...mockCampaignData, thumbnail: '-' });

      const result = await usecase.execute({
        ...mockRequestData,
        thumbnail: undefined,
      });

      expect(mockCampaignRepository.create).toHaveBeenCalledWith(
        { data: { ...mockRequestData, totalAmount: 0, thumbnail: '-' } },
        mockDatabase,
      );
      expect(result).toStrictEqual<CreateCampaignResponse>({
        id: result.id,
      });
    });
  });
});
