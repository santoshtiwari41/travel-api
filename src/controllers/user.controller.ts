import type { Request, Response } from "express";
import { getUserProfile } from "../services/user.service.js";

export const UserProfile = async (req: Request, res: Response) => {

    try {
        const user = await getUserProfile()
        res.status(200).json(user)
    }

    catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}