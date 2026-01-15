import { db } from "../db/drizzle.js"
import { users } from "../db/schema/user.js"

export const loginUser = async (email: string, password: string, fullName: string) => {

   

}

export const signUpUser = async (email: string, password: string, fullName: string) => {

 const res = await db.insert(users).values({ email, password, fullName }).returning();
    return res;

}