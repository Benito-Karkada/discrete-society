import { NextResponse } from "next/server";
import { isLocked } from "@/lib/lock";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ locked: await isLocked() });
}
