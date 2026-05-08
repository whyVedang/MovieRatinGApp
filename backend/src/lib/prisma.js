import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import pg from "pg";
import { DATABASE_URL, NODE_ENV } from "../configenv";

dotenv.config();


const isProduction = NODE_ENV;
const connectionString = DATABASE_URL;
const pool = new pg.Pool({ connectionString , ssl: isProduction ? { rejectUnauthorized: false } : false});
const adapter = new PrismaPg(pool);

const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (isProduction !== "production") globalForPrisma.prisma = prisma;

export default prisma;
