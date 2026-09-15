const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
schema = schema.replace(
  /model CustomEvent \{([\s\S]*?)createdAt/m,
  'model CustomEvent {$1category    String?  @default("General")\n  createdAt'
);
fs.writeFileSync('prisma/schema.prisma', schema);
console.log("updated");
