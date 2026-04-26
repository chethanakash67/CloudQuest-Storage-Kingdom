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

type StorageClass = 'Standard' | 'Infrequent Access' | 'Archive' | 'Deep Archive';

interface Customer {
  id: number;
  name: string;
  emoji: string;
  dataDescription: string;
  frequency: string;
  correctClass: StorageClass;
  hint: string;
}

const STORAGE_CLASSES: { name: StorageClass; emoji: string; color: string; description: string; cost: string; speed: string }[] = [
  { name: 'Standard', emoji: '⚡', color: 'from-blue-500 to-cyan-500', description: 'Fast & frequent access', cost: '$$$', speed: 'Instant' },
  { name: 'Infrequent Access', emoji: '📦', color: 'from-green-500 to-emerald-500', description: 'Cheaper for rare access', cost: '$$', speed: 'Fast' },
  { name: 'Archive', emoji: '🗄️', color: 'from-orange-500 to-amber-500', description: 'Cheap but slow retrieval', cost: '$', speed: 'Hours' },
  { name: 'Deep Archive', emoji: '🏔️', color: 'from-purple-500 to-violet-500', description: 'Cheapest, very slow', cost: '¢', speed: '12+ Hours' },
];

const ALL_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Student Portal', emoji: '👨‍🎓', dataDescription: 'Daily profile pictures', frequency: 'Multiple times daily', correctClass: 'Standard', hint: 'Accessed constantly by users' },
  { id: 2, name: 'School Website', emoji: '🏫', dataDescription: 'Homepage banner images', frequency: 'Every page load', correctClass: 'Standard', hint: 'Needs instant loading' },
  { id: 3, name: 'HR Department', emoji: '👔', dataDescription: 'Monthly payroll reports', frequency: 'Once a month', correctClass: 'Infrequent Access', hint: 'Only needed monthly' },
  { id: 4, name: 'IT Department', emoji: '💻', dataDescription: 'Quarterly audit logs', frequency: 'Every 3 months', correctClass: 'Infrequent Access', hint: 'Reviewed quarterly' },
  { id: 5, name: 'Compliance Team', emoji: '📋', dataDescription: 'Last year tax records', frequency: 'Rarely, maybe once a year', correctClass: 'Archive', hint: 'Rarely accessed, keep for compliance' },
  { id: 6, name: 'Data Team', emoji: '📊', dataDescription: 'Old analytics data (2 years ago)', frequency: 'Almost never', correctClass: 'Archive', hint: 'Historical data, seldom needed' },
  { id: 7, name: 'Legal Department', emoji: '⚖️', dataDescription: 'Legal records from 2015', frequency: 'Extremely rare, only if lawsuit', correctClass: 'Deep Archive', hint: 'Keep forever, almost never accessed' },
  { id: 8, name: 'Archive Manager', emoji: '🗃️', dataDescription: 'Decade-old backup tapes data', frequency: 'Virtually never', correctClass: 'Deep Archive', hint: 'Decades old, absolute minimum cost' },
];

export default function StorageClassShop() {
  const router = useRouter();
  const { hearts, addXP, addCoins, removeHeart, resetHearts, completeLevel, unlockBadge, addScore } = useGameStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'complete' | 'gameover'>('playing');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [budget, setBudget] = useState(100);
  const [satisfaction, setSatisfaction] = useState(100);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Initialize customers
  useEffect(() => {
    const shuffled = [...ALL_CUSTOMERS].sort(() => Math.random() - 0.5);
    setCustomers(shuffled.slice(0, GAME_CONFIG.STORAGE_CLASS_CUSTOMERS));
  }, []);

  useEffect(() => {
    if (hearts <= 0 && gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [hearts, gameState]);

  const handleClassSelect = (storageClass: StorageClass) => {
    if (gameState !== 'playing' || !customers[currentIndex]) return;

    const customer = customers[currentIndex];
    const isCorrect = customer.correctClass === storageClass;

    if (isCorrect) {
      playSound('correct');
      playSound('coinCollect');
      addXP(GAME_CONFIG.XP_PER_CORRECT);
      addCoins(GAME_CONFIG.COINS_PER_CORRECT);
      addScore(15);
      setCorrectCount((prev) => prev + 1);
      setSatisfaction((prev) => Math.min(100, prev + 5));
      setFeedback({ correct: true, message: `Perfect! ${customer.dataDescription} belongs in ${storageClass}!` });
    } else {
      playSound('wrong');
      playSound('damage');
      removeHeart();
      setWrongCount((prev) => prev + 1);
      setBudget((prev) => Math.max(0, prev - 15));
      setSatisfaction((prev) => Math.max(0, prev - 15));
      setFeedback({ correct: false, message: `Wrong! ${customer.dataDescription} should be in ${customer.correctClass}. ${customer.hint}` });
    }

    setShowHint(false);

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= customers.length) {
        playSound('levelComplete');
        setGameState('complete');
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 1500);
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
    completeLevel(3, s);
    unlockBadge('Storage Strategist');
  };

  useEffect(() => {
    if (gameState === 'complete') handleComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleRetry = () => {
    resetHearts();
    const shuffled = [...ALL_CUSTOMERS].sort(() => Math.random() - 0.5);
    setCustomers(shuffled.slice(0, GAME_CONFIG.STORAGE_CLASS_CUSTOMERS));
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setBudget(100);
    setSatisfaction(100);
    setGameState('playing');
    setFeedback(null);
  };

  const total = correctCount + wrongCount;
  const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
  const stars = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;
  const currentCustomer = customers[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-emerald-950/20 to-gray-950">
      <PlayerStatsBar />

      <div className="pt-16 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🏪 <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Storage Class Shop</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Assign the right storage class • Customer {currentIndex + 1}/{customers.length}</p>
          </div>
          {gameState === 'playing' && (
            <Timer duration={GAME_CONFIG.STORAGE_CLASS_TIME} onTimeUp={handleTimeUp} />
          )}
        </div>

        {/* Meters */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-green-400 font-medium">💰 Budget</span>
              <span className="text-gray-400">{budget}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-green-500 rounded-full" animate={{ width: `${budget}%` }} />
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-400 font-medium">😊 Satisfaction</span>
              <span className="text-gray-400">{satisfaction}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div className="h-full bg-blue-500 rounded-full" animate={{ width: `${satisfaction}%` }} />
            </div>
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 p-3 rounded-xl text-sm font-medium ${
                feedback.correct ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customer Card */}
        <AnimatePresence mode="wait">
          {currentCustomer && gameState === 'playing' && (
            <motion.div
              key={currentCustomer.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="bg-gray-900/80 rounded-2xl border border-gray-800 p-6 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-3xl">
                  {currentCustomer.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{currentCustomer.name}</h3>
                  <p className="text-sm text-gray-300 mt-1">&ldquo;I need to store: <strong>{currentCustomer.dataDescription}</strong>&rdquo;</p>
                  <p className="text-xs text-gray-500 mt-2">Access frequency: <span className="text-gray-300">{currentCustomer.frequency}</span></p>
                </div>
              </div>

              {showHint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded-lg"
                >
                  💡 Hint: {currentCustomer.hint}
                </motion.p>
              )}

              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Need a hint?
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Storage Class Shelves */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {STORAGE_CLASSES.map((sc) => (
            <motion.button
              key={sc.name}
              onClick={() => handleClassSelect(sc.name)}
              disabled={gameState !== 'playing' || !!feedback}
              className={`p-4 rounded-xl bg-gradient-to-br ${sc.color} text-white text-center transition-all disabled:opacity-50 shadow-lg hover:shadow-xl`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl block mb-1">{sc.emoji}</span>
              <span className="text-xs font-bold block">{sc.name}</span>
              <span className="text-[10px] opacity-80 block mt-1">{sc.description}</span>
              <div className="flex justify-between mt-2 text-[10px] opacity-70">
                <span>Cost: {sc.cost}</span>
                <span>{sc.speed}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Learning Tip */}
        <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/30">
          <p className="text-[11px] text-emerald-400">
            💡 <strong>Cloud Concept:</strong> <strong>Storage Classes</strong> control cost and retrieval speed. <strong>Standard</strong> = fast & expensive. <strong>Deep Archive</strong> = cheapest but slowest. Choose based on how often data is accessed!
          </p>
        </div>
      </div>

      <LevelCompleteModal
        isOpen={gameState === 'complete'}
        levelName="Storage Class Shop"
        score={correctCount * 15}
        maxScore={customers.length * 15}
        xpEarned={GAME_CONFIG.XP_PER_LEVEL_COMPLETE + correctCount * GAME_CONFIG.XP_PER_CORRECT}
        coinsEarned={GAME_CONFIG.COINS_PER_LEVEL_COMPLETE + correctCount * GAME_CONFIG.COINS_PER_CORRECT}
        stars={stars}
        onNextLevel={() => router.push('/level/4')}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />

      <GameOverModal
        isOpen={gameState === 'gameover'}
        reason={hearts <= 0 ? 'hearts' : 'time'}
        levelName="Storage Class Shop"
        score={correctCount * 15}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />
    </div>
  );
}
