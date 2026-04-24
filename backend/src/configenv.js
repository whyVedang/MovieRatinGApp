import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT;
export const TMDB_APIKEY = process.env.TMDB_APIKEY;
export const JWT_SECRET = process.env.JWT_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const JWTEXPIRESIN = process.env.JWTEXPIRESIN;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

