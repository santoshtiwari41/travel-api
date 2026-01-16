import { pgTable, serial, varchar, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';
// @ts-ignore
import { users } from './user.js';

export const otps = pgTable('otps', {
  id: serial('id').primaryKey(),
  
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  
  code: varchar('code', { length: 6 }).notNull(),
  
  isUsed: boolean('is_used').default(false).notNull(),
  
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type OTP = typeof otps.$inferSelect;
export type NewOTP = typeof otps.$inferInsert;