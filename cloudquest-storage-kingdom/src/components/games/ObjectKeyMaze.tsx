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
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type CellType = 'wall' | 'path' | 'door' | 'start' | 'end' | 'player';

interface Door {
  row: number;
  col: number;
  question: string;
  correctKey: string;
  options: string[];
  solved: boolean;
}

const MAZE_LAYOUT: CellType[][] = [
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
  ['wall', 'start', 'path', 'path', 'wall', 'path', 'path', 'path', 'wall'],
  ['wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
  ['wall', 'path', 'door', 'path', 'door', 'path', 'wall', 'path', 'wall'],
  ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
  ['wall', 'path', 'path', 'door', 'path', 'path', 'door', 'path', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'wall'],
  ['wall', 'path', 'path', 'door', 'path', 'path', 'path', 'path', 'wall'],
  ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'end', 'wall'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

const DOORS: Door[] = [
  {
    row: 3, col: 2,
    question: 'Find the GCS object name for the profile photo of student 101',
    correctKey: 'students/101/profile.jpg',
    options: ['students/101/profile.jpg', 'photos/student101.jpg', 'profile/101.png', 'student-101-pic.jpg'],
    solved: false,
  },
  {
    row: 3, col: 4,
    question: 'Find the GCS object name for course cs201, assignment 3',
    correctKey: 'courses/cs201/assignments/3/submission.pdf',
    options: ['courses/cs201/assignments/3/submission.pdf', 'homework/cs201-3.pdf', 'cs201/hw3.pdf', 'assignments/3/cs201.pdf'],
    solved: false,
  },
  {
    row: 5, col: 3,
    question: 'Find the GCS object name for Week 5 of Data Science',
    correctKey: 'lectures/data-science/week-5/video.mp4',
    options: ['videos/ds-week5.mp4', 'lectures/data-science/week-5/video.mp4', 'data-science/5/lecture.mp4', 'week5-ds-lecture.mp4'],
    solved: false,
  },
  {
    row: 5, col: 6,
    question: 'Find the GCS object name for the database backup from January 2024',
    correctKey: 'backups/db/2024/01/full-backup.sql',
    options: ['backups/db/2024/01/full-backup.sql', 'backup-jan-2024.sql', 'db/backup/202401.sql', 'jan2024backup.sql'],
    solved: false,
  },
  {
    row: 7, col: 3,
    question: 'Find the GCS object name for the API server access log on March 15',
    correctKey: 'logs/api-server/2024/03/15/access.log',
    options: ['api-logs-march15.log', 'server/logs/march15.log', 'logs/api-server/2024/03/15/access.log', 'access-log-031524.log'],
    solved: false,
  },
];

export default function ObjectKeyMaze() {
  const router = useRouter();
  const { hearts, addXP, addCoins, removeHeart, resetHearts, completeLevel, unlockBadge, addScore } = useGameStore();
  const [playerPos, setPlayerPos] = useState({ row: 1, col: 1 });
  const [doors, setDoors] = useState<Door[]>(DOORS.map((d) => ({ ...d })));
  const [activeDoor, setActiveDoor] = useState<Door | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'complete' | 'gameover'>('playing');
  const [solvedCount, setSolvedCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [moveHistory, setMoveHistory] = useState<Array<{ row: number; col: number }>>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'correct' | 'wrong' } | null>(null);

  const movePlayer = useCallback(
    (dRow: number, dCol: number) => {
      if (gameState !== 'playing' || activeDoor) return;

      const newRow = playerPos.row + dRow;
      const newCol = playerPos.col + dCol;

      if (newRow < 0 || newRow >= MAZE_LAYOUT.length || newCol < 0 || newCol >= MAZE_LAYOUT[0].length) return;

      const cell = MAZE_LAYOUT[newRow][newCol];
      if (cell === 'wall') return;

      if (cell === 'door') {
        const door = doors.find((d) => d.row === newRow && d.col === newCol);
        if (door && !door.solved) {
          setActiveDoor(door);
          return;
        }
      }

      if (cell === 'end') {
        if (doors.every((d) => d.solved)) {
          playSound('levelComplete');
          setGameState('complete');
        }
      }

      setMoveHistory((prev) => [...prev, playerPos]);
      setPlayerPos({ row: newRow, col: newCol });
    },
    [playerPos, gameState, activeDoor, doors]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': movePlayer(-1, 0); break;
        case 'ArrowDown': case 's': case 'S': movePlayer(1, 0); break;
        case 'ArrowLeft': case 'a': case 'A': movePlayer(0, -1); break;
        case 'ArrowRight': case 'd': case 'D': movePlayer(0, 1); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [movePlayer]);

  useEffect(() => {
    if (hearts <= 0 && gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [hearts, gameState]);

  const handleDoorAnswer = (selectedKey: string) => {
    if (!activeDoor) return;
    setTotalAttempts((prev) => prev + 1);

    if (selectedKey === activeDoor.correctKey) {
      playSound('correct');
      playSound('coinCollect');
      addXP(GAME_CONFIG.XP_PER_CORRECT);
      addCoins(GAME_CONFIG.COINS_PER_CORRECT);
      addScore(20);
      setDoors((prev) =>
        prev.map((d) => d.row === activeDoor.row && d.col === activeDoor.col ? { ...d, solved: true } : d)
      );
      setSolvedCount((prev) => prev + 1);
      setPlayerPos({ row: activeDoor.row, col: activeDoor.col });
      setFeedbackMsg({ text: '✅ Correct object name! Door opened!', type: 'correct' });
    } else {
      playSound('wrong');
      playSound('damage');
      removeHeart();
      setWrongCount((prev) => prev + 1);
      setFeedbackMsg({ text: '❌ Wrong object name! Try again.', type: 'wrong' });
      // Send player back
      if (moveHistory.length > 0) {
        setPlayerPos(moveHistory[moveHistory.length - 1]);
      }
    }

    setActiveDoor(null);
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  const handleTimeUp = useCallback(() => {
    if (gameState === 'playing') {
      playSound('gameOver');
      setGameState('gameover');
    }
  }, [gameState]);

  const handleComplete = () => {
    const accuracy = totalAttempts > 0 ? (solvedCount / totalAttempts) * 100 : 0;
    const s = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;
    addXP(GAME_CONFIG.XP_PER_LEVEL_COMPLETE);
    addCoins(GAME_CONFIG.COINS_PER_LEVEL_COMPLETE);
    completeLevel(2, s);
    unlockBadge('Object Name Master');
  };

  useEffect(() => {
    if (gameState === 'complete') handleComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleRetry = () => {
    resetHearts();
    setPlayerPos({ row: 1, col: 1 });
    setDoors(DOORS.map((d) => ({ ...d })));
    setActiveDoor(null);
    setSolvedCount(0);
    setWrongCount(0);
    setTotalAttempts(0);
    setMoveHistory([]);
    setGameState('playing');
  };

  const accuracy = totalAttempts > 0 ? (solvedCount / totalAttempts) * 100 : 0;
  const stars = accuracy >= GAME_CONFIG.STAR_THRESHOLDS.THREE ? 3 : accuracy >= GAME_CONFIG.STAR_THRESHOLDS.TWO ? 2 : 1;

  const getCellColor = (cell: CellType, row: number, col: number) => {
    if (playerPos.row === row && playerPos.col === col) return 'bg-yellow-400 shadow-lg shadow-yellow-400/50';
    const door = doors.find((d) => d.row === row && d.col === col);
    if (cell === 'door' && door) return door.solved ? 'bg-green-600/60' : 'bg-red-500/60 animate-pulse';
    if (cell === 'end') return 'bg-emerald-500/80 animate-pulse';
    if (cell === 'start') return 'bg-blue-500/50';
    if (cell === 'wall') return 'bg-gray-800';
    return 'bg-gray-700/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-cyan-950/20 to-gray-950">
      <PlayerStatsBar />

      <div className="pt-16 px-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🔑 <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">GCS Object Name Maze</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Navigate the maze using correct GCS object names • {solvedCount}/{GAME_CONFIG.MAZE_DOORS_REQUIRED} doors</p>
          </div>
          {gameState === 'playing' && (
            <Timer duration={GAME_CONFIG.MAZE_TIME} onTimeUp={handleTimeUp} />
          )}
        </div>

        {/* Progress */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" animate={{ width: `${(solvedCount / GAME_CONFIG.MAZE_DOORS_REQUIRED) * 100}%` }} />
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-3 p-2 rounded-lg text-center text-sm font-medium ${
                feedbackMsg.type === 'correct' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {feedbackMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Maze Grid */}
        <div className="flex justify-center mb-4">
          <div className="inline-grid gap-1 p-3 bg-gray-900/80 rounded-2xl border border-gray-800" style={{ gridTemplateColumns: `repeat(${MAZE_LAYOUT[0].length}, minmax(0, 1fr))` }}>
            {MAZE_LAYOUT.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <motion.div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-xs sm:text-sm ${getCellColor(cell, rIdx, cIdx)} transition-colors`}
                  animate={playerPos.row === rIdx && playerPos.col === cIdx ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  {playerPos.row === rIdx && playerPos.col === cIdx && '🧙'}
                  {cell === 'door' && !(playerPos.row === rIdx && playerPos.col === cIdx) && (
                    doors.find((d) => d.row === rIdx && d.col === cIdx)?.solved ? '🚪' : '🔒'
                  )}
                  {cell === 'end' && !(playerPos.row === rIdx && playerPos.col === cIdx) && '⭐'}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="grid grid-cols-3 gap-1 w-32">
            <div />
            <button onClick={() => movePlayer(-1, 0)} className="p-3 bg-gray-800 rounded-lg active:bg-gray-700 flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
            <div />
            <button onClick={() => movePlayer(0, -1)} className="p-3 bg-gray-800 rounded-lg active:bg-gray-700 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => movePlayer(1, 0)} className="p-3 bg-gray-800 rounded-lg active:bg-gray-700 flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => movePlayer(0, 1)} className="p-3 bg-gray-800 rounded-lg active:bg-gray-700 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mb-4 hidden sm:block">Use Arrow Keys or WASD to move</p>

        {/* Door Dialog */}
        <AnimatePresence>
          {activeDoor && (
            <motion.div
              className="fixed inset-0 z-[80] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
              <motion.div
                className="relative z-10 bg-gray-900 border border-yellow-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <div className="text-center mb-4">
                  <span className="text-4xl mb-2 block">🔒</span>
                  <h3 className="text-lg font-bold text-white">Door Locked!</h3>
                  <p className="text-sm text-gray-400 mt-2">{activeDoor.question}</p>
                  <p className="text-xs text-yellow-400 mt-1">Choose the correct GCS object name:</p>
                </div>
                <div className="space-y-2">
                  {activeDoor.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleDoorAnswer(option)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-yellow-500/50 transition-all text-sm font-mono text-gray-300 hover:text-white"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Learning Tip */}
        <div className="p-3 bg-yellow-950/30 rounded-xl border border-yellow-900/30">
          <p className="text-[11px] text-yellow-400">
            💡 <strong>GCP Concept:</strong> A <strong>GCS object name</strong> uniquely identifies an object within a bucket. Prefixes use folder-like paths (e.g., <code className="text-yellow-300">students/101/profile.jpg</code>) to organize data logically.
          </p>
        </div>
      </div>

      <LevelCompleteModal
        isOpen={gameState === 'complete'}
        levelName="GCS Object Name Maze"
        levelOrder={2}
        score={solvedCount * 20}
        maxScore={GAME_CONFIG.MAZE_DOORS_REQUIRED * 20}
        xpEarned={GAME_CONFIG.XP_PER_LEVEL_COMPLETE + solvedCount * GAME_CONFIG.XP_PER_CORRECT}
        coinsEarned={GAME_CONFIG.COINS_PER_LEVEL_COMPLETE + solvedCount * GAME_CONFIG.COINS_PER_CORRECT}
        stars={stars}
        onNextLevel={() => router.push('/level/3')}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />

      <GameOverModal
        isOpen={gameState === 'gameover'}
        reason={hearts <= 0 ? 'hearts' : 'time'}
        levelName="GCS Object Name Maze"
        score={solvedCount * 20}
        onRetry={handleRetry}
        onBackToMap={() => router.push('/map')}
      />
    </div>
  );
}
