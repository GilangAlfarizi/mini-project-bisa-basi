import { faker } from '@faker-js/faker';
import { hashSync } from 'bcryptjs';

export const usersDataConstant = [
  {
    id: faker.string.uuid(),
    name: 'Gilang Alfarizi',
    password: hashSync('passwordexample', 10),
    email: 'alfarizigilang@vokraf.com',
    createdAt: '2025-10-23 06:36:38.189',
    updatedAt: '2025-10-23 06:36:38.189',
  },
];
