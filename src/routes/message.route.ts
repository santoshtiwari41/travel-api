import { Router } from "express";
import { getHistory } from "src/controllers/message.controller.js";
import { AuthMiddleware } from "src/middlewares/auth.middleware.js";

const router:Router = Router();

router.get(
  "/:conversationId/history",
  AuthMiddleware,
  getHistory
);

export default router;
