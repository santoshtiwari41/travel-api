import { AppError } from "src/utils/appError.js";
import { Request, Response } from "express";
export async function sendNotification(req:Request,res:Response){
    try{

    }
    catch(error)
    {
        if(error instanceof AppError){
            return res.status(error.statusCode).json({
                status:"error",
                message:error.message
            })
        }
        return res.status(500).json({
            status:"error",
            message:"Internal Server Error"
        })
    }
}