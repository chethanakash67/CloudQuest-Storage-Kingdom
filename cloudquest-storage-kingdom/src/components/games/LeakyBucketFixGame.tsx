'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/gameConfig';
import { playSound } from '@/lib/sounds';
import Timer from '@/components/ui/Timer';
import LevelCompleteModal from '@/components/ui/LevelCompleteModal';
import GameOverModal from '@/components/ui/GameOverModal';
import PlayerStatsBar from '@/components/ui/PlayerStatsBar';
import { useRouter } from 'next/navigation';
import { Lock, Unlock, ShieldAlert, Check, X } from 'lucide-react';

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  currentState: boolean;
  correctState: boolean;
  icon: string;
  category: string;
}

const INITIAL_SETTINGS: SecuritySetting[] = [
  {
    id: 'public-access-prevention',
    name: 'Public Access Prevention',
    description: 'Prevents allUsers or allAuthenticatedUsers from making the bucket public',
    currentState: false,
    correctState: true,
    icon: '🔒',
    category: 'GCP Public Access',
  },
  {
    id: 'uniform-bucket-level-access',
    name: 'Uniform Bucket-Level Access',
    description: 'Uses bucket-level IAM and disables per-object ACLs',
    currentState: false,
    correctState: true,
    icon: '🛡️',
    category: 'GCP IAM',
  },
  {
    id: 'allusers-write',
    name: 'allUsers Write Grant',
    description: 'Legacy public write permission that can let anyone upload objects',
    currentState: true,
    correctState: false,
    icon: '✏️',
    category: 'GCP Principals',
  },
  {
    id: 'teacher-custom-role',
    name: 'Teacher Custom IAM Role',
    description: 'Grants read access through a scoped GCP IAM role only',
    currentState: false,
    correctState: true,
    icon: '👩‍🏫',
    category: 'GCP IAM',
  },
];

export default function LeakyBucketFixGame() {
  const router = useRouter();
  const { hearts, addXP, addCoins, removeHeart, resetHearts, completeLevel, unlockBadge, addScore } = useGameStore();
  const [settings, setSettings] = useState<SecuritySetting[]>(INITIAL_SETTINGS.map((s) => ({ ...s })));
  const [gameState, setGameState] = useState<'playing' | 'complete' | 'gameover'>('playing');
  const [leakIntensity, setLeakIntensity] = useState(100);
  const [showResult, setShowResult] = useState(false);
  const [checkedSettings, setCheckedSettings] = useState<Record<string, boolean | null>>({});
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  // Calculate leak based on correct settings
  useEffect(() => {
    const correctCount = settings.filter((s) => s.currentState === s.correctState).length;
    const leak = 100 - (correctCount / settings.length) * 100;
    setLeakIntensity(leak);
  }, [settings]);

  useEffect(() => {
    if (hearts <= 0 && gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [hearts, gameState]);

  const toggleSetting = (id: string) => {
    if (gameState !== 'playing' || showResult) return;
    playSound('click');
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, currentState: !s.currentState } : s))
    );
  };

  const handleSubmit = () => {
    if (gameState !== 'playing') return;
    setShowResult(true);
    setAttemptsUsed((prev) => prev + 1);

    let correct = 0;
    let wrong = 0;
    const checks: Record<string, boolean> = {};

    settings.forEach((s) => {
      const isCorrect = s.currentState === s.correctState;
      checks[s.id] = isCorrect;
      if (isCorrect) {
        correct++;
      } else {
        wrong++;
      }
    });

    setCheckedSettings(checks);

    if (correct === settings.length) {
      // All correct - level complete
      playSound('levelComplete');
      addXP(GAME_CONFIG.XP_PER_CORRECT * correct);
      addCoins(GAME_CONFIG.COINS_PER_CORRECT * correct);
      addScore(correct * 25);

      setTimeout(() => {
        setGameState('complete');
      }, 1500);
    } else {
      // Some wrong
      playSound('wrong');
      playSound('damage');

      for (let i = 0; i < wrong; i++) {
        removeHeart();
      }

      setTimeout(() => {
        setShowResult(false);
        setCheckedSettings({});
      }, 2500);
    }
  };

  const handleTimeUp = useCallback(() => {
    if (gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [gameState]);

  const handleComplete = () => {
    const s = attemptsUsed <= 1 ? 3 : attemptsUsed <= 2 ? 2 : 1;
    addXP(GAME_CONFIG.XP_PER_LEVEL_COMPLETE);
    addCoins(GAME_CONFIG.COINS_PER_LEVEL_COMPLETE);
    completeLevel(6, s);
    unlockBadge('Leak Fixer');

    // Check if all levels completed for GCP Storage Guardian badge
    const { completedLevels } = useGameStore.getState();
    if (completedLevels.length >= 5) {
      setTimeout(() => {
        unlockBadge('GCP Storage Guardian');
      }, 2000);
    }
  };

  useEffect(() => {
    if (gameState === 'complete') handleComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleRetry = () => {
    resetHearts();
    setSettings(INITIAL_SETTINGS.map((s) => ({ ...s })));
    setShowResult(false);
    setCheckedSettings({});
    setAttemptsUsed(0);
    setGameState('playing');
  };

  const stars = attemptsUsed <= 1 ? 3 : attemptsUsed <= 2 ? 2 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-blue-950/20 to-gray-950">
      <PlayerStatsBar />

      <div className="pt-16 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🔧 <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Fix the Leaky GCS Bucket</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Toggle GCP bucket security settings to stop the data leak</p>
          </div>
          {gameState === 'playing' && (
            <Timer duration={GAME_CONFIG.LEAKY_BUCKET_TIME} onTimeUp={handleTimeUp} />
          )}
        </div>

        {/* Bucket Visualization */}
        <div className="relative bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-6 overflow-hidden">
          <div className="flex items-center justify-center">
            {/* Bucket */}
            <div className="relative">
              <div className="w-40 h-48 border-4 border-blue-500/50 rounded-b-3xl bg-blue-950/30 relative overflow-hidden">
                {/* Water/Data level */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/40 to-cyan-400/20"
                  animate={{ height: `${100 - leakIntensity}%` }}
                  transition={{ duration: 0.5 }}
                />

                {/* Data icons floating */}
                {leakIntensity < 100 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="text-2xl"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      📁
                    </motion.span>
                  </div>
                )}

                {/* Bucket label */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2">
                  <ShieldAlert className={`w-8 h-8 ${leakIntensity > 0 ? 'text-red-400' : 'text-green-400'}`} />
                </div>
              </div>

              {/* Leak drops */}
              {leakIntensity > 0 && (
                <div className="absolute -bottom-4 left-0 right-0 flex justify-around">
                  {Array.from({ length: Math.ceil(leakIntensity / 25) }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{
                        y: [0, 20, 0],
                        opacity: [1, 0.3, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="ml-8">
              <div className="flex items-center gap-2 mb-2">
                {leakIntensity > 0 ? (
                  <Unlock className="w-5 h-5 text-red-400" />
                ) : (
                  <Lock className="w-5 h-5 text-green-400" />
                )}
                <span className={`text-sm font-bold ${leakIntensity > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {leakIntensity > 0 ? 'LEAKING!' : 'SECURED!'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Leak intensity: <span className="text-white font-mono">{leakIntensity.toFixed(0)}%</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Attempts used: <span className="text-white font-mono">{attemptsUsed}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Security Settings Toggle Panel */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Security Settings</h3>
          {settings.map((setting) => (
            <motion.div
              key={setting.id}
              className={`p-4 rounded-xl border transition-all ${
                checkedSettings[setting.id] === true
                  ? 'bg-green-500/10 border-green-500/30'
                  : checkedSettings[setting.id] === false
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
              }`}
              animate={
                checkedSettings[setting.id] === false
                  ? { x: [0, -3, 3, -3, 3, 0] }
                  : {}
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{setting.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{setting.name}</h4>
                    <p className="text-[11px] text-gray-500">{setting.description}</p>
                    <span className="text-[10px] text-gray-600">Category: {setting.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {checkedSettings[setting.id] !== undefined && checkedSettings[setting.id] !== null && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      {checkedSettings[setting.id] ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </motion.span>
                  )}

                  <button
                    onClick={() => toggleSetting(setting.id)}
                    disabled={gameState !== 'playing' || showResult}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      setting.currentState ? 'bg-green-600' : 'bg-gray-700'
                    } disabled:opacity-50`}
                  >
                    <motion.div
                      className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                      animate={{ left: setting.currentState ? '30px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        {gameState === 'playing' && !showResult && (
          <motion.button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20 mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🔧 Apply Security Fix
          </motion.button>
        )}

        {showResult && leakIntensity > 0 && (
          <p className="text-center text-sm text-yellow-400 mb-6 animate-pulse">
            Review the incorrect settings and try again...
          </p>
        )}

        {/* Learning Tip */}
        <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-900/30">
          <p className="text-[11px] text-blue-400">
            💡 <strong>GCP Concept:</strong> <strong>Public GCS buckets</strong> can expose sensitive data. Use Public Access Prevention, Uniform Bucket-Level Access, scoped IAM roles, and remove allUsers grants.
          </p>
        </div>
      </div>

      <LevelCompleteModal
        isOpen={gameState === 'complete'}
        levelName="Fix the Leaky GCS Bucket"
        levelOrder={6}
        score={settings.length * 25}
        maxScore={settings.length * 25}
        xpEarned={GAME_CONFIG.XP_PER_LEVEL_COMPLETE + settings.length * GAME_CONFIG.XP_PER_CORRECT}
        coinsEarned={GAME_CONFIG.COINS_PER_LEVEL_COMPLETE + settings.length * GAME_CONFIG.COINS_PER_CORRECT}
        stars={stars}
        onNextLevel={() => router.push('/map')}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
        isLastLevel={true}
      />

      <GameOverModal
        isOpen={gameState === 'gameover'}
        reason={hearts <= 0 ? 'hearts' : 'time'}
        levelName="Fix the Leaky GCS Bucket"
        score={0}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />
    </div>
  );
}
