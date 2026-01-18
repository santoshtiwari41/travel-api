import { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { loginUser, signUpUser } from "../services/auth.service.js";
import { generateToken } from "../lib/jwt.js";
import { generateOTP } from "../lib/otp.js";
// import { saveOTP } from "../services/otp.service.js";

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

        const otp=generateOTP();
        console.log('generated otp is ',otp)


        // await saveOTP(data.id,otp);
        console.log('otp saved successfully ')
        
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


export async function Login(req:Request, res:Response) {

    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"Email and password are required "})
        }

        const data=await loginUser(email,password);
        if(!data){
            return res.status(400).json({message:"failed to login user"});
        }
         const token =generateToken({userId:data.id,email},'10m');
        return res.status(200).json({message:"User logged in successfully",token});
           

    }

    catch(error){
        if(error instanceof AppError){
            return res.status(error.statusCode).json({message: error.message});
        }
        return res.status(500).json({message: "Internal Server Error"});
    }
}