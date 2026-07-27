require('dotenv').config();
const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(`
      ALTER TABLE "Hazard" ADD COLUMN IF NOT EXISTS "name" TEXT;
      ALTER TABLE "Hazard" ADD COLUMN IF NOT EXISTS "description" TEXT;
      ALTER TABLE "Hazard" ADD COLUMN IF NOT EXISTS "type" TEXT;
      
      ALTER TABLE "Hazard" ALTER COLUMN "category" DROP NOT NULL;
      ALTER TABLE "Hazard" ALTER COLUMN "source" DROP NOT NULL;
      ALTER TABLE "Hazard" ALTER COLUMN "event" DROP NOT NULL;
      ALTER TABLE "Hazard" ALTER COLUMN "consequence" DROP NOT NULL;
    `);
    console.log("Migration successful");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
