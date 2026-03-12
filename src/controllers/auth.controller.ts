import { Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { googleSignup, loginUser, saveOTP, signUpUser, VerifyOTP } from "../services/auth.service.js";
import { generateToken } from "../lib/jwt.js";
import { generateOTP } from "../lib/otp.js";
import { db } from "@/db/drizzle.js";
import { expoToken } from "@/db/schema/expo-token.js";
import { eq } from "drizzle-orm";
import { authEvents } from "src/listeners/expo-token.js";
import { emailEvent } from "src/listeners/email.js";

export async function Register(req: Request, res: Response) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { email, password, fullName, expoPushToken } = req.body;
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "Email, password and fullName are required " })
        }


        const data = await signUpUser(email, password, fullName);


        if (!data) {
            return res.status(400).json({ message: "Failed to register user" });
        }


        authEvents.emit('post-registration', { userId: data.id, expoPushToken });

        const otp = generateOTP();
        const saveOtp = await saveOTP(data.id, otp)
        
        emailEvent.emit('registration', { email: data.email, otp });
        return res.status(201).json({ message: "User registered successfully", sessionToken: saveOtp?.token });


    }

    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });

        }
        console.log('error is ', error)
        return res.status(500).json({ message: "Internal Server Error", error });
    }
}


export async function Login(req: Request, res: Response) {

    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required " })
        }

        const data = await loginUser(email, password);
        if (!data) {
            return res.status(400).json({ message: "failed to login user" });
        }
        const token = generateToken({ userId: data.id, email }, '1d');
        return res.status(200).json({ message: "User logged in successfully", token });


    }

    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function googleAuth(req: Request, res: Response) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
        const { idToken, expoPushToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "Google ID token is required" });
        }
        const data = await googleSignup({ idToken })

        if (!data) {
            return res.status(400).json({ message: "Failed to register user" });
        }
        if (expoPushToken) {
            const existingToken = await db
                .select()
                .from(expoToken)
                .where(eq(expoToken.userId, data.id))
                .limit(1);

            if (existingToken.length === 0) {
                await db.insert(expoToken).values({
                    token: expoPushToken,
                    userId: data.id
                });
            }
        }
        const token = generateToken({ userId: data.id, email: data.email, fullName: data.fullName }, '1d');
        return res.status(201).json({ message: "User registered successfully", token });

    }
    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



export async function OTPVerify(req: Request, res: Response) {
    try {
        const { otp, token } = req.body;
        if (!otp || !token) {
            return res.status(400).json({ message: "OTP and token are required" });
        }
        const verify = VerifyOTP(token, otp)
        if (!verify) {
            return res.status(400).json({ message: "Invalid OTP or token" });
        }
        return res.status(200).json({ message: "Email verified successfully!" });

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Internal server error' })
    }
}

