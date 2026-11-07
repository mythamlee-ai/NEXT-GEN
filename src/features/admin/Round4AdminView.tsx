import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Sliders,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  KeyRound,
  Shield,
  Layers,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Award,
  Sparkles,
  BarChart2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Round4Package, Round4Config, Round4Log, ScienceCoreType } from '../../types/round4';
import { Round4Engine, defaultRound4Config } from '../../services/round4Engine';
import { storageService } from '../../services/storageService';
import { Team } from '../../types';
import { audioManager } from '../../services/audioManager';

interface Round4AdminViewProps {
  onRefresh?: () => void;
}

export const Round4AdminView: React.FC<Round4AdminViewProps> = ({ onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'packages' | 'config' | 'logs'>('packages');
  const [packages, setPackages] = useState<Round4Package[]>([]);
  const [config, setConfig] = useState<Round4Config>(Round4Engine.getConfig());
  const [logs, setLogs] = useState<Round4Log[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoreFilter, setSelectedCoreFilter] = useState<'ALL' | ScienceCoreType>('ALL');
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // GM Manual controls for teams
  const [selectedTeamForAdjust, setSelectedTeamForAdjust] = useState<Team | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('');

  const loadAll = () => {
    setPackages(Round4Engine.getPackages());
    setConfig(Round4Engine.getConfig());
    setLogs(Round4Engine.getLogs());
    setTeams(storageService.getTeams());
  };

  const handleGmManualUnlock = (teamId: string) => {
    if (window.confirm('Xác nhận mở khóa thủ công 3 Ổ Khóa Cổng Bảo Mật cho đội này?')) {
      const success = Round4Engine.gmManualUnlockGate(teamId);
      if (success) {
        audioManager.playUnlock();
        loadAll();
        setSavedSuccessMsg('Đã mở khóa thủ công 3 Ổ Khóa thành công!');
        setTimeout(() => setSavedSuccessMsg(null), 3000);
      }
    }
  };

  const handleApplyScoreAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamForAdjust || !adjustReason.trim()) return;
    const res = Round4Engine.adjustTeamScore(
      selectedTeamForAdjust.id,
      adjustDelta,
      adjustReason,
      'Game Master'
    );
    if (res.success) {
      audioManager.playBonusPoints();
      loadAll();
      setSavedSuccessMsg(res.message);
      setSelectedTeamForAdjust(null);
      setAdjustReason('');
      setTimeout(() => setSavedSuccessMsg(null), 4000);
    }
  };

  const [verifyingTeamId, setVerifyingTeamId] = useState<string | null>(null);

  const handleGmVerifyScan = (team: Team) => {
    const r4 = team.round4State;
    if (!r4) {
      alert(`Đội "${team.teamName}" chưa bắt đầu dữ liệu Vòng 4!`);
      return;
    }

    if (!r4.keywordVaultUnlocked) {
      alert(
        `Cổng bảo mật 3 ổ khóa của đội "${team.teamName}" chưa mở! Vui lòng nhấn "🔓 Mở Cổng" trước khi xác thực tín hiệu.`
      );
      return;
    }

    if (r4.aiScanCompleted) {
      alert(
        `Nhiệm vụ Quét Tín Hiệu của đội "${team.teamName}" đã được xác thực trước đó (${
          r4.aiScanResult?.isCorrect ? 'CHÍNH XÁC' : 'SAI'
        }). Trạng thái vòng chơi đã chuyển sang bước kế tiếp.`
      );
      return;
    }

    const pkg =
      packages.find((p) => p.id === r4.assignedPackageId) ||
      Round4Engine.getPackages().find((p) => p.id === r4.assignedPackageId);

    let targetId = r4.selectedScanTargetId;

    // If team has not selected a signal on screen, notify GM with clear guidance or allow manual assignment
    if (!targetId) {
      if (!pkg) {
        alert(`⚠️ Đội "${team.teamName}" chưa có dữ liệu tín hiệu để xác thực!`);
        return;
      }
      const targetsList = pkg.aiScan.scanTargets
        .map((t, idx) => `${idx + 1}. [${t.id}] ${t.label} (Tần số: ${t.frequency})`)
        .join('\n');
      const manualInput = window.prompt(
        `⚠️ Đội "${team.teamName}" chưa thu nhận tín hiệu nào từ màn hình máy trạm.\n\n` +
          `Danh sách tín hiệu có thể quét của gói ${pkg.id}:\n${targetsList}\n\n` +
          `Nhập mã ID tín hiệu (ví dụ: "${pkg.aiScan.scanTargets[0].id}") để Game Master xác thực thay đội, hoặc bấm Hủy:`
      );
      if (!manualInput || !manualInput.trim()) return;
      targetId = manualInput.trim();
    }

    const target = pkg?.aiScan.scanTargets.find((t) => t.id === targetId);
    const correctTarget = pkg?.aiScan.scanTargets.find((t) => t.id === pkg?.aiScan.correctTargetId);

    const confirmMsg =
      `📡 XÁC THỰC QUÉT TÍN HIỆU CHO ĐỘI: ${team.teamName}\n` +
      `- Tín hiệu thu nhận: ${target?.label || targetId} (${target?.frequency || 'Dải tần số'})\n` +
      `- Tín hiệu chuẩn của gói: ${correctTarget?.label || pkg?.aiScan.correctTargetId} (${correctTarget?.frequency || ''})\n\n` +
      `Bấm OK để tiến hành xác thực và đồng bộ ngay lập tức tới máy trạm Đội chơi.`;

    if (!window.confirm(confirmMsg)) return;

    setVerifyingTeamId(team.id);
    const res = Round4Engine.verifySignalScan(team.id, targetId, 'GAME_MASTER');
    setVerifyingTeamId(null);

    if (res.success) {
      if (res.isCorrect) {
        audioManager.playBonusPoints();
      } else {
        audioManager.playIncorrect();
      }
      loadAll();
      setSavedSuccessMsg(`[GM XÁC THỰC] ${res.message}`);
      setTimeout(() => setSavedSuccessMsg(null), 5000);
    } else {
      audioManager.playIncorrect();
      alert(`Lỗi xác thực: ${res.message}`);
    }
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(() => {
      setLogs(Round4Engine.getLogs());
      setTeams(storageService.getTeams());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleActive = (pkgId: string) => {
    Round4Engine.togglePackageActive(pkgId);
    setPackages(Round4Engine.getPackages());
    audioManager.playPop();
  };

  const handleResetPackages = () => {
    if (window.confirm('Khôi phục danh sách 16 Gói Nhiệm Vụ Round 4 về mặc định?')) {
      Round4Engine.resetPackagesToDefault();
      setPackages(Round4Engine.getPackages());
      audioManager.playUnlock();
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    Round4Engine.saveConfig(config);
    audioManager.playUnlock();
    setSavedSuccessMsg('Đã lưu cấu hình Round 4 thành công!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
    if (onRefresh) onRefresh();
  };

  const handleResetConfig = () => {
    if (window.confirm('Khôi phục cấu hình Round 4 về mặc định ban đầu?')) {
      Round4Engine.saveConfig(defaultRound4Config);
      setConfig(defaultRound4Config);
      audioManager.playUnlock();
      setSavedSuccessMsg('Đã khôi phục cấu hình mặc định!');
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ Audit Logs của Round 4?')) {
      Round4Engine.clearLogs();
      setLogs([]);
      audioManager.playPop();
    }
  };

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    const primaryCore = pkg.aiScan.core;
    const matchesSearch =
      pkg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.finalCode.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCore = selectedCoreFilter === 'ALL' || primaryCore === selectedCoreFilter;
    return matchesSearch && matchesCore;
  });

  const activeCount = packages.filter((p) => p.active).length;
  const teamsInRound4 = teams.filter((t) => t.round4State || t.roundScores[4] > 0);

  const getCoreBadge = (core: ScienceCoreType) => {
    switch (core) {
      case 'physics':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
            ⚛️ PHYSICS CORE
          </span>
        );
      case 'chemistry':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            🧪 CHEMISTRY CORE
          </span>
        );
      case 'biology':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40">
            🧬 BIOLOGY CORE
          </span>
        );
      case 'ai_tech':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/40">
            🤖 AI & TECH CORE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  THE FINAL MISSION ENGINE
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-indigo-900/60 text-indigo-300 border border-indigo-500/40">
                  ROUND 4 MASTER CONTROL
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                AI LAB: GIẢI MÃ TỐI MẬT &amp; CỐT LÕI NĂNG LƯỢNG
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-slate-300">
              <span className="text-slate-500">Gói hoạt động:</span>{' '}
              <strong className="text-cyan-300 font-bold">
                {activeCount} / {packages.length}
              </strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-purple-500/30 text-xs font-mono text-slate-300">
              <span className="text-slate-500">Độ khó:</span>{' '}
              <strong className="text-purple-300 font-bold">{config.difficulty}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs font-mono text-slate-300">
              <span className="text-slate-500">Thời gian hiệu lực:</span>{' '}
              <strong className="text-emerald-300 font-bold">
                {Round4Engine.getEffectiveTimeLimit(config)}s
              </strong>
            </div>
          </div>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex flex-wrap items-center gap-2 mt-6 border-t border-cyan-500/20 pt-4">
          <button
            onClick={() => setActiveSubTab('packages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'packages'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border border-cyan-500/30'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>16 Gói Nhiệm Vụ Khoa Học</span>
          </button>

          <button
            onClick={() => setActiveSubTab('config')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'config'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border border-purple-500/30'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Cấu Hình Luật Chơi &amp; Điểm Thưởng</span>
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'logs'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border border-amber-500/30'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Logs &amp; Giám Sát Đội Thi ({logs.length})</span>
          </button>
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-5 h-5" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 1: PACKAGES MANAGEMENT                               */}
      {/* ============================================================ */}
      {activeSubTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0c1435]/80 border border-cyan-500/30 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm gói (ID, tên, theme, final code)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Core filters */}
              <div className="flex items-center gap-1">
                {(['ALL', 'physics', 'chemistry', 'biology', 'ai_tech'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCoreFilter(c)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      selectedCoreFilter === c
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-700/60'
                    }`}
                  >
                    {c === 'ALL'
                      ? 'TẤT CẢ'
                      : c === 'physics'
                      ? 'PHYSICS'
                      : c === 'chemistry'
                      ? 'CHEMISTRY'
                      : c === 'biology'
                      ? 'BIOLOGY'
                      : 'AI TECH'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetPackages}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi Phục Mặc Định</span>
              </button>
            </div>
          </div>

          {/* Package Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPackages.map((pkg) => {
              const isExpanded = expandedPkgId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl border transition-all ${
                    pkg.active
                      ? 'bg-[#0c1435]/90 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-black text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/40">
                            {pkg.id.toUpperCase()}
                          </span>
                          {getCoreBadge(pkg.aiScan.core)}
                        </div>
                        <h3 className="text-base font-black text-white">{pkg.title}</h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{pkg.theme}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(pkg.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            pkg.active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-400/50 hover:bg-rose-500/30'
                          }`}
                        >
                          {pkg.active ? 'BẬT' : 'TẮT'}
                        </button>
                        <button
                          onClick={() => setExpandedPkgId(isExpanded ? null : pkg.id)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Summary row */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block">AI Scan:</span>
                        <span className="text-cyan-300 truncate block">
                          {pkg.aiScan.title}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Puzzle:</span>
                        <span className="text-purple-300 uppercase truncate block">
                          {pkg.keywordPuzzle.type} ({pkg.keywordPuzzle.finalKeyword})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Final Code:</span>
                        <span className="text-amber-300 font-black truncate block">
                          {pkg.finalCode.code}
                        </span>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-cyan-500/20 space-y-3 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                        <div>
                          <strong className="text-cyan-400 font-mono block">1. AI SCAN MISSION:</strong>
                          <p className="text-slate-300 mt-0.5">{pkg.aiScan.prompt}</p>
                          <span className="text-slate-400 text-[11px]">
                            Mục tiêu đúng:{' '}
                            <strong className="text-cyan-300">
                              {pkg.aiScan.scanTargets.find((t) => t.id === pkg.aiScan.correctTargetId)?.label || pkg.aiScan.correctTargetId}
                            </strong>
                          </span>
                        </div>

                        <div>
                          <strong className="text-rose-400 font-mono block">2. AI ERROR DETECTOR:</strong>
                          <p className="text-slate-300 mt-0.5">{pkg.aiErrorDetector.bugDescription}</p>
                          <p className="text-[11px] text-emerald-300 mt-1 font-mono">
                            Vá lỗi chính xác: Option {pkg.aiErrorDetector.correctOptionId}
                          </p>
                        </div>

                        <div>
                          <strong className="text-amber-400 font-mono block">3. SCIENCE CROSSOVER:</strong>
                          <p className="text-slate-300 mt-0.5">{pkg.scienceCrossover.scientificDilemma}</p>
                          <p className="text-[11px] text-cyan-300 mt-1 font-mono">
                            Quyết định chuẩn xác: Option {pkg.scienceCrossover.correctOptionId}
                          </p>
                        </div>

                        <div>
                          <strong className="text-purple-400 font-mono block">4. AI DATA LAB:</strong>
                          <p className="text-slate-300 mt-0.5">{pkg.aiDataLab.question}</p>
                          <p className="text-[11px] text-emerald-300 mt-1 font-mono">
                            Kết luận chuẩn: {pkg.aiDataLab.correctOptionId || pkg.aiDataLab.numericalTarget}
                          </p>
                        </div>

                        <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">
                            Mật mã giải phóng lõi:{' '}
                            <strong className="text-amber-400 font-black">{pkg.finalCode.code}</strong>
                          </span>
                          <span className="text-[11px] font-mono text-cyan-400">
                            Checksum: {pkg.finalCode.systemChecksum}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: CONFIGURATION & RULES                             */}
      {/* ============================================================ */}
      {activeSubTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time & Difficulty */}
            <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-cyan-500/20 pb-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Thời Gian &amp; Cấp Độ Khó</span>
              </h3>

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5">
                  Thời Gian Cơ Bản (Giây) [3 - 7 phút = 180s - 420s]:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="180"
                    max="420"
                    step="30"
                    value={config.baseTimeLimitSeconds}
                    onChange={(e) =>
                      setConfig({ ...config, baseTimeLimitSeconds: parseInt(e.target.value) || 300 })
                    }
                    className="flex-1 accent-cyan-400"
                  />
                  <span className="font-mono font-black text-cyan-300 text-sm bg-slate-900 px-3 py-1.5 rounded-lg border border-cyan-500/40 min-w-[70px] text-center">
                    {config.baseTimeLimitSeconds}s ({Math.floor(config.baseTimeLimitSeconds / 60)}m
                    {config.baseTimeLimitSeconds % 60 ? ` ${config.baseTimeLimitSeconds % 60}s` : ''})
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5">
                  Độ Khó Thử Thách (Difficulty Tier):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STANDARD', 'ADVANCED', 'FINAL_BOSS'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setConfig({ ...config, difficulty: diff })}
                      className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                        config.difficulty === diff
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                          : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-black">
                        {diff === 'STANDARD' ? 'STANDARD' : diff === 'ADVANCED' ? 'ADVANCED' : 'FINAL BOSS'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-300 mt-1">
                        {diff === 'STANDARD'
                          ? '100% thời gian'
                          : diff === 'ADVANCED'
                          ? '-15% thời gian'
                          : '-25% thời gian'}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-cyan-300 mt-2 font-mono">
                  → Thời gian thực tế áp dụng cho đội chơi:{' '}
                  <strong>{Round4Engine.getEffectiveTimeLimit(config)} giây</strong>
                </p>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5">
                  Thời Gian Animation Lucky Bonus / Penalty (ms):
                </label>
                <input
                  type="number"
                  min="1000"
                  max="4000"
                  step="200"
                  value={config.animationDurationMs}
                  onChange={(e) =>
                    setConfig({ ...config, animationDurationMs: parseInt(e.target.value) || 2200 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Lucky Bonus & Penalty Setup */}
            <div className="bg-[#0c1435]/90 border border-purple-500/40 rounded-3xl p-6 shadow-[0_0_25px_rgba(168,85,247,0.15)] space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-purple-500/20 pb-3">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Kho Điểm Lucky Bonus &amp; Penalty</span>
              </h3>

              <div>
                <label className="text-xs font-mono font-bold text-emerald-400 block mb-1.5">
                  Các Mức Thưởng Ngẫu Nhiên (Lucky Bonus khi Đúng) [phân tách bằng dấu phẩy]:
                </label>
                <input
                  type="text"
                  value={config.bonusValues.join(', ')}
                  onChange={(e) => {
                    const vals = e.target.value
                      .split(',')
                      .map((s) => parseInt(s.trim()))
                      .filter((n) => !isNaN(n));
                    setConfig({ ...config, bonusValues: vals });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Mặc định: +10, +20, +30, +50 (Hệ thống random 1 trong 4 giá trị này và khóa nút để chống spam)
                </span>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-rose-400 block mb-1.5">
                  Các Mức Phạt Ngẫu Nhiên (Penalty khi Sai) [phân tách bằng dấu phẩy]:
                </label>
                <input
                  type="text"
                  value={config.penaltyValues.join(', ')}
                  onChange={(e) => {
                    const vals = e.target.value
                      .split(',')
                      .map((s) => parseInt(s.trim()))
                      .filter((n) => !isNaN(n));
                    setConfig({ ...config, penaltyValues: vals });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-300 font-mono font-bold text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Mặc định: -5, -10, -15, -20 điểm
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-mono font-bold text-cyan-300 block mb-1">
                    Thưởng Keyword Decrypt:
                  </label>
                  <input
                    type="number"
                    value={config.keywordDecryptBonus}
                    onChange={(e) =>
                      setConfig({ ...config, keywordDecryptBonus: parseInt(e.target.value) || 50 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-amber-300 block mb-1">
                    Thưởng Final Code:
                  </label>
                  <input
                    type="number"
                    value={config.finalCodeBonus}
                    onChange={(e) =>
                      setConfig({ ...config, finalCodeBonus: parseInt(e.target.value) || 100 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Speed Bonus Table */}
          <div className="bg-[#0c1435]/90 border border-emerald-500/40 rounded-3xl p-6 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-emerald-500/20 pb-3 mb-4">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Bảng Thưởng Tốc Độ (Speed Bonus Table)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">&lt; 2:00</span>
                <input
                  type="number"
                  value={config.speedBonusTable.under2Min}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      speedBonusTable: {
                        ...config.speedBonusTable,
                        under2Min: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-center py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 font-mono font-black text-lg"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">Điểm thưởng</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">2:00 – 3:00</span>
                <input
                  type="number"
                  value={config.speedBonusTable.under3Min}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      speedBonusTable: {
                        ...config.speedBonusTable,
                        under3Min: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-center py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 font-mono font-black text-lg"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">Điểm thưởng</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">3:00 – 4:00</span>
                <input
                  type="number"
                  value={config.speedBonusTable.under4Min}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      speedBonusTable: {
                        ...config.speedBonusTable,
                        under4Min: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-center py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 font-mono font-black text-lg"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">Điểm thưởng</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">4:00 – 4:30</span>
                <input
                  type="number"
                  value={config.speedBonusTable.under4m30s}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      speedBonusTable: {
                        ...config.speedBonusTable,
                        under4m30s: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-center py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 font-mono font-black text-lg"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">Điểm thưởng</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-700 p-3 rounded-2xl col-span-2 sm:col-span-1">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">&gt; 4:30</span>
                <input
                  type="number"
                  value={config.speedBonusTable.over4m30s}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      speedBonusTable: {
                        ...config.speedBonusTable,
                        over4m30s: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-center py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-400 font-mono font-black text-lg"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Điểm thưởng</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetConfig}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khôi Phục Mặc Định</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>LƯU CẤU HÌNH ROUND 4</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 3: AUDIT LOGS & TEAM STATE MONITOR                   */}
      {/* ============================================================ */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6">
          {/* Teams currently active in Round 4 */}
          <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
            <h3 className="text-base font-black text-white flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                <span>Tiến Độ Round 4 Của Các Đội ({teamsInRound4.length} đội)</span>
              </span>
            </h3>

            {teamsInRound4.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono text-center py-6">
                Chưa có đội thi nào bắt đầu bước vào Round 4.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamsInRound4.map((team) => {
                  const r4 = team.round4State;
                  const isVaultUnlocked = r4?.keywordVaultUnlocked;
                  const clueCount = r4?.clueFragments?.length || 0;
                  return (
                    <div
                      key={team.id}
                      className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-black text-white text-sm">{team.teamName}</h4>
                          <span className="text-[11px] font-mono text-slate-400">{team.className}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                          {team.assignedPackageId || 'N/A'}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono space-y-1 pt-1 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">3 Ổ Khóa Cổng:</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isVaultUnlocked
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {isVaultUnlocked ? '🔓 ĐÃ MỞ' : '🔒 ĐANG KHÓA'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Mảnh ghép dữ kiện:</span>
                          <span className="text-cyan-300 font-bold">{clueCount} / 4 mảnh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bước hiện tại:</span>
                          <span className="text-purple-300 uppercase font-bold">
                            {r4?.currentStep || 'completed'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Bonus tích lũy:</span>
                          <span className="text-emerald-400 font-bold">+{r4?.randomBonus || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phạt tích lũy:</span>
                          <span className="text-rose-400 font-bold">-{r4?.randomPenalty || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Speed Bonus:</span>
                          <span className="text-amber-400 font-bold">+{r4?.speedBonus || 0}</span>
                        </div>
                        {r4?.manualAdjustment ? (
                          <div className="flex justify-between">
                            <span className="text-slate-400">GM Điều chỉnh:</span>
                            <span
                              className={`font-bold ${
                                r4.manualAdjustment > 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {r4.manualAdjustment > 0 ? `+${r4.manualAdjustment}` : r4.manualAdjustment}
                            </span>
                          </div>
                        ) : null}
                        {/* Signal Status Row */}
                        <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                          <span className="text-slate-400">Tín hiệu NV1 (AI Scan):</span>
                          {r4?.aiScanCompleted ? (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                r4.aiScanResult?.isCorrect
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {r4.aiScanResult?.isCorrect ? '✅ ĐÃ QUÉT (ĐÚNG)' : '❌ ĐÃ QUÉT (SAI)'}
                            </span>
                          ) : r4?.selectedScanTargetId ? (
                            <span className="text-cyan-300 font-bold text-[10px] bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/40">
                              📡 ĐÃ KHÓA: {r4.selectedScanTargetId}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px] italic">
                              Chưa có tín hiệu
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                          <span className="text-white">Điểm Round 4:</span>
                          <span className="text-cyan-400 font-black">
                            {team.roundScores[4] || 0} pts
                          </span>
                        </div>
                      </div>

                      {/* GM Quick Actions */}
                      <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
                        {!isVaultUnlocked && (
                          <button
                            onClick={() => handleGmManualUnlock(team.id)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold cursor-pointer"
                            title="Mở khóa thủ công 3 ổ khóa cho đội"
                          >
                            🔓 Mở Cổng
                          </button>
                        )}

                        {/* GM Action: XÁC THỰC QUÉT TÍN HIỆU */}
                        {!r4?.aiScanCompleted && (
                          <button
                            type="button"
                            disabled={verifyingTeamId === team.id}
                            onClick={() => handleGmVerifyScan(team)}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-[10px] font-mono font-black shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer disabled:opacity-50 flex items-center gap-1 active:scale-95 transition-all"
                            title="Game Master xác thực tín hiệu quét cho đội"
                          >
                            <span>📡 XÁC THỰC QUÉT TÍN HIỆU</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedTeamForAdjust(team);
                            setAdjustDelta(10);
                            setAdjustReason('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-400 text-purple-300 text-[10px] font-mono font-bold cursor-pointer"
                        >
                          ⚖️ Cộng/Trừ Điểm
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Audit Logs Table */}
          <div className="bg-[#0c1435]/90 border border-slate-700/60 rounded-3xl p-6 shadow-[0_0_25px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Nhật Ký Thao Tác Chi Tiết (Audit Logs) ({logs.length})</span>
              </h3>

              <button
                onClick={handleClearLogs}
                disabled={logs.length === 0}
                className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Logs</span>
              </button>
            </div>

            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono text-center py-8">
                Chưa có thao tác nào được ghi nhận trong audit log.
              </p>
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[10px] uppercase text-slate-400 bg-slate-900/90 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3">Đội thi</th>
                      <th className="py-2.5 px-3">Gói</th>
                      <th className="py-2.5 px-3">Nhiệm vụ</th>
                      <th className="py-2.5 px-3">Đáp án</th>
                      <th className="py-2.5 px-3">Kết quả</th>
                      <th className="py-2.5 px-3">Bonus / Penalty</th>
                      <th className="py-2.5 px-3">Tổng điểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {logs.map((log) => {
                      const timeStr = new Date(log.timestamp).toLocaleTimeString('vi-VN');
                      return (
                        <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{timeStr}</td>
                          <td className="py-2 px-3 text-white font-bold whitespace-nowrap">
                            {log.teamName}
                          </td>
                          <td className="py-2 px-3 text-cyan-400 font-bold">{log.packageId}</td>
                          <td className="py-2 px-3 text-slate-300 max-w-[200px] truncate" title={log.questionTitle}>
                            <span className="text-purple-400 uppercase text-[10px] mr-1">[{log.step}]</span>
                            {log.questionTitle}
                          </td>
                          <td className="py-2 px-3 text-slate-300 max-w-[120px] truncate" title={log.userAnswer}>
                            {log.userAnswer}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {log.isCorrect ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/40">
                                <CheckCircle2 className="w-3 h-3" /> ĐÚNG
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-400 font-bold bg-rose-950/70 px-2 py-0.5 rounded border border-rose-500/40">
                                <XCircle className="w-3 h-3" /> SAI
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {log.bonusAwarded ? (
                              <span className="text-emerald-400 font-bold">+{log.bonusAwarded}</span>
                            ) : log.penaltyDeducted ? (
                              <span className="text-rose-400 font-bold">-{log.penaltyDeducted}</span>
                            ) : (
                              <span className="text-slate-500">0</span>
                            )}
                            {log.speedBonusAwarded ? (
                              <span className="text-amber-400 font-bold ml-1.5">
                                (⚡+{log.speedBonusAwarded})
                              </span>
                            ) : null}
                          </td>
                          <td className="py-2 px-3 font-bold text-cyan-300 whitespace-nowrap">
                            {log.newScore} pts
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* GM MANUAL SCORE ADJUSTMENT MODAL                             */}
      {/* ============================================================ */}
      {selectedTeamForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0c1435] border-2 border-purple-500 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.5)]">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-3 mb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Điều Chỉnh Điểm Thủ Công</span>
              </h3>
              <button
                onClick={() => setSelectedTeamForAdjust(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 font-mono">
              Đội: <strong className="text-cyan-300">{selectedTeamForAdjust.teamName}</strong> ({selectedTeamForAdjust.className})
            </p>

            <form onSubmit={handleApplyScoreAdjust} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">MỨC ĐIỂM ĐIỀU CHỈNH (+ HOẶC -):</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[-20, -10, 10, 20].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAdjustDelta(val)}
                      className={`py-1.5 rounded-lg font-bold cursor-pointer border ${
                        adjustDelta === val
                          ? val > 0
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black'
                            : 'bg-rose-500 text-white border-rose-300 font-black'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      {val > 0 ? `+${val}` : val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  placeholder="Nhập số điểm..."
                  className="w-full bg-slate-900 border border-purple-500/50 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">LÝ DO ĐIỀU CHỈNH (BẮT BUỘC - LƯU AUDIT LOG):</label>
                <textarea
                  required
                  rows={3}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="VD: Trả lời xuất sắc câu hỏi phụ của BGK / Vi phạm quy chế thi đấu..."
                  className="w-full bg-slate-900 border border-purple-500/50 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setSelectedTeamForAdjust(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={!adjustReason.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black cursor-pointer shadow-lg disabled:opacity-40"
                >
                  Xác Nhận Lưu &amp; Tính Điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
