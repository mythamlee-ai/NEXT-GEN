import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  HelpCircle,
  Trophy,
  Volume2,
  VolumeX,
  Compass,
  Atom,
  FlaskConical,
  Dna,
  Zap,
  ArrowRight,
  Bot,
  Key,
  X,
  Layers,
  Star,
} from 'lucide-react';
import { audioManager } from '../../services/audioManager';

interface CinematicLobbyProps {
  onStartQuest?: () => void;
  onStartJourney?: () => void;
  onViewLeaderboard: () => void;
  onViewMap?: () => void;
  hasActiveSession?: boolean;
  onOpenAdminLogin?: () => void;
}

export const CinematicLobby: React.FC<CinematicLobbyProps> = ({
  onStartQuest,
  onStartJourney,
  onViewLeaderboard,
  onViewMap,
  hasActiveSession = false,
  onOpenAdminLogin,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(audioManager.isEnabled());
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const launchQuest = onStartJourney || onStartQuest || (() => {});

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMousePos({
        x: (e.clientX - cx) / cx, // -1 to 1
        y: (e.clientY - cy) / cy,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleSound = () => {
    const next = audioManager.toggleSound();
    setSoundEnabled(next);
  };

  const handleStart = () => {
    audioManager.playUnlock();
    setIsWarping(true);
    setTimeout(() => {
      launchQuest();
    }, 850);
  };

  const skipWarp = () => {
    launchQuest();
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Cinematic Warp Portal Overlay */}
      {isWarping && (
        <div
          onClick={skipWarp}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl transition-all duration-700 cursor-pointer"
        >
          <div className="relative flex flex-col items-center">
            {/* Expanding Warp Tunnel Rings */}
            <div className="w-56 h-56 sm:w-96 sm:h-96 rounded-full border-4 border-cyan-400 animate-ping opacity-75 shadow-[0_0_50px_rgba(6,182,212,0.8)]" />
            <div className="absolute inset-0 w-56 h-56 sm:w-96 sm:h-96 rounded-full border-2 border-fuchsia-500 animate-spin shadow-[0_0_40px_rgba(217,70,239,0.8)]" />
            <div className="absolute inset-0 w-40 h-40 m-auto rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-300 blur-2xl animate-pulse" />

            <p className="mt-8 font-mono text-cyan-300 font-black tracking-widest text-base sm:text-lg animate-bounce uppercase drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]">
              Đang mở cổng dịch chuyển vũ trụ khoa học...
            </p>
            <span className="text-xs text-cyan-200/70 mt-2 hover:text-white underline">
              (Nhấn để vào ngay)
            </span>
          </div>
        </div>
      )}

      {/* 3D Perspective Ground Grid (Sci-Fi Holodeck Floor) */}
      <div
        className="absolute bottom-0 inset-x-0 h-72 pointer-events-none opacity-40 perspective-grid z-0"
        style={{
          transform: `rotateX(68deg) scale(2.4) translateY(${mousePos.y * 18}px) translateX(${mousePos.x * 24}px)`,
        }}
      />

      {/* Floating 3D Science Badges (Physics, Chemistry, Biology, AI Robotics) */}
      <div
        className="absolute top-10 left-4 sm:left-14 p-3.5 rounded-2xl bg-gradient-to-br from-[#0c1a40]/90 to-[#0e245a]/80 border-2 border-cyan-400/60 backdrop-blur-md hidden sm:flex items-center gap-3 text-cyan-200 text-xs font-mono shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-transform duration-300 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -25}px)`,
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <Atom className="w-6 h-6 animate-spin text-cyan-300" />
        </div>
        <div>
          <span className="block font-black text-white text-sm">VẬT LÝ HỌC</span>
          <span className="text-[10px] text-cyan-300/80 font-medium">Lượng tử & Quang học</span>
        </div>
      </div>

      <div
        className="absolute top-16 right-4 sm:right-16 p-3.5 rounded-2xl bg-gradient-to-br from-[#2a0e38]/90 to-[#3b1250]/80 border-2 border-fuchsia-400/60 backdrop-blur-md hidden sm:flex items-center gap-3 text-fuchsia-200 text-xs font-mono shadow-[0_0_25px_rgba(217,70,239,0.35)] transition-transform duration-300 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * -20}px)`,
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-fuchsia-400/50 flex items-center justify-center text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.5)]">
          <FlaskConical className="w-6 h-6 text-fuchsia-300" />
        </div>
        <div>
          <span className="block font-black text-white text-sm">HÓA HỌC</span>
          <span className="text-[10px] text-fuchsia-300/80 font-medium">Phản ứng & Nguyên tố</span>
        </div>
      </div>

      <div
        className="absolute bottom-16 left-6 sm:left-20 p-3.5 rounded-2xl bg-gradient-to-br from-[#0a2822]/90 to-[#0e3b32]/80 border-2 border-emerald-400/60 backdrop-blur-md hidden md:flex items-center gap-3 text-emerald-200 text-xs font-mono shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-transform duration-300 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * 25}px)`,
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
          <Dna className="w-6 h-6 text-emerald-300" />
        </div>
        <div>
          <span className="block font-black text-white text-sm">SINH HỌC</span>
          <span className="text-[10px] text-emerald-300/80 font-medium">Di truyền & Tế bào</span>
        </div>
      </div>

      <div
        className="absolute bottom-20 right-6 sm:right-24 p-3.5 rounded-2xl bg-gradient-to-br from-[#2b1f09]/90 to-[#3d2b0c]/80 border-2 border-amber-400/60 backdrop-blur-md hidden md:flex items-center gap-3 text-amber-200 text-xs font-mono shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-transform duration-300 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 22}px)`,
        }}
      >
        <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          <Bot className="w-6 h-6 text-amber-300 animate-pulse" />
        </div>
        <div>
          <span className="block font-black text-white text-sm">AI & ROBOT</span>
          <span className="text-[10px] text-amber-300/80 font-medium">Trí tuệ số Next Gen</span>
        </div>
      </div>

      {/* Main Center Content Container with 3D Depth */}
      <div
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center transition-transform duration-200"
        style={{
          transform: `rotateY(${mousePos.x * 6}deg) rotateX(${mousePos.y * -6}deg)`,
        }}
      >
        {/* Organization Neon Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border-2 border-cyan-400/60 text-cyan-300 text-xs font-mono font-bold tracking-wider mb-5 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
          <span>TỔ KHOA HỌC TỰ NHIÊN • TRƯỜNG THPT PÉTRUS KÝ</span>
        </div>

        {/* 3D Central SCIENCE CORE Reactor */}
        <div className="relative my-3 flex items-center justify-center w-56 h-56 sm:w-68 sm:h-68">
          {/* Orbital Ring 1 - Cyan (45 deg) */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-orbit-cw shadow-[0_0_25px_rgba(6,182,212,0.6)]"
            style={{ transform: 'rotate3d(1, 1, 0, 45deg)' }}
          />

          {/* Orbital Ring 2 - Magenta (-55 deg) */}
          <div
            className="absolute inset-2 rounded-full border-2 border-dotted border-fuchsia-400 animate-orbit-ccw shadow-[0_0_25px_rgba(217,70,239,0.6)]"
            style={{ transform: 'rotate3d(1, -1, 1, 60deg)' }}
          />

          {/* Orbital Ring 3 - Amber (Horizontal plane) */}
          <div
            className="absolute inset-4 rounded-full border-2 border-amber-400/80 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.5)]"
            style={{ transform: 'rotateX(75deg)' }}
          />

          {/* Glowing Fusion Reactor Core */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.8)] animate-float-core border-4 border-cyan-200">
            {/* Plasma Pulsing Aura */}
            <div className="absolute inset-0 rounded-full bg-cyan-400/50 blur-xl animate-ping" />
            <div className="relative flex flex-col items-center justify-center text-white">
              <Zap className="w-12 h-12 text-white fill-amber-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-cyan-100 font-black mt-0.5">
                CORE-3D
              </span>
            </div>
          </div>
        </div>

        {/* Game Title with Neon Gradient Typography */}
        <div className="relative my-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
            PEK SCIENCE QUEST
          </h1>
          <div className="mt-2 inline-flex items-center gap-2 px-5 py-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <span className="text-lg sm:text-2xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">
              KHOA HỌC NEXT GEN
            </span>
          </div>
        </div>

        {/* Slogan */}
        <p className="mt-3 text-sm sm:text-base md:text-lg font-medium text-cyan-100 max-w-xl mx-auto flex items-center justify-center gap-2 bg-[#0a1233]/80 px-5 py-2 rounded-full border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <span className="text-cyan-400 font-bold">“</span>
          <span className="text-white font-bold tracking-wide">
            Giải mã tri thức – Chinh phục vũ trụ khoa học!
          </span>
          <span className="text-cyan-400 font-bold">”</span>
        </p>

        {/* 4 Lands Quick Capsule Preview with Neon Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-3xl mt-6 px-2">
          <div className="p-3 rounded-2xl bg-[#081533]/85 border-2 border-cyan-400/60 text-center shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105">
            <span className="text-[10px] font-mono text-cyan-300 block font-bold">VÒNG 1</span>
            <span className="text-xs font-black text-white block truncate">Code Breaker</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#230930]/85 border-2 border-fuchsia-400/60 text-center shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all hover:border-fuchsia-300 hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] hover:scale-105">
            <span className="text-[10px] font-mono text-fuchsia-300 block font-bold">VÒNG 2</span>
            <span className="text-xs font-black text-white block truncate">AI Đây? PeK</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#2b1807]/85 border-2 border-amber-400/60 text-center shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:border-amber-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105">
            <span className="text-[10px] font-mono text-amber-300 block font-bold">VÒNG 3</span>
            <span className="text-xs font-black text-white block truncate">Picture Puzzle</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#08241b]/85 border-2 border-emerald-400/60 text-center shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:border-emerald-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105">
            <span className="text-[10px] font-mono text-emerald-300 block font-bold">VÒNG 4</span>
            <span className="text-xs font-black text-white block truncate">Final Mission</span>
          </div>
        </div>

        {/* Interactive Action Control Deck */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 z-20">
          {/* Main Primary Launch Button - 3D Neon Bevel */}
          <button
            onClick={handleStart}
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_0_35px_rgba(6,182,212,0.65)] hover:shadow-[0_0_50px_rgba(6,182,212,0.9)] transition-all duration-300 btn-3d-sci-fi flex items-center gap-2.5 cursor-pointer border-2 border-cyan-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/25 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Play className="w-5 h-5 fill-current text-white animate-pulse" />
            <span>BẮT ĐẦU HÀNH TRÌNH</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Guide Button */}
          <button
            onClick={() => {
              audioManager.playButtonTap();
              setShowGuideModal(true);
            }}
            className="px-5 py-3.5 rounded-2xl bg-[#0a1435]/90 hover:bg-[#0e1d4d] border-2 border-cyan-400/50 text-cyan-200 hover:text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center gap-2 cursor-pointer btn-3d-sci-fi"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>HƯỚNG DẪN</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              audioManager.playButtonTap();
              onViewLeaderboard();
            }}
            className="px-5 py-3.5 rounded-2xl bg-[#241306]/90 hover:bg-[#381d0a] border-2 border-amber-400/50 text-amber-200 hover:text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-2 cursor-pointer btn-3d-sci-fi"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>BẢNG XẾP HẠNG</span>
          </button>

          {/* 3D Mission Map Button */}
          {onViewMap && (
            <button
              onClick={() => {
                audioManager.playButtonTap();
                onViewMap();
              }}
              className="px-5 py-3.5 rounded-2xl bg-[#1b092c]/90 hover:bg-[#2b0f47] border-2 border-purple-400/50 text-purple-200 hover:text-white font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center gap-2 cursor-pointer btn-3d-sci-fi"
            >
              <Compass className="w-4 h-4 text-purple-400" />
              <span>BẢN ĐỒ 3D</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-3.5 rounded-2xl bg-[#09102b]/90 hover:bg-[#0e1a47] border-2 border-cyan-500/40 text-cyan-300 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer btn-3d-sci-fi"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-cyan-300" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Guide & Rules Holographic Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#090e24] via-[#0d163a] to-[#150f2e] border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.4)] p-6 sm:p-8 text-left text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-white transition-all cursor-pointer border border-cyan-400/30"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 border-b border-cyan-500/30 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <HelpCircle className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-300">
                  HƯỚNG DẪN THI ĐẤU KHOA HỌC
                </h3>
                <p className="text-xs font-mono text-cyan-300/80 font-bold">
                  PÉTRUS KÝ SCIENCE QUEST • THE NEXT GEN
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-[#081533]/80 border border-cyan-500/40">
                <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 flex items-center justify-center text-xs font-bold">1</span>
                  <span>VÒNG 1: SCIENCE CODE BREAKER (9 câu trắc nghiệm)</span>
                </div>
                <p className="text-xs text-cyan-100/80 leading-relaxed font-medium">
                  Bẻ khóa 9 mật mã thuộc 3 bộ môn Vật lý, Hóa học, Sinh học. Mỗi câu đúng ghi điểm và mở khóa từ khóa khoa học tương ứng (+10 đến +20 điểm).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#230930]/80 border border-fuchsia-500/40">
                <div className="flex items-center gap-2 font-bold text-fuchsia-300 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-fuchsia-500/30 border border-fuchsia-400/50 text-fuchsia-200 flex items-center justify-center text-xs font-bold">2</span>
                  <span>VÒNG 2: AI ĐÂY? (Giải mã 2 Giáo Viên KHTN)</span>
                </div>
                <p className="text-xs text-fuchsia-100/80 leading-relaxed font-medium">
                  Lật mở 4 tầng gợi ý về các Thầy Cô Tổ KHTN Pétrus Ký. Mở càng ít gợi ý điểm thưởng càng cao (40 ➔ 30 ➔ 20 ➔ 10 điểm). Thu thập từ khóa nhân lực công nghệ.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#2b1807]/80 border border-amber-500/40">
                <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/30 border border-amber-400/50 text-amber-200 flex items-center justify-center text-xs font-bold">3</span>
                  <span>VÒNG 3: PICTURE PUZZLE (Đuổi hình bắt chữ khoa học)</span>
                </div>
                <p className="text-xs text-amber-100/80 leading-relaxed font-medium">
                  Giải mã 3 hình ảnh câu đố rebus khoa học bằng cách nhập từ khóa hoặc trắc nghiệm. Thu thập từ khóa tư duy logic và suy luận.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#08241b]/80 border border-emerald-500/40">
                <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/30 border border-emerald-400/50 text-emerald-200 flex items-center justify-center text-xs font-bold">4</span>
                  <span>VÒNG 4: THE FINAL MISSION (Rương Kho Báu Cuối Cùng)</span>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed font-medium">
                  Quét mã QR trạm thực địa hoặc nhập mật mã. Kích hoạt hộp quà may mắn (+5, +10, -5, -10, *2, :2) và mở khóa các từ khóa tối thượng NEXT GEN CHAMPION!
                </p>
              </div>

              {/* Keyword Vault Highlight in Guide */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-cyan-950/70 border border-cyan-400/50">
                <div className="flex items-center gap-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-300 mb-1.5">
                  <Key className="w-4 h-4 text-cyan-300" />
                  <span>KHO TỪ KHÓA KHOA HỌC (35 TỪ KHÓA LƯỢNG TỬ)</span>
                </div>
                <p className="text-xs text-cyan-100/90 leading-relaxed font-medium">
                  Tổng điểm = Điểm các vòng + Điểm từ khóa. Thăng hạng danh hiệu từ 🔹 NEW EXPLORER đến 🌌 NEXT GEN CHAMPION (800+ điểm)!
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                ĐÃ HIỂU, SẴN SÀNG!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
