'use client';

import { motion } from 'framer-motion';
import PlayerStatsBar from '@/components/ui/PlayerStatsBar';
import Link from 'next/link';
import { ArrowLeft, Trophy, Star, Medal } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

// Demo leaderboard data (would come from API in production)
const DEMO_LEADERBOARD = [
  { rank: 1, name: 'CloudMaster', avatar: '🧙', xp: 2500, level: 10, badges: 7 },
  { rank: 2, name: 'ByteKnight', avatar: '⚔️', xp: 2100, level: 9, badges: 6 },
  { rank: 3, name: 'DataWizard', avatar: '🛡️', xp: 1800, level: 8, badges: 6 },
  { rank: 4, name: 'StorageNinja', avatar: '🏹', xp: 1500, level: 7, badges: 5 },
  { rank: 5, name: 'BucketHero', avatar: '🧙', xp: 1200, level: 5, badges: 4 },
  { rank: 6, name: 'CloudRanger', avatar: '🏹', xp: 1000, level: 4, badges: 3 },
  { rank: 7, name: 'AccessGuard', avatar: '⚔️', xp: 800, level: 4, badges: 3 },
  { rank: 8, name: 'KeyMaster', avatar: '🛡️', xp: 600, level: 3, badges: 2 },
  { rank: 9, name: 'ArchiveKeeper', avatar: '🧙', xp: 400, level: 2, badges: 1 },
  { rank: 10, name: 'NewGuardian', avatar: '⚔️', xp: 150, level: 1, badges: 0 },
];

const RANK_STYLES = [
  { bg: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/30', icon: '🥇' },
  { bg: 'from-gray-400/20 to-gray-500/10', border: 'border-gray-400/30', icon: '🥈' },
  { bg: 'from-orange-700/20 to-orange-800/10', border: 'border-orange-700/30', icon: '🥉' },
];

export default function LeaderboardPage() {
  const { playerName, xp, level, unlockedBadges, selectedAvatar } = useGameStore();
  const AVATARS_MAP: Record<string, string> = { guardian: '🛡️', wizard: '🧙', knight: '⚔️', ranger: '🏹' };

  // Insert current player into leaderboard
  const playerEntry = {
    rank: 0,
    name: playerName || 'You',
    avatar: AVATARS_MAP[selectedAvatar] || '🛡️',
    xp,
    level,
    badges: unlockedBadges.length,
  };

  const allEntries = [...DEMO_LEADERBOARD, playerEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      <PlayerStatsBar />

      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px]" />

      <div className="relative z-10 pt-20 px-4 pb-16 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/map" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black font-['Outfit',sans-serif] text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" /> Leaderboard
            </h1>
            <p className="text-xs text-gray-500">Top Cloud Guardians</p>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {allEntries.slice(0, 3).map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`p-4 rounded-2xl bg-gradient-to-b ${RANK_STYLES[i].bg} border ${RANK_STYLES[i].border} text-center ${
                entry.name === (playerName || 'You') ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <span className="text-2xl block mb-1">{RANK_STYLES[i].icon}</span>
              <span className="text-3xl block mb-2">{entry.avatar}</span>
              <p className="text-sm font-bold text-white truncate">{entry.name}</p>
              <p className="text-xs text-indigo-400 font-medium">{entry.xp} XP</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-gray-500">Lv.{entry.level}</span>
                <Medal className="w-3 h-3 text-yellow-500 ml-1" />
                <span className="text-[10px] text-gray-500">{entry.badges}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full List */}
        <div className="space-y-2">
          {allEntries.slice(3).map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                entry.name === (playerName || 'You')
                  ? 'bg-indigo-500/10 border border-indigo-500/30'
                  : 'bg-gray-900/30 border border-gray-800/50 hover:bg-gray-900/50'
              }`}
            >
              <span className="w-8 text-center text-sm font-bold text-gray-500">#{entry.rank}</span>
              <span className="text-xl">{entry.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${entry.name === (playerName || 'You') ? 'text-indigo-300' : 'text-white'}`}>
                  {entry.name}
                  {entry.name === (playerName || 'You') && (
                    <span className="ml-2 text-[10px] text-indigo-400 font-normal">(you)</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-indigo-400">{entry.xp} XP</p>
                <p className="text-[10px] text-gray-600">Lv.{entry.level} • {entry.badges}🏅</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
