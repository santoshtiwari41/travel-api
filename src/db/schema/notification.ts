// @ts-nocheck
import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  serial,
  text,
  uuid,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './user';
export const notification = pgTable(
  'notification',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    data: json('data'),
    sentBy: uuid('sent_by').references(() => users.id),
    sentTo: uuid('sent_to').array(),
    readBy: uuid('read_by').array().default([]),
    successCount: integer('success_count').default(0),
    failedCount: integer('failed_count').default(0),
    totalCount: integer('total_count').default(0),
    isDeleted: boolean('is_deleted').default(false),
    insertedAt: timestamp('inserted_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [index('notification_sent_by_idx').on(table.sentBy)],
);

export const notificationRelations = relations(notification, ({ one }) => ({
  sender: one(users, {
    fields: [notification.sentBy],
    references: [users.id],
  }),
}));