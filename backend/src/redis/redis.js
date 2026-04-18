import dotenv from "dotenv";
import { createClient } from 'redis';

dotenv.config()
const REDIS_URL=process.env.REDIS_URL
const client = createClient({url:REDIS_URL});

client.on('connect', () => console.log('Redis connected'));
client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();

export default client