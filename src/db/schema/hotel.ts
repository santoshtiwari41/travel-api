import { pgTable, uuid, varchar, real, bigint } from "drizzle-orm/pg-core";
// @ts-ignore
import { cities } from "./location";

export const hotels = pgTable("hotels", {
  id: uuid("id").defaultRandom().primaryKey(),
  cityId: bigint("city_id",{ mode: "number" }).references(() => cities.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  ratingAvg: real("rating_avg").default(0),
  pricePerNight: real("price_per_night"),
});
