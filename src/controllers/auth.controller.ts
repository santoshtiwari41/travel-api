import { Request, Response } from "express";
import { AppError } from "../utils/appError.js";

export async function Login(req:Request, res:Response) {


    try{}

    catch(error){
    if(error instanceof AppError){
        return res.status(error.statusCode).json({message: error.message});

    }

    return res.status(500).json({message: "Internal Server Error"});

}
}