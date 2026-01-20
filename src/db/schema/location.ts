import {
  pgTable,
  varchar,
  decimal,
  bigint,
  index,
  uuid
} from "drizzle-orm/pg-core";

export const countries = pgTable("countries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  code: varchar("code", { length: 5 }).notNull(),
});


export const cities=pgTable("cities",{
    id: bigint("id", { mode: "number" }).primaryKey(), 
    city: varchar("city", { length: 150 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    iso2: varchar("iso2", { length: 2 }).notNull(),
    iso3: varchar("iso3", { length: 3 }).notNull(),
    lat: decimal("lat", { precision: 9, scale: 6 }).notNull(),
    lng: decimal("lng", { precision: 9, scale: 6 }).notNull(),
})
