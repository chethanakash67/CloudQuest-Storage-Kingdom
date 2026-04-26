import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET all badges with user unlock status
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  try {
    const badges = await prisma.badge.findMany({
      include: {
        users: userId ? { where: { userId } } : false,
      },
    });

    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST unlock a badge for a user
export async function POST(req: NextRequest) {
  try {
    const { userId, badgeId } = await req.json();

    if (!userId || !badgeId) {
      return NextResponse.json({ error: 'userId and badgeId are required' }, { status: 400 });
    }

    const userBadge = await prisma.userBadge.upsert({
      where: {
        userId_badgeId: { userId, badgeId },
      },
      update: {},
      create: { userId, badgeId },
    });

    return NextResponse.json(userBadge);
  } catch (error) {
    console.error('Error unlocking badge:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
