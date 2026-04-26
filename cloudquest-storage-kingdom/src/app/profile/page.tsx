'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { AVATARS, LEVELS, BADGES, GAME_CONFIG } from '@/lib/gameConfig';
import PlayerStatsBar from '@/components/ui/PlayerStatsBar';
import Link from 'next/link';
import { ArrowLeft, Star, RotateCcw } from 'lucide-react';

export default function ProfilePage() {
  const {
    playerName,
    selectedAvatar,
    xp,
    level,
    coins,
    completedLevels,
    levelStars,
    unlockedBadges,
    resetGame,
  } = useGameStore();

  const avatar = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];
  const totalStars = Object.values(levelStars).reduce((sum, s) => sum + s, 0);
  const maxStars = LEVELS.length * 3;
  const xpProgress = (xp % GAME_CONFIG.XP_TO_LEVEL_UP) / GAME_CONFIG.XP_TO_LEVEL_UP * 100;

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      <PlayerStatsBar />

      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px]" />

      <div className="relative z-10 pt-20 px-4 pb-16 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/map" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </Link>
          <h1 className="text-2xl font-black font-['Outfit',sans-serif] text-white">👤 Profile</h1>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-6 text-center"
        >
          <motion.div
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/30 flex items-center justify-center mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <span className="text-4xl">{avatar.emoji}</span>
          </motion.div>

          <h2 className="text-xl font-bold text-white">{playerName || 'Guardian'}</h2>
          <p className="text-sm text-indigo-400">{avatar.name}</p>

          {/* Level & XP */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
              {level}
            </span>
            <div className="text-left">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Level {level}</p>
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total XP', value: xp, icon: '⚡', color: 'text-indigo-400' },
            { label: 'Coins', value: coins, icon: '🪙', color: 'text-yellow-400' },
            { label: 'Stars', value: `${totalStars}/${maxStars}`, icon: '⭐', color: 'text-yellow-300' },
            { label: 'Badges', value: `${unlockedBadges.length}/${BADGES.length}`, icon: '🏅', color: 'text-orange-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-xl p-4 text-center"
            >
              <span className="text-xl block mb-1">{stat.icon}</span>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Level Progress */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Level Progress</h3>
          <div className="space-y-2">
            {LEVELS.map((lvl) => {
              const isCompleted = completedLevels.includes(lvl.order);
              const stars = levelStars[lvl.order] || 0;

              return (
                <div
                  key={lvl.order}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    isCompleted ? 'bg-green-500/5 border border-green-500/20' : 'bg-gray-800/30'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-600'
                  }`}>
                    {lvl.order}
                  </span>
                  <span className={`text-sm flex-1 ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                    {lvl.title}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges Preview */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Badges</h3>
            <Link href="/rewards" className="text-xs text-indigo-400 hover:text-indigo-300">View all →</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {BADGES.map((badge) => {
              const isUnlocked = unlockedBadges.includes(badge.name);
              return (
                <div
                  key={badge.name}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-yellow-500/10 border border-yellow-500/30'
                      : 'bg-gray-800/50 border border-gray-800 opacity-40'
                  }`}
                  title={badge.name}
                >
                  <span className="text-xl">{isUnlocked ? badge.icon : '🔒'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone!')) {
              resetGame();
              window.location.href = '/';
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset Progress
        </button>
      </div>
    </div>
  );
}
