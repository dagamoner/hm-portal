import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.user.updateMany({
    where: { username: 'fgmoner' },
    data: { hasGlobalAccess: true }
  });
  console.log('Updated user fgmoner:', result);
}

main().catch(console.error).finally(() => prisma.$disconnect());
