import {
  GetUserProfileRequest,
  GetUserProfileResponse,
  IUserRepository,
  User,
} from '@domain/user';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';

import { GetUserProfileUseCase } from './get-user-profile.usecase';

describe('[use case] get user profile', () => {
  let usecase: GetUserProfileUseCase;

  const mockUserRepository: IUserRepository = mock<IUserRepository>();

  beforeAll(() => {
    usecase = new GetUserProfileUseCase(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockRequestData: GetUserProfileRequest = {
    userId: faker.string.uuid(),
  };

  const mockUserData: Required<Pick<User, 'id' | 'name' | 'email' | 'picUrl'>> =
    {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      picUrl: faker.internet.url(),
    };

  describe('execute()', () => {
    test('throw error USER_NOT_FOUND if user not found', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'GET_USER_PROFILE_USECASE.USER_NOT_FOUND',
      );
    });

    test('should successfully get user profile', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);

      const result = await usecase.execute(mockRequestData);

      expect(result).toStrictEqual<GetUserProfileResponse>({
        name: mockUserData.name,
        email: mockUserData.email,
        picUrl: mockUserData.picUrl!,
      });
    });

    test('should successfully get user profile without picUrl', async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockResolvedValue({ ...mockUserData, picUrl: null });

      const result = await usecase.execute(mockRequestData);

      expect(result).toStrictEqual<GetUserProfileResponse>({
        name: mockUserData.name,
        email: mockUserData.email,
        picUrl: '-',
      });
    });
  });
});
