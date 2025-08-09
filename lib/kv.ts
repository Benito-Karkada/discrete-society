// Thin Upstash wrapper
import { Redis } from "@upstash/redis";
export const redis = Redis.fromEnv();

export async function isLocked(): Promise<boolean> {
  try {
    const v = await redis.get<string>("site_locked");
    // default locked if key missing or any error
    return v !== "false";
  } catch {
    return true;
  }
}

export async function setLocked(v: boolean) {
  await redis.set("site_locked", v ? "true" : "false");
}
