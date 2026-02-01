import { Request, Response } from "express";
import { FriendService } from "src/services/friend.service.js";
import { AppError } from "src/utils/appError.js";


export async function sendRequest(req: Request, res: Response) {

  try {
    const senderId = await req.user.userId;
    const { receiverId } = req.body;

    await FriendService.sendRequest(senderId, receiverId);
    res.status(200).json({ message: "Friend request sent" });
  }

  catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'internal server error' });
  }
}

export async function acceptRequest(req: Request, res: Response) {

  try {
    const userId = await req.user.userId;
    const { requestId } = req.params;
    if(!requestId){
      return res.status(400).json({message:'invalid user'})
    }

    await FriendService.acceptRequest(requestId, userId);
    res.status(200).json({ message: "Friend request accepted" });
  }
  catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function getFriends(req: Request, res: Response) {
  try {
    const userId = await req.user.userId;
    const friendsList = await FriendService.getFriends(userId)
    return res.status(200).json(friendsList)
  }
  catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Internal server error'})
  }
}

export async function getAllRequest(req: Request, res: Response) {
  try {
    const userId = await req.user.userId;
    const friendsRequest=await FriendService.getFriendRequests(userId)
    return res.status(200).json(friendsRequest)

  }
  catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message:'Internal Server Error' })
  }
}

export async function rejectRequest(req: Request, res: Response) {

  try {
    const userId = await req.user.userId;
    const { requestId } = req.params;
    if(!requestId){
      return res.status(400).json({message:'invalid user'})
    }

    await FriendService.declineRequest(requestId, userId);
    res.status(200).json({ message: "Friend request rejected" });
  }
  catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}