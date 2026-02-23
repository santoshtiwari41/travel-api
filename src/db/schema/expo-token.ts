import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const expoToken = pgTable("expo_token", {
    id: uuid("id").notNull().unique(),
    token:text("token"),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
})

