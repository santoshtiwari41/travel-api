import { Request, Response } from "express";
import { AppError } from "src/utils/appError.js";
import { getUserNotifications, markAllNotificationsRead, markNotificationRead } from "src/services/notification.service.js";

export async function sendNotification(_req: Request, res: Response) {
  return res.status(501).json({ message: "Not implemented" });
}

export async function getNotifications(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const notifications = await getUserNotifications(userId);

    const enriched = notifications
      .filter((n: any) => !n.isDeleted)
      .map((n: any) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        data: n.data,
        createdAt: n.insertedAt,
        read: Array.isArray(n.readBy) ? n.readBy.includes(userId) : false,
        successCount: n.successCount,
        failedCount: n.failedCount,
        totalCount: n.totalCount,
      }))
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = enriched.filter((n: any) => !n.read).length;

    return res.status(200).json({ notifications: enriched, unreadCount });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function readAllNotifications(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const result = await markAllNotificationsRead(userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function readNotification(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Notification id is required" });
    const result = await markNotificationRead(userId, id);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}