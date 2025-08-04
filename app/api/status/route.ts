import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET() {
  const redis = await getRedis();
  const val = await redis.get("site_locked");
  return NextResponse.json({ locked: val === "true" });
}