import { Router } from "express";
import { FriendController } from "src/controllers/friend.controller.js";
import { AuthMiddleware } from "src/middlewares/auth.middleware.js";

const router:Router = Router();

router.post("/request", AuthMiddleware, FriendController.sendRequest);
router.post("/request/:requestId/accept", AuthMiddleware, FriendController.acceptRequest);

export default router;
