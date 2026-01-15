import { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { signUpUser } from "../services/auth.service.js";

export async function Login(req:Request, res:Response) {
    try{

        const {email,password,fullName}=req.body;

        if(!email || !password || !fullName){
            return res.status(400).json({message:"Email, password and fullName are required "})
        }

        await signUpUser(email,password,fullName);
        
        

    }

    catch(error){
    if(error instanceof AppError){
        return res.status(error.statusCode).json({message: error.message});

    }
    return res.status(500).json({message: "Internal Server Error"});
}
}