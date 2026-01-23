import { Router } from "express";
import { CreateTrip } from "src/controllers/trip.controller.js";
import { AuthMiddleware } from "src/middlewares/auth.middleware.js";

const router:Router=Router()
router.post('/',AuthMiddleware,CreateTrip)

export default router ;