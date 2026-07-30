const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.jtlztprfxallbdnvmrmk:Donatto270619@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
  });

  await client.connect();

  const res = await client.query("SELECT username, \"failedLogins\", \"lockedUntil\" FROM \"User\" WHERE role = 'ADMIN'");
  console.log("Admins:");
  console.log(res.rows);

  // Unlock the admins
  await client.query("UPDATE \"User\" SET \"failedLogins\" = 0, \"lockedUntil\" = NULL WHERE role = 'ADMIN'");
  console.log("Unlocked all admins!");

  await client.end();
}

main().catch(console.error);
