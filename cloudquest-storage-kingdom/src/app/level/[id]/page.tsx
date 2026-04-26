'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';
import BucketSortingGame from '@/components/games/BucketSortingGame';
import ObjectKeyMaze from '@/components/games/ObjectKeyMaze';
import StorageClassShop from '@/components/games/StorageClassShop';
import CostSpeedBattle from '@/components/games/CostSpeedBattle';
import PermissionDefenseGame from '@/components/games/PermissionDefenseGame';
import LeakyBucketFixGame from '@/components/games/LeakyBucketFixGame';

const LEVEL_COMPONENTS: Record<number, React.ComponentType> = {
  1: BucketSortingGame,
  2: ObjectKeyMaze,
  3: StorageClassShop,
  4: CostSpeedBattle,
  5: PermissionDefenseGame,
  6: LeakyBucketFixGame,
};

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const { unlockedLevels, resetHearts } = useGameStore();
  const [mounted, setMounted] = useState(false);

  const levelId = parseInt(params.id as string, 10);

  useEffect(() => {
    setMounted(true);
    resetHearts();
  }, [resetHearts]);

  useEffect(() => {
    if (mounted && !unlockedLevels.includes(levelId)) {
      router.push('/map');
    }
  }, [mounted, levelId, unlockedLevels, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-bounce block mb-4">⚔️</span>
          <p className="text-sm text-gray-500">Loading mission...</p>
        </div>
      </div>
    );
  }

  const GameComponent = LEVEL_COMPONENTS[levelId];

  if (!GameComponent) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4">❓</span>
          <p className="text-sm text-gray-400">Level not found</p>
          <button
            onClick={() => router.push('/map')}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500"
          >
            Back to Map
          </button>
        </div>
      </div>
    );
  }

  return <GameComponent />;
}
