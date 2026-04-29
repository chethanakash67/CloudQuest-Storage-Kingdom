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
import { DollarSign, Zap } from 'lucide-react';

type StorageClass = 'Standard' | 'Nearline' | 'Coldline' | 'Archive';

interface DataCard {
  id: number;
  name: string;
  emoji: string;
  description: string;
  accessFrequency: string;
  size: string;
  correctClass: StorageClass;
  assigned: StorageClass | null;
}

const COST_MAP: Record<StorageClass, number> = {
  'Standard': 25,
  'Nearline': 16,
  'Coldline': 9,
  'Archive': 4,
};

const DATA_CARDS_POOL: Omit<DataCard, 'id' | 'assigned'>[] = [
  { name: 'User Avatars', emoji: '👤', description: 'GCS profile images loaded on every login', accessFrequency: 'High (daily)', size: '50 GB', correctClass: 'Standard' },
  { name: 'Course Videos', emoji: '🎥', description: 'Active course media streamed from Cloud Storage', accessFrequency: 'High (daily)', size: '500 GB', correctClass: 'Standard' },
  { name: 'Previous Exams', emoji: '📝', description: 'Past exam papers reviewed each month', accessFrequency: 'Medium (monthly)', size: '20 GB', correctClass: 'Nearline' },
  { name: 'Billing Exports', emoji: '🧾', description: 'Monthly BigQuery billing exports saved to GCS', accessFrequency: 'Medium (monthly)', size: '35 GB', correctClass: 'Nearline' },
  { name: 'Audit Logs', emoji: '📊', description: 'Server logs from previous quarter', accessFrequency: 'Low (quarterly)', size: '100 GB', correctClass: 'Coldline' },
  { name: 'Research Snapshots', emoji: '🔬', description: 'Experiment data checked a few times per year', accessFrequency: 'Low (semiannual)', size: '240 GB', correctClass: 'Coldline' },
  { name: 'Tax Records', emoji: '📑', description: 'Financial records kept for compliance', accessFrequency: 'Rare (emergency only)', size: '30 GB', correctClass: 'Archive' },
  { name: 'Alumni Records', emoji: '🎓', description: 'Graduate records retained for a decade', accessFrequency: 'Extremely rare', size: '150 GB', correctClass: 'Archive' },
];

export default function CostSpeedBattle() {
  const router = useRouter();
  const { hearts, addXP, addCoins, removeHeart, resetHearts, completeLevel, unlockBadge, addScore } = useGameStore();
  const [cards, setCards] = useState<DataCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<DataCard | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'review' | 'complete' | 'gameover'>('playing');
  const [budget, setBudget] = useState(100);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const shuffled = [...DATA_CARDS_POOL].sort(() => Math.random() - 0.5);
    setCards(shuffled.slice(0, GAME_CONFIG.COST_SPEED_CARDS).map((c, i) => ({ ...c, id: i + 1, assigned: null })));
  }, []);

  useEffect(() => {
    if (hearts <= 0 && gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [hearts, gameState]);

  const handleAssign = (storageClass: StorageClass) => {
    if (!selectedCard || gameState !== 'playing') return;

    const cost = COST_MAP[storageClass];
    setTotalCost((prev) => prev + cost);

    setCards((prev) =>
      prev.map((c) => c.id === selectedCard.id ? { ...c, assigned: storageClass } : c)
    );

    if (selectedCard.correctClass === storageClass) {
      playSound('correct');
      addScore(15);
    } else {
      playSound('click');
    }

    setSelectedCard(null);

    // Check if all assigned
    const updatedCards = cards.map((c) => c.id === selectedCard.id ? { ...c, assigned: storageClass } : c);
    if (updatedCards.every((c) => c.assigned !== null)) {
      setTimeout(() => setGameState('review'), 500);
    }
  };

  const handleReviewComplete = () => {
    let correctCount = 0;
    let wrongCount = 0;

    cards.forEach((card) => {
      if (card.assigned === card.correctClass) {
        correctCount++;
        addXP(GAME_CONFIG.XP_PER_CORRECT);
        addCoins(GAME_CONFIG.COINS_PER_CORRECT);
      } else {
        wrongCount++;
        removeHeart();
      }
    });

    if (hearts <= wrongCount) {
      playSound('gameOver');
      setGameState('gameover');
      return;
    }

    playSound('levelComplete');
    const total = correctCount + wrongCount;
    const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
    const s = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;
    addXP(GAME_CONFIG.XP_PER_LEVEL_COMPLETE);
    addCoins(GAME_CONFIG.COINS_PER_LEVEL_COMPLETE);
    completeLevel(4, s);
    unlockBadge('Cost Controller');
    setGameState('complete');
  };

  const handleTimeUp = useCallback(() => {
    if (gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [gameState]);

  const handleRetry = () => {
    resetHearts();
    const shuffled = [...DATA_CARDS_POOL].sort(() => Math.random() - 0.5);
    setCards(shuffled.slice(0, GAME_CONFIG.COST_SPEED_CARDS).map((c, i) => ({ ...c, id: i + 1, assigned: null })));
    setSelectedCard(null);
    setTotalCost(0);
    setBudget(100);
    setGameState('playing');
  };

  const correctCount = cards.filter((c) => c.assigned === c.correctClass).length;
  const accuracy = cards.length > 0 ? (correctCount / cards.length) * 100 : 0;
  const stars = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-orange-950/20 to-gray-950">
      <PlayerStatsBar />

      <div className="pt-16 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              ⚔️ <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Cost vs Access Battle</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Optimize GCS cost using access frequency and retention needs</p>
          </div>
          {gameState === 'playing' && (
            <Timer duration={GAME_CONFIG.COST_SPEED_TIME} onTimeUp={handleTimeUp} />
          )}
        </div>

        {/* Budget & Cost Display */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Total Cost</span>
            </div>
            <span className="text-lg font-bold text-white">{totalCost} credits</span>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">Cards Assigned</span>
            </div>
            <span className="text-lg font-bold text-white">{cards.filter((c) => c.assigned).length}/{cards.length}</span>
          </div>
        </div>

        {/* Review Mode */}
        {gameState === 'review' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <div className="bg-gray-900/80 rounded-2xl border border-orange-500/30 p-6">
              <h3 className="text-lg font-bold text-white mb-4 text-center">📊 Review Your Assignments</h3>
              <div className="space-y-2 mb-4">
                {cards.map((card) => (
                  <div key={card.id} className={`flex items-center justify-between p-3 rounded-xl ${card.assigned === card.correctClass ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                    <div className="flex items-center gap-2">
                      <span>{card.emoji}</span>
                      <span className="text-sm text-white">{card.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium ${card.assigned === card.correctClass ? 'text-green-400' : 'text-red-400'}`}>
                        {card.assigned} {card.assigned === card.correctClass ? '✅' : `❌ (${card.correctClass})`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-3">Correct: {correctCount}/{cards.length} • Cost: {totalCost} credits</p>
                <button
                  onClick={handleReviewComplete}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold hover:from-orange-500 hover:to-red-500 transition-all"
                >
                  Submit Results
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Data Cards */}
        {gameState === 'playing' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {cards.map((card) => (
                <motion.button
                  key={card.id}
                  onClick={() => !card.assigned && setSelectedCard(card)}
                  disabled={!!card.assigned}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    card.assigned
                      ? 'border-gray-700 bg-gray-800/30 opacity-50'
                      : selectedCard?.id === card.id
                      ? 'border-orange-400 bg-orange-500/10 shadow-lg shadow-orange-500/10'
                      : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                  }`}
                  whileHover={!card.assigned ? { scale: 1.02 } : {}}
                  whileTap={!card.assigned ? { scale: 0.98 } : {}}
                >
                  <span className="text-2xl block mb-2">{card.emoji}</span>
                  <h4 className="text-sm font-bold text-white">{card.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">{card.description}</p>
                  <div className="mt-2 flex justify-between text-[10px]">
                    <span className="text-gray-500">Freq: {card.accessFrequency}</span>
                    <span className="text-gray-500">{card.size}</span>
                  </div>
                  {card.assigned && (
                    <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-400">{card.assigned}</span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Storage Class Buttons */}
            {selectedCard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <p className="text-xs text-gray-400 mb-2 text-center">Assign <strong className="text-white">{selectedCard.name}</strong> to:</p>
                <div className="grid grid-cols-4 gap-2">
                  {(['Standard', 'Nearline', 'Coldline', 'Archive'] as StorageClass[]).map((sc) => (
                    <button
                      key={sc}
                      onClick={() => handleAssign(sc)}
                      className="p-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500/50 transition-all text-center"
                    >
                      <span className="text-xs font-bold text-white block">{sc}</span>
                      <span className="text-[10px] text-gray-500 block">{COST_MAP[sc]} credits</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Learning Tip */}
        <div className="p-3 bg-orange-950/30 rounded-xl border border-orange-900/30 mt-4">
          <p className="text-[11px] text-orange-400">
            💡 <strong>GCP Concept:</strong> Choosing a Cloud Storage class is about balancing <strong>storage cost</strong>, <strong>retrieval fees</strong>, and <strong>minimum storage duration</strong>. Hot data belongs in Standard; colder data can move to Nearline, Coldline, or Archive.
          </p>
        </div>
      </div>

      <LevelCompleteModal
        isOpen={gameState === 'complete'}
        levelName="Cost vs Access Battle"
        levelOrder={4}
        score={correctCount * 15}
        maxScore={cards.length * 15}
        xpEarned={GAME_CONFIG.XP_PER_LEVEL_COMPLETE + correctCount * GAME_CONFIG.XP_PER_CORRECT}
        coinsEarned={GAME_CONFIG.COINS_PER_LEVEL_COMPLETE + correctCount * GAME_CONFIG.COINS_PER_CORRECT}
        stars={stars}
        onNextLevel={() => router.push('/level/5')}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />

      <GameOverModal
        isOpen={gameState === 'gameover'}
        reason={hearts <= 0 ? 'hearts' : 'time'}
        levelName="Cost vs Access Battle"
        score={correctCount * 15}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />
    </div>
  );
}
