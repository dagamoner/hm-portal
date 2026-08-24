import dotenv from 'dotenv';
dotenv.config();

// Override the DB URL with the direct one so PgBouncer doesn't block the pool
process.env.DATABASE_URL = process.env.DIRECT_URL;

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const company = await prisma.company.findFirst({
    where: { name: { contains: 'LAURO' } }
  });

  if (!company) {
    console.log('Company not found');
    return;
  }

  const visits = await prisma.visit.findMany({
    where: { establishment: { companyId: company.id } }
  });
  console.log(`Found ${visits.length} visits for company`);

  for (const v of visits) {
    if (v.date.toISOString().includes('2026-08-21T00:00:00.000Z')) {
        console.log(`Updating visit ${v.id}, current date: ${v.date}`);
        await prisma.visit.update({
        where: { id: v.id },
        data: { date: new Date('2026-08-21T12:00:00Z') }
        });
    } else {
        console.log(`Skipping visit ${v.id}, current date: ${v.date}`);
    }
  }

  const books = await prisma.safetyBookEntry.findMany({
    where: { companyId: company.id }
  });
  console.log(`Found ${books.length} book entries for company`);

  for (const b of books) {
    if (b.date.toISOString().includes('2026-08-21T00:00:00.000Z')) {
        console.log(`Updating book entry ${b.id}, current date: ${b.date}`);
        await prisma.safetyBookEntry.update({
        where: { id: b.id },
        data: { date: new Date('2026-08-21T12:00:00Z') }
        });
    } else {
        console.log(`Skipping book entry ${b.id}, current date: ${b.date}`);
    }
  }

  console.log('Done updating dates.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
