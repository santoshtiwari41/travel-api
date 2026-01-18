import { pgTable, uuid, varchar, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
// @ts-ignore
import { users } from "./user";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  title: varchar("title", { length: 120 }),
  message: varchar("message", { length: 255 }),
  metadata: jsonb("metadata"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
