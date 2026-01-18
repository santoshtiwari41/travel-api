import { pgTable, uuid, varchar, doublePrecision } from "drizzle-orm/pg-core";

export const countries = pgTable("countries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  code: varchar("code", { length: 5 }).notNull(),
});

export const cities = pgTable("cities", {
  id: uuid("id").defaultRandom().primaryKey(),
  countryId: uuid("country_id").references(() => countries.id).notNull(),
  name: varchar("name", { length: 80 }).notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
});
