require('dotenv').config();
const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
  await client.connect();
  try {
    const res = await client.query('SELECT COUNT(*) FROM "ImprovementAction"');
    console.log('ImprovementActions count:', res.rows[0].count);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
