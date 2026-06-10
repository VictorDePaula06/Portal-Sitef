import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('backup.json', 'utf-8'));
  for (const account of data) {
    const createdAccount = await prisma.account.create({
      data: {
        email: account.email,
        password: account.password,
      }
    });

    for (const store of account.stores) {
      await prisma.store.create({
        data: {
          name: store.name,
          cnpj: store.cnpj,
          accountId: createdAccount.id
        }
      });
    }
  }
  console.log('Migração para o Vercel Postgres concluída com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
