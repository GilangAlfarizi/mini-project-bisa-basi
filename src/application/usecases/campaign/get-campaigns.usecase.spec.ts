import { GetCampaignsResponse, ICampaignRepository } from '@domain/campaign';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { GetCampaignsUseCase } from './get-campaigns.usecase';

describe('[use case] get campaigns', () => {
  let usecase: GetCampaignsUseCase;
  const mockCampaignRepository: ICampaignRepository =
    mock<ICampaignRepository>();

  beforeAll(() => {
    usecase = new GetCampaignsUseCase(mockCampaignRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockCampaignsData: GetCampaignsResponse = {
    id: faker.string.uuid(),
    categoryName: faker.book.title(),
    name: faker.book.title(),
    description: faker.food.description(),
    thumbnail: faker.internet.url(),
    totalAmount: faker.number.int({ min: 0, max: 1000000 }),
  };

  describe('execute()', () => {
    test('should return data', async () => {
      mockCampaignRepository.findManyWithCategoryName = jest
        .fn()
        .mockResolvedValue([mockCampaignsData]);

      expect(await usecase.execute()).toStrictEqual<GetCampaignsResponse[]>([
        mockCampaignsData,
      ]);
    });
  });
});
