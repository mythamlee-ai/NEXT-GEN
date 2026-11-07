import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Medal,
  Clock,
  Search,
  Users,
  Sparkles,
  RefreshCw,
  UserCheck,
  KeyRound,
  ShieldAlert,
  Flame,
  Award,
  Download,
  Printer,
  FileSpreadsheet,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Eye,
  Star,
  Zap,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Team } from '../../types';
import { ScoringEngine } from '../../services/scoringEngine';
import { storageService } from '../../services/storageService';
import { keywordService } from '../../services/keywordService';
import { ExcelService } from '../../services/excelService';
import { audioManager } from '../../services/audioManager';

interface LeaderboardViewProps {
  highlightTeamId?: string;
  isProjectorMode?: boolean;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  highlightTeamId,
  isProjectorMode = false,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'playing' | 'finished'>('all');
  const [activeTab, setActiveTab] = useState<'table' | 'ceremony'>('table');
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<Team | null>(null);

  // Ceremony state
  const [isCeremonyPlaying, setIsCeremonyPlaying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isOfficialLocked, setIsOfficialLocked] = useState<boolean>(() => {
    return localStorage.getItem('pek_leaderboard_locked_official') === 'true';
  });

  const loadTeams = () => {
    const list = storageService.getTeams();
    const sorted = [...list].sort(ScoringEngine.compareTeams);
    setTeams(sorted);
  };

  useEffect(() => {
    loadTeams();
    const unsubscribe = storageService.subscribe((event) => {
      if (event.type === 'TEAMS_UPDATED' || event.type === 'FACTORY_RESET') {
        loadTeams();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggleOfficialLock = () => {
    const next = !isOfficialLocked;
    setIsOfficialLocked(next);
    localStorage.setItem('pek_leaderboard_locked_official', String(next));
    audioManager.playUnlock();
  };

  const handleTriggerCeremony = () => {
    setIsCeremonyPlaying(true);
    setCountdown(3);
    audioManager.playCountdown();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setCountdown(null);
          audioManager.playVictory();
          // Launch grand confetti
          try {
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#f59e0b', '#06b6d4', '#ec4899', '#10b981', '#8b5cf6'],
            });
            setTimeout(() => {
              confetti({
                particleCount: 100,
                spread: 120,
                origin: { x: 0.2, y: 0.6 },
              });
              confetti({
                particleCount: 100,
                spread: 120,
                origin: { x: 0.8, y: 0.6 },
              });
            }, 600);
          } catch {
            // Fallback
          }
          return null;
        }
        audioManager.playCountdown();
        return prev - 1;
      });
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAssignAward = (teamId: string, awardTitle: string) => {
    const team = storageService.getTeamById(teamId);
    if (!team) return;
    const currentAwards = team.specialAwards || [];
    let updatedAwards: string[];
    if (currentAwards.includes(awardTitle)) {
      updatedAwards = currentAwards.filter((a: string) => a !== awardTitle);
    } else {
      updatedAwards = [...currentAwards, awardTitle];
    }
    const updated = { ...team, specialAwards: updatedAwards };
    storageService.saveTeam(updated);
    loadTeams();
    audioManager.playBonusPoints();
  };

  const filteredTeams = teams.filter((t) => {
    const matchSearch =
      t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teamCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.captainName && t.captainName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchSearch) return false;
    if (statusFilter === 'playing') return t.status === 'playing' || t.status === 'ready';
    if (statusFilter === 'finished') return t.status === 'finished';
    return true;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(245,158,11,0.8)] border border-yellow-200">
          <Trophy className="w-4 h-4 stroke-[2.5]" />
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-200 via-slate-300 to-cyan-200 text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(203,213,225,0.7)] border border-white">
          <Medal className="w-4 h-4 stroke-[2.5]" />
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 text-white font-black text-sm shadow-[0_0_15px_rgba(249,115,22,0.6)] border border-amber-400">
          <Medal className="w-4 h-4 stroke-[2.5]" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900/80 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30">
        #{rank}
      </span>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 sm:py-8 text-white ${isProjectorMode ? 'max-w-full' : ''}`}>
      {/* Top Banner & Control Bar */}
      <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 mb-6 shadow-[0_0_35px_rgba(6,182,212,0.25)] backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                ĐẠI HỘI KHOA HỌC PEK • BẢNG TỔNG SẮP CHÍNH THỨC
              </span>
              {isOfficialLocked ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-950 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  <Lock className="w-3 h-3" /> ĐÃ XÁC THỰC CHÍNH THỨC
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 border border-amber-500 text-amber-300">
                  <Unlock className="w-3 h-3" /> DỮ LIỆU THỜI GIAN THỰC
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              LEADERBOARD PEK SCIENCE QUEST
            </h1>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Công thức: <strong className="text-cyan-300">TỔNG ĐIỂM = TẬP THỂ (V1 + V3 + V4) + CÁ NHÂN (V2)</strong>
            </p>
          </div>

          {/* Action Tools: Export, Print, Lock, Mode Switch */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => ExcelService.exportTournamentReport(teams)}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              title="Xuất bảng điểm chi tiết dạng Excel .xlsx"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Xuất Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => ExcelService.exportToCsv(teams)}
              className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              title="Xuất dữ liệu CSV"
            >
              <Download className="w-4 h-4" />
              <span>Xuất CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              title="In bảng điểm"
            >
              <Printer className="w-4 h-4" />
              <span>In Bảng Điểm</span>
            </button>

            <button
              onClick={handleToggleOfficialLock}
              className={`px-3 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all border ${
                isOfficialLocked
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-amber-950/80 border-amber-500 text-amber-300'
              }`}
              title="Khóa/Mở khóa xác thực kết quả chính thức"
            >
              {isOfficialLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>{isOfficialLocked ? 'Mở Khóa GM' : 'Khóa Kết Quả'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-cyan-500/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'table'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-300 hover:text-white border border-cyan-500/30'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Bảng Điểm Chi Tiết (10 Cột Đầy Đủ)</span>
            </button>

            <button
              onClick={() => setActiveTab('ceremony')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ceremony'
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                  : 'bg-slate-900/60 text-slate-300 hover:text-white border border-amber-500/30'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Sân Khấu Vinh Danh 3D Gameshow</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo đội, lớp, đội trưởng..."
              className="bg-[#070b1c] border border-cyan-500/40 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 outline-none w-52 sm:w-64 focus:border-cyan-300 font-mono"
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW MODE 1: DETAILED 10-COLUMN LEADERBOARD TABLE            */}
      {/* ============================================================ */}
      {activeTab === 'table' && (
        <div className="space-y-4">
          {/* Status filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Tất cả ({teams.length})
            </button>
            <button
              onClick={() => setStatusFilter('finished')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'finished'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Đã về đích ({teams.filter((t) => t.status === 'finished').length})
            </button>
            <button
              onClick={() => setStatusFilter('playing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'playing'
                  ? 'bg-purple-500 text-white font-black'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Đang thi đấu ({teams.filter((t) => t.status !== 'finished').length})
            </button>
          </div>

          {/* 10-Column Cyber Glass Table */}
          <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-[#070b1c]/95 border-b border-cyan-500/30 text-[10px] text-cyan-300 uppercase tracking-wider">
                    <th className="py-3.5 px-3 text-center w-12">Hạng</th>
                    <th className="py-3.5 px-4 min-w-[160px]">Tên Đội &amp; Lớp</th>
                    <th className="py-3.5 px-3 text-center">Điểm V1</th>
                    <th className="py-3.5 px-3 text-center text-purple-300">V2 Cá Nhân</th>
                    <th className="py-3.5 px-3 text-center">Điểm V3</th>
                    <th className="py-3.5 px-3 text-center text-slate-300">Cơ Bản V4</th>
                    <th className="py-3.5 px-3 text-center text-emerald-400">Thưởng V4</th>
                    <th className="py-3.5 px-3 text-center text-rose-400">Phạt V4</th>
                    <th className="py-3.5 px-3 text-center text-amber-400">Tốc Độ V4</th>
                    <th className="py-3.5 px-4 text-right text-amber-300 font-black">TỔNG ĐIỂM</th>
                    <th className="py-3.5 px-3 text-center">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/15">
                  {filteredTeams.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400 font-medium font-mono">
                        Chưa có dữ liệu đội thi phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredTeams.map((team, idx) => {
                      const rank = idx + 1;
                      const r4 = team.round4State;
                      const v1 = team.roundScores[1] || 0;
                      const v2 = team.roundScores[2] || 0;
                      const v3 = team.roundScores[3] || 0;
                      const baseV4 = v1 + v2 + v3;
                      const bonusV4 = r4?.randomBonus || 0;
                      const penaltyV4 = r4?.randomPenalty || 0;
                      const speedV4 = r4?.speedBonus || 0;

                      return (
                        <tr
                          key={team.id}
                          className="hover:bg-cyan-500/10 transition-colors cursor-pointer group"
                          onClick={() => setSelectedTeamDetails(team)}
                        >
                          {/* (1) Thứ Hạng */}
                          <td className="py-3.5 px-3 text-center font-bold">
                            {getRankBadge(rank)}
                          </td>

                          {/* (2) Tên Đội & Lớp */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                                {team.teamName}
                              </span>
                              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 font-bold">
                                {team.className}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              Đội trưởng: <strong className="text-slate-300">{team.captainName || 'Chưa cập nhật'}</strong>
                            </span>
                            {team.specialAwards && team.specialAwards.length > 0 && (
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {team.specialAwards.map((award, aIdx) => (
                                  <span
                                    key={aIdx}
                                    className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-400"
                                  >
                                    ★ {award}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* (3) Điểm V1 */}
                          <td className="py-3.5 px-3 text-center text-cyan-300 font-bold">
                            {v1}đ
                          </td>

                          {/* (4) Điểm V2 Cá Nhân */}
                          <td className="py-3.5 px-3 text-center text-purple-300 font-bold">
                            {v2}đ
                          </td>

                          {/* (5) Điểm V3 */}
                          <td className="py-3.5 px-3 text-center text-cyan-300 font-bold">
                            {v3}đ
                          </td>

                          {/* (6) Cơ Bản V4 */}
                          <td className="py-3.5 px-3 text-center text-slate-300">
                            {baseV4}đ
                          </td>

                          {/* (7) Thưởng V4 */}
                          <td className="py-3.5 px-3 text-center text-emerald-400 font-bold">
                            +{bonusV4}đ
                          </td>

                          {/* (8) Phạt V4 */}
                          <td className="py-3.5 px-3 text-center text-rose-400 font-bold">
                            -{penaltyV4}đ
                          </td>

                          {/* (9) Tốc Độ V4 */}
                          <td className="py-3.5 px-3 text-center text-amber-400 font-bold">
                            +{speedV4}đ
                          </td>

                          {/* (10) Tổng Điểm */}
                          <td className="py-3.5 px-4 text-right font-black text-base text-amber-400">
                            {team.score}
                            <span className="text-[10px] text-amber-300/80 font-normal ml-1">pts</span>
                          </td>

                          {/* Action view modal */}
                          <td className="py-3.5 px-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTeamDetails(team);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 text-cyan-300 hover:text-white transition-all cursor-pointer"
                              title="Xem chi tiết thành viên và tiến trình"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW MODE 2: 3D GAMESHOW CEREMONY & PODIUM SCREEN            */}
      {/* ============================================================ */}
      {activeTab === 'ceremony' && (
        <div className="space-y-8">
          {/* Ceremony Controller */}
          <div className="bg-[#0c1435]/90 border border-amber-500/40 rounded-3xl p-5 text-center backdrop-blur-xl">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
              ĐIỀU HÀNH LỄ BẾ MẠC &amp; VINH DANH QUÁN QUÂN
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-4">
              SÂN KHẤU CÚP VÀNG NEXT GEN CHAMPIONS
            </h2>

            {countdown !== null ? (
              <div className="text-6xl sm:text-7xl font-black font-mono text-amber-400 animate-bounce my-4">
                {countdown}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleTriggerCeremony}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs font-mono shadow-[0_0_25px_rgba(245,158,11,0.7)] flex items-center gap-2 cursor-pointer uppercase tracking-wider transition-all transform hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>KÍCH HOẠT LỄ BẾ MẠC &amp; BẮN PHÁO HOA</span>
                </button>
              </div>
            )}
          </div>

          {/* Top 3 3D Neon Hologram Podium */}
          {teams.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end perspective-1000 pt-8">
              {/* Rank 2 (Silver Pedestal) */}
              <div className="bg-[#0c1435]/95 border-2 border-slate-300/80 rounded-3xl p-6 text-center shadow-[0_0_35px_rgba(203,213,225,0.4)] relative order-2 md:order-1 flex flex-col items-center backdrop-blur-2xl hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950 font-black flex items-center justify-center text-2xl mb-3 shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse">
                  🥈
                </div>
                <span className="text-[11px] font-mono font-black text-slate-200 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full border border-slate-400">
                  Á QUÂN (HẠNG NHÌ)
                </span>
                <h3 className="font-black text-xl text-white mt-3">{teams[1].teamName}</h3>
                <span className="text-xs text-cyan-300 font-mono font-bold mt-1">Lớp: {teams[1].className}</span>
                <span className="text-3xl font-black text-cyan-300 font-mono mt-4">
                  {teams[1].score} <span className="text-sm font-normal text-slate-400">pts</span>
                </span>
              </div>

              {/* Rank 1 (Gold Champion High Pedestal) */}
              <div className="bg-gradient-to-b from-[#24174d]/95 via-[#131c4f]/95 to-[#0b1029]/95 border-2 border-amber-400 rounded-3xl p-8 text-center shadow-[0_0_60px_rgba(245,158,11,0.6)] relative order-1 md:order-2 flex flex-col items-center md:-translate-y-6 backdrop-blur-2xl overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.9)]" />
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-4xl shadow-[0_0_35px_rgba(245,158,11,0.9)] mb-3 animate-bounce">
                  👑
                </div>
                <span className="text-xs font-mono font-black text-amber-300 uppercase tracking-widest bg-amber-950 px-4 py-1.5 rounded-full border border-amber-400 shadow-lg">
                  QUÁN QUÂN NEXT GEN (HẠNG NHẤT)
                </span>
                <h3 className="font-black text-2xl sm:text-3xl text-white mt-3 tracking-tight">
                  {teams[0].teamName}
                </h3>
                <span className="text-sm text-amber-300 font-mono font-bold mt-1">
                  Lớp: {teams[0].className} • Mã: {teams[0].teamCode}
                </span>
                <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono mt-4 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                  {teams[0].score} <span className="text-sm font-normal text-amber-300">pts</span>
                </span>
              </div>

              {/* Rank 3 (Bronze Pedestal) */}
              <div className="bg-[#0c1435]/95 border-2 border-amber-600/80 rounded-3xl p-6 text-center shadow-[0_0_35px_rgba(249,115,22,0.4)] relative order-3 flex flex-col items-center backdrop-blur-2xl hover:-translate-y-2 transition-transform">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 to-amber-700 text-white font-black flex items-center justify-center text-2xl mb-3 shadow-[0_0_20px_rgba(249,115,22,0.8)] animate-pulse">
                  🥉
                </div>
                <span className="text-[11px] font-mono font-black text-amber-300 uppercase tracking-widest bg-amber-950 px-3 py-1 rounded-full border border-amber-600">
                  QUÝ QUÂN (HẠNG BA)
                </span>
                <h3 className="font-black text-xl text-white mt-3">{teams[2].teamName}</h3>
                <span className="text-xs text-amber-400 font-mono font-bold mt-1">Lớp: {teams[2].className}</span>
                <span className="text-3xl font-black text-amber-400 font-mono mt-4">
                  {teams[2].score} <span className="text-sm font-normal text-slate-400">pts</span>
                </span>
              </div>
            </div>
          )}

          {/* Special Awards Showcase (Danh hiệu phụ) */}
          <div className="bg-[#0c1435]/90 border border-purple-500/40 rounded-3xl p-6 shadow-[0_0_35px_rgba(168,85,247,0.25)] backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-purple-400 animate-pulse" />
              <h3 className="text-lg font-black text-white">DANH HIỆU VINH DANH PHỤ DO GAME MASTER TRAO</h3>
            </div>
            <p className="text-xs text-slate-300 mb-6 font-sans">
              Các danh hiệu phụ được trao dựa trên thành tích đặc sắc của các cá nhân và đội thi (không cộng thêm điểm vào bảng tổng).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'MVP TOÀN NĂNG', desc: 'Cá nhân đạt điểm Vòng 2 cao nhất', icon: '🌟', color: 'border-yellow-400 text-yellow-300' },
                { title: 'SPEED MASTER', desc: 'Đội hoàn thành nhanh nhất', icon: '⚡', color: 'border-cyan-400 text-cyan-300' },
                { title: 'SCIENCE WIZARD', desc: 'Đội giải đúng nhiều câu hỏi nhất', icon: '🧙', color: 'border-emerald-400 text-emerald-300' },
                { title: 'BEST SYNERGY', desc: 'Đội phối hợp ăn ý nhất', icon: '🤝', color: 'border-purple-400 text-purple-300' },
              ].map((award, i) => (
                <div key={i} className={`p-4 rounded-2xl bg-[#070b1c] border ${award.color} space-y-2`}>
                  <div className="text-3xl">{award.icon}</div>
                  <h4 className="font-black text-sm text-white">{award.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{award.desc}</p>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Trao cho đội:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleAssignAward(e.target.value, award.title);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-1.5 font-mono cursor-pointer"
                      defaultValue=""
                    >
                      <option value="">-- Chọn đội --</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.teamName} ({t.className})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: CHI TIẾT ĐỘI THI & THÀNH VIÊN                         */}
      {/* ============================================================ */}
      {selectedTeamDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0c1435] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(6,182,212,0.4)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cyan-500/30 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  HỒ SƠ THI ĐẤU CHI TIẾT
                </span>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{selectedTeamDetails.teamName}</span>
                  <span className="text-xs bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400">
                    {selectedTeamDetails.className}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedTeamDetails(null)}
                className="text-slate-400 hover:text-white p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Member List and Individual Scores at Round 2 */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold text-purple-300 uppercase mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>DANH SÁCH THÀNH VIÊN &amp; ĐIỂM CÁ NHÂN VÒNG 2 (SOLO):</span>
              </h4>
              <div className="space-y-2">
                {(selectedTeamDetails.members && selectedTeamDetails.members.length > 0
                  ? selectedTeamDetails.members
                  : [selectedTeamDetails.captainName || 'Đội trưởng']
                ).map((member, mIdx) => {
                  const mScore =
                    selectedTeamDetails.memberScores && selectedTeamDetails.memberScores[member] !== undefined
                      ? selectedTeamDetails.memberScores[member]
                      : Math.round(
                          (selectedTeamDetails.roundScores[2] || 0) /
                            (selectedTeamDetails.members?.length || 1)
                        );
                  return (
                    <div
                      key={mIdx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-purple-950 text-purple-300 flex items-center justify-center font-bold text-[10px] border border-purple-500/40">
                          {mIdx + 1}
                        </span>
                        <span className="text-white font-bold">{member}</span>
                        {mIdx === 0 && (
                          <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500">
                            Đội Trưởng
                          </span>
                        )}
                      </div>
                      <span className="text-purple-300 font-bold">V2: +{mScore} điểm</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Round by Round Performance */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase mb-2">
                TIẾN TRÌNH &amp; THỜI GIAN QUA 4 VÒNG:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {[1, 2, 3, 4].map((r) => (
                  <div key={r} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">VÒNG {r}:</span>
                    <span className="text-base font-black text-cyan-300 block">
                      {selectedTeamDetails.roundScores[r as 1 | 2 | 3 | 4] || 0}đ
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ⏱ {selectedTeamDetails.roundTimes[r as 1 | 2 | 3 | 4] || 0}s
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Round 4 Detailed Breakdown */}
            {selectedTeamDetails.round4State && (
              <div className="p-4 rounded-2xl bg-[#070b1c] border border-cyan-500/30 font-mono text-xs mb-6">
                <span className="text-amber-400 font-bold block mb-2 uppercase">
                  CHI TIẾT VÒNG 4 (AI LAB MẬT MÃ KHOA HỌC):
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Cơ bản V4: +{selectedTeamDetails.round4State.baseScore || 0}đ</div>
                  <div>Bonus may mắn: +{selectedTeamDetails.round4State.randomBonus || 0}đ</div>
                  <div>Phạt sai lệch: -{selectedTeamDetails.round4State.randomPenalty || 0}đ</div>
                  <div>Thưởng tốc độ: +{selectedTeamDetails.round4State.speedBonus || 0}đ</div>
                  <div>Từ khóa &amp; Mã cuối: +{(selectedTeamDetails.round4State.finalBonus || 0) + (selectedTeamDetails.round4State.keywordScore || 0)}đ</div>
                  {selectedTeamDetails.round4State.manualAdjustment ? (
                    <div className="text-purple-300 font-bold">
                      GM Điều chỉnh: {selectedTeamDetails.round4State.manualAdjustment > 0 ? `+${selectedTeamDetails.round4State.manualAdjustment}` : selectedTeamDetails.round4State.manualAdjustment}đ
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            <div className="text-right">
              <button
                onClick={() => setSelectedTeamDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono cursor-pointer"
              >
                Đóng Hồ Sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

