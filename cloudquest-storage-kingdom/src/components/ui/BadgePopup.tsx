'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface BadgePopupProps {
  isOpen: boolean;
  badgeName: string;
  badgeIcon: string;
  badgeDescription: string;
  onClose: () => void;
}

export default function BadgePopup({ isOpen, badgeName, badgeIcon, badgeDescription, onClose }: BadgePopupProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-yellow-500/30 shadow-2xl shadow-yellow-500/20 max-w-sm w-full mx-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            {/* Sparkle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.cos(i * 45 * (Math.PI / 180)) * 100],
                  y: [0, Math.sin(i * 45 * (Math.PI / 180)) * 100],
                }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            ))}

            <motion.span
              className="text-xl font-bold text-yellow-400 uppercase tracking-widest"
              animate={{ opacity: [0, 1] }}
              transition={{ delay: 0.3 }}
            >
              Badge Unlocked!
            </motion.span>

            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-b from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/50 flex items-center justify-center shadow-lg shadow-yellow-500/20"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="text-5xl">{badgeIcon}</span>
            </motion.div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">{badgeName}</h3>
              <p className="text-sm text-gray-400 mt-1">{badgeDescription}</p>
            </div>

            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors font-medium text-sm"
            >
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
