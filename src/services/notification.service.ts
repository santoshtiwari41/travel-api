import { db } from "@/db/drizzle.js";
import { expoToken } from "@/db/schema/expo-token.js";
import { notification as Notification } from "@/db/schema/notification.js";
import { and, eq, inArray, arrayContains, not } from "drizzle-orm";
import { AppError } from "src/utils/appError.js";

export interface SendNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
}

const chunkArray = <T>(arr: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};


export async function sendOneSignalNotification(
  tokens: string[],
  notification: SendNotification
) {
  const appId = process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_API_KEY;

  if (!appId || !apiKey) {
    throw new AppError(
      "OneSignal is not configured. Set ONESIGNAL_APP_ID and ONESIGNAL_API_KEY env vars.",
      500
    );
  }

  const chunks = chunkArray(tokens, 2000); 
  let successCount = 0;
  let failedCount = 0;

  for (const chunk of chunks) {
    try {
      const response = await fetch("https://api.onesignal.com/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Basic ${apiKey}`,
        },
        body: JSON.stringify({
          app_id: appId,
          include_subscription_ids: chunk,
          headings: { en: notification.title },
          contents: { en: notification.body },
          data: notification.data || {},
        }),
      });

      if (!response.ok) {
        console.error("OneSignal Notification Error:", await response.text());
        failedCount += chunk.length;
        continue;
      }

      const result = (await response.json()) as { id?: string; errors?: any };
      if (result.id) {
        successCount += chunk.length;
      } else {
        failedCount += chunk.length;
      }
    } catch (error) {
      console.error("OneSignal Notification Error:", error);
      failedCount += chunk.length;
    }
  }

  return { successCount, failedCount };
}

export async function sendNotificationsToUsers(
  userIds: string[],
  sentBy: string,
  notification: SendNotification
) {
  const userTokens = await db
    .select({
      token: expoToken.token,
      userId: expoToken.userId,
    })
    .from(expoToken)
    .where(inArray(expoToken.userId, userIds));

  if (userTokens.length === 0) {
    throw new AppError('No notification tokens found for the specified users', 404);
  }

  const tokens = userTokens.map((ut) => ut.token).filter((token) => token !== null) as string[];

  await sendOneSignalNotification(tokens, notification);

  await db.insert(Notification).values({
    title: notification.title,
    body: notification.body,
    data: notification.data,
    sentBy: sentBy,
    sentTo: userTokens.map((user) => user.userId),
    totalCount: userTokens.length,
  });
}

export async function getUserNotifications(userId: string) {
  const notifications = await db.select().from(Notification).where(arrayContains(Notification.sentTo, [userId]));
  return notifications;
}

export async function markAllNotificationsRead(userId: string) {
  const unread = await db
    .select({
      id: Notification.id,
      readBy: Notification.readBy,
    })
    .from(Notification)
    .where(
      and(
        arrayContains(Notification.sentTo, [userId]),
        eq(Notification.isDeleted, false),
        not(arrayContains(Notification.readBy, [userId]))
      )
    );

  for (const n of unread) {
    const current = Array.isArray(n.readBy) ? n.readBy : [];
    const next = current.includes(userId) ? current : [...current, userId];
    await db.update(Notification).set({ readBy: next }).where(eq(Notification.id, n.id));
  }

  return { updated: unread.length };
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const rows = await db
    .select({
      id: Notification.id,
      sentTo: Notification.sentTo,
      readBy: Notification.readBy,
      isDeleted: Notification.isDeleted,
    })
    .from(Notification)
    .where(eq(Notification.id, notificationId))
    .limit(1);

  const n = rows[0];
  if (!n || n.isDeleted) throw new AppError("Notification not found", 404);
  if (!Array.isArray(n.sentTo) || !n.sentTo.includes(userId)) {
    throw new AppError("Not allowed", 403);
  }

  const current = Array.isArray(n.readBy) ? n.readBy : [];
  const next = current.includes(userId) ? current : [...current, userId];
  await db.update(Notification).set({ readBy: next }).where(eq(Notification.id, notificationId));

  return { updated: true };
}

