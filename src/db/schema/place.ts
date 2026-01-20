import { pgTable, uuid, varchar, text, real, bigint } from "drizzle-orm/pg-core";
// @ts-ignore
import { cities } from "./location";

export const places = pgTable("places", {
  id: uuid("id").defaultRandom().primaryKey(),
  cityId: bigint("city_id",{ mode: "number" }).references(() => cities.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }),
  ratingAvg: real("rating_avg").default(0),
});
