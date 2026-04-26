import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET leaderboard - top users by XP
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        xp: true,
        level: true,
        selectedAvatar: true,
        badges: { select: { badge: { select: { name: true } } } },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
