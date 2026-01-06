import {Router} from 'express';
import { UserProfile } from '../controllers/user.controller.js';
const router:Router=Router();

router.get('/profile',UserProfile)

export default router;