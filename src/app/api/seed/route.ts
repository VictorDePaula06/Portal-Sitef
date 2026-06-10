import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const account = await prisma.account.upsert({
      where: { email: 'tef@globaltera.com.br' },
      update: { password: 'Gt@2026#Tera@@' },
      create: { email: 'tef@globaltera.com.br', password: 'Gt@2026#Tera@@' }
    });

    const stores = [
      { name: "BOA PEDIDA TRES POCOS LT", cnpj: "60.391.938/0001-01" },
      { name: "ACHEI LOJA DE CONVENIENCI", cnpj: "46.053.680/0001-02" },
      { name: "ARMAZEM LOPES - CAMPUSCAO", cnpj: "19.196.558/0001-12" },
      { name: "AUTO POSTO ML RECREIO DOS", cnpj: "31.230.909/0001-60" },
      { name: "BOA PEDIDA ATERRADO LTDA", cnpj: "35.135.148/0001-18" },
      { name: "BOA PEDIDA CONFORTACO LTD", cnpj: "39.907.111/0001-11" },
      { name: "BOA PEDIDA GUAPURUVU", cnpj: "39.920.692/0001-21" },
      { name: "BOA PEDIDA GUSTAVO LIRA", cnpj: "43.209.052/0001-85" },
      { name: "BOA PEDIDA JACUECANGA LTD", cnpj: "40.012.038/0001-07" },
      { name: "DOM PEDRO II", cnpj: "42.331.363/0001-50" },
      { name: "HELGAS LANCHONETE LTDA", cnpj: "18.594.610/0001-26" },
      { name: "LAGOA SANTA LOJA DE CONVE", cnpj: "23.691.236/0001-17" },
      { name: "LANCHONETE CONVENIENCIA B", cnpj: "34.366.446/0001-56" },
      { name: "LOJA DE CONVENIÊNCIA CANÃ", cnpj: "33.311.650/0001-07" },
      { name: "LOJA PRIMEIRO DO BRASIL", cnpj: "04.904.416/0001-95" },
      { name: "LOJA TULIPA", cnpj: "18.081.708/0001-80" },
      { name: "POSTO BARRA GAS", cnpj: "11.513.372/0001-38" },
      { name: "POSTO CARBAT", cnpj: "29.456.787/0001-82" },
      { name: "POSTO DE ABASTECIMENTO E", cnpj: "01.131.154/0001-85" },
      { name: "POSTO GALLENA", cnpj: "11.398.725/0001-04" },
      { name: "POSTO IMPERIAL BRACUI LTD", cnpj: "05.318.745/0001-17" },
      { name: "POSTO JMX", cnpj: "13.930.408/0001-04" },
      { name: "POSTO MJX", cnpj: "13.846.056/0001-03" },
      { name: "POSTO ML AYRTON SENNA", cnpj: "25.213.515/0001-09" },
      { name: "POSTO MONALISA", cnpj: "29.520.756/0001-43" },
      { name: "POSTO PENDOTIBA", cnpj: "02.623.670/0001-90" },
      { name: "POSTO PONTA D AGUA", cnpj: "03.242.460/0001-14" },
      { name: "POSTO ROMA", cnpj: "34.484.564/0001-69" },
      { name: "POSTO TRABALHO ITAGUAI", cnpj: "24.314.862/0001-57" },
      { name: "POSTO TRABALHO SANTA ROSA", cnpj: "24.244.784/0001-61" },
      { name: "POSTO TRES POCOS LTDA", cnpj: "45.383.040/0001-06" },
      { name: "ROCAL PRODUTOS DE PETROLE", cnpj: "42.289.165/0001-75" },
      { name: "VIA MARICA POSTO DE GASOL", cnpj: "07.747.478/0001-29" }
    ];

    for (const store of stores) {
      await prisma.store.upsert({
        where: { cnpj_accountId: { cnpj: store.cnpj, accountId: account.id } },
        update: { name: store.name },
        create: { name: store.name, cnpj: store.cnpj, accountId: account.id }
      });
    }

    return NextResponse.json({ success: true, message: 'Dados cadastrados com sucesso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
