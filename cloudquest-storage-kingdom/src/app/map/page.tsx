'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { LEVELS, AVATARS } from '@/lib/gameConfig';
import { Star, Lock, Check } from 'lucide-react';
import Link from 'next/link';
import PlayerStatsBar from '@/components/ui/PlayerStatsBar';

const WORLD_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  'GCS Bucket Island': { bg: 'from-cyan-600/20 to-blue-600/20', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  'GCP Storage Class Cave': { bg: 'from-emerald-600/20 to-green-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  'GCP IAM Access Castle': { bg: 'from-red-600/20 to-pink-600/20', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' },
};

const WORLD_EMOJIS: Record<string, string> = {
  'GCS Bucket Island': '🏝️',
  'GCP Storage Class Cave': '🏔️',
  'GCP IAM Access Castle': '🏰',
};

export default function GameMapPage() {
  const { unlockedLevels, completedLevels, levelStars, selectedAvatar, playerName } = useGameStore();
  const avatar = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];

  // Group by world
  const worldGroups = LEVELS.reduce(
    (acc, level) => {
      if (!acc[level.world]) acc[level.world] = [];
      acc[level.world].push(level);
      return acc;
    },
    {} as Record<string, typeof LEVELS[number][]>
  );

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      <PlayerStatsBar />

      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[120px]" />

      <div className="relative z-10 pt-20 px-4 pb-16 max-w-4xl mx-auto">
        {/* Map Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-3"
          >
            <span className="text-4xl">{avatar.emoji}</span>
            <div className="text-left">
              <h1 className="text-2xl font-black font-['Outfit',sans-serif] text-white">Storage Kingdom</h1>
              <p className="text-xs text-gray-500">{playerName || 'Guardian'}&apos;s Adventure Map</p>
            </div>
          </motion.div>
        </div>

        {/* World Sections */}
        {Object.entries(worldGroups).map(([worldName, levels], worldIdx) => {
          const worldColor = WORLD_COLORS[worldName];
          const worldEmoji = WORLD_EMOJIS[worldName];

          return (
            <motion.div
              key={worldName}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: worldIdx * 0.2 }}
              className="mb-10"
            >
              {/* World Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{worldEmoji}</span>
                <div>
                  <h2 className={`text-lg font-bold ${worldColor.text}`}>{worldName}</h2>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                    {levels.length} missions
                  </p>
                </div>
                <div className={`flex-1 h-px bg-gradient-to-r ${worldColor.bg}`} />
              </div>

              {/* Level Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {levels.map((level) => {
                  const isUnlocked = unlockedLevels.includes(level.order);
                  const isCompleted = completedLevels.includes(level.order);
                  const stars = levelStars[level.order] || 0;

                  return (
                    <motion.div
                      key={level.order}
                      whileHover={isUnlocked ? { scale: 1.02 } : {}}
                      className="relative"
                    >
                      {isUnlocked ? (
                        <Link href={`/level/${level.order}`}>
                          <div
                            className={`p-5 rounded-2xl bg-gradient-to-br ${worldColor.bg} border ${worldColor.border} hover:shadow-lg ${worldColor.glow} transition-all cursor-pointer relative overflow-hidden group`}
                          >
                            {/* Shimmer on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />

                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${worldColor.bg} border ${worldColor.border} flex items-center justify-center text-base font-bold ${worldColor.text}`}>
                                    {level.order}
                                  </span>
                                  {isCompleted && (
                                    <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                      <Check className="w-3 h-3 text-green-400" />
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-4 h-4 ${
                                        s <= stars
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-700'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <h3 className="text-base font-bold text-white mb-1">{level.title}</h3>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{level.description}</p>

                              <div className="flex items-center gap-3 text-[10px]">
                                <span className="text-indigo-400">+{level.xpReward} XP</span>
                                <span className="text-yellow-400">+{level.coinReward} 🪙</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="p-5 rounded-2xl bg-gray-900/30 border border-gray-800/50 opacity-50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center">
                              <Lock className="w-4 h-4 text-gray-600" />
                            </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star key={s} className="w-4 h-4 text-gray-800" />
                              ))}
                            </div>
                          </div>
                          <h3 className="text-base font-bold text-gray-600 mb-1">{level.title}</h3>
                          <p className="text-xs text-gray-700">Complete level {level.order - 1} to unlock</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Map Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Link
            href="/knowledge"
            className="px-5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
          >
            📖 Knowledge
          </Link>
          <Link
            href="/rewards"
            className="px-5 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-colors"
          >
            🏅 Badges
          </Link>
          <Link
            href="/leaderboard"
            className="px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors"
          >
            🏆 Leaderboard
          </Link>
          <Link
            href="/profile"
            className="px-5 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors"
          >
            👤 Profile
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
