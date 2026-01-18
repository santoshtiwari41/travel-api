import { Router } from "express";
import { acceptRequest, sendRequest } from "src/controllers/friend.controller.js";
import { AuthMiddleware } from "src/middlewares/auth.middleware.js";

const router:Router = Router();

router.post("/request", AuthMiddleware, sendRequest);
router.post("/request/:requestId/accept", AuthMiddleware, acceptRequest);

export default router;
