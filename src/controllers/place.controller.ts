import { AppError } from "src/utils/appError.js";
import { Request, Response } from "express";
import { createCountry, getCities, getCountry } from "src/services/place.service.js";

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


export async function GetCity(req: Request, res: Response) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

    const result = await getCities({
      search,
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 50 : limit,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
    
  } catch (error) {
    console.error("Error in GetCity Controller:", error);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ 
        success: false, 
        message: error.message 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "internal server error" 
    });
  }
}