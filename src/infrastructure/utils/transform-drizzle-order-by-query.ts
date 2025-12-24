import { OrderByRequest } from '@domain/base';
import { asc, desc } from 'drizzle-orm';

export const transformDrizzleOrderByQuery = <Model>(
  table: any,
  orderBy?: OrderByRequest<Model>,
) => {
  if (!orderBy) return undefined;

  const conditions = Object.entries(orderBy).map(([key, value]) => {
    if (value === 'desc') {
      return desc(table[key]);
    }

    return asc(table[key]);
  });

  return conditions.length ? conditions : undefined;
};
