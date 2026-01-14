import { Database } from '@database';
import { CreateCampaignResponse, ICampaignRepository } from '@domain/campaign';
import { CreateDonationRequest, IDonationRepository } from '@domain/donation';
import { PaymentStatus } from '@domain/enums';
import { IUserRepository } from '@domain/user';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { CreateDonationUseCase } from './create-donation.usecase';

describe('[use case] create donation', () => {
  let usecase: CreateDonationUseCase;
  const mockDatabase: Database = mock<Database>();
  const mockDonationRepository: IDonationRepository =
    mock<IDonationRepository>();
  const mockUserRepository: IUserRepository = mock<IUserRepository>();
  const mockCampaignRepository: ICampaignRepository =
    mock<ICampaignRepository>();

  beforeAll(() => {
    usecase = new CreateDonationUseCase(
      mockDatabase,
      mockDonationRepository,
      mockUserRepository,
      mockCampaignRepository,
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

  const mockRequestData: CreateDonationRequest = {
    userId: faker.string.uuid(),
    campaignId: faker.string.uuid(),
    paymentType: 'DANA',
    amount: 100,
  };

  describe('execute()', () => {
    test('throw error USER_NOT_FOUND if user not found', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'CREATE_DONATION_USECASE.USER_NOT_FOUND',
      );
    });

    test('throw error CAMPAIGN_NOT_FOUND if campaign not found', async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: mockRequestData.userId });
      mockCampaignRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'CREATE_DONATION_USECASE.CAMPAIGN_NOT_FOUND',
      );
    });

    test('should successfully create a donation', async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: mockRequestData.userId });
      mockCampaignRepository.findOne = jest.fn().mockResolvedValue({
        id: mockRequestData.campaignId,
        totalAmount: 10000,
      });

      mockDonationRepository.create = jest
        .fn()
        .mockResolvedValueOnce({ id: faker.string.uuid(), totalAmount: 0 });

      const result = await usecase.execute(mockRequestData);

      expect(mockDonationRepository.create).toHaveBeenCalledWith(
        { data: { ...mockRequestData, status: PaymentStatus.PENDING } },
        mockDatabase,
      );
      expect(mockCampaignRepository.update).toHaveBeenCalledWith(
        {
          data: { totalAmount: 10100 },
          where: { id: mockRequestData.campaignId },
        },
        mockDatabase,
      );
      expect(result).toStrictEqual<CreateCampaignResponse>({
        id: result.id,
      });
    });
  });
});
