import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis Client Error', err));

let redisClient: any;

export async function getRedis() {
  if (!redisClient) {
    redisClient = client;
    await redisClient.connect();
  }
  return redisClient;
}
