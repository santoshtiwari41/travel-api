import { eq } from "drizzle-orm";
import { db } from "../db/drizzle.js"
import { users } from "../db/schema/user.js"
import { AppError } from "../utils/appError.js";

export const loginUser = async (email: string, password: string, fullName: string) => {



}

export const signUpUser = async (email: string, password: string, fullName: string) => {

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
        throw new AppError('User with this email already exists', 400);
    }
    const [res] = await db.insert(users).values({ email, password, fullName }).returning();
    return res;

}