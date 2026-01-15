import { Router } from "express";
import { Register } from "../controllers/auth.controller.js";


const router:Router = Router();
// router.get('/login',)
router.post('/register',Register)
// router.post('/forgot-password')
// router.post('/reset-password')

export default router;
