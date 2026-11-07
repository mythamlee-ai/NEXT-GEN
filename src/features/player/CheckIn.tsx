import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sparkles,
  UserCheck,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Compass,
  Trophy,
  Users,
  Atom,
  Bot,
} from 'lucide-react';
import { Team } from '../../types';
import { ScoringEngine } from '../../services/scoringEngine';
import { storageService } from '../../services/storageService';
import { audioManager } from '../../services/audioManager';
import { ChibiMascot } from '../../components/ChibiMascot';

interface CheckInProps {
  onCheckInSuccess: (team: Team) => void;
  onBackToLobby?: () => void;
}

export const CheckIn: React.FC<CheckInProps> = ({ onCheckInSuccess, onBackToLobby }) => {
  const [mode, setMode] = useState<'create' | 'resume'>('create');
  const [existingTeams, setExistingTeams] = useState<Team[]>(() => storageService.getTeams());

  // Form states
  const [teamName, setTeamName] = useState('');
  const [className, setClassName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [resumeCode, setResumeCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setExistingTeams(storageService.getTeams());
    const unsub = storageService.subscribe((event) => {
      if (event.type === 'TEAMS_UPDATED' || event.type === 'FACTORY_RESET') {
        setExistingTeams(storageService.getTeams());
      }
    });
    return () => unsub();
  }, []);

  const handleSelectExistingTeam = (t: Team) => {
    storageService.setCurrentTeamId(t.id);
    audioManager.playUnlock();
    onCheckInSuccess(t);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!teamName.trim()) {
      setErrorMsg('Vui lòng nhập tên đội thi của bạn.');
      audioManager.playWarning();
      return;
    }
    if (!className.trim()) {
      setErrorMsg('Vui lòng nhập lớp (ví dụ: 12 Lý, 11A1, 10 Tin).');
      audioManager.playWarning();
      return;
    }
    if (!captainName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của Đội Trưởng.');
      audioManager.playWarning();
      return;
    }

    const uniqueCode = ScoringEngine.generateTeamCode();
    const newTeam: Team = {
      id: 'team_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      teamCode: uniqueCode,
      teamName: teamName.trim(),
      className: className.trim(),
      captainName: captainName.trim(),
      members: [captainName.trim()],
      createdAt: Date.now(),
      currentRound: 1,
      status: 'ready',
      score: 0,
      roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
      elapsedTime: 0,
      roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
      answersHistory: [],
      currentQuestionIndex: 0,
      questionSeed: uniqueCode + '_' + Date.now(),
      unlockedNextGenCodes: [],
      bonusQRCodes: [],
    };

    storageService.saveTeam(newTeam);
    storageService.setCurrentTeamId(newTeam.id);
    audioManager.playChestOpen();
    onCheckInSuccess(newTeam);
  };

  const handleResumeTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanCode = resumeCode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg('Vui lòng nhập Mã đội (ví dụ: PEK-7F29).');
      audioManager.playWarning();
      return;
    }

    const teams = storageService.getTeams();
    const found = teams.find(
      (t) => t.teamCode.toUpperCase() === cleanCode || t.id === cleanCode
    );

    if (found) {
      storageService.setCurrentTeamId(found.id);
      audioManager.playUnlock();
      onCheckInSuccess(found);
    } else {
      setErrorMsg(`Không tìm thấy đội với mã "${cleanCode}". Vui lòng kiểm tra lại.`);
      audioManager.playIncorrect();
    }
  };

  const handleQuickDemo = () => {
    const demoCode = ScoringEngine.generateTeamCode();
    const demoTeam: Team = {
      id: 'team_demo_' + Date.now(),
      teamCode: demoCode,
      teamName: 'Lượng Tử Sáng Tạo',
      className: '12 Lý - THPT PeK',
      captainName: 'Nguyễn Minh Triết (Đội Trưởng)',
      members: ['Nguyễn Minh Triết'],
      createdAt: Date.now(),
      currentRound: 1,
      status: 'ready',
      score: 0,
      roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
      elapsedTime: 0,
      roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
      answersHistory: [],
      currentQuestionIndex: 0,
      questionSeed: 'DEMO_SEED_' + Date.now(),
      unlockedNextGenCodes: [],
      bonusQRCodes: [],
    };
    storageService.saveTeam(demoTeam);
    storageService.setCurrentTeamId(demoTeam.id);
    audioManager.playChestOpen();
    onCheckInSuccess(demoTeam);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8 relative z-10 text-white">
      {/* Sci-Fi Hologram Header */}
      <div className="text-center mb-6 flex flex-col items-center">
        <ChibiMascot
          expression="greeting"
          size="lg"
          showSpeechBubble={true}
          speechText="Chào mừng bạn đến với Cổng Đăng Ký Next Gen! Hãy tạo hồ sơ đội thi để bước vào vũ trụ khoa học!"
        />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold tracking-wider mt-3 mb-2 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>PORTAL ĐĂNG KÝ HÀNH TRÌNH • NEXT GEN</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
          ĐĂNG KÝ THI ĐẤU
        </h1>
        <p className="text-xs sm:text-sm text-cyan-300 font-mono font-bold">
          “Giải mã tri thức – Chinh phục vũ trụ khoa học!”
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 p-1.5 bg-[#0c1435]/90 border border-cyan-500/40 rounded-2xl mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            setMode('create');
            setErrorMsg('');
            audioManager.playPop();
          }}
          className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'create'
              ? 'bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Đăng Ký Đội Mới</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('resume');
            setErrorMsg('');
            audioManager.playPop();
          }}
          className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mode === 'resume'
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black shadow-[0_0_15px_rgba(168,85,247,0.5)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Tiếp Tục Lượt Chơi</span>
        </button>
      </div>

      {/* Cybernetic Holo-Form Container */}
      <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-2xl relative overflow-hidden">
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {mode === 'create' ? (
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-mono font-bold tracking-wider text-cyan-300 mb-1.5">
                Tên Đội Chơi <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="VD: Lượng Tử Tốc Độ, Biệt Đội Menđen..."
                className="w-full bg-[#070b1c]/90 border border-cyan-500/40 focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none text-sm transition-all font-mono font-semibold"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono font-bold tracking-wider text-cyan-300 mb-1.5">
                Lớp / Khối <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="VD: 12 Lý, 11A1, 10 Hóa..."
                className="w-full bg-[#070b1c]/90 border border-cyan-500/40 focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none text-sm transition-all font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono font-bold tracking-wider text-cyan-300 mb-1.5 flex items-center justify-between">
                <span>Tên Đội Trưởng <span className="text-rose-400">*</span></span>
                <span className="text-[10px] text-amber-400 font-mono normal-case font-bold">Đại diện nhận thưởng</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  placeholder="Nhập họ và tên Đội Trưởng..."
                  className="w-full bg-[#070b1c]/90 border border-cyan-500/40 focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-xl pl-4 pr-10 py-3 text-white placeholder-slate-500 outline-none text-sm transition-all font-mono font-semibold"
                />
                <UserCheck className="w-5 h-5 text-cyan-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer tracking-wider"
              >
                <span>XÁC NHẬN CHECK-IN & NHẬN MÃ NHIỆM VỤ</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Quick Demo Button */}
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chơi Thử Bằng Đội Mẫu (Quick Demo 1-Click)</span>
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-2.5 font-mono font-medium">
                Hệ thống cấp Mã Đội Độc Bản (VD: PEK-7F29) để lưu phiên
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResumeTeam} className="space-y-5">
            <div>
              <label className="block text-xs uppercase font-mono font-bold tracking-wider text-purple-300 mb-2">
                Mã Đội Của Bạn
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={resumeCode}
                  onChange={(e) => setResumeCode(e.target.value.toUpperCase())}
                  placeholder="VD: PEK-7F29"
                  className="w-full bg-[#070b1c]/90 border border-purple-500/40 focus:border-purple-300 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)] rounded-xl px-4 py-3.5 text-center text-white placeholder-slate-500 font-mono text-xl uppercase tracking-widest outline-none transition-all font-black"
                  autoFocus
                />
                <KeyRound className="w-5 h-5 text-purple-400 absolute right-4 top-4 pointer-events-none" />
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Nhập mã đội đã cấp để khôi phục tiến trình khi bạn đổi máy hoặc tải lại trang.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer tracking-wider"
            >
              <span>KHÔI PHỤC PHIÊN CHƠI</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Quick Multi-Device Team Selector */}
            {existingTeams.length > 0 && (
              <div className="pt-5 border-t border-purple-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>ĐỘI THI TRÊN HỆ THỐNG ({existingTeams.length})</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Đồng bộ thời gian thực
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {existingTeams.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectExistingTeam(t)}
                      className="p-3 rounded-2xl bg-[#070b1c]/80 hover:bg-purple-950/40 border border-cyan-500/30 hover:border-purple-400 transition-all flex items-center justify-between cursor-pointer group shadow-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300 truncate">
                            {t.teamName}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300">
                            {t.teamCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono font-medium">
                          {t.className} • Vòng {t.currentRound} ({t.score} điểm)
                        </p>
                      </div>

                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-purple-600 text-slate-300 group-hover:text-white border border-slate-700 group-hover:border-purple-500 text-[11px] font-bold transition-all flex-shrink-0"
                      >
                        Vào chơi →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {onBackToLobby && (
        <div className="mt-4 text-center">
          <button
            onClick={onBackToLobby}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors underline cursor-pointer font-bold"
          >
            ← Quay lại Sảnh chính
          </button>
        </div>
      )}
    </div>
  );
};
