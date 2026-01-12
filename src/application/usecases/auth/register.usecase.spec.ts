import {
  IHashService,
  IMailService,
  IMailTemplateService,
  ITokenService,
} from '@application/services';
import { Database } from '@database';
import { RegisterRequest, RegisterResponse } from '@domain/auth';
import { IUserRepository, User } from '@domain/user';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { RegisterUseCase } from './register.usecase';

describe('[use case] register user', () => {
  let usecase: RegisterUseCase;
  const mockDatabase: Database = mock<Database>();
  const mockUserRepository: IUserRepository = mock<IUserRepository>();
  const mockHashService: IHashService = mock<IHashService>();
  const mockTokenService: ITokenService = mock<ITokenService>();
  const mockMailService = mock<IMailService>();
  const mockMailTemplateService = mock<IMailTemplateService>();

  beforeAll(() => {
    usecase = new RegisterUseCase(
      mockDatabase,
      mockUserRepository,
      mockHashService,
      mockTokenService,
      mockMailService,
      mockMailTemplateService,
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

  const mockRequestData: RegisterRequest = {
    name: faker.book.title(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };

  const mockUserData: Pick<User, 'id' | 'name' | 'password' | 'email'> = {
    id: faker.string.uuid(),
    name: mockRequestData.name,
    password: faker.internet.password(),
    email: mockRequestData.email,
  };

  describe('execute()', () => {
    test('throw error EMAIL_IS_ALREADY_IN_USE if email is taken', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'REGISTER_USECASE.EMAIL_IS_ALREADY_IN_USE',
      );
    });

    test('should successfully register a user', async () => {
      const hashedPassword = mockUserData.password;
      const accessToken = faker.internet.jwt();

      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);
      mockHashService.hash = jest.fn().mockReturnValue(hashedPassword);
      mockUserRepository.create = jest.fn().mockResolvedValueOnce({
        ...mockUserData,
        isVerified: false,
        picUrl: null,
      });
      mockTokenService.generate = jest.fn().mockReturnValue(accessToken);

      const result = await usecase.execute(mockRequestData);

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        {
          data: {
            ...mockRequestData,
            password: hashedPassword,
            isVerified: false,
            picUrl: null,
          },
        },
        mockDatabase,
      );
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
