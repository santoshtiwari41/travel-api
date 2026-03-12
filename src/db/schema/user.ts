import { is } from "drizzle-orm";
import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users=pgTable("users",{
    id:uuid("id").primaryKey().defaultRandom().notNull().unique(),
    fullName:varchar("full_name").notNull(),
    email:varchar("email").notNull().unique(),
    password:varchar("password"),
    isVerified:boolean("is_verified").default(false).notNull(),
    isGoogleAuth:boolean("is_google_auth").default(false).notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),
})