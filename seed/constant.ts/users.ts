import { faker } from '@faker-js/faker';

export const usersDataConstant = [
  {
    id: faker.string.uuid(),
    name: 'User Admin',
    password: 'thisAdmin123',
    email: 'thisisadmin@gmail.com',
    createdAt: '2025-10-23 06:36:38.189',
    updatedAt: '2025-10-23 06:36:38.189',
  },
];
