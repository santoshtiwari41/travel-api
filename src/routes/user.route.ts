import {Router} from 'express';
import { changePassword, editProfile, getAllUsers, GetProfile } from '../controllers/user.controller.js';
import { AuthMiddleware } from 'src/middlewares/auth.middleware.js';
const router:Router=Router();

router.get('/',AuthMiddleware,getAllUsers)
router.get('/profile',AuthMiddleware,GetProfile)
router.put('/profile/update',AuthMiddleware,editProfile)
router.put('/profile/change-password',AuthMiddleware,changePassword)

export default router;