import { IHashService } from '@application/services';
import { ITokenService } from '@application/services/token.service';
import { LoginRequest, RegisterResponse } from '@domain/auth';
import { IUserRepository, User } from '@domain/user';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { LoginUseCase } from './login.usecase';

describe('[use case] login user', () => {
  let usecase: LoginUseCase;

  const mockUserRepository: IUserRepository = mock<IUserRepository>();
  const mockHashService: IHashService = mock<IHashService>();
  const mockTokenService: ITokenService = mock<ITokenService>();

  beforeAll(() => {
    usecase = new LoginUseCase(
      mockUserRepository,
      mockHashService,
      mockTokenService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestData: LoginRequest = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const mockUserData: Pick<User, 'id' | 'name' | 'password' | 'email'> = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    email: mockRequestData.email,
  };

  describe('execute()', () => {
    test('throw error USER_NOT_FOUND if email is not registered', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'LOGIN_USECASE.USER_NOT_FOUND',
      );
    });

    test('throw error INVALID_CREDENTIALS if password is wrong', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);
      mockHashService.compare = jest.fn().mockReturnValue(false);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'LOGIN_USECASE.INVALID_CREDENTIALS',
      );
    });

    test('should successfully login', async () => {
      const accessToken = faker.internet.jwt();

      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);
      mockHashService.compare = jest.fn().mockReturnValue(true);
      mockUserRepository.create = jest
        .fn()
        .mockResolvedValueOnce({ ...mockUserData });
      mockTokenService.generate = jest.fn().mockReturnValue(accessToken);

      const result = await usecase.execute(mockRequestData);

      expect(result).toStrictEqual<RegisterResponse>({
        user: {
          id: mockUserData.id,
          name: mockUserData.name,
          email: mockUserData.email,
        },
        accessToken,
      });
    });
  });
});
