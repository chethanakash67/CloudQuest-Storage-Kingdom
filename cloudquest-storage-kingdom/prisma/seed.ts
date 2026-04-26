import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { LEVELS, BADGES } from '../src/lib/gameConfig';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cloudquest';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Seed game levels
  for (const level of LEVELS) {
    await prisma.gameLevel.upsert({
      where: { id: `level-${level.order}` },
      update: { ...level },
      create: {
        id: `level-${level.order}`,
        ...level,
      },
    });
    console.log(`  ✅ Level ${level.order}: ${level.title}`);
  }

  // Seed badges
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: { ...badge },
      create: { ...badge },
    });
    console.log(`  🏅 Badge: ${badge.name}`);
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
