import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  const state = await redis.get<string>("locked");
  console.log("Redis locked state:", state);
  return NextResponse.json({ locked: state !== "false" });
}
