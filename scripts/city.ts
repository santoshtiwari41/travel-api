import fs from "fs";
import path from "path";
import csv from "csv-parser";

import { fileURLToPath } from "url";
import { db } from "../src/db/drizzle";
import { cities } from "../src/db/schema/location";

/* ---------------- TYPES ---------------- */

type CityCSV = {
  id: string;
  city: string;
  country: string;
  iso2: string;
  iso3: string;
  lat: string;
  lng: string;
};

/* ------------- ESM __dirname ------------ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------- UTILS ------------------- */

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/* ------------- MAIN -------------------- */

async function seedCities() {
  const results: CityCSV[] = [];

  const filePath = path.join(__dirname, "cities.csv");

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found at: ${filePath}`);
  }

  /* ---- READ CSV ---- */
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  if (results.length === 0) {
    console.log("⚠️ No rows found in CSV");
    return;
  }

  /* ---- FORMAT DATA ---- */
  const formatted = results.map((row) => ({
    id: Number(row.id),
    city: row.city.trim(),
    country: row.country.trim(),
    iso2: row.iso2.trim(),
    iso3: row.iso3.trim(),
    // Postgres decimal must be STRING
    lat: row.lat.toString(),
    lng: row.lng.toString(),
  }));

  /* ---- BATCH INSERT ---- */
  const BATCH_SIZE = 500;
  const batches = chunkArray(formatted, BATCH_SIZE);

  for (let i = 0; i < batches.length; i++) {
    await db
      .insert(cities)
      .values(batches[i])
      .onConflictDoNothing();

    console.log(
      `🚀 Inserted batch ${i + 1}/${batches.length} (${batches[i].length} rows)`
    );
  }

  console.log(`✅ Successfully seeded ${formatted.length} cities`);
  process.exit(0);
}

/* ------------- RUN -------------------- */

seedCities().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
