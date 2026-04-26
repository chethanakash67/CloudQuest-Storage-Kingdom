import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET user by email
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        progress: { include: { level: true } },
        badges: { include: { badge: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create or login user
export async function POST(req: NextRequest) {
  try {
    const { name, email, avatar } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { name, selectedAvatar: avatar || 'guardian' },
      create: {
        name,
        email,
        selectedAvatar: avatar || 'guardian',
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
