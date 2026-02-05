import type { Request, Response } from "express";
import { getProfile, getUsers, updatePassword, updateProfile } from "../services/user.service.js";
import { AppError } from "../utils/appError.js";

export const GetProfile = async (req: Request, res: Response) => {
  try {
    const userId=await req.user.userId;
    const user=await getProfile(userId)

    res.status(200).json(user)
  }
  catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const currentUserId = await req.user.userId;
    console.log('user id is ', currentUserId)
    const users = await getUsers({ search, currentUserId })
    return res.status(200).json(users)
  }
  catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}



export async function editProfile(req: Request, res: Response) {
  try {
    const userId = await req.user.userId;
    const { fullName } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const user = await updateProfile(userId, fullName);

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


export async function changePassword(req: Request, res: Response) {
  try {
    const userId = await req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    await updatePassword(
      userId,
      oldPassword,
      newPassword
    );

    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
