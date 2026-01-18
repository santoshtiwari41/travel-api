import { pgTable, uuid, varchar, real } from "drizzle-orm/pg-core";
// @ts-ignore
import { cities } from "./location";

export const hotels = pgTable("hotels", {
  id: uuid("id").defaultRandom().primaryKey(),
  cityId: uuid("city_id").references(() => cities.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  ratingAvg: real("rating_avg").default(0),
  pricePerNight: real("price_per_night"),
});
