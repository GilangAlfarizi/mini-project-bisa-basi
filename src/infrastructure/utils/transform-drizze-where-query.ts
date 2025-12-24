import { WhereRequest, WhereUniqueRequest } from '@domain/base';
import {
  and,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  not,
  notInArray,
} from 'drizzle-orm';

export const transformDrizzleWhereQuery = <Model>(
  table: any,
  where?: WhereRequest<Model> | WhereUniqueRequest<Model>,
) => {
  if (!where) return undefined;

  const conditions = Object.entries(where).map(([key, value]) => {
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value.in)) {
        return inArray(table[key], value.in);
      }
      if (value.contains) {
        return ilike(table[key], `%${value.contains.toLowerCase()}%`);
      }
      if (value.lte) {
        return lte(table[key], value.lte);
      }
      if (value.gte) {
        return gte(table[key], value.gte);
      }
      if (value.not) {
        return not(eq(table[key], value.not));
      }
      if (Array.isArray(value.notIn)) {
        return notInArray(table[key], value.notIn);
      }
    } else {
      return eq(table[key], value);
    }
  });

  return conditions.length ? and(...conditions) : undefined;
};
