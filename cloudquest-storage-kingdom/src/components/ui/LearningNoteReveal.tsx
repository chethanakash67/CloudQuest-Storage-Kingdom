'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, Globe, Sparkles, Gamepad2, CheckCircle2 } from 'lucide-react';
import { LearningNote, CATEGORY_STYLES } from '@/lib/learningNotes';

interface LearningNoteRevealProps {
  note: LearningNote;
  isNew: boolean;
}

export default function LearningNoteReveal({ note, isNew }: LearningNoteRevealProps) {
  const [expanded, setExpanded] = useState(false);
  const style = CATEGORY_STYLES[note.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
      className={`w-full rounded-2xl border ${style.border} ${style.bg} overflow-hidden`}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <motion.div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg ${style.glow} flex-shrink-0`}
          animate={isNew ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <BookOpen className="w-5 h-5 text-white" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] uppercase tracking-wider font-bold ${style.text}`}>
              {note.category}
            </span>
            {isNew && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.6, type: 'spring', stiffness: 400 }}
                className="px-1.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[9px] font-bold flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5" /> NEW
              </motion.span>
            )}
          </div>
          <h4 className="text-sm font-bold leading-tight text-white">{note.title}</h4>
        </div>

        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0 mt-3" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 mt-3" />
        )}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Summary */}
              <p className="text-xs text-gray-300 leading-relaxed">{note.summary}</p>

              {/* Game Connection */}
              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Gamepad2 className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">
                    How {note.gameConnection.gameEmoji} {note.gameConnection.gameName} Teaches It
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/80 leading-relaxed mb-2">
                  {note.gameConnection.howItTeaches}
                </p>
                <div className="space-y-1">
                  {note.gameConnection.whatYouPracticed.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-purple-500/70 mt-0.5 flex-shrink-0" />
                      <span className="text-[10px] text-purple-300/60 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Concepts */}
              <div>
                <h5 className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3" /> Key Concepts
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {note.keyConcepts.map((concept, i) => (
                    <motion.div
                      key={concept.term}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800/50"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm">{concept.emoji}</span>
                        <span className="text-xs font-bold text-white">{concept.term}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        {concept.definition}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Real World Example */}
              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Globe className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">
                    Real World Example
                  </span>
                </div>
                <p className="text-[11px] text-indigo-300/80 leading-relaxed">
                  {note.realWorldExample}
                </p>
              </div>

              {/* Pro Tip */}
              <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Lightbulb className="w-3 h-3 text-yellow-400" />
                  <span className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold">
                    Pro Tip
                  </span>
                </div>
                <p className="text-[11px] text-yellow-300/80 leading-relaxed">{note.proTip}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
