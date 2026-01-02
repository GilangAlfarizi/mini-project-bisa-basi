import { GetUserDonationsRequest, IDonationRepository } from '@domain/donation';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { GetUserDonationsUseCase } from './get-user-donations.usecase';

describe('[use case] get user donation history', () => {
  let usecase: GetUserDonationsUseCase;

  const mockDonationRepository: IDonationRepository =
    mock<IDonationRepository>();

  beforeAll(() => {
    usecase = new GetUserDonationsUseCase(mockDonationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestData: GetUserDonationsRequest = {
    userId: faker.string.uuid(),
  };

  describe('execute()', () => {
    test('should successfully create a donation', async () => {
      mockDonationRepository.findMany = jest.fn().mockResolvedValue([{}]);

      const result = await usecase.execute(mockRequestData);
      expect(result).toBeDefined();
    });
  });
});
