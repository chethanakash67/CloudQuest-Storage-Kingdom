'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { BADGES } from '@/lib/gameConfig';
import PlayerStatsBar from '@/components/ui/PlayerStatsBar';
import Link from 'next/link';
import { Lock, Check, ArrowLeft } from 'lucide-react';

export default function RewardsPage() {
  const { unlockedBadges } = useGameStore();

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      <PlayerStatsBar />

      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[120px]" />

      <div className="relative z-10 pt-20 px-4 pb-16 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/map" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-['Outfit',sans-serif] text-white">🏅 Badges & Rewards</h1>
            <p className="text-xs text-gray-500">{unlockedBadges.length}/{BADGES.length} badges unlocked</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedBadges.length / BADGES.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BADGES.map((badge, i) => {
            const isUnlocked = unlockedBadges.includes(badge.name);

            return (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`relative p-5 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-yellow-500/10 to-orange-500/5 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                    : 'bg-gray-900/30 border-gray-800 opacity-60'
                }`}
              >
                {isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                )}

                <motion.div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40'
                      : 'bg-gray-800/50 border-2 border-gray-700'
                  }`}
                  animate={isUnlocked ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
                >
                  {isUnlocked ? (
                    <span className="text-3xl">{badge.icon}</span>
                  ) : (
                    <Lock className="w-6 h-6 text-gray-600" />
                  )}
                </motion.div>

                <h3 className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-yellow-300' : 'text-gray-600'}`}>
                  {badge.name}
                </h3>
                <p className={`text-[11px] ${isUnlocked ? 'text-gray-400' : 'text-gray-700'}`}>
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* All badges hint */}
        {unlockedBadges.length >= BADGES.length - 1 && !unlockedBadges.includes('GCP Storage Guardian') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center"
          >
            <p className="text-sm text-purple-300">✨ Complete all levels to earn the <strong>GCP Storage Guardian</strong> badge!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
