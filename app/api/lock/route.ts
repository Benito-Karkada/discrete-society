import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { locked, password } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    const redis = await getRedis();
    await redis.set("site_locked", locked ? "true" : "false");
    return NextResponse.json({ success: true, locked });
  } catch (err) {
    console.error("LOCK API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
