import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const content=sqliteTable('content',{id:text('id').primaryKey(),kind:text('kind').notNull(),value:text('value').notNull(),updatedAt:text('updated_at').notNull()});
