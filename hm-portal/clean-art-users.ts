import { loadEnvConfig } from '@next/env';
loadEnvConfig('./');
import { prisma } from './src/lib/prisma';

async function main() {
  const result = await prisma.company.updateMany({
    where: { artUser: 'admin' },
    data: { artUser: null, artPass: null }
  });
  console.log(`Updated ${result.count} companies with autofilled 'admin' user.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    setTimeout(() => process.exit(0), 1000);
  });
