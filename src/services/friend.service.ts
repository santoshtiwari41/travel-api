import { db } from "@/db/drizzle.js";
import { friendRequests, friends } from "@/db/schema/social.js";
import { and, eq } from "drizzle-orm";
import { AppError } from "src/utils/appError.js";

export class FriendService {
  static async sendRequest(senderId: string, receiverId: string) {
    return db.insert(friendRequests).values({
      senderId,
      receiverId,
    });
  }

  static async acceptRequest(requestId: string, userId: string) {
    const request = await db.query.friendRequests.findFirst({
      where: eq(friendRequests.id, requestId),
    });

    if (!request || request.receiverId !== userId) {
        throw new AppError("unauthorized", 403);
    }

    await db.transaction(async (tx) => {
      await tx
        .update(friendRequests)
        .set({ status: "accepted" })
        .where(eq(friendRequests.id, requestId));

      await tx.insert(friends).values([
        { userId: request.senderId, friendId: request.receiverId },
        { userId: request.receiverId, friendId: request.senderId },
      ]);
    });
  }
}
