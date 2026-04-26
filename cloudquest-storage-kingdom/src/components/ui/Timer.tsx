'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isPaused?: boolean;
  onTick?: (remaining: number) => void;
}

export default function Timer({ duration, onTimeUp, isPaused = false, onTick }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 10;

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, handleTimeUp, onTick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={isUrgent ? { scale: [1, 1.2, 1], color: ['#ef4444', '#fbbf24', '#ef4444'] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-500' : 'text-blue-400'}`} />
      </motion.div>
      <div className="flex flex-col min-w-[80px]">
        <span className={`text-sm font-mono font-bold tabular-nums ${isUrgent ? 'text-red-400' : 'text-blue-300'}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
