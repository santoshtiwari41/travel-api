import { eq } from "drizzle-orm";
import { db } from "../db/drizzle.js"
import { users } from "../db/schema/user.js"
import { AppError } from "../utils/appError.js";
import { comparePassword, hashPassword } from "../lib/password-hash.js";

export const loginUser = async (email: string, password: string) => {
  
    const [user] = await db.select()
        .from(users)
        .where(eq(users.email, email.toLowerCase().trim()))
        .limit(1);

    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    return user;
};

export const signUpUser = async (email: string, password: string, fullName: string) => {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
        throw new AppError('User with this email already exists', 400);
    }
    const newPassword = await hashPassword(password);
    const [res] = await db.insert(users).values({ email, password: newPassword, fullName }).returning();
    return res;

}