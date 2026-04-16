import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from "pg";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;