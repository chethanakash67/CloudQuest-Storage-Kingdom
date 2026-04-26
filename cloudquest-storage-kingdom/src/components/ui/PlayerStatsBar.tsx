'use client';

import { useGameStore } from '@/store/gameStore';
import Hearts from './Hearts';
import XPBar from './XPBar';
import CoinsDisplay from './CoinsDisplay';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { AVATARS } from '@/lib/gameConfig';

export default function PlayerStatsBar() {
  const { playerName, selectedAvatar, xp, level, coins, hearts } = useGameStore();
  const avatar = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-indigo-900/30">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Left - Logo & Player */}
        <div className="flex items-center gap-3">
          <Link href="/map" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-bold text-white hidden sm:block">CloudQuest</span>
          </Link>
          <div className="h-6 w-px bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 hidden sm:flex">
            <span className="text-lg">{avatar.emoji}</span>
            <span className="text-xs font-medium text-gray-400">{playerName || 'Guardian'}</span>
          </div>
        </div>

        {/* Center - Stats */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Hearts current={hearts} max={3} />
          <XPBar xp={xp} level={level} />
          <CoinsDisplay coins={coins} />
        </div>

        {/* Right - Navigation */}
        <div className="flex items-center gap-2">
          <Link
            href="/rewards"
            className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors font-medium hidden sm:block"
          >
            🏅 Badges
          </Link>
          <Link
            href="/profile"
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors font-medium"
          >
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
