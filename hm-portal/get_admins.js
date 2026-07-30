const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://postgres.jtlztprfxallbdnvmrmk:Donatto270619@aws-0-us-east-1.pooler.supabase.com:5432/postgres" });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany({
    where: { role: 'ADMIN' }
  });
  
  if (users.length === 0) {
     console.log("NO ADMIN FOUND!");
  } else {
     console.log("Admins:");
     console.log(users.map(u => ({ username: u.username, name: u.name, failed: u.failedLogins })));
  }

  // unlock
  await prisma.user.updateMany({
     where: { role: 'ADMIN' },
     data: { failedLogins: 0, lockedUntil: null }
  });
  
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
