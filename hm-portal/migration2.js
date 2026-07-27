require('dotenv').config();
const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(`
      ALTER TABLE "RiskEvaluation" ADD COLUMN IF NOT EXISTS "probability" INTEGER;
      ALTER TABLE "RiskEvaluation" ADD COLUMN IF NOT EXISTS "severity" INTEGER;
      ALTER TABLE "RiskEvaluation" ADD COLUMN IF NOT EXISTS "riskLevel" INTEGER;
      ALTER TABLE "RiskEvaluation" ADD COLUMN IF NOT EXISTS "controlMeasures" TEXT;
    `);
    console.log("Migration successful");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
