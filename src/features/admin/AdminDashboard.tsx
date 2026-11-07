import React, { useState, useEffect } from 'react';
import {
  Users,
  Play,
  Pause,
  FastForward,
  Square,
  Trophy,
  Clock,
  Sparkles,
  Layers,
  Database,
  Tv,
  Settings,
  RefreshCw,
  Award,
  Radio,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
  Gift,
  Lock,
  KeyRound,
  ShieldCheck,
  Download,
  Cpu,
  Gamepad2,
} from 'lucide-react';
import { Team, GameConfig, AdminTab } from '../../types';
import { storageService } from '../../services/storageService';
import { ScoringEngine } from '../../services/scoringEngine';
import { ExcelService } from '../../services/excelService';
import { TeamMonitor } from './TeamMonitor';
import { QuestionBankView } from './QuestionBankView';
import { MysteryCodesView } from './MysteryCodesView';
import { StationPrintModal } from './StationPrintModal';
import { SystemDiagnosticsView } from './SystemDiagnosticsView';
import { LeaderboardView } from '../leaderboard/LeaderboardView';
import { KeywordManagementView } from './KeywordManagementView';
import { Round3AdminView } from './Round3AdminView';
import { Round4AdminView } from './Round4AdminView';
import { audioManager } from '../../services/audioManager';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminDashboard: React.FC = () => {
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [teams, setTeams] = useState<Team[]>([]);
  const [config, setConfig] = useState<GameConfig>(storageService.getGameConfig());
  const [showPrintStations, setShowPrintStations] = useState<boolean>(false);
  const [showEndGameConfirm, setShowEndGameConfirm] = useState<boolean>(false);

  const refreshAll = () => {
    const list = storageService.getTeams();
    setTeams([...list]);
    setConfig(storageService.getGameConfig());
  };

  useEffect(() => {
    refreshAll();
    const unsub = storageService.subscribe((event) => {
      if (
        event.type === 'TEAMS_UPDATED' ||
        event.type === 'CONFIG_UPDATED' ||
        event.type === 'FACTORY_RESET'
      ) {
        refreshAll();
      }
    });
    return () => unsub();
  }, []);

  // Compute Master KPIs
  const totalTeams = teams.length;
  const waitingTeams = teams.filter((t) => t.status === 'ready').length;
  const playingTeams = teams.filter((t) => t.status === 'playing').length;
  const completedTeams = teams.filter((t) => t.status === 'finished').length;

  const sortedTeams = [...teams].sort(ScoringEngine.compareTeams);
  const highestScoreTeam = sortedTeams[0];
  const finishedTeams = sortedTeams.filter((t) => t.status === 'finished');
  const bestTimeTeam = finishedTeams.length > 0 ? finishedTeams[0] : null;

  // Master Control Actions
  const handleStartGame = () => {
    const updated: GameConfig = { ...config, gameStatus: 'in_progress' };
    storageService.saveGameConfig(updated);
    audioManager.playUnlock();
  };

  const handlePauseGame = () => {
    const updated: GameConfig = { ...config, gameStatus: 'paused' };
    storageService.saveGameConfig(updated);
  };

  const handleResumeGame = () => {
    const updated: GameConfig = { ...config, gameStatus: 'in_progress' };
    storageService.saveGameConfig(updated);
    audioManager.playUnlock();
  };

  const handleNextRound = () => {
    if (config.globalCurrentRound < 4) {
      const nextR = (config.globalCurrentRound + 1) as 1 | 2 | 3 | 4;
      const updated: GameConfig = { ...config, globalCurrentRound: nextR };
      storageService.saveGameConfig(updated);
      audioManager.playUnlock();
    }
  };

  const handleEndGame = () => {
    setShowEndGameConfirm(true);
  };

  const confirmEndGameAction = () => {
    const updated: GameConfig = { ...config, gameStatus: 'completed' };
    storageService.saveGameConfig(updated);
    audioManager.playVictory();
    setShowEndGameConfirm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-white">
      {/* Top Banner - Cybernetic Command Deck */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              GAME MASTER COMMAND CENTER • NEXT GEN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-cyan-400" />
            ĐIỀU HÀNH GIẢI ĐẤU KHOA HỌC PEK
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono font-medium">
            Tổ Khoa học Tự nhiên • Giám sát thời gian thực, Kho từ khóa mật mã & Quản trị hệ thống
          </p>
        </div>

        {/* Global Game Status & Quick Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {config.gameStatus === 'waiting' && (
            <button
              onClick={handleStartGame}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current text-slate-950" />
              <span>BẮT ĐẦU GIẢI</span>
            </button>
          )}

          {config.gameStatus === 'in_progress' && (
            <button
              onClick={handlePauseGame}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95"
            >
              <Pause className="w-4 h-4" />
              <span>TẠM DỪNG</span>
            </button>
          )}

          {config.gameStatus === 'paused' && (
            <button
              onClick={handleResumeGame}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>TIẾP TỤC GIẢI</span>
            </button>
          )}

          <button
            onClick={handleNextRound}
            disabled={config.globalCurrentRound >= 4}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              config.globalCurrentRound < 4
                ? 'bg-purple-950/60 hover:bg-purple-900/60 border-purple-500/50 text-purple-200'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <FastForward className="w-4 h-4" />
            <span>Chuyển Vòng {Math.min(4, config.globalCurrentRound + 1)}</span>
          </button>

          <button
            onClick={handleEndGame}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>KẾT THÚC</span>
          </button>

          <button
            onClick={() => ExcelService.exportTournamentReport(teams)}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Xuất Báo Cáo (.xlsx)</span>
          </button>

          <button
            onClick={() => setShowPrintStations(true)}
            className="px-3.5 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>In Thẻ Trạm</span>
          </button>

          <a
            href="/pek-science-quest.html"
            download="pek-science-quest.html"
            className="px-3.5 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Tải toàn bộ web game đóng gói trong 1 file HTML duy nhất (chơi offline không cần internet)"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Tải Web (.html)</span>
          </a>

          <button
            onClick={refreshAll}
            title="Làm mới trạng thái"
            className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {/* Total Teams */}
        <div className="bg-[#0c1435]/90 border border-slate-700/60 rounded-2xl p-4 shadow-md backdrop-blur-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
            Tổng Số Đội
          </span>
          <span className="text-2xl font-black text-white font-mono">{totalTeams}</span>
        </div>

        {/* Playing */}
        <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md">
          <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold block mb-1">
            Đang Thi Đấu
          </span>
          <span className="text-2xl font-black text-cyan-300 font-mono">{playingTeams}</span>
        </div>

        {/* Completed */}
        <div className="bg-[#0c1435]/90 border border-emerald-500/40 rounded-2xl p-4 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-md">
          <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold block mb-1">
            Đã Hoàn Thành
          </span>
          <span className="text-2xl font-black text-emerald-300 font-mono">{completedTeams}</span>
        </div>

        {/* Current Round */}
        <div className="bg-[#0c1435]/90 border border-purple-500/40 rounded-2xl p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-md">
          <span className="text-[11px] font-mono text-purple-400 uppercase font-bold block mb-1">
            Vòng Toàn Cục
          </span>
          <span className="text-2xl font-black text-purple-300 font-mono">
            Vòng {config.globalCurrentRound}/4
          </span>
        </div>

        {/* Highest Score */}
        <div className="bg-[#0c1435]/90 border border-amber-500/40 rounded-2xl p-4 shadow-[0_0_15px_rgba(245,158,11,0.15)] backdrop-blur-md">
          <span className="text-[11px] font-mono text-amber-400 uppercase font-bold block mb-1">
            Điểm Cao Nhất
          </span>
          <span className="text-2xl font-black text-amber-300 font-mono truncate block">
            {highestScoreTeam ? `${highestScoreTeam.score} pts` : '0 pts'}
          </span>
        </div>

        {/* Best Time */}
        <div className="bg-[#0c1435]/90 border border-fuchsia-500/40 rounded-2xl p-4 shadow-[0_0_15px_rgba(217,70,239,0.15)] backdrop-blur-md">
          <span className="text-[11px] font-mono text-fuchsia-400 uppercase font-bold block mb-1">
            Thời Gian Nhanh Nhất
          </span>
          <span className="text-2xl font-black text-fuchsia-300 font-mono truncate block">
            {bestTimeTeam ? ScoringEngine.formatTime(bestTimeTeam.elapsedTime) : '--:--'}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-cyan-500/20 pb-3">
        <button
          onClick={() => setAdminTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'dashboard'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : 'text-slate-300 hover:text-white bg-[#0c1435]/80 border border-cyan-500/30'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Theo Dõi & Điều Khiển Đội Thi</span>
        </button>

        <button
          onClick={() => setAdminTab('keywords')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'keywords'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : 'text-amber-300 hover:text-amber-200 bg-[#0c1435]/80 border border-amber-500/40'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>🔑 Quản Trị Kho Từ Khóa (35+)</span>
        </button>

        <button
          onClick={() => setAdminTab('round3')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'round3'
              ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.6)]'
              : 'text-amber-300 hover:text-amber-200 bg-[#0c1435]/80 border border-amber-500/40'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-amber-400" />
          <span>🎮 Điều Hành Vòng 3 (Đuổi Hình Bắt Chữ)</span>
        </button>

        <button
          onClick={() => setAdminTab('round4')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'round4'
              ? 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white font-black shadow-[0_0_20px_rgba(6,182,212,0.6)]'
              : 'text-cyan-300 hover:text-cyan-200 bg-[#0c1435]/80 border border-cyan-500/40'
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>🚀 Quản Trị Round 4 (AI Lab & 16 Gói)</span>
        </button>

        <button
          onClick={() => setAdminTab('projector')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'projector'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : 'text-slate-300 hover:text-white bg-[#0c1435]/80 border border-cyan-500/30'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Leaderboard Máy Chiếu Sân Khấu</span>
        </button>

        <button
          onClick={() => setAdminTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'questions'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : 'text-slate-300 hover:text-white bg-[#0c1435]/80 border border-cyan-500/30'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Quản Trị Ngân Hàng Câu Hỏi</span>
        </button>

        <button
          onClick={() => setAdminTab('diagnostics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            adminTab === 'diagnostics'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-[0_0_20px_rgba(99,102,241,0.5)]'
              : 'text-slate-300 hover:text-white bg-[#0c1435]/80 border border-indigo-500/30'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Kiểm Tra Hệ Thống (Diagnostics)</span>
        </button>
      </div>

      {/* Tab 1: Teams Control Monitor */}
      {adminTab === 'dashboard' && (
        <TeamMonitor teams={teams} onRefresh={refreshAll} />
      )}

      {/* Tab: Keywords Management */}
      {adminTab === 'keywords' && (
        <KeywordManagementView onRefresh={refreshAll} />
      )}

      {/* Tab: Round 3 Ca Dao Tục Ngữ Control */}
      {adminTab === 'round3' && (
        <Round3AdminView onRefresh={refreshAll} />
      )}

      {/* Tab: Round 4 AI Lab Engine */}
      {adminTab === 'round4' && (
        <Round4AdminView onRefresh={refreshAll} />
      )}

      {/* Tab 2: Projector Leaderboard */}
      {adminTab === 'projector' && (
        <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-xl">
          <LeaderboardView isProjectorMode={true} />
        </div>
      )}

      {/* Tab 3: Question Bank CRUD */}
      {adminTab === 'questions' && (
        <QuestionBankView onRefresh={refreshAll} />
      )}

      {/* Tab 4: System Diagnostics & Camera Test */}
      {adminTab === 'diagnostics' && (
        <SystemDiagnosticsView />
      )}

      {/* Printable QR Stations Modal */}
      {showPrintStations && (
        <StationPrintModal onClose={() => setShowPrintStations(false)} />
      )}

      {/* End Game In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={showEndGameConfirm}
        title="Kết Thúc Giải Đấu PeK Science Quest"
        message="Bạn có chắc chắn muốn kết thúc toàn bộ giải đấu và công bố bảng xếp hạng chung cuộc?"
        confirmText="Xác Nhận Kết Thúc"
        type="warning"
        onConfirm={confirmEndGameAction}
        onCancel={() => setShowEndGameConfirm(false)}
      />
    </div>
  );
};
