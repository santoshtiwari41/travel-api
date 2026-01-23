import { db } from "@/db/drizzle.js";
import { trips } from "@/db/schema/trip.js";

export async function createTrip(userId:string,cityId:number,startDate:string,endDate:string){
    await db.insert(trips).values({
        userId,
        cityId,
        startDate,
        endDate
    })
}


export async function getTrips(){

    const data=await db.select().from(trips)
    return data
}