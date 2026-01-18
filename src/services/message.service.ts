
import { db } from "@/db/drizzle.js";
import { conversationParticipants, conversations, messages } from "@/db/schema/message.js";
import { and, eq, inArray, sql } from "drizzle-orm";
import { AppError } from "src/utils/appError.js";

export class MessageService {
  static async getOrCreateDirectConversation(userA: string, userB: string) {
    const existing = await db
      .select({ id: conversations.id })
      .from(conversations)
      .innerJoin(conversationParticipants,
        eq(conversationParticipants.conversationId, conversations.id)
      )
      .where(inArray(conversationParticipants.userId, [userA, userB]))
      .groupBy(conversations.id)
      .having(sql`COUNT(*) = 2`);

    if (existing.length > 0) return existing[0].id;

    const [conversation] = await db
      .insert(conversations)
      .values({ type: "direct" })
      .returning();
    if(conversation == undefined) {
      throw new AppError("Failed to create conversation", 500);
    }
    await db.insert(conversationParticipants).values([
      { conversationId: conversation.id, userId: userA },
      { conversationId: conversation.id, userId: userB },
    ]);

    return conversation.id;
  }

  static async saveMessage(
    conversationId: string,
    senderId: string,
    content: string
  ) {
    const [message] = await db
      .insert(messages)
      .values({
        conversationId,
        senderId,
        content,
        type: "text",
      })
      .returning();

    return message;
  }

  static async getHistory(conversationId: string, limit = 50, offset = 0) {
    return db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: (m, { desc }) => [desc(m.createdAt)],
      limit,
      offset,
    });
  }
}
