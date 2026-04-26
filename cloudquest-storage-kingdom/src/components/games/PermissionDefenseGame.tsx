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
import { ShieldCheck, ShieldX } from 'lucide-react';

interface Character {
  id: number;
  role: string;
  emoji: string;
  name: string;
  action: string;
  resource: string;
  shouldAllow: boolean;
  reason: string;
}

const ALL_CHARACTERS: Character[] = [
  { id: 1, role: 'Teacher', emoji: '👩‍🏫', name: 'Prof. Cloud', action: 'READ', resource: 'assignments/cs101/hw3.pdf', shouldAllow: true, reason: 'Teachers can read assignment files' },
  { id: 2, role: 'Student', emoji: '👨‍🎓', name: 'Alex Student', action: 'UPLOAD', resource: 'students/alex/submission.pdf', shouldAllow: true, reason: 'Students can upload their own files' },
  { id: 3, role: 'Hacker', emoji: '🦹', name: 'DarkByte', action: 'DELETE', resource: 'system/database.sql', shouldAllow: false, reason: 'Hackers must always be blocked!' },
  { id: 4, role: 'Admin', emoji: '👨‍💼', name: 'Admin One', action: 'MANAGE', resource: 'settings/bucket-policy.json', shouldAllow: true, reason: 'Admins can manage bucket settings' },
  { id: 5, role: 'Hacker', emoji: '🕵️', name: 'PhishKing', action: 'READ', resource: 'users/passwords.csv', shouldAllow: false, reason: 'Suspicious entity targeting sensitive data' },
  { id: 6, role: 'Student', emoji: '👩‍🎓', name: 'Maria Student', action: 'DELETE', resource: 'assignments/cs101/hw3.pdf', shouldAllow: false, reason: 'Students cannot delete assignment files' },
  { id: 7, role: 'Teacher', emoji: '👨‍🏫', name: 'Dr. Storage', action: 'WRITE', resource: 'grades/cs101/final.csv', shouldAllow: true, reason: 'Teachers can write grade files' },
  { id: 8, role: 'Anonymous', emoji: '👻', name: 'Unknown User', action: 'READ', resource: 'private/financial-report.xlsx', shouldAllow: false, reason: 'Anonymous users cannot access private files' },
  { id: 9, role: 'Admin', emoji: '👩‍💻', name: 'SysAdmin', action: 'DELETE', resource: 'temp/old-cache.log', shouldAllow: true, reason: 'Admins can clean up temporary files' },
  { id: 10, role: 'Hacker', emoji: '💀', name: 'RansomBot', action: 'WRITE', resource: 'system/config.yml', shouldAllow: false, reason: 'Malicious entity trying to corrupt config' },
];

export default function PermissionDefenseGame() {
  const router = useRouter();
  const { hearts, addXP, addCoins, removeHeart, resetHearts, completeLevel, unlockBadge, addScore } = useGameStore();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'complete' | 'gameover'>('playing');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [dataLeaks, setDataLeaks] = useState(0);
  const [approaching, setApproaching] = useState(true);

  useEffect(() => {
    const shuffled = [...ALL_CHARACTERS].sort(() => Math.random() - 0.5);
    setCharacters(shuffled.slice(0, GAME_CONFIG.PERMISSION_WAVES));
  }, []);

  useEffect(() => {
    if (hearts <= 0 && gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [hearts, gameState]);

  const handleDecision = (allow: boolean) => {
    if (gameState !== 'playing' || !characters[currentIndex]) return;

    const character = characters[currentIndex];
    const isCorrect = allow === character.shouldAllow;

    if (isCorrect) {
      playSound('correct');
      playSound('coinCollect');
      addXP(GAME_CONFIG.XP_PER_CORRECT);
      addCoins(GAME_CONFIG.COINS_PER_CORRECT);
      addScore(15);
      setCorrectCount((prev) => prev + 1);
      setFeedback({ correct: true, message: `✅ Correct! ${character.reason}` });
    } else {
      playSound('wrong');
      playSound('damage');
      removeHeart();
      setWrongCount((prev) => prev + 1);
      setDataLeaks((prev) => prev + 1);
      setFeedback({ correct: false, message: `❌ Data Leak! ${character.reason}` });
    }

    setApproaching(false);

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= characters.length) {
        playSound('levelComplete');
        setGameState('complete');
      } else {
        setCurrentIndex((prev) => prev + 1);
        setApproaching(true);
      }
    }, 1800);
  };

  const handleTimeUp = useCallback(() => {
    if (gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [gameState]);

  const handleComplete = () => {
    const total = correctCount + wrongCount;
    const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
    const s = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;
    addXP(GAME_CONFIG.XP_PER_LEVEL_COMPLETE);
    addCoins(GAME_CONFIG.COINS_PER_LEVEL_COMPLETE);
    completeLevel(5, s);
    unlockBadge('Access Defender');
  };

  useEffect(() => {
    if (gameState === 'complete') handleComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleRetry = () => {
    resetHearts();
    const shuffled = [...ALL_CHARACTERS].sort(() => Math.random() - 0.5);
    setCharacters(shuffled.slice(0, GAME_CONFIG.PERMISSION_WAVES));
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setDataLeaks(0);
    setGameState('playing');
    setFeedback(null);
    setApproaching(true);
  };

  const total = correctCount + wrongCount;
  const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
  const stars = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;
  const currentChar = characters[currentIndex];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Teacher': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Student': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Hacker': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Admin': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Anonymous': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-red-950/20 to-gray-950">
      <PlayerStatsBar />

      <div className="pt-16 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🏰 <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Permission Defense</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Guard the castle • Wave {currentIndex + 1}/{characters.length} • Leaks: {dataLeaks}</p>
          </div>
          {gameState === 'playing' && (
            <Timer duration={GAME_CONFIG.PERMISSION_DEFENSE_TIME} onTimeUp={handleTimeUp} />
          )}
        </div>

        {/* Castle Gate Visual */}
        <div className="relative w-full bg-gray-900/50 rounded-2xl border border-gray-800 p-6 mb-4 min-h-[300px] overflow-hidden">
          {/* Castle background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl opacity-20">🏰</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

          {/* Gate */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-28 border-2 border-gray-700 rounded-t-full bg-gray-800/50 flex items-center justify-center">
            <span className="text-2xl">🚪</span>
          </div>

          {/* Approaching Character */}
          <AnimatePresence mode="wait">
            {currentChar && gameState === 'playing' && (
              <motion.div
                key={currentChar.id}
                initial={{ x: -200, opacity: 0 }}
                animate={approaching ? { x: -30, opacity: 1 } : { x: 300, opacity: 0 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                className="absolute top-1/2 left-1/3 -translate-y-1/2"
              >
                <div className="flex flex-col items-center">
                  <span className="text-5xl mb-2">{currentChar.emoji}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRoleColor(currentChar.role)}`}>
                    {currentChar.role}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Character Info Card */}
        <AnimatePresence mode="wait">
          {currentChar && gameState === 'playing' && !feedback && (
            <motion.div
              key={currentChar.id + '-info'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-900/80 rounded-xl border border-gray-800 p-5 mb-4"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{currentChar.emoji}</span>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white">{currentChar.name}</h3>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 ${getRoleColor(currentChar.role)}`}>
                    {currentChar.role}
                  </span>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-gray-400">
                      Action: <span className="text-white font-medium">{currentChar.action}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Resource: <span className="text-white font-mono text-[11px]">{currentChar.resource}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-4 rounded-xl text-sm font-medium ${
                feedback.correct ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Allow / Deny Buttons */}
        {gameState === 'playing' && !feedback && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.button
              onClick={() => handleDecision(true)}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-500/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ShieldCheck className="w-6 h-6" /> ALLOW
            </motion.button>
            <motion.button
              onClick={() => handleDecision(false)}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-lg hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-500/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ShieldX className="w-6 h-6" /> BLOCK
            </motion.button>
          </div>
        )}

        {/* Learning Tip */}
        <div className="p-3 bg-red-950/30 rounded-xl border border-red-900/30">
          <p className="text-[11px] text-red-400">
            💡 <strong>Cloud Concept:</strong> <strong>Access Control</strong> determines who can read, write, or manage cloud resources. Use <strong>IAM roles</strong> and <strong>bucket policies</strong> to enforce least-privilege access.
          </p>
        </div>
      </div>

      <LevelCompleteModal
        isOpen={gameState === 'complete'}
        levelName="Permission Defense"
        score={correctCount * 15}
        maxScore={characters.length * 15}
        xpEarned={GAME_CONFIG.XP_PER_LEVEL_COMPLETE + correctCount * GAME_CONFIG.XP_PER_CORRECT}
        coinsEarned={GAME_CONFIG.COINS_PER_LEVEL_COMPLETE + correctCount * GAME_CONFIG.COINS_PER_CORRECT}
        stars={stars}
        onNextLevel={() => router.push('/level/6')}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />

      <GameOverModal
        isOpen={gameState === 'gameover'}
        reason={hearts <= 0 ? 'hearts' : 'time'}
        levelName="Permission Defense"
        score={correctCount * 15}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />
    </div>
  );
}
