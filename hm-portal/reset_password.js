const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.jtlztprfxallbdnvmrmk:Donatto270619@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
  });

  await client.connect();

  const newPass = "Admin1234!";
  const hash = await bcrypt.hash(newPass, 10);
  
  await client.query("UPDATE \"User\" SET password = $1 WHERE username = 'admin'", [hash]);
  console.log("Password for 'admin' updated to Admin1234!");

  await client.end();
}

main().catch(console.error);
