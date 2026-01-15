import { Campaign, ICampaignRepository } from '@domain/campaign';
import { Donation, IDonationRepository } from '@domain/donation';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { WebhookMidtransUseCase } from './webhook-midtrans.usecase';

describe('[use case] webhook midtrans notification', () => {
  let usecase: WebhookMidtransUseCase;

  const mockDonationRepository: IDonationRepository =
    mock<IDonationRepository>();
  const mockCampaignRepository: ICampaignRepository =
    mock<ICampaignRepository>();

  beforeAll(() => {
    usecase = new WebhookMidtransUseCase(
      mockDonationRepository,
      mockCampaignRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestData = {
    order_id: faker.string.uuid(),
    transaction_status: 'settlement',
    payment_type: 'qris',
    gross_amount: '25000.00',
  };

  const mockCampaignData: Pick<Campaign, 'id' | 'totalAmount'> = {
    id: faker.string.uuid(),
    totalAmount: 50000,
  };

  const mockDonationData: Pick<Donation, 'id' | 'campaignId'> = {
    id: faker.string.uuid(),
    campaignId: mockCampaignData.id,
  };

  describe('execute()', () => {
    test('return if no donation found', async () => {
      mockDonationRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(usecase.execute(mockRequestData)).resolves.toBeUndefined();
    });

    test('return if no campaign found', async () => {
      mockDonationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockDonationData);
      mockCampaignRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(usecase.execute(mockRequestData)).resolves.toBeUndefined();
    });

    test('return successfully, with transaction_status settlement', async () => {
      mockDonationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockDonationData);
      mockCampaignRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCampaignData);
      await expect(usecase.execute(mockRequestData)).resolves.toBeUndefined();
    });

    test('return successfully, with transaction_status expire', async () => {
      mockDonationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockDonationData);
      mockCampaignRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCampaignData);
      await expect(
        usecase.execute({ ...mockRequestData, transaction_status: 'expire' }),
      ).resolves.toBeUndefined();
    });

    test('return successfully, with transaction_status cancel', async () => {
      mockDonationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockDonationData);
      mockCampaignRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCampaignData);
      await expect(
        usecase.execute({ ...mockRequestData, transaction_status: 'cancel' }),
      ).resolves.toBeUndefined();
    });

    test('return successfully, with transaction_status deny', async () => {
      mockDonationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockDonationData);
      mockCampaignRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCampaignData);
      await expect(
        usecase.execute({ ...mockRequestData, transaction_status: 'deny' }),
      ).resolves.toBeUndefined();
    });

    test('return successfully, with transaction_status unknown', async () => {
      mockDonationRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockDonationData);
      mockCampaignRepository.findOne = jest
        .fn()
        .mockResolvedValue(mockCampaignData);
      await expect(
        usecase.execute({ ...mockRequestData, transaction_status: 'test' }),
      ).resolves.toBeUndefined();
    });
  });
});
