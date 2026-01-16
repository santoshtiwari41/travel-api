import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// @ts-ignore
import * as schema from './schema/index.js';

config({ path: ".env" }); 

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });