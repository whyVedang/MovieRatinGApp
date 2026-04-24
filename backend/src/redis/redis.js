import { REDIS_URL } from '../configenv.js';
import { createClient } from 'redis';
const client = createClient({url:REDIS_URL});

client.on('connect', () => console.log('Redis connected'));
client.on('error', (err) => console.error('Redis Client Error', err));

await client.connect();

export default client