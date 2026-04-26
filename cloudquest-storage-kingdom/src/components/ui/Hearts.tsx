'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartsProps {
  current: number;
  max: number;
  onDamage?: boolean;
}

export default function Hearts({ current, max, onDamage }: HeartsProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <AnimatePresence key={i} mode="wait">
          {i < current ? (
            <motion.div
              key={`heart-${i}-full`}
              initial={onDamage && i === current - 1 ? { scale: 1.5 } : false}
              animate={{ scale: 1 }}
              exit={{ scale: 0, rotate: -30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              <Heart
                className="w-7 h-7 text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`heart-${i}-empty`}
              initial={{ scale: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
            >
              <Heart className="w-7 h-7 text-red-900" />
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}
