import { get } from "@vercel/edge-config";

export async function isLocked(): Promise<boolean> {
  // Only "true" means locked; anything else = unlocked
  const v = await get<string>("site_locked");
  return v === "true";
}
