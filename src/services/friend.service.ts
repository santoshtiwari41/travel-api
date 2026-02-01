import { db } from "@/db/drizzle.js";
import { friendRequests, friends } from "@/db/schema/social.js";
import { users } from "@/db/schema/user.js";
import { and, eq } from "drizzle-orm";
import { AppError } from "src/utils/appError.js";

export class FriendService {
  static async sendRequest(senderId: string, receiverId: string) {
    return db.insert(friendRequests).values({
      senderId,
      receiverId,
    });
  }

  static async getFriends(userId: string) {
    const myFriends = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      })
      .from(friends)
      .innerJoin(users, eq(friends.friendId, users.id))
      .where(eq(friends.userId, userId));

    return myFriends
  }



  static async getFriendRequests(userId: string) {
    const result = await db
      .select({
        id: friendRequests.id,
        status: friendRequests.status,
        createdAt: friendRequests.createdAt,
        senderId: users.id,
        senderName: users.fullName,
        senderEmail: users.email,
      })
      .from(friendRequests)
      .innerJoin(users, eq(friendRequests.senderId, users.id))
      .where(and(eq(friendRequests.receiverId, userId), eq(friendRequests.status, "pending")));

    return result;
  };
static async acceptRequest(requestId: string, userId: string) {
  await db.transaction(async (tx) => {
    const updated = await tx
      .update(friendRequests)
      .set({ status: "accepted" })
      .where(
        and(
          eq(friendRequests.id, requestId),
          eq(friendRequests.receiverId, userId),
          eq(friendRequests.status, "pending")
        )
      )
      .returning();

    const request = updated[0];

    if (!request) {
      throw new AppError("Friend request already processed or invalid", 400);
    }

    await tx.insert(friends).values([
      { userId: request.senderId, friendId: request.receiverId },
      { userId: request.receiverId, friendId: request.senderId },
    ]);
  });
}
  static async declineRequest(requestId: string, userId: string) {
    const deleted = await db
      .delete(friendRequests)
      .where(
        and(
          eq(friendRequests.id, requestId),
          eq(friendRequests.receiverId, userId),
          eq(friendRequests.status, "pending")
        )
      )
      .returning();

    if (deleted.length === 0) {
      throw new AppError("Friend request already processed or invalid", 400);
    }
  }

}
