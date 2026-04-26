'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CoinsDisplayProps {
  coins: number;
}

export default function CoinsDisplay({ coins }: CoinsDisplayProps) {
  const [prevCoins, setPrevCoins] = useState(coins);
  const [showDelta, setShowDelta] = useState(false);
  const delta = coins - prevCoins;

  useEffect(() => {
    if (coins !== prevCoins) {
      setShowDelta(true);
      const timer = setTimeout(() => {
        setShowDelta(false);
        setPrevCoins(coins);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [coins, prevCoins]);

  return (
    <div className="relative flex items-center gap-1.5">
      <motion.div
        animate={showDelta ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Coins className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.7)]" />
      </motion.div>
      <span className="text-sm font-bold text-yellow-300 tabular-nums min-w-[40px]">
        {coins}
      </span>
      <AnimatePresence>
        {showDelta && delta > 0 && (
          <motion.span
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -20 }}
            exit={{ opacity: 0 }}
            className="absolute -top-4 right-0 text-xs font-bold text-green-400"
          >
            +{delta}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
