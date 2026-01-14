import { Request, Response } from "express";
import { AppError } from "../utils/appError.js";

export async function Login(req:Request, res:Response) {
    try{

        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"Email and password are required "})
        }
        

    }

    catch(error){
    if(error instanceof AppError){
        return res.status(error.statusCode).json({message: error.message});

    }
    return res.status(500).json({message: "Internal Server Error"});
}
}