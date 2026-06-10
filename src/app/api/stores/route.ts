import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q') || '';

  try {
    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { cnpj: { contains: search } }
        ]
      },
      include: {
        account: {
          select: {
            email: true,
            password: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(stores);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, cnpj, email, password } = data;

    if (!name || !cnpj || !email || !password) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    const account = await prisma.account.upsert({
      where: { email },
      update: { password },
      create: { email, password }
    });

    const store = await prisma.store.upsert({
      where: { cnpj_accountId: { cnpj, accountId: account.id } },
      update: { name },
      create: { name, cnpj, accountId: account.id }
    });

    return NextResponse.json({ success: true, store });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, name, cnpj, password, accountId } = data;

    if (!id || !name || !cnpj || !password || !accountId) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    await prisma.store.update({
      where: { id },
      data: { name, cnpj }
    });

    await prisma.account.update({
      where: { id: accountId },
      data: { password }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
