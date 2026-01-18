import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";
import { AppError } from "../utils/appError.js";

export const AuthMiddleware = async(req: Request, res: Response, next: NextFunction) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1]
        const verifyedToken = await verifyToken(token!);
        console.log('check token verification',verifyedToken)
        if (!verifyedToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user=verifyedToken;

        next();
    }

    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}