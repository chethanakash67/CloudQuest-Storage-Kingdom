'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { LEARNING_NOTES, CATEGORY_STYLES, LearningNote } from '@/lib/learningNotes';
import PlayerStatsBar from '@/components/ui/PlayerStatsBar';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Lock, Globe, Lightbulb, Sparkles, Search, Gamepad2, CheckCircle2 } from 'lucide-react';

type CategoryFilter = 'all' | 'Buckets & Objects' | 'Storage Classes' | 'Access Control';

export default function KnowledgePage() {
  const { unlockedNotes } = useGameStore();
  const [selectedNote, setSelectedNote] = useState<LearningNote | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const filteredNotes = LEARNING_NOTES.filter((note) =>
    filter === 'all' ? true : note.category === filter
  );

  const totalUnlocked = unlockedNotes.length;
  const totalNotes = LEARNING_NOTES.length;
  const progressPercent = (totalUnlocked / totalNotes) * 100;

  const categories: { label: CategoryFilter; icon: string }[] = [
    { label: 'all', icon: '📖' },
    { label: 'Buckets & Objects', icon: '🪣' },
    { label: 'Storage Classes', icon: '📦' },
    { label: 'Access Control', icon: '🛡️' },
  ];

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      <PlayerStatsBar />

      {/* Background decorations */}
      <div className="absolute top-32 right-10 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-600/3 rounded-full blur-[100px]" />

      <div className="relative z-10 pt-20 px-4 pb-16 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/map" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black font-['Outfit',sans-serif] text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              Knowledge Journal
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalUnlocked}/{totalNotes} notes collected • Complete levels to unlock knowledge
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-indigo-400 font-medium">📚 Knowledge Progress</span>
            <span className="text-gray-500">{Math.round(progressPercent)}% Complete</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setFilter(cat.label)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === cat.label
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : 'bg-gray-800/50 border border-gray-700/50 text-gray-500 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {cat.icon} {cat.label === 'all' ? 'All Notes' : cat.label}
            </button>
          ))}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {filteredNotes.map((note, i) => {
            const isUnlocked = unlockedNotes.includes(note.levelOrder);
            const style = CATEGORY_STYLES[note.category];

            return (
              <motion.div
                key={note.levelOrder}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                {isUnlocked ? (
                  <button
                    onClick={() => setSelectedNote(note)}
                    className={`w-full text-left p-5 rounded-2xl border ${style.border} ${style.bg} hover:shadow-lg ${style.glow} transition-all group relative overflow-hidden`}
                  >
                    {/* Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

                    <div className="relative z-10">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-md flex-shrink-0`}
                        >
                          <span className="text-lg">{note.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[9px] uppercase tracking-wider font-bold ${style.text}`}>
                            {note.category}
                          </span>
                          <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-2 leading-tight">
                            {note.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed mb-3">
                        {note.summary}
                      </p>

                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="text-gray-600 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {note.keyConcepts.length} concepts
                        </span>
                        <span className="text-gray-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Level {note.levelOrder}
                        </span>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="p-5 rounded-2xl bg-gray-900/30 border border-gray-800/50 opacity-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-gray-600 font-bold">
                          {note.category}
                        </span>
                        <h3 className="text-sm font-bold text-gray-600">???</h3>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-700">
                      Complete Level {note.levelOrder} to unlock this note
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty state for filters */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-600">No notes in this category yet</p>
          </div>
        )}
      </div>

      {/* Note Detail Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            className="fixed inset-0 z-[100] overflow-y-auto px-4 py-6 sm:py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedNote(null)}
            />
            <div className="relative z-10 flex min-h-full items-start justify-center">
              <motion.div
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 shadow-2xl"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
              {/* Header */}
              {(() => {
                const style = CATEGORY_STYLES[selectedNote.category];
                return (
                  <>
                    <div className={`p-6 bg-gradient-to-br ${style.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="relative z-10">
                        <span className="text-[10px] uppercase tracking-wider text-white/70 font-bold">
                          {selectedNote.category} • Level {selectedNote.levelOrder}
                        </span>
                        <h2 className="text-xl font-black text-white mt-1 font-['Outfit',sans-serif]">
                          {selectedNote.icon} {selectedNote.title}
                        </h2>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Summary */}
                      <p className="text-sm text-gray-300 leading-relaxed">{selectedNote.summary}</p>

                      {/* Game Connection */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Gamepad2 className="w-4 h-4 text-purple-400" />
                          <h4 className="text-xs uppercase tracking-wider text-purple-400 font-bold">
                            How {selectedNote.gameConnection.gameEmoji} {selectedNote.gameConnection.gameName} Teaches This
                          </h4>
                        </div>
                        <p className="text-sm text-purple-300/80 leading-relaxed mb-3">
                          {selectedNote.gameConnection.howItTeaches}
                        </p>
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-purple-400/60 font-bold">What You Practiced:</span>
                          {selectedNote.gameConnection.whatYouPracticed.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500/70 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-purple-300/60 leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Key Concepts */}
                      <div>
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-3 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> Key Concepts Learned
                        </h3>
                        <div className="space-y-3">
                          {selectedNote.keyConcepts.map((concept, i) => (
                            <motion.div
                              key={concept.term}
                              initial={{ opacity: 0, x: -15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + 0.08 * i }}
                              className={`p-4 rounded-xl ${style.bg} border ${style.border}`}
                            >
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-lg">{concept.emoji}</span>
                                <h4 className={`text-sm font-bold ${style.text}`}>{concept.term}</h4>
                              </div>
                              <p className="text-xs text-gray-400 leading-relaxed pl-7">
                                {concept.definition}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Real World Example */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-indigo-400" />
                          <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
                            Real World Example
                          </h4>
                        </div>
                        <p className="text-sm text-indigo-300/80 leading-relaxed">
                          {selectedNote.realWorldExample}
                        </p>
                      </motion.div>

                      {/* Pro Tip */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                          <h4 className="text-xs uppercase tracking-wider text-yellow-400 font-bold">
                            Pro Tip
                          </h4>
                        </div>
                        <p className="text-sm text-yellow-300/80 leading-relaxed">
                          {selectedNote.proTip}
                        </p>
                      </motion.div>

                      {/* Close button */}
                      <button
                        onClick={() => setSelectedNote(null)}
                        className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
