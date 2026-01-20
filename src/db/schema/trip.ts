import {
  pgTable,
  uuid,
  date,
  timestamp,
  pgEnum,
  bigint,
} from "drizzle-orm/pg-core";
// @ts-ignore
import { users } from "./user";
// @ts-ignore
import { cities } from "./location";

export const tripStatus = pgEnum("trip_status", [
  "planned",
  "ongoing",
  "completed",
  "cancelled",
]);

export const tripVisibility = pgEnum("trip_visibility", [
  "private",
  "friends",
  "public",
]);

export const trips = pgTable("trips", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  cityId: bigint("city_id",{ mode: "number" }).references(() => cities.id).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: tripStatus("status").default("planned"),
  visibility: tripVisibility("visibility").default("friends"),
  createdAt: timestamp("created_at").defaultNow(),
});
