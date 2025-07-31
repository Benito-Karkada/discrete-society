import { NextResponse } from "next/server";
import { createClient } from "redis";

export async function POST(req: Request) {
  try {
    const { locked, password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
    }

    const client = createClient({
      url: process.env.REDIS_URL,
    });
    await client.connect();

    await client.set("site-locked", locked ? "true" : "false");

    await client.disconnect();

    return NextResponse.json({ success: true, locked });
  } catch (err) {
    console.error("Lock API error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
