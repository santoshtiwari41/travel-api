import { pgTable, uuid, varchar, real, bigint } from "drizzle-orm/pg-core";
// @ts-ignore
import { cities } from "./location";

export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  cityId: bigint("city_id",{ mode: "number" }).references(() => cities.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 50 }),
  price: real("price"),
  ratingAvg: real("rating_avg").default(0),
});
