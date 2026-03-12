// src/modules/trip/trip.routes.ts

import { Router } from "express";
import { TripController } from "src/controllers/trip.controller.js";
import { AuthMiddleware } from "src/middlewares/auth.middleware.js";
import { TripService } from "src/services/trip.service.js";


export class TripRoutes {
  public readonly router: Router;

  constructor() {
    this.router = Router();

    const tripController = new TripController(TripService);

    this.router.post("/", AuthMiddleware, tripController.createTrip);
    this.router.get("/", AuthMiddleware, tripController.getAllTrips);
    this.router.get("/active", AuthMiddleware, tripController.getTrips);
    this.router.put(
      "/active/:id",
      AuthMiddleware,
      tripController.toggleTrip
    );
    this.router.put("/:id", AuthMiddleware, tripController.updateTrip);
    this.router.delete("/:id", AuthMiddleware, tripController.deleteTrip);
  }
}