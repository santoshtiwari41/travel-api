import { AppError } from "src/utils/appError.js";
import { Request, Response } from "express";
import { createCity, createCountry, getCity, getCountry } from "src/services/place.service.js";

export async function CreateCountry(req: Request, res: Response) {

    try {
      if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
        const { name, code } = req.body;

        if (!name || !code) {
         return res.status(400).json({message:"All fields are required"})
        }
        await createCountry(name, code)
        return res.status(201).json({ success: true, message: "country created" })

    }
    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({message:error.message})
        }
        return res.status(500).json({ message: 'Internal server Error!!' })
    }
}

export async function CreateCity(req:Request,res:Response){

try{
  if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
    const city=req.body;
    if(!city.countryId || !city.name){
        return res.status(400).json({message:"country_id and name are required"})
    }
    await createCity(city)
    return res.status(201).json({message:"city added successfully"})
}

catch(error){
    if(error instanceof AppError){
        return res.status(error.statusCode).json({message:error.message})
    }
    return res.status(500).json({ message: 'Internal server Error!!' })

}

}

export async function GetCountry(req: Request, res: Response) {
  try {
    
    const countries = await getCountry();

    return res.status(200).json({
      success: true,
      data: countries,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


export async function GetCity(req:Request,res:Response){
    try{
    const city=await getCity()
    return res.status(200).json({success:true,city:city})
    }
    catch(error){
        if(error instanceof AppError){
            return res.status(error.statusCode).json({message:error.message})
        }
        return res.status(500).json({message:"internal server error"})
    }
}