import { db } from "@/db/drizzle.js"
import { cities, countries } from "@/db/schema/location.js"
import {  asc, count, eq, ilike } from "drizzle-orm";
import { AppError } from "src/utils/appError.js";

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



export type GetCitiesParams = {
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
};

export const getCities = async ({
  search,
  page = 1,
  limit = 50,
}: GetCitiesParams) => {
  const offset = (page - 1) * limit;

  let query = db.select().from(cities).$dynamic();
  if (search) {
    query = query.where(ilike(cities.city, `%${search}%`));
  }

  const data = await query
    .orderBy(asc(cities.city))
    .limit(limit)
    .offset(offset);


  const totalResult = await db
    .select({ total: count() })
    .from(cities)
    .where(search ? ilike(cities.city, `%${search}%`) : undefined);

  const totalCount = totalResult[0]?.total ?? 0;

  return {
    data,
    total: Number(totalCount),
    page,
    limit,
  };
};
