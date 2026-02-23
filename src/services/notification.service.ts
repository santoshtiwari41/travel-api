import { db } from "@/db/drizzle.js";
import { expoToken } from "@/db/schema/expo-token.js";
import { notification as Notification } from "@/db/schema/notification.js";
import { inArray, arrayContains } from "drizzle-orm";
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

export async function sendExpoNotification(
  tokens: string[],
  notification: SendNotification
) {
  const messages = tokens.map((token) => ({
    to: token,
    sound: 'default' as const,
    title: notification.title,
    body: notification.body,
    data: notification.data || {},
  }));

  const chunks = chunkArray(messages, 100);
  let successCount = 0;
  let failedCount = 0;

  for (const chunk of chunks) {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });

      if (!response.ok) {
        failedCount += chunk.length;
        continue;
      }

      const result = (await response.json()) as { data: any[] };
      const tickets = result.data || [];

      tickets.forEach((ticket: any) => {
        if (ticket.status === 'ok') {
          successCount++;
        } else {
          failedCount++;
        }
      });
    } catch (error) {
      console.error('Expo Notification Error:', error);
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

  await sendExpoNotification(tokens, notification);

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

