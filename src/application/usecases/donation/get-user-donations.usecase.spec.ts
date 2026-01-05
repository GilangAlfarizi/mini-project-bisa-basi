import {
  GetUserDonationsRequest,
  GetUserDonationsResponse,
  IDonationRepository,
} from '@domain/donation';
import { PaymentStatus } from '@domain/enums';
import { IUserRepository } from '@domain/user';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { GetUserDonationsUseCase } from './get-user-donations.usecase';

describe('[use case] get user donation history', () => {
  let usecase: GetUserDonationsUseCase;

  const mockDonationRepository: IDonationRepository =
    mock<IDonationRepository>();
  const mockUserRepository: IUserRepository = mock<IUserRepository>();

  beforeAll(() => {
    usecase = new GetUserDonationsUseCase(
      mockDonationRepository,
      mockUserRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestData: GetUserDonationsRequest = {
    userId: faker.string.uuid(),
  };

  const mockUserDonationHistory: GetUserDonationsResponse = {
    categoryName: 'Natural Disaster',
    campaignId: 'campaign-id',
    campaignName: 'Bantu Korban Banjir',
    amount: 10000,
    totalAmount: 30000,
    paymentType: 'DANA',
    status: PaymentStatus.SETTLEMENT,
  };

  describe('execute()', () => {
    test('throw USER_NOT_FOUND error when user not found', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(usecase.execute(mockRequestData)).rejects.toThrowError(
        'GET_USER_DONATIONS_USECASE.USER_NOT_FOUND',
      );
    });

    test('should successfully get user donation history', async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: mockRequestData.userId });

      mockDonationRepository.userDonationsWithCampaignAndCategory = jest
        .fn()
        .mockResolvedValue([mockUserDonationHistory]);

      const result = await usecase.execute(mockRequestData);
      expect(result).toStrictEqual<GetUserDonationsResponse[]>([
        mockUserDonationHistory,
      ]);
    });
  });
});
