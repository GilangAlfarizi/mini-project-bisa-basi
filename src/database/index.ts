import { ExtractTablesWithRelations } from 'drizzle-orm';
import { NodePgDatabase, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';

import * as schema from './schema';

const DB = 'DB';

type Database = NodePgDatabase<typeof schema>;

type DBTransaction = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>
>;

export {Database, DB, DBTransaction, schema}