import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const config = {
  matcher: [
    "/((?!api|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|coming-soon|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)).*)",
  ],
};

export async function middleware(req: NextRequest) {
  try {
    const val = await get<string>("site_locked");
    const locked = val === "true";

    if (!locked) return NextResponse.next();
    if (req.nextUrl.pathname === "/coming-soon") return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.rewrite(url);
  } catch {
    // fail-closed: show lock page if Edge Config errors
    const url = req.nextUrl.clone();
    url.pathname = "/coming-soon";
    return NextResponse.rewrite(url);
  }
}
