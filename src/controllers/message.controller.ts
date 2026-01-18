import { Request, Response } from "express";
import { MessageService } from "src/services/message.service.js";
import { AppError } from "src/utils/appError.js";

export async function getHistory(req:Request,res:Response){
  try{
const { conversationId } = req.params;
    const { page = 0 } = req.query;

    const messages = await MessageService.getHistory(
      conversationId,
      50,
      Number(page) * 50
    );

    res.json(messages);
  }
  catch(error){

    if(error instanceof AppError){
        return res.status(error.statusCode).json(error.message)
    }
    return res.status(500).json("internal servier error")
  }

}