'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@/lib/gameConfig';
import { playSound } from '@/lib/sounds';
import Timer from '@/components/ui/Timer';
import LevelCompleteModal from '@/components/ui/LevelCompleteModal';
import GameOverModal from '@/components/ui/GameOverModal';
import PlayerStatsBar from '@/components/ui/PlayerStatsBar';
import { useRouter } from 'next/navigation';

interface FallingFile {
  id: number;
  name: string;
  type: 'image' | 'video' | 'document' | 'backup' | 'log';
  emoji: string;
  x: number;
  y: number;
  speed: number;
  metadata: string;
  size: string;
}

const FILE_TYPES = {
  image: { emoji: '🖼️', color: 'from-pink-500 to-rose-600', label: 'Images' },
  video: { emoji: '🎬', color: 'from-purple-500 to-violet-600', label: 'Videos' },
  document: { emoji: '📄', color: 'from-blue-500 to-cyan-600', label: 'Documents' },
  backup: { emoji: '💾', color: 'from-green-500 to-emerald-600', label: 'Backups' },
  log: { emoji: '📋', color: 'from-orange-500 to-amber-600', label: 'Logs' },
};

const FILE_POOL: Omit<FallingFile, 'id' | 'x' | 'y' | 'speed'>[] = [
  { name: 'photo.jpg', type: 'image', emoji: '🖼️', metadata: 'JPEG, RGB', size: '2.4 MB' },
  { name: 'avatar.png', type: 'image', emoji: '🖼️', metadata: 'PNG, RGBA', size: '1.1 MB' },
  { name: 'thumbnail.webp', type: 'image', emoji: '🖼️', metadata: 'WebP', size: '340 KB' },
  { name: 'lecture.mp4', type: 'video', emoji: '🎬', metadata: 'MP4, H.264', size: '450 MB' },
  { name: 'tutorial.mov', type: 'video', emoji: '🎬', metadata: 'MOV, ProRes', size: '1.2 GB' },
  { name: 'clip.avi', type: 'video', emoji: '🎬', metadata: 'AVI', size: '120 MB' },
  { name: 'report.pdf', type: 'document', emoji: '📄', metadata: 'PDF, v1.7', size: '856 KB' },
  { name: 'notes.docx', type: 'document', emoji: '📄', metadata: 'DOCX', size: '245 KB' },
  { name: 'readme.txt', type: 'document', emoji: '📄', metadata: 'Plain text', size: '12 KB' },
  { name: 'db-backup.sql', type: 'backup', emoji: '💾', metadata: 'SQL dump', size: '5.2 GB' },
  { name: 'snapshot.tar.gz', type: 'backup', emoji: '💾', metadata: 'Compressed', size: '3.8 GB' },
  { name: 'system.bak', type: 'backup', emoji: '💾', metadata: 'System backup', size: '8.1 GB' },
  { name: 'access.log', type: 'log', emoji: '📋', metadata: 'Access log', size: '45 MB' },
  { name: 'error.log', type: 'log', emoji: '📋', metadata: 'Error log', size: '12 MB' },
  { name: 'audit.log', type: 'log', emoji: '📋', metadata: 'Audit trail', size: '78 MB' },
];

export default function BucketSortingGame() {
  const router = useRouter();
  const { hearts, addXP, addCoins, removeHeart, resetHearts, completeLevel, unlockBadge, addScore } = useGameStore();
  const [files, setFiles] = useState<FallingFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<FallingFile | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'complete' | 'gameover'>('playing');
  const [feedbackFlash, setFeedbackFlash] = useState<{ type: 'correct' | 'wrong'; bucket: string } | null>(null);
  const fileIdRef = useRef(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const spawnFile = useCallback(() => {
    const template = FILE_POOL[Math.floor(Math.random() * FILE_POOL.length)];
    const newFile: FallingFile = {
      ...template,
      id: fileIdRef.current++,
      x: 10 + Math.random() * 70,
      y: -10,
      speed: 0.3 + Math.random() * 0.4,
    };
    setFiles((prev) => [...prev.slice(-8), newFile]);
  }, []);

  // Spawn files periodically
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(spawnFile, 2000);
    spawnFile(); // spawn first one immediately
    return () => clearInterval(interval);
  }, [gameState, spawnFile]);

  // Animate falling
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev
          .map((f) => ({ ...f, y: f.y + f.speed }))
          .filter((f) => f.y < 75) // remove when past buckets
      );
    }, 50);
    return () => clearInterval(interval);
  }, [gameState]);

  // Check game over from hearts
  useEffect(() => {
    if (hearts <= 0 && gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [hearts, gameState]);

  const handleBucketClick = useCallback(
    (bucketType: string) => {
      if (!selectedFile || gameState !== 'playing') return;

      setTotalAttempts((prev) => prev + 1);

      if (selectedFile.type === bucketType) {
        playSound('correct');
        playSound('coinCollect');
        addXP(GAME_CONFIG.XP_PER_CORRECT);
        addCoins(GAME_CONFIG.COINS_PER_CORRECT);
        addScore(10);
        setCorrectCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= GAME_CONFIG.BUCKET_SORT_REQUIRED) {
            setTimeout(() => {
              playSound('levelComplete');
              setGameState('complete');
            }, 500);
          }
          return newCount;
        });
        setFeedbackFlash({ type: 'correct', bucket: bucketType });
      } else {
        playSound('wrong');
        playSound('damage');
        removeHeart();
        setWrongCount((prev) => prev + 1);
        setFeedbackFlash({ type: 'wrong', bucket: bucketType });
      }

      setFiles((prev) => prev.filter((f) => f.id !== selectedFile.id));
      setSelectedFile(null);

      setTimeout(() => setFeedbackFlash(null), 500);
    },
    [selectedFile, gameState, addXP, addCoins, removeHeart, addScore]
  );

  const handleTimeUp = useCallback(() => {
    if (gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [gameState]);

  const handleComplete = () => {
    const accuracy = totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;
    const stars = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;
    addXP(GAME_CONFIG.XP_PER_LEVEL_COMPLETE);
    addCoins(GAME_CONFIG.COINS_PER_LEVEL_COMPLETE);
    completeLevel(1, stars);
    unlockBadge('Bucket Builder');
  };

  useEffect(() => {
    if (gameState === 'complete') {
      handleComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleRetry = () => {
    resetHearts();
    setFiles([]);
    setSelectedFile(null);
    setCorrectCount(0);
    setWrongCount(0);
    setTotalAttempts(0);
    setGameState('playing');
    fileIdRef.current = 0;
  };

  const accuracy = totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;
  const stars = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-indigo-950/30 to-gray-950">
      <PlayerStatsBar />

      <div className="pt-16 px-4 max-w-5xl mx-auto">
        {/* Level Header */}
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🏝️ <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Bucket Island: Sorting Game</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Sort files into the correct buckets • {correctCount}/{GAME_CONFIG.BUCKET_SORT_REQUIRED} complete</p>
          </div>
          {gameState === 'playing' && (
            <Timer duration={GAME_CONFIG.BUCKET_SORT_TIME} onTimeUp={handleTimeUp} />
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            animate={{ width: `${(correctCount / GAME_CONFIG.BUCKET_SORT_REQUIRED) * 100}%` }}
          />
        </div>

        {/* Game Area */}
        <div ref={gameAreaRef} className="relative w-full h-[400px] bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden mb-4">
          {/* Falling Files */}
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                className={`absolute cursor-pointer select-none ${
                  selectedFile?.id === file.id ? 'ring-2 ring-yellow-400 z-20' : 'z-10'
                }`}
                style={{ left: `${file.x}%`, top: `${file.y}%` }}
                onClick={() => setSelectedFile(file)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <div className={`px-3 py-2 rounded-xl bg-gradient-to-br ${FILE_TYPES[file.type].color} shadow-lg flex items-center gap-2 min-w-[120px]`}>
                  <span className="text-lg">{file.emoji}</span>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[100px]">{file.name}</p>
                    <p className="text-[10px] text-white/70">{file.size}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Info Panel */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 border border-gray-700 z-30 max-w-[200px]"
              >
                <p className="text-xs text-gray-400">Selected File</p>
                <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] text-gray-500">Key: <span className="text-gray-300">objects/{selectedFile.type}/{selectedFile.name}</span></p>
                  <p className="text-[10px] text-gray-500">Metadata: <span className="text-gray-300">{selectedFile.metadata}</span></p>
                  <p className="text-[10px] text-gray-500">Size: <span className="text-gray-300">{selectedFile.size}</span></p>
                </div>
                <p className="text-[10px] text-indigo-400 mt-2">👇 Click a bucket below to sort</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {files.length === 0 && gameState === 'playing' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-600 text-sm animate-pulse">Files incoming...</p>
            </div>
          )}
        </div>

        {/* Buckets */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {Object.entries(FILE_TYPES).map(([type, config]) => (
            <motion.button
              key={type}
              onClick={() => handleBucketClick(type)}
              className={`relative p-3 sm:p-4 rounded-xl border-2 border-dashed transition-all ${
                selectedFile
                  ? 'border-gray-600 hover:border-white cursor-pointer'
                  : 'border-gray-800 cursor-default opacity-50'
              } ${
                feedbackFlash?.bucket === type
                  ? feedbackFlash.type === 'correct'
                    ? 'bg-green-500/20 border-green-400'
                    : 'bg-red-500/20 border-red-400'
                  : 'bg-gray-900/50'
              }`}
              whileHover={selectedFile ? { scale: 1.05 } : {}}
              whileTap={selectedFile ? { scale: 0.95 } : {}}
              animate={
                feedbackFlash?.bucket === type && feedbackFlash.type === 'wrong'
                  ? { x: [0, -5, 5, -5, 5, 0] }
                  : {}
              }
            >
              <div className="text-center">
                <span className="text-2xl sm:text-3xl block mb-1">{config.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-300">{config.label}</span>
                <div className={`mt-1 h-1 rounded-full bg-gradient-to-r ${config.color} opacity-50`} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Learning Tip */}
        <div className="mt-4 p-3 bg-indigo-950/30 rounded-xl border border-indigo-900/30">
          <p className="text-[11px] text-indigo-400">
            💡 <strong>Cloud Concept:</strong> A <strong>Bucket</strong> is a container for storing objects. Each <strong>Object</strong> has a name (key), metadata, and a size. Organizing files into the right buckets keeps your cloud storage efficient!
          </p>
        </div>
      </div>

      {/* Modals */}
      <LevelCompleteModal
        isOpen={gameState === 'complete'}
        levelName="Bucket Island: Sorting Game"
        score={correctCount * 10}
        maxScore={GAME_CONFIG.BUCKET_SORT_REQUIRED * 10}
        xpEarned={GAME_CONFIG.XP_PER_LEVEL_COMPLETE + correctCount * GAME_CONFIG.XP_PER_CORRECT}
        coinsEarned={GAME_CONFIG.COINS_PER_LEVEL_COMPLETE + correctCount * GAME_CONFIG.COINS_PER_CORRECT}
        stars={stars}
        onNextLevel={() => router.push('/level/2')}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />

      <GameOverModal
        isOpen={gameState === 'gameover'}
        reason={hearts <= 0 ? 'hearts' : 'time'}
        levelName="Bucket Island: Sorting Game"
        score={correctCount * 10}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />
    </div>
  );
}
