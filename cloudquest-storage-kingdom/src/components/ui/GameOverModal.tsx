'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Map } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  reason: 'hearts' | 'time';
  levelName: string;
  score: number;
  onRetry: () => void;
  onBackToMap: () => void;
}

export default function GameOverModal({ isOpen, reason, levelName, score, onRetry, onBackToMap }: GameOverModalProps) {
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
            className="relative z-10 flex flex-col items-center gap-5 p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-red-950/30 border border-red-500/30 shadow-2xl shadow-red-500/10 max-w-sm w-full mx-4"
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.span
              className="text-6xl"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              💔
            </motion.span>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-400">Game Over</h2>
              <p className="text-sm text-gray-400 mt-1">{levelName}</p>
              <p className="text-xs text-gray-500 mt-2">
                {reason === 'hearts'
                  ? 'You ran out of hearts!'
                  : 'Time\'s up!'}
              </p>
            </div>

            <div className="w-full bg-gray-800/50 rounded-xl p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Score reached</span>
                <span className="text-white font-bold">{score}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold hover:from-red-500 hover:to-orange-500 transition-all shadow-lg shadow-red-500/20"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={onBackToMap}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
