import { prisma } from './src/lib/prisma';

async function main() {
  const result1 = await prisma.chemicalProduct.updateMany({
    data: { fdsUrl: null }
  });
  console.log('Chemical products cleared:', result1.count);
  
  const result2 = await prisma.sgaLibraryItem.updateMany({
    data: { fdsUrl: null }
  });
  console.log('Sga items cleared:', result2.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
