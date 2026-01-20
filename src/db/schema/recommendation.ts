import { pgTable, uuid, real, integer, varchar, timestamp, bigint } from "drizzle-orm/pg-core";
// @ts-ignore
import { cities } from "./location";

export const recommendationScores = pgTable("recommendation_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: varchar("entity_type", { length: 30 }).notNull(),
  entityId: uuid("entity_id").notNull(),
  cityId: bigint("city_id",{ mode: "number" }).references(() => cities.id).notNull(),
  score: real("score").notNull(),
  rank: integer("rank"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
