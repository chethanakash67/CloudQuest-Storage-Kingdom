'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Shield, Cloud, Zap, Swords, BookOpen } from 'lucide-react';

const floatingElements = [
  { emoji: '☁️', delay: 0, duration: 8, x: '10%', y: '15%' },
  { emoji: '🏰', delay: 1, duration: 10, x: '80%', y: '20%' },
  { emoji: '🔐', delay: 2, duration: 7, x: '20%', y: '70%' },
  { emoji: '⚡', delay: 0.5, duration: 9, x: '70%', y: '60%' },
  { emoji: '📦', delay: 1.5, duration: 6, x: '50%', y: '30%' },
  { emoji: '🗝️', delay: 3, duration: 8, x: '85%', y: '75%' },
  { emoji: '💎', delay: 2.5, duration: 7, x: '15%', y: '45%' },
  { emoji: '🛡️', delay: 0.8, duration: 11, x: '40%', y: '80%' },
];

const features = [
  { icon: Swords, title: '6 Unique Missions', desc: 'Sorting, maze, strategy, defense & more', color: 'from-pink-500 to-rose-500' },
  { icon: BookOpen, title: 'Learn by Playing', desc: 'Cloud storage concepts through gameplay', color: 'from-blue-500 to-cyan-500' },
  { icon: Zap, title: 'XP & Rewards', desc: 'Earn XP, coins, badges & unlock levels', color: 'from-yellow-500 to-orange-500' },
  { icon: Shield, title: 'Become a Guardian', desc: 'Protect the Storage Kingdom!', color: 'from-green-500 to-emerald-500' },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#050510] overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]" />

      {/* Floating Elements */}
      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl sm:text-4xl opacity-20 pointer-events-none select-none"
          style={{ left: el.x, top: el.y }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: 'easeInOut',
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
            <Cloud className="w-3 h-3" /> Educational Game
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-['Outfit',sans-serif] tracking-tight mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-gradient-animated bg-[length:200%_200%]">
              Cloud
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent bg-gradient-animated bg-[length:200%_200%]" style={{ animationDelay: '1s' }}>
              Quest
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl sm:text-2xl font-semibold text-gray-300 font-['Outfit',sans-serif]"
          >
            Storage Kingdom
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-500 mt-3 max-w-md mx-auto"
          >
            Become a Cloud Guardian. Protect the digital kingdom. Master cloud storage through epic missions.
          </motion.p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-16"
        >
          <Link
            href="/character-select"
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
          >
            <span className="text-2xl">⚔️</span>
            Start Adventure
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity -z-10" />
          </Link>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl w-full mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.15 }}
              className="glass-card rounded-xl p-4 text-center hover:border-indigo-500/30 transition-colors group"
            >
              <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white mb-1">{feature.title}</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Three Worlds Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="max-w-2xl w-full"
        >
          <h2 className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Three Lands Await</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Bucket Island', emoji: '🏝️', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/20' },
              { name: 'Class Cave', emoji: '🏔️', color: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/20' },
              { name: 'Access Castle', emoji: '🏰', color: 'from-red-500/20 to-pink-500/20', border: 'border-red-500/20' },
            ].map((world) => (
              <div
                key={world.name}
                className={`p-4 rounded-xl bg-gradient-to-b ${world.color} border ${world.border} text-center`}
              >
                <span className="text-3xl block mb-2">{world.emoji}</span>
                <span className="text-xs font-bold text-white">{world.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-12 text-xs text-gray-700 text-center"
        >
          Learn Cloud Storage · Master Buckets, Objects, Classes & Permissions
        </motion.p>
      </div>
    </div>
  );
}
