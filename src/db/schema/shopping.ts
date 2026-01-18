import { pgTable, uuid, varchar, real, boolean } from "drizzle-orm/pg-core";
//@ts-ignore
import { cities } from "./location";

export const shoppingCenters = pgTable("shopping_centers", {
  id: uuid("id").defaultRandom().primaryKey(),
  cityId: uuid("city_id").references(() => cities.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  ratingAvg: real("rating_avg").default(0),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  shoppingCenterId: uuid("shopping_center_id")
    .references(() => shoppingCenters.id)
    .notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  price: real("price"),
  isLocalSpecialty: boolean("is_local_specialty").default(false),
});
