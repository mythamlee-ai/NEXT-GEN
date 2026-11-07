import React, { useEffect } from 'react';
import { ScienceKeyword } from '../types';
import { Sparkles, Key, CheckCircle, Zap, Star } from 'lucide-react';
import { audioManager } from '../services/audioManager';

interface KeywordUnlockModalProps {
  keyword: ScienceKeyword | null;
  onClose: () => void;
}

export const KeywordUnlockModal: React.FC<KeywordUnlockModalProps> = ({ keyword, onClose }) => {
  useEffect(() => {
    if (keyword) {
      audioManager.playBonusPoints();
      audioManager.playUnlock();
    }
  }, [keyword]);

  if (!keyword) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Radial Neon Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.25)_0,rgba(168,85,247,0.2)_40%,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0e1630] via-[#121c3d] to-[#1c1236] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.5)] overflow-hidden">
        {/* Top Floating Glow Effect */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-fuchsia-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Hologram Badge */}
        <div className="relative mx-auto w-20 h-20 mb-4 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-fuchsia-500 p-0.5 shadow-[0_0_30px_rgba(6,182,212,0.8)] animate-bounce">
          <div className="w-full h-full bg-[#0a0f24] rounded-2xl flex items-center justify-center">
            <Key className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)] animate-pulse" />
          </div>
        </div>

        {/* Status Text */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
          <span>Hologram Unlocked</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-400 mb-2 tracking-wide">
          TỪ KHÓA MỚI!
        </h2>

        {/* Keyword Name Card */}
        <div className="my-4 py-3.5 px-4 bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-pink-950/60 border border-cyan-400/60 rounded-2xl shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 mb-1">
            {keyword.categoryLabel || 'Khoa học Next Gen'} • {keyword.round === 'secret' ? 'Từ khóa ẩn' : `Trạm Vòng ${keyword.round}`}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-wider drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]">
            « {keyword.name} »
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-bold text-sm">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              +{keyword.points} ĐIỂM
            </span>
            <div className="flex items-center text-amber-400 text-xs">
              {Array.from({ length: keyword.difficulty }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-cyan-100/90 leading-relaxed font-sans mb-6 px-2">
          {keyword.description}
        </p>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm tracking-wide uppercase transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Thu Thập & Tiếp Tục</span>
        </button>
      </div>
    </div>
  );
};
