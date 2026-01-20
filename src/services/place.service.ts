import { db } from "@/db/drizzle.js"
import { cities, countries } from "@/db/schema/location.js"
import { and, eq } from "drizzle-orm";
import { AppError } from "src/utils/appError.js";

interface City {
    countryId: string,
    name: string,
    lat?: number,
    lng?: number

}
export const createCountry = async (name: string, code: string) => {
    const existing = await db
        .select()
        .from(countries)
        .where(eq(countries.code, code));

    if (existing.length > 0) {
        throw new AppError("Country already exists", 409);
    }
    const res = await db.insert(countries).values({
        name,
        code
    })
    return res;
}

export const getCountry = async () => {
    const data = await db.select().from(countries)
    return data;
}

export const createCity = async (city: City) => {
    const existing = await db.select()
        .from(cities)
        .where(
            and(
                eq(cities.countryId, city.countryId),
                eq(cities.name, city.name)
            )
        );

    if (existing.length > 0) {
        throw new AppError("This city already exists in this country", 409);
    }

    return await db.insert(cities).values(city);
};
export const getCity = async () => {
    const data = await db.select().from(cities);
    return data;
}

