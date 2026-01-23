import { AppError } from "src/utils/appError.js";
import { Request, Response } from "express";
import { createTrip } from "src/services/trip.service.js";

export async function CreateTrip(req:Request,res:Response){
    try{
         if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
        const {cityId,startDate,endDate}=req.body;
        if(!cityId || !startDate || !endDate){

        }
        const {userId}=req.user
        await createTrip(userId,cityId,startDate,endDate);
        
      return res.status(200).json({message:'trip created successfully'})


    }
    catch(error)
    {
       if(error instanceof AppError){
        return res.status(error.statusCode).json({message:error.message})
       } 
       return res.status(500).json({message:'internal server error'})
    }
}