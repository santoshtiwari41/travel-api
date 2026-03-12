import { db } from "@/db/drizzle.js";
import { trips } from "@/db/schema/trip.js";
import { cities } from "@/db/schema/location.js";
import { friends } from "@/db/schema/social.js";
import { users } from "@/db/schema/user.js";
import { and, eq, inArray } from "drizzle-orm";
import { sendNotificationsToUsers } from "src/services/notification.service.js";

type TripCreateRow = {
  id: string;
  userId: string;
  cityId: number;
  startDate: string;
  endDate: string;
};


export function attachTripMatchNotifications(TripService: {
  on: (event: "tripCreate", handler: (tripData: unknown) => void) => void;
}) {
  TripService.on("tripCreate", async (tripData) => {
    try {
      const [created] = tripData as TripCreateRow[];
      if (!created) return;

      const { id: tripId, userId, cityId, startDate } = created;

      const friendRows = await db
        .select({ friendId: friends.friendId })
        .from(friends)
        .where(eq(friends.userId, userId));

      const friendIds = friendRows.map((f) => f.friendId);
      if (friendIds.length === 0) return;

      const matchingTrips = await db
        .select({ friendId: trips.userId })
        .from(trips)
        .where(
          and(
            inArray(trips.userId, friendIds),
            eq(trips.cityId, cityId),
            inArray(trips.status, ["planned", "ongoing"])
          )
        );

      const matchedFriendIds = Array.from(
        new Set(matchingTrips.map((t) => t.friendId))
      );
      if (matchedFriendIds.length === 0) return;

      const [creator] = await db
        .select({ fullName: users.fullName })
        .from(users)
        .where(eq(users.id, userId));

      const [city] = await db
        .select({ city: cities.city })
        .from(cities)
        .where(eq(cities.id, cityId));

      const creatorName = creator?.fullName ?? "Your friend";
      const cityName = city?.city ?? "your destination";

      await sendNotificationsToUsers(matchedFriendIds, userId, {
        title: "Friend trip match ✈️",
        body: `${creatorName} is planning a trip to ${cityName} on ${startDate}. Open the app to plan together.`,
        data: {
          type: "trip_match",
          tripId,
          cityId,
          startDate,
        },
      });
    } catch (err) {
      console.error("Error while sending trip match notifications:", err);
    }
  });
}

