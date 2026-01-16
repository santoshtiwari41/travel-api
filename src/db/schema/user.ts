import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users=pgTable("users",{
    id:uuid("id").primaryKey().defaultRandom().notNull().unique(),
    fullName:varchar("full_name").notNull(),
    email:varchar("email").notNull().unique(),
    password:varchar("password").notNull(),
    isVerified:boolean("is_verified").default(false).notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull(),
})