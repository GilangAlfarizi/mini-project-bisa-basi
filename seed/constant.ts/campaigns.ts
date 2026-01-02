import { faker } from '@faker-js/faker';

import { categoriesDataConstant } from './categories';

export const campaignsDataConstant = [
  {
    id: faker.string.uuid(),
    name: 'Bantu Korban Banjir Sumatera',
    description: 'short description',
    categoryId: categoriesDataConstant[0].id,
    thumbnail: 'image.url',
    totalAmount: 0,
    createdAt: '2025-10-23 06:36:38.189',
    updatedAt: '2025-10-23 06:36:38.189',
  },
];
