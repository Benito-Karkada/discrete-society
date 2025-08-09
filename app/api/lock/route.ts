import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { locked, password } = await req.json().catch(() => ({}));

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
  }

  const id = process.env.EDGE_CONFIG_ID!;
  const token = process.env.VERCEL_API_TOKEN!;
  const url = `https://api.vercel.com/v1/edge-config/${id}/items`;

  const body = {
    items: [
      {
        operation: "upsert",
        key: "site_locked",
        value: locked ? "true" : "false",
      },
    ],
  };

  const r = await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    // Edge runtime can call external APIs fine
    cache: "no-store",
  });

  if (!r.ok) {
    const msg = await r.text();
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }

  return NextResponse.json({ success: true, locked: !!locked });
}
