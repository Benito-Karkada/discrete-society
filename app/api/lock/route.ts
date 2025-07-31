import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { locked, password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password !== adminPassword) {
    return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
  }

  const file = path.join(process.cwd(), "lock.json");
  fs.writeFileSync(file, JSON.stringify({ locked }));
  return NextResponse.json({ success: true, locked });
}
