import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Clock,
  CheckCircle,
  Zap,
  HelpCircle,
  Image as ImageIcon,
  QrCode,
  RotateCcw,
  Sparkles,
  BarChart2,
  FileCheck,
  UserCheck,
  Map as MapIcon,
  Check,
  KeyRound,
} from 'lucide-react';
import { Team } from '../../types';
import { ScoringEngine } from '../../services/scoringEngine';
import { audioManager } from '../../services/audioManager';
import { storageService } from '../../services/storageService';
import { keywordService } from '../../services/keywordService';
import { CertificateModal } from './CertificateModal';
import { ChibiMascot } from '../../components/ChibiMascot';
import { TreasureChest } from '../../components/TreasureChest';

interface ResultsViewProps {
  team: Team;
  onViewLeaderboard: () => void;
  onPlayAgain: () => void;
  onViewMap?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  team,
  onViewLeaderboard,
  onPlayAgain,
  onViewMap,
}) => {
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  useEffect(() => {
    // Play celebratory fanfare
    audioManager.playVictory();

    // Fire fireworks confetti
    try {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#0284c7', '#8b5cf6', '#f59e0b', '#10b981'],
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#0284c7', '#8b5cf6', '#f59e0b', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch {
      // Ignored
    }
  }, []);

  // Compute live rank among all teams
  const allTeams = storageService.getTeams();
  const sortedTeams = [...allTeams].sort(ScoringEngine.compareTeams);
  const currentRank = sortedTeams.findIndex((t) => t.id === team.id) + 1;

  const totalCorrect = team.answersHistory.filter((ans) => ans.isCorrect).length;
  const totalQuestions = team.answersHistory.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Victory Header Card with Animated Treasure Chest Component */}
      <div className="relative bg-slate-900/95 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(245,158,11,0.25)] text-center overflow-hidden mb-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Central Treasure Chest Sequence Component */}
        <div className="relative z-10 mb-6">
          <TreasureChest
            keysCollected={['Alpha (Lượng Tử)', 'Beta (Nguyên Tố)', 'Gamma (Tiến Hóa)', 'NextGen (Chung Cuộc)']}
            onRewardClaim={() => setShowCertificate(true)}
            autoPlay={true}
          />
        </div>

        {/* Team Honors */}
        <div className="relative z-10 max-w-xl mx-auto mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            XUẤT SẮC MỞ BUNG RƯƠNG KHO BÁU!
          </h1>
          <p className="text-base sm:text-xl font-bold bg-gradient-to-r from-cyan-300 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
            Đội: {team.teamName} • Lớp: {team.className}
          </p>
          {team.captainName && (
            <p className="text-xs sm:text-sm text-slate-300 font-semibold mt-1 flex items-center justify-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Đội Trưởng: <strong className="text-purple-200">{team.captainName}</strong></span>
            </p>
          )}

          {/* Player Rank Display */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className={`px-4 py-1.5 rounded-xl text-xs font-mono font-black border shadow-[0_0_20px_rgba(6,182,212,0.3)] ${keywordService.getRank(team.score).glow} bg-slate-900/90`}>
              {keywordService.getRank(team.score).badge} DANH HIỆU: {keywordService.getRank(team.score).rank}
            </span>
            <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              <span>{team.unlockedKeywordIds?.length || team.unlockedKeywords?.length || 0} Từ Khóa (+{team.keywordScore || 0}đ)</span>
            </span>
          </div>
        </div>

        {/* 4 Grand Score KPIs */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/70 border border-amber-500/40 shadow-sm text-center">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block mb-1">
              HẠNG HIỆN TẠI
            </span>
            <div className="flex items-center justify-center gap-1.5">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                #{currentRank}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 shadow-sm text-center">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-1">
              TỔNG ĐIỂM SỐ
            </span>
            <div className="flex items-center justify-center gap-1.5">
              <Award className="w-6 h-6 text-cyan-400" />
              <span className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                {team.score}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 shadow-sm text-center">
            <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider block mb-1">
              THỜI GIAN GIẢI
            </span>
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="w-6 h-6 text-indigo-400" />
              <span className="text-2xl sm:text-3xl font-black text-indigo-200 font-mono">
                {ScoringEngine.formatTime(team.elapsedTime)}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 shadow-sm text-center">
            <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider block mb-1">
              ĐỘ CHÍNH XÁC
            </span>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span className="text-2xl sm:text-3xl font-black text-emerald-200 font-mono">
                {totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 100}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 my-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowCertificate(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer transform hover:scale-102"
          >
            <FileCheck className="w-5 h-5 text-slate-950" />
            <span>XEM & XUẤT GIẤY CHỨNG NHẬN PÉTRUS KÝ</span>
          </button>

          {onViewMap && (
            <button
              onClick={onViewMap}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-sm flex items-center gap-2 border border-cyan-500/40 transition-all cursor-pointer shadow-sm"
            >
              <MapIcon className="w-5 h-5 text-cyan-400" />
              <span>XEM LẠI BẢN ĐỒ KHO BÁU 3D</span>
            </button>
          )}

          <button
            onClick={onViewLeaderboard}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer transform hover:scale-102"
          >
            <BarChart2 className="w-5 h-5" />
            <span>XEM BẢNG XẾP HẠNG TOÀN GIẢI</span>
          </button>

          <button
            onClick={onPlayAgain}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer border border-slate-700/60"
          >
            <RotateCcw className="w-4 h-4" />
            <span>CHƠI LẠI TỪ ĐẦU</span>
          </button>
        </div>
      </div>

      {/* Round Breakdown Cards */}
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <span>CHI TIẾT 4 TRẠM KHOA HỌC ĐÃ CHINH PHỤC:</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Round 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-lg">
              ⚡
            </span>
            <span className="font-mono font-black text-cyan-300 text-lg">
              {team.roundScores[1] || 0} pts
            </span>
          </div>
          <h4 className="font-bold text-white text-sm">Vòng 1: Lăng Kính Quang Phổ</h4>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Thời gian: {ScoringEngine.formatTime(team.roundTimes[1] || 0)}
          </p>
        </div>

        {/* Round 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="w-9 h-9 rounded-xl bg-purple-950 text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold text-lg">
              🔮
            </span>
            <span className="font-mono font-black text-purple-300 text-lg">
              {team.roundScores[2] || 0} pts
            </span>
          </div>
          <h4 className="font-bold text-white text-sm">Vòng 2: Trạm Thầy Cô Danh Nhân</h4>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Thời gian: {ScoringEngine.formatTime(team.roundTimes[2] || 0)}
          </p>
        </div>

        {/* Round 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-lg">
              🧩
            </span>
            <span className="font-mono font-black text-emerald-300 text-lg">
              {team.roundScores[3] || 0} pts
            </span>
          </div>
          <h4 className="font-bold text-white text-sm">Vòng 3: Giải Mã Thị Giác</h4>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Thời gian: {ScoringEngine.formatTime(team.roundTimes[3] || 0)}
          </p>
        </div>

        {/* Round 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-lg">
              💎
            </span>
            <span className="font-mono font-black text-amber-300 text-lg">
              {team.roundScores[4] || 0} pts
            </span>
          </div>
          <h4 className="font-bold text-white text-sm">Vòng 4: Lõi Năng Lượng Next Gen</h4>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Thời gian: {ScoringEngine.formatTime(team.roundTimes[4] || 0)}
          </p>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          team={team}
          rank={currentRank}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};
