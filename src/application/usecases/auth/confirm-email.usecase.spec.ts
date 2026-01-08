import { ITokenService } from '@application/services/token.service';
import { Database } from '@database';
import { ConfirmEmailRequest } from '@domain/auth';
import { IUserRepository, User } from '@domain/user';
import { faker } from '@faker-js/faker';
import { JsonWebTokenError } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';

import { ConfirmEmailUseCase } from './confirm-email.usecase';

describe('[use case] confirm email user', () => {
  let usecase: ConfirmEmailUseCase;
  const mockDatabase: Database = mock<Database>();
  const mockUserRepository: IUserRepository = mock<IUserRepository>();
  const mockTokenService: ITokenService = mock<ITokenService>();

  beforeAll(() => {
    usecase = new ConfirmEmailUseCase(
      mockDatabase,
      mockUserRepository,
      mockTokenService,
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

  const mockRequestData: ConfirmEmailRequest = {
    token: faker.internet.jwt(),
  };

  const mockUserData: Pick<User, 'id'> = {
    id: faker.string.uuid(),
  };

  describe('execute()', () => {
    test('throw error INVALID_TOKEN if token is invalid', async () => {
      mockTokenService.verify = jest.fn().mockImplementation(() => {
        throw new JsonWebTokenError('invalid token');
      });

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'CONFIRM_EMAIL_USECASE.INVALID_TOKEN',
      );
    });

    test('throw error USER_NOT_FOUND if user is not found', async () => {
      mockTokenService.verify = jest
        .fn()
        .mockResolvedValue({ email: faker.internet.email() });

      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'CONFIRM_EMAIL_USECASE.USER_NOT_FOUND',
      );
    });

    test('should successfully confirm a user', async () => {
      mockTokenService.verify = jest
        .fn()
        .mockResolvedValue({ email: faker.internet.email() });

      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);

      mockUserRepository.update = jest.fn().mockResolvedValueOnce({});

      await usecase.execute(mockRequestData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        {
          data: { isVerified: true },
          where: { id: mockUserData.id },
        },
        mockDatabase,
      );
    });
  });
});
