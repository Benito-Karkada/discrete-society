import { NextResponse } from "next/server";
import { fetchNewDrops } from "@/lib/shopify";

export async function GET() {
  try {
    const drops = await fetchNewDrops();
    if (!Array.isArray(drops)) {
      throw new Error("fetchNewDrops did not return an array");
    }
    return NextResponse.json(drops);
  } catch (err) {
    console.error("💥 failed to fetch drops:", err);
    // return an empty list on error so the client sees []
    return NextResponse.json([], { status: 500 });
  }
}
