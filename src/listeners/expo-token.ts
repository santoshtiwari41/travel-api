import { EventEmitter } from 'events';
import { db } from "@/db/drizzle.js";
import { expoToken } from "@/db/schema/expo-token.js";
import { eq } from "drizzle-orm";
import { AppError } from 'src/utils/appError.js';

export const authEvents = new EventEmitter();

authEvents.on('post-registration', async ({ userId, expoPushToken }) => {
    try {
        if (!expoPushToken) return;

        const existingToken = await db
            .select()
            .from(expoToken)
            .where(eq(expoToken.userId, userId))
            .limit(1);

        if (existingToken.length === 0) {
            await db.insert(expoToken).values({
                token: expoPushToken,
                userId: userId
            });
        }
    } catch (error) {
        console.log('error saving the token ', error)
    }
});