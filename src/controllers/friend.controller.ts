import { Request, Response } from "express";
import { FriendService } from "src/services/friend.service.js";

export class FriendController {
  static async sendRequest(req: Request, res: Response) {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    await FriendService.sendRequest(senderId, receiverId);
    res.status(200).json({ message: "Friend request sent" });
  }

  static async acceptRequest(req: Request, res: Response) {
    const userId = req.user.id;
    const { requestId } = req.params;

    await FriendService.acceptRequest(requestId, userId);
    res.status(200).json({ message: "Friend request accepted" });
  }
}
