'use client';

import { motion } from 'framer-motion';
import { GAME_CONFIG } from '@/lib/gameConfig';

interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const xpInCurrentLevel = xp % GAME_CONFIG.XP_TO_LEVEL_UP;
  const progress = (xpInCurrentLevel / GAME_CONFIG.XP_TO_LEVEL_UP) * 100;

  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/30">
        {level}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">XP</span>
          <span className="text-[10px] text-indigo-400">{xpInCurrentLevel}/{GAME_CONFIG.XP_TO_LEVEL_UP}</span>
        </div>
        <div className="h-2.5 bg-gray-800/80 rounded-full overflow-hidden border border-indigo-900/50">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
