import { Request, Response } from "express";
import { FriendService } from "src/services/friend.service.js";
import { AppError } from "src/utils/appError.js";


export async function sendRequest(req: Request, res: Response) {

  try{
   const senderId = req.user.id;
    const { receiverId } = req.body;

    await FriendService.sendRequest(senderId, receiverId);
    res.status(200).json({ message: "Friend request sent" });
  }

  catch(error){
    if(error instanceof AppError)
    {
     return res.status(error.statusCode).json({message: error.message});
    }
   return res.status(500).json({message: "Internal Server Error"});
  }
}

export async function acceptRequest(req: Request, res: Response) {

  try{
    const userId = req.user.id;
    const { requestId } = req.params;

    await FriendService.acceptRequest(requestId, userId);
    res.status(200).json({ message: "Friend request accepted" });
  }
  catch(error){
    if(error instanceof AppError)
    {
     return res.status(error.statusCode).json({message: error.message});
    }
   return res.status(500).json({message: "Internal Server Error"});
  }
}