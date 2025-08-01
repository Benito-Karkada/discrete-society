import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`https://edge-config.vercel.com/${process.env.EDGE_CONFIG_ID}/item/locked`, {
    headers: {
      Authorization: `Bearer ${process.env.EDGE_CONFIG_READ_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ locked: true }); // default to locked if error
  }

  const data = await res.json();
  return NextResponse.json({ locked: data?.value === true });
}
