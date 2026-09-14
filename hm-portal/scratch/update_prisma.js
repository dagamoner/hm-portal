const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

if (!schema.includes('model CustomEvent')) {
  schema = schema.replace(
    /model Company \{([\s\S]*?)createdAt/m,
    'model Company {\n  customEvents      CustomEvent[]\n$1createdAt'
  );

  schema += `\n\nmodel CustomEvent {
  id          String   @id @default(uuid())
  title       String
  date        DateTime
  color       String   @default("bg-blue-500")
  companyId   String?
  company     Company? @relation(fields: [companyId], references: [id], onDelete: Cascade)
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}\n`;

  fs.writeFileSync('prisma/schema.prisma', schema);
  console.log('Added CustomEvent model and relation');
} else {
  console.log('CustomEvent already exists');
}
