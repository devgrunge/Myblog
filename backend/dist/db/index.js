import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";
const rawUrl = process.env.DATABASE_URL ?? "file:./data/blog.db";
const dbPath = rawUrl.startsWith("file:") ? rawUrl.replace("file:", "") : rawUrl;
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
export const db = drizzle(sqlite, { schema });
