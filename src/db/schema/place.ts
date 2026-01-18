import { pgTable, uuid, varchar, text, real } from "drizzle-orm/pg-core";
// @ts-ignore
import { cities } from "./location";

export const places = pgTable("places", {
  id: uuid("id").defaultRandom().primaryKey(),
  cityId: uuid("city_id").references(() => cities.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }),
  ratingAvg: real("rating_avg").default(0),
});
