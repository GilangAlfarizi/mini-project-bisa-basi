import {
  GetCampaignDetailRequest,
  GetCampaignDetailResponse,
  ICampaignRepository,
} from '@domain/campaign';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { GetCampaignDetailUseCase } from './get-campaign-detail.usecase';

describe('[use case] get campaign detail', () => {
  let usecase: GetCampaignDetailUseCase;
  const mockCampapaignRepository: ICampaignRepository =
    mock<ICampaignRepository>();

  beforeAll(() => {
    usecase = new GetCampaignDetailUseCase(mockCampapaignRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockCampaignsData: GetCampaignDetailResponse = {
    id: faker.string.uuid(),
    categoryId: faker.string.uuid(),
    name: faker.book.title(),
    description: faker.food.description(),
    thumbnail: faker.internet.url(),
  };

  const mockRequestData: GetCampaignDetailRequest = {
    id: mockCampaignsData.id,
  };

  describe('execute()', () => {
    test('throw error CAMPAIGN_NOT_FOUND if campaign not found', async () => {
      mockCampapaignRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'GET_CAMPAIGN_DETAIL_USECASE.CAMPAIGN_NOT_FOUND',
      );
    });

    test('should return data', async () => {
      mockCampapaignRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCampaignsData);

      expect(
        await usecase.execute(mockRequestData),
      ).toStrictEqual<GetCampaignDetailResponse>(mockCampaignsData);
    });

    test('should return data without thumbnail', async () => {
      mockCampapaignRepository.findOne = jest
        .fn()
        .mockResolvedValue({ ...mockCampaignsData, thumbnail: null });

      expect(
        await usecase.execute(mockRequestData),
      ).toStrictEqual<GetCampaignDetailResponse>({
        ...mockCampaignsData,
        thumbnail: '-',
      });
    });
  });
});
