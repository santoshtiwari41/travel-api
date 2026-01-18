import { pgTable, uuid, varchar, integer, text, timestamp } from "drizzle-orm/pg-core";
// @ts-ignore
import { users } from "./user";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  entityType: varchar("entity_type", { length: 30 }).notNull(),
  entityId: uuid("entity_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});
