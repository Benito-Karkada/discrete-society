import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { locked, password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
  }

  const res = await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ operation: "upsert", key: "locked", value: locked }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Edge Config Write Error:", err);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ success: true, locked });
}
