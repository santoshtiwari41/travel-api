
import { db } from "@/db/drizzle.js";
import { cities } from "@/db/schema/location.js";
import { trips } from "@/db/schema/trip.js";
import { and, eq, inArray } from "drizzle-orm";
import { EventEmitter } from "node:events";
import { AppError } from "src/utils/appError.js";

 class TripServices extends EventEmitter {
  async createTrip(
    userId: string,
    cityId: number,
    startDate: string,
    endDate: string
  ) {
    const data=await db.insert(trips).values({
      userId,
      cityId,
      startDate,
      endDate,
    }).returning();
    this.emit('tripCreate',data)
  }

  async getOngoingPlannedTrip(userId: string) {
    const data = await db
      .select()
      .from(trips)
      .where(
        and(
          eq(trips.userId, userId),
          inArray(trips.status, ["planned", "ongoing"])
        )
      );

    if (data.length === 0) {
      throw new AppError("No trip found", 404);
    }

    return data;
  }

  async allTrips(userId: string) {
    const data = await db
      .select({
        tripId: trips.id,
        startDate: trips.startDate,
        endDate: trips.endDate,
        status: trips.status,
        visibility: trips.visibility,
        cityId: trips.cityId,
        lat: cities.lat,
        lng: cities.lng,
        city: cities.city,
        country: cities.country,
      })
      .from(trips)
      .innerJoin(cities, eq(trips.cityId, cities.id))
      .where(eq(trips.userId, userId));

    if (data.length === 0) {
      throw new AppError("No trip found", 404);
    }

    return data;
  }

  async createOngoing(userId: string, tripId: string) {
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

      // reset existing ongoing trip
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

  async updateTrips(
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

  async deleteTrip(userId: string, tripId: string) {
    const result = await db
      .delete(trips)
      .where(
        and(
          eq(trips.id, tripId),
          eq(trips.userId, userId)
        )
      )
      .returning({ id: trips.id });

    if (!result.length) {
      throw new AppError("Trip not found", 404);
    }
  }
}

export const TripService=new TripServices()