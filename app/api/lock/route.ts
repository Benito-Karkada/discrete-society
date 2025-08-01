import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  const { locked, password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
  }

  await redis.set("locked", locked ? "true" : "false");
  console.log("Set locked to:", locked);

  return NextResponse.json({ success: true, locked });
}

export async function GET() {
  const state = await redis.get<string>("locked");
  return NextResponse.json({ locked: state !== "false" }); // default locked unless explicitly false
}
