import type { Request, Response } from "express";
import { getUserProfile } from "../services/user.service.js";
import { AppError } from "../utils/appError.js";

export const UserProfile = async (req: Request, res: Response) => {
    try {
        const user = await getUserProfile()
        res.status(200).json(user)
    }

    catch (error) {
        if(error instanceof AppError){
            res.status(error.statusCode).json({message:error.message})
        }
        res.status(500).json({ message: "internal server error" })
    }
}


export const updateUserProfile=async(req:Request,res:Response)=>{
    try{
    const user=await getUserProfile();
    res.status(200).json(user);
    }
    catch(error){
        if(error instanceof AppError){
            res.status(error.statusCode).json({message:error.message})
        }
        res.status(500).json({ message: "internal server error" })
    }
}