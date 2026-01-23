import { Router } from "express";
import { CreateTrip, deleteTrips, getAllTrips, getTrips, toggleTrip, updateTrip } from "src/controllers/trip.controller.js";
import { AuthMiddleware } from "src/middlewares/auth.middleware.js";

const router:Router=Router()
router.post('/', AuthMiddleware, CreateTrip);         
router.get('/', AuthMiddleware, getAllTrips);         
router.get('/active', AuthMiddleware, getTrips);       
router.put('/active/:id', AuthMiddleware, toggleTrip);
router.put('/:id', AuthMiddleware, updateTrip);        
router.delete('/:id', AuthMiddleware, deleteTrips);

export default router ;