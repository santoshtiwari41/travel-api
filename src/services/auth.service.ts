import { and, eq } from "drizzle-orm";
import { db } from "../db/drizzle.js"
import { users } from "../db/schema/user.js"
import { AppError } from "../utils/appError.js";
import { comparePassword, hashPassword } from "../lib/password-hash.js";
import { verifyGoogleToken } from "src/utils/verify-google-token.js";
import { otps } from "@/db/schema/otp.js";
import { randomBytes } from 'node:crypto';
import { addMinutes } from 'date-fns';
export const loginUser = async (email: string, password: string) => {

    const [user] = await db.select()
        .from(users)
        .where(eq(users.email, email.toLowerCase().trim()))
        .limit(1);

    if (!user) {
        throw new AppError('Invalid email or password', 400);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 400);
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

export const googleSignup = async ({ idToken }: { idToken: string }) => {

    const tokenInfo = await verifyGoogleToken(idToken);
    let existing = await db.select().from(users).where(eq(users.email, tokenInfo.email)).limit(1);
    if (existing.length > 0) {
        return existing[0];

    }
    const [user] = await db.insert(users).values({
        email: tokenInfo.email,
        fullName: tokenInfo.name,
        isGoogleAuth: true,
    }).returning();

    return user

}

export async function VerifyOTP(token: string, otp: string) {
    const [isValid] = await db.select().from(otps).where(and(
        eq(otps.token, token),
        eq(otps.code, otp),
        eq(otps.isUsed, false)
    )).limit(1);
    if (!isValid) {
        throw new AppError("Invalid or expired OTP", 400);
    }

    if (new Date() > isValid.expiresAt) {
        throw new AppError("OTP has expired", 400);
    }

    await db.transaction(async (tx) => {
        await tx
            .update(users)
            .set({ isVerified: true })
            .where(eq(users.id, isValid.userId));

        await tx
            .update(otps)
            .set({ isUsed: true })
            .where(eq(otps.id, isValid.id));
    });

    return true;


}

export async function saveOTP(userId: string, otpCode: string) {
    const sessionToken = randomBytes(32).toString('hex');
  const [res]=  await db.insert(otps).values({
        userId: userId,
        code: otpCode,
        token: sessionToken,
        expiresAt: addMinutes(new Date(), 10),
    }).returning();
    return  res
}