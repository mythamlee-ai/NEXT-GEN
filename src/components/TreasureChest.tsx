import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Key,
  Unlock,
  Lock,
  Award,
  Trophy,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { audioManager } from '../services/audioManager';

export type ChestState =
  | 'LOCKED'
  | 'CLOSED'
  | 'UNLOCKING'
  | 'OPENING'
  | 'OPEN'
  | 'REWARD_REVEALED';

interface TreasureChestProps {
  keysCollected?: string[]; // e.g. ['Alpha', 'Beta', 'Gamma', 'NextGen']
  onRewardClaim?: () => void;
  autoPlay?: boolean;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({
  keysCollected = ['Alpha', 'Beta', 'Gamma', 'NextGen'],
  onRewardClaim,
  autoPlay = true,
}) => {
  const [chestState, setChestState] = useState<ChestState>('CLOSED');
  const [flyingKeysCount, setFlyingKeysCount] = useState<number>(0);

  useEffect(() => {
    if (!autoPlay) return;

    // Sequence timing
    // 1. Zoom and subtle shake (CLOSED -> UNLOCKING)
    const t1 = setTimeout(() => {
      setChestState('UNLOCKING');
      audioManager.playPop();
    }, 600);

    // 2. 4 keys fly in
    const t2 = setTimeout(() => {
      setFlyingKeysCount(4);
      audioManager.playUnlock();
    }, 1500);

    // 3. Locks click open & Chest opens (OPENING)
    const t3 = setTimeout(() => {
      setChestState('OPENING');
      audioManager.playChestOpen();
    }, 2800);

    // 4. Fully open with radiant rays (OPEN)
    const t4 = setTimeout(() => {
      setChestState('OPEN');
    }, 3800);

    // 5. Reward Revealed + Confetti + Victory fanfare
    const t5 = setTimeout(() => {
      setChestState('REWARD_REVEALED');
      audioManager.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#f59e0b', '#0284c7', '#8b5cf6', '#10b981', '#ec4899'],
        });
      } catch {
        // Ignored
      }
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [autoPlay]);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Radiant Glowing Background Rays when opening or open */}
      {(chestState === 'OPENING' || chestState === 'OPEN' || chestState === 'REWARD_REVEALED') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 bg-gradient-to-r from-amber-300/40 via-yellow-200/50 to-amber-400/40 rounded-full blur-3xl animate-pulse" />
          {/* Rotating God Rays */}
          <div
            className="w-full h-full absolute opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent animate-spin"
            style={{ animationDuration: '20s' }}
          />
        </div>
      )}

      {/* 4 Keys Flying In Animation Container */}
      {chestState === 'UNLOCKING' && (
        <div className="relative w-full max-w-xs h-12 flex items-center justify-around mb-2">
          {['Alpha', 'Beta', 'Gamma', 'NextGen'].map((k, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-xl bg-amber-100 border border-amber-300 shadow-md text-amber-800 text-xs font-mono font-bold flex items-center gap-1 transition-all duration-700 transform ${
                flyingKeysCount > 0 ? 'translate-y-8 scale-90 opacity-90' : '-translate-y-4 opacity-70'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{k}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Chest Image / Render Box */}
      <div
        className={`relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl p-2 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 shadow-2xl transition-all duration-700 transform ${
          chestState === 'UNLOCKING'
            ? 'scale-105 animate-pulse'
            : chestState === 'OPENING' || chestState === 'OPEN' || chestState === 'REWARD_REVEALED'
            ? 'scale-110 shadow-amber-400/50'
            : 'scale-100'
        }`}
      >
        <img
          src="/src/assets/images/nextgen_chest_1791188403890.jpg"
          alt="Rương Kho Báu Next Gen PeK"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-inner bg-slate-900"
        />

        {/* Floating Locks overlay if locked */}
        {chestState === 'CLOSED' && (
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] rounded-3xl flex flex-col items-center justify-center text-white">
            <Lock className="w-10 h-10 text-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold mt-1 bg-black/60 px-3 py-1 rounded-full">
              4 PHONG ẤN BẢO VỆ
            </span>
          </div>
        )}

        {/* Unlocking Flash */}
        {chestState === 'UNLOCKING' && (
          <div className="absolute inset-0 bg-amber-300/20 rounded-3xl flex items-center justify-center">
            <Unlock className="w-12 h-12 text-white drop-shadow-lg animate-ping" />
          </div>
        )}

        {/* Floating Sparks */}
        {(chestState === 'OPEN' || chestState === 'REWARD_REVEALED') && (
          <div className="absolute -top-3 -right-3 p-2 bg-amber-500 text-white rounded-full shadow-lg border-2 border-white animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Narrative & Status Text */}
      <div className="relative z-10 mt-6 max-w-md">
        {chestState === 'UNLOCKING' && (
          <div className="space-y-1 animate-in fade-in">
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest block">
              ĐANG HẤP THU 4 MẢNH MẬT MÃ...
            </span>
            <h3 className="text-xl font-black text-slate-900">
              CÁC Ổ KHÓA CỔ ĐANG MỞ RA!
            </h3>
          </div>
        )}

        {(chestState === 'OPENING' || chestState === 'OPEN') && (
          <div className="space-y-1 animate-in zoom-in-95">
            <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-widest block">
              NẮP RƯƠNG ĐANG BUNG MỞ!
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              ÁNH SÁNG KHO BÁU BỪNG LÊN!
            </h3>
          </div>
        )}

        {chestState === 'REWARD_REVEALED' && (
          <div className="space-y-3 animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>CONGRATULATIONS!</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              THE FINAL TREASURE HAS BEEN UNLOCKED!
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Bạn đã mở thành công Rương Kho Báu Khoa Học PeK! Toàn bộ danh hiệu Quán Quân và Chứng nhận vinh dự đã thuộc về đội của bạn.
            </p>

            {onRewardClaim && (
              <div className="pt-2">
                <button
                  onClick={onRewardClaim}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform hover:scale-102 cursor-pointer"
                >
                  <Trophy className="w-5 h-5 stroke-[2.5]" />
                  <span>XEM GIẤY CHỨNG NHẬN & PHẦN THƯỞNG</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
