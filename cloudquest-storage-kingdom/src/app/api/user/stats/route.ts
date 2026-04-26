import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST update user stats (XP, coins, hearts)
export async function POST(req: NextRequest) {
  try {
    const { userId, xp, coins, hearts, level } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const updateData: Record<string, number> = {};
    if (xp !== undefined) updateData.xp = xp;
    if (coins !== undefined) updateData.coins = coins;
    if (hearts !== undefined) updateData.hearts = hearts;
    if (level !== undefined) updateData.level = level;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
