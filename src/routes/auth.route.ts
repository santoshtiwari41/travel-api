import { Router } from "express";
import { Login, Register } from "../controllers/auth.controller.js";


const router:Router = Router();
router.post('/login',Login)
router.post('/register',Register)
// router.post('/forgot-password')
// router.post('/reset-password')

export default router;
