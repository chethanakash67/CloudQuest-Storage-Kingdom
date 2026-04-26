import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET progress for a user
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: { level: true },
      orderBy: { level: { order: 'asc' } },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST update level progress
export async function POST(req: NextRequest) {
  try {
    const { userId, levelId, completed, stars, score } = await req.json();

    if (!userId || !levelId) {
      return NextResponse.json({ error: 'userId and levelId are required' }, { status: 400 });
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_levelId: { userId, levelId },
      },
      update: {
        completed: completed ?? true,
        stars: { set: stars ?? 0 },
        bestScore: { set: score ?? 0 },
        attempts: { increment: 1 },
      },
      create: {
        userId,
        levelId,
        completed: completed ?? true,
        stars: stars ?? 0,
        bestScore: score ?? 0,
        attempts: 1,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
