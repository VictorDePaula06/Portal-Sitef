import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const accounts = await prisma.account.findMany({
    include: { stores: true }
  });
  fs.writeFileSync('backup.json', JSON.stringify(accounts, null, 2));
  console.log('Backup concluído com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
