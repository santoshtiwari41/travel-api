
import { Request, Response } from "express";
import { TripService } from "src/services/trip.service.js";
import { AppError } from "src/utils/appError.js";

const notification = {
  title: "your friend is also going to the same destination",
  description: "you can connect with your friend and plan your trip together",
  data: { type: "friend_request" },
};

export class TripController {
  constructor(private readonly tripService: typeof TripService) {}

  createTrip = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
      }

      const { cityId, startDate, endDate } = req.body;
      if (!cityId || !startDate || !endDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const { userId } = req.user;

      await this.tripService.createTrip(
        userId,
        cityId,
        startDate,
        endDate
      );

      return res.status(200).json({
        message: "trip created successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  };

  toggleTrip = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user;
      const tripId = req.params.id;

      if (!tripId) {
        return res.status(400).json({ message: "invalid trip" });
      }

      await this.tripService.createOngoing(userId, tripId);

      return res.status(200).json({
        message: "toggled trip successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  };

  getTrips = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user;

      const trips = await this.tripService.getOngoingPlannedTrip(userId);

      return res.status(200).json({ trips });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  };

  getAllTrips = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user;

      const trips = await this.tripService.allTrips(userId);

      return res.status(200).json({ trips });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  };

  deleteTrip = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user;
      const tripId = req.params.id;

      if (!tripId) {
        return res.status(400).json({ message: "invalid trip" });
      }

      await this.tripService.deleteTrip(userId, tripId);

      return res.status(200).json({
        message: "Trip deleted successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  };

  updateTrip = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "body is required" });
      }

      const { status } = req.body;
      if (status === "ongoing") {
        return res
          .status(400)
          .json({ message: "status not allowed" });
      }

      const { userId } = req.user;
      const tripId = req.params.id;

      if (!tripId) {
        return res.status(400).json({ message: "invalid trip" });
      }

      await this.tripService.updateTrips(userId, tripId, status);

      return res.status(200).json({
        message: "status updated successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  };
}