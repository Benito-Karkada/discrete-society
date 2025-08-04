import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET() {
  try {
    const redis = await getRedis();
    const val = await redis.get("site_locked");
    return NextResponse.json({ locked: val === "true" });
  } catch (err) {
    console.error("STATUS API error:", err);
    // On error, default to locked
    return NextResponse.json({ locked: true }, { status: 500 });
  }
}
