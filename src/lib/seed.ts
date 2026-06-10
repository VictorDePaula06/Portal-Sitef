import { PrismaClient } from '../generated/index.js';

const prisma = new PrismaClient();

const accounts = [
  { email: 'sitef2@globaltera.com.br', password: 'Glob@l2026@@' },
  { email: 'sitef3@globaltera.com.br', password: 'Gt@2026#Tera@@' },
  { email: 'sitef4@globaltera.com.br', password: 'Gt@2026#Tera@@' },
  { email: 'sitef5@globaltera.com.br', password: 'Global@@2026@' },
  { email: 'tef@globaltera.com.br', password: 'Gt@2026#Tera@@' },
  { email: 'bruno.lyra@bisw.com.br', password: 'Gt@2026#Tera@' },
  { email: 'financeiro02@castoldi.com.br', password: 'R3dec@st0ld2' }
];

async function main() {
  console.log("Iniciando seed de contas...");
  for (const account of accounts) {
    await prisma.account.upsert({
      where: { email: account.email },
      update: { password: account.password },
      create: account,
    });
  }
  console.log("Contas criadas com sucesso!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
