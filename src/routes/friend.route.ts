import { Router } from "express";
import { acceptRequest, getAllRequest, getFriends, sendRequest,rejectRequest } from "src/controllers/friend.controller.js";
import { AuthMiddleware } from "src/middlewares/auth.middleware.js";

const router:Router = Router();
router.get('/',AuthMiddleware,getFriends)
router.get('/request',AuthMiddleware,getAllRequest)
router.post("/request", AuthMiddleware, sendRequest);
router.post("/request/:requestId/accept", AuthMiddleware, acceptRequest);
router.post("/request/:requestId/reject", AuthMiddleware, rejectRequest);

export default router;
