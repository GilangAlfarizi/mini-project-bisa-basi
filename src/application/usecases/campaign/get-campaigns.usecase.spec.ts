import { GetCampaignsResponse, ICampaignRepository } from '@domain/campaign';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { GetCampaignsUseCase } from './get-campaigns.usecase';

describe('[use case] get campaigns', () => {
  let usecase: GetCampaignsUseCase;
  const mockCampapaignRepository: ICampaignRepository =
    mock<ICampaignRepository>();

  beforeAll(() => {
    usecase = new GetCampaignsUseCase(mockCampapaignRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockCampaignsData: GetCampaignsResponse = {
    id: faker.string.uuid(),
    categoryId: faker.string.uuid(),
    name: faker.book.title(),
    description: faker.food.description(),
    thumbnail: faker.internet.url(),
  };

  describe('execute()', () => {
    test('should return data', async () => {
      mockCampapaignRepository.findMany = jest
        .fn()
        .mockResolvedValue([mockCampaignsData]);

      expect(await usecase.execute()).toStrictEqual([mockCampaignsData]);
    });
  });
});
