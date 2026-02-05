import { pgTable, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
//@ts-ignore
import { users } from "./user";

export const friendRequestStatus = pgEnum("friend_request_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const friendRequests = pgTable("friend_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  receiverId: uuid("receiver_id").references(() => users.id).notNull(),
  status: friendRequestStatus("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const friends = pgTable("friends", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
    
  friendId: uuid("friend_id")
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
    
  createdAt: timestamp("created_at").defaultNow().notNull(),
});