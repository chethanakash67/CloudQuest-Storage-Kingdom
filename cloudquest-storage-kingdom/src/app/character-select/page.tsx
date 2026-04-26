'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { AVATARS } from '@/lib/gameConfig';
import { playSound } from '@/lib/sounds';

export default function CharacterSelectPage() {
  const router = useRouter();
  const { setPlayer } = useGameStore();
  const [selectedAvatar, setSelectedAvatar] = useState('guardian');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!playerName.trim()) {
      setError('Enter your guardian name!');
      return;
    }
    playSound('levelComplete');
    setPlayer(playerName.trim(), selectedAvatar);
    router.push('/map');
  };

  const selected = AVATARS.find((a) => a.id === selectedAvatar) || AVATARS[0];

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.span
            className="text-6xl block mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            ⚔️
          </motion.span>
          <h1 className="text-3xl font-black font-['Outfit',sans-serif] text-white mb-2">Choose Your Guardian</h1>
          <p className="text-sm text-gray-500">Select your character and enter the Storage Kingdom</p>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {AVATARS.map((avatar) => (
            <motion.button
              key={avatar.id}
              onClick={() => {
                setSelectedAvatar(avatar.id);
                playSound('click');
              }}
              className={`p-5 rounded-2xl border-2 transition-all ${
                selectedAvatar === avatar.id
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-5xl block mb-3">{avatar.emoji}</span>
              <span className="text-sm font-bold text-white block">{avatar.name}</span>
              <div
                className="mt-2 h-1 rounded-full"
                style={{ backgroundColor: avatar.color + '80' }}
              />
            </motion.button>
          ))}
        </div>

        {/* Selected Preview */}
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-4 mb-6 text-center"
        >
          <span className="text-4xl">{selected.emoji}</span>
          <p className="text-sm font-bold text-white mt-2">{selected.name}</p>
          <p className="text-xs text-gray-500">Ready for adventure!</p>
        </motion.div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Guardian Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            placeholder="Enter your name..."
            className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            maxLength={20}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>

        {/* Start Button */}
        <motion.button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Enter the Kingdom →
        </motion.button>

        <p className="text-center text-xs text-gray-700 mt-4">
          You can change your character later in your profile
        </p>
      </motion.div>
    </div>
  );
}
