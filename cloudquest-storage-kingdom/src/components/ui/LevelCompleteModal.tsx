'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, RotateCcw } from 'lucide-react';

interface LevelCompleteModalProps {
  isOpen: boolean;
  levelName: string;
  score: number;
  maxScore: number;
  xpEarned: number;
  coinsEarned: number;
  stars: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onBackToMap: () => void;
  isLastLevel?: boolean;
}

export default function LevelCompleteModal({
  isOpen,
  levelName,
  score,
  maxScore,
  xpEarned,
  coinsEarned,
  stars,
  onNextLevel,
  onRetry,
  onBackToMap,
  isLastLevel = false,
}: LevelCompleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-5 p-8 rounded-2xl bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 max-w-md w-full mx-4"
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Header */}
            <motion.div
              className="text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-5xl mb-2 block">🎉</span>
              <h2 className="text-2xl font-bold text-white">Level Complete!</h2>
              <p className="text-sm text-gray-400 mt-1">{levelName}</p>
            </motion.div>

            {/* Stars */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + s * 0.2, type: 'spring', stiffness: 300 }}
                >
                  <Star
                    className={`w-10 h-10 ${
                      s <= stars
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]'
                        : 'text-gray-700'
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Score */}
            <div className="w-full bg-gray-800/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Score</span>
                <span className="text-white font-bold">{score}/{maxScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-indigo-400">XP Earned</span>
                <motion.span
                  className="text-indigo-300 font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  +{xpEarned}
                </motion.span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-400">Coins Earned</span>
                <motion.span
                  className="text-yellow-300 font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  +{coinsEarned}
                </motion.span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full">
              {!isLastLevel && (
                <button
                  onClick={onNextLevel}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                >
                  Next Level <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={onRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" /> Retry
                </button>
                <button
                  onClick={onBackToMap}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  🗺️ Map
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
