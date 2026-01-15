import { IPaymentService } from '@application/services';
import { Database } from '@database';
import { Campaign, ICampaignRepository } from '@domain/campaign';
import {
  CreateUserDonationRequest,
  CreateUserDonationResponse,
  IDonationRepository,
} from '@domain/donation';
import { IUserRepository, User } from '@domain/user';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { CreateUserDonationUseCase } from './create-user-donation.usecase';

describe('[use case] create user donation', () => {
  let usecase: CreateUserDonationUseCase;

  const mockDatabase: Database = mock<Database>();
  const mockDonationRepository: IDonationRepository =
    mock<IDonationRepository>();
  const mockUserRepository: IUserRepository = mock<IUserRepository>();
  const mockCampaignRepository: ICampaignRepository =
    mock<ICampaignRepository>();
  const mockPaymentService: IPaymentService = mock<IPaymentService>();

  beforeAll(() => {
    usecase = new CreateUserDonationUseCase(
      mockDatabase,
      mockDonationRepository,
      mockUserRepository,
      mockCampaignRepository,
      mockPaymentService,
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestData: CreateUserDonationRequest = {
    userId: faker.string.uuid(),
    campaignId: faker.string.uuid(),
    amount: parseInt(faker.finance.amount({ min: 10000, max: 60000, dec: 0 })),
  };

  const mockUserData: Pick<User, 'id' | 'name' | 'email'> = {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
  };

  const mockCampaignData: Pick<Campaign, 'id' | 'name' | 'totalAmount'> = {
    id: faker.string.uuid(),
    name: faker.book.title(),
    totalAmount: parseInt(
      faker.finance.amount({ min: 10000, max: 60000, dec: 0 }),
    ),
  };

  describe('execute()', () => {
    test('throw error USER_NOT_FOUND if user not found', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'CREATE_USER_DONATION_USECASE.USER_NOT_FOUND',
      );
    });

    test('throw error CAMPAIGN_NOT_FOUND if campaign not found', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);
      mockCampaignRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'CREATE_USER_DONATION_USECASE.CAMPAIGN_NOT_FOUND',
      );
    });

    test('should successfully create user donation', async () => {
      const mockMidtransUrl = faker.internet.url();

      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);
      mockCampaignRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCampaignData);

      mockPaymentService.generateOrderId = jest
        .fn()
        .mockReturnValue(faker.string.uuid());

      mockPaymentService.createOrder = jest.fn().mockResolvedValue({
        token: faker.internet.jwt(),
        redirect_url: mockMidtransUrl,
      });

      const result = await usecase.execute(mockRequestData);

      expect(result).toStrictEqual<CreateUserDonationResponse>({
        midtransUrl: mockMidtransUrl,
      });
    });

    test('should successfully create user donation with long title', async () => {
      const mockMidtransUrl = faker.internet.url();

      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);
      mockCampaignRepository.findOne = jest.fn().mockResolvedValue({
        ...mockCampaignData,
        name: faker.string.alpha(60),
      });

      mockPaymentService.generateOrderId = jest
        .fn()
        .mockReturnValue(faker.string.uuid());

      mockPaymentService.createOrder = jest.fn().mockResolvedValue({
        token: faker.internet.jwt(),
        redirect_url: mockMidtransUrl,
      });

      const result = await usecase.execute(mockRequestData);

      expect(result).toStrictEqual<CreateUserDonationResponse>({
        midtransUrl: mockMidtransUrl,
      });
    });
  });
});
