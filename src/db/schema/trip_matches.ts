import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
// @ts-ignore
import { trips } from "./trip";

export const tripMatches = pgTable("trip_matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  tripAId: uuid("trip_a_id").references(() => trips.id).notNull(),
  tripBId: uuid("trip_b_id").references(() => trips.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
