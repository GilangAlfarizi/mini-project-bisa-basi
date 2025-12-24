import { Column, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { PgTable, PgUpdateSetSource } from 'drizzle-orm/pg-core';

import { schema } from '../src/database';
import { campaigns, categories, users } from '../src/database/schema';
import {
  campaignsDataConstant,
  categoriesDataConstant,
  usersDataConstant,
} from './constant.ts';

const db = drizzle({ connection: process.env.DATABASE_URL || '', schema });

export function conflictUpdateSet<TTable extends PgTable>(
  table: TTable,
  columns: (keyof TTable['_']['columns'] & keyof TTable)[],
): PgUpdateSetSource<TTable> {
  return Object.assign(
    {},
    ...columns.map((k) => ({
      [k]: sql.raw(`excluded.${(table[k] as Column).name}`),
    })),
  ) as PgUpdateSetSource<TTable>;
}
const main = async () => {
  try {
    db.transaction(async (tx) => {
      await tx
        .insert(categories)
        .values(categoriesDataConstant)
        .onConflictDoNothing();

      await Promise.all([
        tx.insert(users).values(usersDataConstant).onConflictDoNothing(),
        tx
          .insert(campaigns)
          .values(campaignsDataConstant)
          .onConflictDoNothing(),
      ]);
    });

    console.log('Seed Successfully');
  } catch (error) {
    console.log(error);
  }
};

main();
