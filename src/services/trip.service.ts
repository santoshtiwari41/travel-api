import { db } from "@/db/drizzle.js";
import { trips } from "@/db/schema/trip.js";
import { and, eq, inArray } from "drizzle-orm";
import { AppError } from "src/utils/appError.js";

export async function createTrip(userId: string, cityId: number, startDate: string, endDate: string) {
    await db.insert(trips).values({
        userId,
        cityId,
        startDate,
        endDate
    })
}

export async function getOngoingPlannedTrip(userId: string) {

    const data = await db.select().from(trips)
        .where(
            and(
                eq(trips.userId, userId),
                inArray(trips.status, ["planned", "ongoing"])
            )
        )
    if (data.length <= 0) {
        throw new AppError('No trip found ', 404)
    }
    return data
}

export async function allTrips(userId: string) {
    const data = await db.select().from(trips)
        .where(eq(trips.userId, userId))

     if (data.length <= 0) {
        throw new AppError('No trip found ', 404)
    }

    return data;
}

export async function createOngoing(userId: string, tripId: string) {
    await db.transaction(async (tx) => {
        const trip = await tx
            .select({ status: trips.status })
            .from(trips)
            .where(
                and(
                    eq(trips.id, tripId),
                    eq(trips.userId, userId)
                )
            )
            .limit(1);

        if (!trip.length) {
            throw new AppError("Trip not found", 404);
        }

        await tx
            .update(trips)
            .set({ status: "planned" })
            .where(
                and(
                    eq(trips.userId, userId),
                    eq(trips.status, "ongoing")
                )
            );

        const updated = await tx
            .update(trips)
            .set({ status: "ongoing" })
            .where(
                and(
                    eq(trips.id, tripId),
                    eq(trips.userId, userId)
                )
            )
            .returning({ id: trips.id });

        if (!updated.length) {
            throw new AppError("Failed to activate trip", 400);
        }
    });
}

export async function updateTrips(
    userId: string,
    tripId: string,
    status: "cancelled" | "completed" | "planned"
) {
   
    const updated = await db
        .update(trips)
        .set({ status })
        .where(
            and(
                eq(trips.id, tripId),
                eq(trips.userId, userId)
            )
        )
        .returning({ id: trips.id });

    if (!updated.length) {
        throw new AppError("Trip not found", 404);
    }
}

export async function deleteTrip(userId: string, tripId: string) {
    const result = await db
        .delete(trips)
        .where(
            and(
                eq(trips.id, tripId),
                eq(trips.userId, userId)
            )
        )
        .returning({ id: trips.id });

    if (result.length === 0) {
        throw new AppError("Trip not found", 404);
    }
}

