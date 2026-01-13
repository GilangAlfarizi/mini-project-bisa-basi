import { IImageService } from '@application/services';
import { Database } from '@database';
import {
  IUserRepository,
  UpdateUserProfilePictureRequest,
  User,
} from '@domain/user';
import { faker } from '@faker-js/faker';
import { mock } from 'jest-mock-extended';
import { Readable } from 'stream';

import { UpdateUserProfilePictureUseCase } from './update-user-profile-picture.usecase';

describe('[use case] update user profile picture', () => {
  let usecase: UpdateUserProfilePictureUseCase;
  const mockDatabase: Database = mock<Database>();
  const mockUserRepository: IUserRepository = mock<IUserRepository>();
  const mockImageService: IImageService = mock<IImageService>();

  beforeAll(() => {
    usecase = new UpdateUserProfilePictureUseCase(
      mockDatabase,
      mockUserRepository,
      mockImageService,
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

  const mockRequestData: UpdateUserProfilePictureRequest = {
    userId: faker.string.uuid(),
    file: {
      fieldname: 'file',
      originalname: 'profile.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 204800,
      buffer: Buffer.from('mock-image-data'),
      destination: '',
      filename: '',
      path: '',
      stream: new Readable(),
    },
  };

  const mockUserData: Pick<User, 'id' | 'picUrl'> = {
    id: faker.string.uuid(),
    picUrl: null,
  };

  const uploadResult = {
    url: faker.internet.url(),
    public_id: faker.string.uuid(),
  };

  describe('execute()', () => {
    test('throw error USER_NOT_FOUND if category name is taken', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      expect(usecase.execute(mockRequestData)).rejects.toThrow(
        'GET_USER_PROFILE_USECASE.USER_NOT_FOUND',
      );
    });

    test('should successfully update a profile picture', async () => {
      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUserData);

      mockImageService.uploadPicture = jest
        .fn()
        .mockResolvedValue(uploadResult);
      mockUserRepository.update = jest.fn().mockResolvedValueOnce({});

      await usecase.execute(mockRequestData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        {
          data: { picUrl: uploadResult.url },
          where: { id: mockRequestData.userId },
        },
        mockDatabase,
      );
    });

    test('should successfully replace a profile picture', async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockResolvedValue({ ...mockUserData, picUrl: faker.internet.url() });

      mockImageService.uploadPicture = jest
        .fn()
        .mockResolvedValue(uploadResult);
      mockImageService.deleteOldPicture = jest.fn().mockReturnThis();

      await usecase.execute(mockRequestData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(
        {
          data: { picUrl: uploadResult.url },
          where: { id: mockRequestData.userId },
        },
        mockDatabase,
      );
    });
  });
});
