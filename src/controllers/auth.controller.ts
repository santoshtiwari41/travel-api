import { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { signUpUser } from "../services/auth.service.js";
import { generateToken } from "../lib/jwt.js";

export async function Register(req:Request, res:Response) {
    try{

        const {email,password,fullName}=req.body;

        if(!email || !password || !fullName){
            return res.status(400).json({message:"Email, password and fullName are required "})
        }

        const data=await signUpUser(email,password,fullName);
        
        if(!data){
            return res.status(400).json({message:"Failed to register user"});
        }
        
        const token =generateToken({userId:data.id,email,fullName},'10m');
        return res.status(201).json({message:"User registered successfully",token});
           

    }

    catch(error){
    if(error instanceof AppError){
        return res.status(error.statusCode).json({message: error.message});

    }
    console.log('error is ',error)
    return res.status(500).json({message: "Internal Server Error",error});
}
}