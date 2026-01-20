import { pgTable, uuid, varchar, real, boolean, bigint } from "drizzle-orm/pg-core";
// @ts-ignore
import { cities } from "./location";

export const restaurants = pgTable("restaurants", {
  id: uuid("id").defaultRandom().primaryKey(),
  cityId: bigint("city_id",{ mode: "number" }).references(() => cities.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  priceRange: varchar("price_range", { length: 20 }),
  ratingAvg: real("rating_avg").default(0),
});

export const dishes = pgTable("dishes", {
  id: uuid("id").defaultRandom().primaryKey(),
  restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  price: real("price"),
  isSignature: boolean("is_signature").default(false),
});
