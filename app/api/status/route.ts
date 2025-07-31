import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/redis';

export async function GET() {
  const redis = await getRedis();
  const locked = await redis.get('site_locked');
  return NextResponse.json({ locked: locked === 'true' });
}
