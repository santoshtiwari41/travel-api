import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
// @ts-ignore
import { users } from "./user";



export const conversationTypeEnum = pgEnum("conversation_type", [
  "direct", // 1-to-1 chat
  "group",  // future
]);

export const messageTypeEnum = pgEnum("message_type", [
  "text",
  "image",
  "file",
  "system",
]);


export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    type: conversationTypeEnum("type")
      .default("direct")
      .notNull(),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    typeIdx: index("idx_conversations_type").on(table.type),
  })
);



export const conversationParticipants = pgTable(
  "conversation_participants",
  {
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),

    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    joinedAt: timestamp("joined_at").defaultNow(),

    lastReadMessageId: uuid("last_read_message_id"),
    isMuted: boolean("is_muted").default(false),
  },
  (table) => ({
    conversationUserIdx: index("idx_participants_conversation_user").on(
      table.conversationId,
      table.userId
    ),
    userIdx: index("idx_participants_user").on(table.userId),
  })
);


export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),

    senderId: uuid("sender_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    type: messageTypeEnum("type")
      .default("text")
      .notNull(),

    content: text("content"),              
    attachmentUrl: text("attachment_url"), 

    isEdited: boolean("is_edited").default(false),
    isDeleted: boolean("is_deleted").default(false),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    conversationIdx: index("idx_messages_conversation").on(
      table.conversationId,
      table.createdAt
    ),
    senderIdx: index("idx_messages_sender").on(table.senderId),
  })
);



export const messageReads = pgTable(
  "message_reads",
  {
    messageId: uuid("message_id")
      .references(() => messages.id, { onDelete: "cascade" })
      .notNull(),

    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    readAt: timestamp("read_at").defaultNow(),
  },
  (table) => ({
    messageUserIdx: index("idx_message_reads").on(
      table.messageId,
      table.userId
    ),
  })
);
