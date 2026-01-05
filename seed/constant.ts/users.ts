import { hashSync } from 'bcryptjs';

export const usersDataConstant = [
  {
    id: 'df8bb538-cd97-4d1c-ad81-8e029f0663f2',
    name: 'Gilang Alfarizi',
    password: hashSync('passwordexample', 10),
    email: 'alfarizigilang@vokraf.com',
    createdAt: '2025-10-23 06:36:38.189',
    updatedAt: '2025-10-23 06:36:38.189',
  },
];
