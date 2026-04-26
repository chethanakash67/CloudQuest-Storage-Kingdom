import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST log a game event
export async function POST(req: NextRequest) {
  try {
    const { userId, levelId, eventType, score } = await req.json();

    if (!userId || !levelId || !eventType) {
      return NextResponse.json(
        { error: 'userId, levelId, and eventType are required' },
        { status: 400 }
      );
    }

    const event = await prisma.gameEvent.create({
      data: {
        userId,
        levelId,
        eventType,
        score: score || 0,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error logging game event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
