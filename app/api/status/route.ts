import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const file = path.join(process.cwd(), "lock.json");

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ locked: true }, null, 2));
  }

  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return NextResponse.json(data);
}
