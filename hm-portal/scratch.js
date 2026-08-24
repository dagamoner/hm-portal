const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetDateStr = '2026-08-20'; // They are currently on this day (or UTC 00:00 of 21 which became 20 in arg)
  
  // Actually we just want to update all visits and book entries for that specific company to the 21st.
  // The company name is "DESARROLLO SUSTENTABLE LAURO S. A. S."
  
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
    console.log(`Updating visit ${v.id}, current date: ${v.date}`);
    await prisma.visit.update({
      where: { id: v.id },
      data: { date: new Date('2026-08-21T12:00:00Z') }
    });
  }

  const books = await prisma.safetyBookEntry.findMany({
    where: { companyId: company.id }
  });
  console.log(`Found ${books.length} book entries for company`);

  for (const b of books) {
    console.log(`Updating book entry ${b.id}, current date: ${b.date}`);
    await prisma.safetyBookEntry.update({
      where: { id: b.id },
      data: { date: new Date('2026-08-21T12:00:00Z') }
    });
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
  });
