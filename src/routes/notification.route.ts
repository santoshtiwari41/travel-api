import { Router } from "express";
import { getNotifications, readAllNotifications, readNotification, sendNotification } from "src/controllers/notification.controller.js";
import { AuthMiddleware } from "src/middlewares/auth.middleware.js";

const router:Router=Router();
router.post("/send",AuthMiddleware,sendNotification)
router.get("/",AuthMiddleware,getNotifications)
router.post("/read-all",AuthMiddleware,readAllNotifications)
router.post("/:id/read",AuthMiddleware,readNotification)

export default router;