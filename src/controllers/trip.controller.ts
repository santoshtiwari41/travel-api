import { AppError } from "src/utils/appError.js";
import { Request, Response } from "express";
import { allTrips, createOngoing, createTrip, deleteTrip, getOngoingPlannedTrip, updateTrips } from "src/services/trip.service.js";

export async function CreateTrip(req: Request, res: Response) {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { cityId, startDate, endDate } = req.body;
    if (!cityId || !startDate || !endDate) {

    }
    const { userId } = req.user
    await createTrip(userId, cityId, startDate, endDate);

    return res.status(200).json({ message: 'trip created successfully' })


  }
  catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message: 'internal server error' })
  }
}

export async function toggleTrip(req: Request, res: Response) {
  try {

    const { userId } = req.user;
    const tripId=req.params.id;
    if (!tripId) {
      return res.status(400).json({ message: 'invalid trip ' })
    }
    await createOngoing(userId, tripId)
    res.status(200).json({ message: 'toggled trip successfully' })
  }
  catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message: 'internal server error' })
  }
}

export async function getTrips(req: Request, res: Response) {

  try {
    const { userId } = req.user;
    const trips = await getOngoingPlannedTrip(userId)
    return res.status(200).json({ trips })

  }
  catch (error) {
    {

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      return res.status(500).json({ message: 'internal server error' })
    }
  }
}

export async function getAllTrips(req: Request, res: Response) {
  try {
    const { userId } = req.user;
    const trips = await allTrips(userId)
    return res.status(200).json({ trips })


  }
  catch (error) {
    {

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      return res.status(500).json({ message: 'internal server error' })
    }
  }
}

export async function deleteTrips(req: Request, res: Response) {

  try {

    if (!req.body) {
      return res.status(400).json({ message: 'body is required' })
    }
    const { userId } = req.user;
    const tripId= req.params.id;
    if (!tripId) {
      return res.status(400).json({ message: 'invalid trip ' })
    }
    await deleteTrip(userId,tripId)
    return res.status(200).json({message:'Trip deleted successfully'})
  }

  catch (error) {
    {

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      return res.status(500).json({ message: 'internal server error' })
    }
  }
}

export async function updateTrip(req:Request,res:Response){
  try{
   if (!req.body) {
      return res.status(400).json({ message: 'body is required' })
    }
    const { status } = req.body;
    if(status==="ongoing"){
      return res.status(400).json({message:'status not allowed'})
    }
    const {userId}=req.user
    const tripId=req.params.id;
    if (!tripId) {
      return res.status(400).json({ message: 'invalid trip ' })
    }

    await updateTrips(userId,tripId,status)
    return res.status(200).json({message:"status updated successfully"})
  }
  catch(error){
    {

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message })
      }
      return res.status(500).json({ message: 'internal server error' })
    }
  }

}

