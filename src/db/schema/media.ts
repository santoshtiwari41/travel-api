import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: varchar("entity_type", { length: 30 }).notNull(),
  entityId: uuid("entity_id").notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  type: varchar("type", { length: 20 }),
});
