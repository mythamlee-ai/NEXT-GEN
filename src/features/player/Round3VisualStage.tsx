import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  Plus,
  Hourglass,
  HelpCircle,
  Ban,
  Zap,
} from 'lucide-react';

interface Round3VisualStageProps {
  visualClues: string[];
  proverbNumber?: number;
  reducedMotion?: boolean;
  isCorrect?: boolean | null;
  isWrong?: boolean | null;
  isTimeout?: boolean;
  timeRemaining?: number;
}

export const Round3VisualStage: React.FC<Round3VisualStageProps> = ({
  visualClues,
  proverbNumber,
  reducedMotion = false,
  isCorrect = null,
  isWrong = null,
  isTimeout = false,
  timeRemaining = 30,
}) => {
  // Helper to detect if a clue is a sci-fi connective/operator
  const isOperator = (item: string): boolean => {
    return ['1️⃣', '🚫', '➕', '🆚', '➡️', '↔️', '⏳', '❓'].includes(item.trim());
  };

  // Render dedicated glowing 3D vector chips for connective symbols
  const renderOperatorChip = (operator: string, index: number) => {
    switch (operator.trim()) {
      case '1️⃣':
        return (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-gradient-to-b from-amber-500/30 to-amber-950/80 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] backdrop-blur-md transform transition-all duration-300"
          >
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]">
              1
            </span>
          </div>
        );
      case '🚫':
        return (
          <div
            key={index}
            className="flex items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-b from-rose-500/30 to-rose-950/80 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] backdrop-blur-md"
          >
            <Ban className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.9)]" />
          </div>
        );
      case '➕':
        return (
          <div
            key={index}
            className="flex items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-b from-cyan-500/30 to-cyan-950/80 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] backdrop-blur-md"
          >
            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
          </div>
        );
      case '🆚':
        return (
          <div
            key={index}
            className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600/40 via-purple-600/40 to-pink-600/40 border-2 border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.7)] backdrop-blur-md"
          >
            <span className="font-mono text-lg sm:text-2xl font-black tracking-wider text-fuchsia-200 drop-shadow-[0_0_10px_rgba(217,70,239,1)]">
              VS
            </span>
          </div>
        );
      case '➡️':
        return (
          <div
            key={index}
            className="flex items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-b from-emerald-500/30 to-emerald-950/80 border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] backdrop-blur-md"
          >
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          </div>
        );
      case '↔️':
        return (
          <div
            key={index}
            className="flex items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-b from-indigo-500/30 to-indigo-950/80 border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)] backdrop-blur-md"
          >
            <ArrowLeftRight className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-300 drop-shadow-[0_0_12px_rgba(99,102,241,0.9)]" />
          </div>
        );
      case '⏳':
        return (
          <div
            key={index}
            className="flex items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-b from-amber-500/30 to-amber-950/80 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] backdrop-blur-md"
          >
            <Hourglass className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
          </div>
        );
      case '❓':
        return (
          <div
            key={index}
            className="flex items-center justify-center p-2.5 sm:p-3.5 rounded-2xl bg-gradient-to-b from-yellow-500/30 to-yellow-950/80 border-2 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.6)] backdrop-blur-md animate-bounce"
          >
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 drop-shadow-[0_0_12px_rgba(234,179,8,0.9)]" />
          </div>
        );
      default:
        return null;
    }
  };

  // Border & Glow styling depending on game state
  const getContainerGlow = () => {
    if (isCorrect === true) {
      return 'border-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.8),inset_0_0_30px_rgba(52,211,153,0.3)] bg-gradient-to-b from-emerald-950/90 via-[#0a1f18]/90 to-slate-950/95';
    }
    if (isWrong === true) {
      return 'border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.8),inset_0_0_30px_rgba(244,63,94,0.3)] bg-gradient-to-b from-rose-950/90 via-[#1f0a10]/90 to-slate-950/95 animate-shake';
    }
    if (isTimeout) {
      return 'border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.8)] bg-gradient-to-b from-red-950/90 via-[#1a0808]/90 to-slate-950/95';
    }
    if (timeRemaining <= 5) {
      return 'border-rose-400 shadow-[0_0_40px_rgba(251,113,133,0.9)] bg-gradient-to-b from-[#240a18]/95 via-[#1a092b]/90 to-[#0d0417]/95 animate-pulse';
    }
    return 'border-amber-400/60 shadow-[0_0_45px_rgba(245,158,11,0.35),inset_0_0_25px_rgba(217,70,239,0.15)] bg-gradient-to-b from-[#180a2b]/95 via-[#230f3b]/85 to-[#0f051c]/95';
  };

  return (
    <div
      className={`relative w-full rounded-3xl p-6 sm:p-10 border-2 transition-all duration-500 backdrop-blur-2xl overflow-hidden ${getContainerGlow()}`}
      style={{ perspective: '1200px' }}
    >
      {/* Background Holographic Grid Rays & Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-fuchsia-600 to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Cyber Corner Decors */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
          <span className="text-[11px] sm:text-xs font-mono font-black tracking-widest text-amber-300 uppercase px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/40 shadow-xs">
            HOLOGRAPHIC PROVERB STAGE {proverbNumber ? `#${proverbNumber.toString().padStart(2, '0')}` : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[10px] sm:text-xs font-mono text-cyan-300 font-bold tracking-wide">
            3D VISUAL CODEX
          </span>
        </div>
      </div>

      {/* The 3D Visual Cards Stage */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-6 py-6 sm:py-8 min-h-[180px] sm:min-h-[220px] relative z-10">
        {visualClues.map((clue, idx) => {
          if (isOperator(clue)) {
            return renderOperatorChip(clue, idx);
          }

          return (
            <div
              key={idx}
              className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-7 rounded-3xl transition-all duration-500 transform ${
                reducedMotion
                  ? 'hover:scale-105'
                  : 'hover:scale-110 hover:-translate-y-2'
              } cursor-default select-none`}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(20,10,35,0.85) 100%)',
                border: '2px solid rgba(251, 191, 36, 0.45)',
                boxShadow: '0 15px 35px -5px rgba(0,0,0,0.6), 0 0 25px rgba(245, 158, 11, 0.25), inset 0 1px 1px rgba(255,255,255,0.4)',
                backdropFilter: 'blur(16px)',
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              {/* Back Glow Layer */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Pedestal Bottom Light */}
              <div className="absolute -bottom-2 inset-x-4 h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[4px] opacity-70 group-hover:opacity-100 transition-opacity" />

              {/* Holographic Big Symbol / Emoji */}
              <div className="relative z-10 flex items-center justify-center text-5xl sm:text-6xl md:text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter transition-transform duration-300 group-hover:scale-110">
                <span>{clue}</span>
              </div>

              {/* Optical Reflection Accent */}
              <div className="absolute top-1 inset-x-3 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Floating Laser Scanline Effect across the stage */}
      <div
        className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] pointer-events-none opacity-40 animate-pulse"
        style={{ top: '65%' }}
      />
    </div>
  );
};
