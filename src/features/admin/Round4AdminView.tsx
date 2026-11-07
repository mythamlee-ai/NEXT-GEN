import React, { useState, useEffect } from 'react';
import {
  Brain,
  Zap,
  Sliders,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  Heart,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  AlertTriangle,
  Award,
  Sparkles,
  BarChart2,
  Bot,
  Search,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { AIDetectiveQuestion, Round4Config, Round4Log } from '../../types/round4';
import { Round4Engine, defaultRound4Config } from '../../services/round4Engine';
import { defaultAIDetectiveQuestions } from '../../data/aiDetectiveQuestions';
import { storageService } from '../../services/storageService';
import { Team } from '../../types';
import { audioManager } from '../../services/audioManager';

interface Round4AdminViewProps {
  onRefresh?: () => void;
}

export const Round4AdminView: React.FC<Round4AdminViewProps> = ({ onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'config' | 'teams' | 'logs'>('questions');
  const [questions, setQuestions] = useState<AIDetectiveQuestion[]>(() =>
    Round4Engine.getAIDetectiveQuestions()
  );
  const [config, setConfig] = useState<Round4Config>(() => Round4Engine.getConfig());
  const [logs, setLogs] = useState<Round4Log[]>(() => Round4Engine.getLogs());
  const [teams, setTeams] = useState<Team[]>(() => storageService.getTeams());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('ALL');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // Question Modal (Add / Edit / Preview)
  const [previewQuestion, setPreviewQuestion] = useState<AIDetectiveQuestion | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<AIDetectiveQuestion | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // GM Score Adjust Modal
  const [selectedTeamForAdjust, setSelectedTeamForAdjust] = useState<Team | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('');

  const loadAll = () => {
    setQuestions(Round4Engine.getAIDetectiveQuestions());
    setConfig(Round4Engine.getConfig());
    setLogs(Round4Engine.getLogs());
    setTeams(storageService.getTeams());
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(() => {
      setTeams(storageService.getTeams());
      setLogs(Round4Engine.getLogs());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Save Config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    Round4Engine.saveConfig(config);
    audioManager.playUnlock();
    setSavedSuccessMsg('Đã lưu cấu hình Vòng 4 thành công!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
    if (onRefresh) onRefresh();
  };

  // Reset Config
  const handleResetConfig = () => {
    if (window.confirm('Khôi phục cấu hình Vòng 4 về mặc định?')) {
      Round4Engine.saveConfig(defaultRound4Config);
      setConfig(defaultRound4Config);
      audioManager.playUnlock();
      setSavedSuccessMsg('Đã khôi phục cấu hình mặc định!');
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    }
  };

  // Save / Add Question
  const handleSaveQuestion = (q: AIDetectiveQuestion) => {
    const existing = Round4Engine.getAIDetectiveQuestions();
    const idx = existing.findIndex((item) => item.id === q.id);
    let updated: AIDetectiveQuestion[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = q;
    } else {
      updated = [...existing, q];
    }
    Round4Engine.saveAIDetectiveQuestions(updated);
    setQuestions(updated);
    setEditingQuestion(null);
    setIsAddingNew(false);
    audioManager.playUnlock();
    setSavedSuccessMsg('Đã lưu câu hỏi AI Detective thành công!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  // Delete Question
  const handleDeleteQuestion = (qId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi AI Detective này?')) {
      const updated = questions.filter((q) => q.id !== qId);
      Round4Engine.saveAIDetectiveQuestions(updated);
      setQuestions(updated);
      audioManager.playPop();
    }
  };

  // Reset Questions to default
  const handleResetQuestions = () => {
    if (window.confirm('Khôi phục danh sách câu hỏi AI Detective về bộ chuẩn mặc định?')) {
      Round4Engine.resetAIDetectiveQuestions();
      setQuestions(defaultAIDetectiveQuestions);
      audioManager.playUnlock();
      setSavedSuccessMsg('Đã khôi phục ngân hàng câu hỏi mặc định!');
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    }
  };

  // Teacher manual action: Switch to Backup Mission for team
  const handleGmSwitchToBackup = (teamId: string) => {
    if (window.confirm('Chuyển đội thi này sang NHIỆM VỤ DỰ PHÒNG (Ghép nối 20/11)?')) {
      Round4Engine.switchToBackupMission(teamId);
      loadAll();
      audioManager.playUnlock();
      setSavedSuccessMsg('Đã chuyển đội sang Nhiệm vụ Ghép Nối Tri Ân!');
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    }
  };

  // Teacher manual action: Unlock Tri An for team
  const handleGmUnlockTriAn = (team: Team) => {
    if (window.confirm(`Xác nhận MỞ KHÓA MẬT MÃ "TRI ÂN" (+100 điểm) cho đội ${team.teamName}?`)) {
      Round4Engine.verifyFinalKeyword(team, 'TRI AN', 0);
      loadAll();
      audioManager.playBonusPoints();
      setSavedSuccessMsg(`Đã mở khóa mật mã TRI ÂN cho đội ${team.teamName}!`);
      setTimeout(() => setSavedSuccessMsg(null), 3000);
    }
  };

  // Teacher score adjust
  const handleApplyScoreAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamForAdjust || !adjustReason.trim()) return;
    const res = Round4Engine.adjustTeamScore(
      selectedTeamForAdjust.id,
      adjustDelta,
      adjustReason,
      'Giáo Viên'
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

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesQuery =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.aiClaim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.field.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField = selectedFieldFilter === 'ALL' || q.field === selectedFieldFilter;
    return matchesQuery && matchesField;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-[#0c1435]/95 via-[#1a0f35]/95 to-[#08182b]/95 border-2 border-purple-500/40 rounded-3xl p-6 shadow-[0_0_35px_rgba(168,85,247,0.2)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-purple-950/80 border border-purple-400 text-purple-400">
                <Brain className="w-5 h-5" />
              </span>
              <span className="font-mono text-xs font-bold text-purple-300 uppercase tracking-wider">
                BẢNG ĐIỀU KHIỂN GIÁO VIÊN • VÒNG 4
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              AI DETECTIVE – GIẢI MÃ KHO BÁU TRI ÂN 20/11
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Quản lý câu hỏi AI Detective, thiết lập mật mã TRI ÂN, giám sát ghép nối và điều khiển phòng thi
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-bold">
              {questions.length} Câu hỏi AI
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-400/50 text-amber-300 font-bold">
              {teams.length} Đội thi
            </span>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-purple-500/20">
          <button
            onClick={() => setActiveSubTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'questions'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700/60'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Ngân Hàng Câu Hỏi AI Detective ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('teams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'teams'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700/60'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Giám Sát Tiến Độ &amp; Điều Khiển Đội Thi</span>
          </button>

          <button
            onClick={() => setActiveSubTab('config')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'config'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Cấu Hình Điểm &amp; Luật Chơi</span>
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'logs'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border border-slate-700/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Logs ({logs.length})</span>
          </button>
        </div>
      </div>

      {savedSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 1: NGÂN HÀNG CÂU HỎI AI DETECTIVE                    */}
      {/* ============================================================ */}
      {activeSubTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0c1435]/80 border border-cyan-500/30 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm câu hỏi, môn, nhận định AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Field filters */}
              <div className="flex items-center gap-1">
                {['ALL', 'Vật Lí', 'Hóa Học', 'Sinh Học', 'AI & Công Nghệ', 'Khoa Học & Đời Sống'].map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFieldFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedFieldFilter === f
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-700/60'
                      }`}
                    >
                      {f}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingQuestion({
                    id: `ai-q-${Date.now().toString(36)}`,
                    title: 'Câu hỏi mới',
                    field: 'Vật Lí',
                    aiClaim: 'Nhận định của AI có lỗi...',
                    questionText: 'Nhận định trên của AI là ĐÚNG hay SAI?',
                    options: [
                      { id: 'opt-a', text: 'Phương án A', isCorrect: false },
                      { id: 'opt-b', text: 'Phương án B (Đúng)', isCorrect: true },
                    ],
                    correctOptionId: 'opt-b',
                    correctAnswerText: 'Phương án B là đáp án chính xác',
                    aiFlawExplanation: 'AI đã mắc lỗi...',
                    scientificTruth: 'Kiến thức khoa học chuẩn xác là...',
                    points: 30,
                    timeLimitSeconds: 60,
                  });
                  setIsAddingNew(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Câu Hỏi</span>
              </button>

              <button
                onClick={handleResetQuestions}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi Phục Mặc Định</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-[#0c1435]/90 border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.1)] space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-black text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                        #{idx + 1} • {q.field}
                      </span>
                      <span className="font-mono text-xs text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                        +{q.points} điểm
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white">{q.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem Trước</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingQuestion({ ...q });
                        setIsAddingNew(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 hover:bg-purple-900 text-xs font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>

                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 hover:bg-rose-900 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* AI Claim Box */}
                <div className="p-3.5 rounded-xl bg-[#060a1c] border border-purple-500/30 text-xs text-slate-200 font-mono italic">
                  "{q.aiClaim}"
                </div>

                {/* Question & Correct Answer row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono block">Lỗi sai của AI:</span>
                    <span className="text-amber-300 font-medium block mt-0.5">
                      {q.aiFlawExplanation}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono block">Kiến thức khoa học chuẩn:</span>
                    <span className="text-emerald-300 font-medium block mt-0.5">
                      {q.scientificTruth}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 2: GIÁM SÁT TIẾN ĐỘ & ĐIỀU KHIỂN GIÁO VIÊN            */}
      {/* ============================================================ */}
      {activeSubTab === 'teams' && (
        <div className="bg-[#0c1435]/90 border border-amber-500/40 rounded-3xl p-6 shadow-[0_0_25px_rgba(245,158,11,0.15)] space-y-6">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-amber-400" />
                <span>Tiến Độ Vòng 4 Của Các Đội ({teams.length} đội)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Giáo viên có quyền điều khiển chuyển nhiệm vụ, mở khóa mật mã hoặc cộng/trừ điểm
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => {
              const r4 = team.round4State;
              const currentStep = r4?.currentStep || 'ai_detective';
              const isSolved = r4?.keywordSolved;
              const isBackup = currentStep === 'backup_matching' || r4?.backupCompleted;

              return (
                <div
                  key={team.id}
                  className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4.5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-white text-sm">{team.teamName}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{team.className}</span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isSolved
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                          : isBackup
                          ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                          : 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                      }`}
                    >
                      {isSolved
                        ? 'TRI ÂN (+100đ)'
                        : isBackup
                        ? 'BACKUP (Ghép nối)'
                        : 'AI DETECTIVE'}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono space-y-1.5 pt-2 border-t border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Điểm AI Detective:</span>
                      <span className="text-cyan-300 font-bold">
                        +{r4?.aiDetectiveScore || 0}đ
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Từ khóa TRI ÂN:</span>
                      <span className={isSolved ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                        {isSolved ? '✅ ĐÃ MỞ (+100đ)' : `Đã thử: ${r4?.keywordAttempts || 0}/3`}
                      </span>
                    </div>

                    {isBackup && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ghép nối 20/11:</span>
                        <span className="text-amber-400 font-bold">
                          {r4?.backupPairsMatched?.length || 0}/5 cặp (+{r4?.backupScore || 0}đ)
                        </span>
                      </div>
                    )}

                    {r4?.manualAdjustment ? (
                      <div className="flex justify-between">
                        <span className="text-slate-400">GV Điều chỉnh:</span>
                        <span
                          className={`font-bold ${
                            r4.manualAdjustment > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {r4.manualAdjustment > 0 ? `+${r4.manualAdjustment}` : r4.manualAdjustment}đ
                        </span>
                      </div>
                    ) : null}

                    <div className="flex justify-between pt-1.5 border-t border-slate-800 font-bold">
                      <span className="text-white">Tổng Điểm Vòng 4:</span>
                      <span className="text-amber-400 text-sm">
                        {team.roundScores[4] || 0} ĐIỂM
                      </span>
                    </div>
                  </div>

                  {/* Teacher Quick Controls */}
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
                    {!isSolved && !isBackup && (
                      <button
                        onClick={() => handleGmSwitchToBackup(team.id)}
                        className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold cursor-pointer"
                        title="Chuyển sang nhiệm vụ ghép nối 20/11"
                      >
                        🌸 Sang Backup
                      </button>
                    )}

                    {!isSolved && (
                      <button
                        onClick={() => handleGmUnlockTriAn(team)}
                        className="px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-400 text-purple-300 text-[10px] font-mono font-bold cursor-pointer"
                        title="Xác nhận mở khóa mật mã TRI ÂN cho đội"
                      >
                        🔓 Mở TRI ÂN
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedTeamForAdjust(team);
                        setAdjustDelta(10);
                        setAdjustReason('');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-[10px] font-mono font-bold cursor-pointer"
                    >
                      ⚖️ Cộng/Trừ Điểm
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 3: CẤU HÌNH ĐIỂM & LUẬT CHƠI                          */}
      {/* ============================================================ */}
      {activeSubTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="bg-[#0c1435]/90 border border-purple-500/40 rounded-3xl p-6 shadow-[0_0_25px_rgba(168,85,247,0.15)] space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-purple-500/20 pb-3">
              <Sliders className="w-5 h-5 text-purple-400" />
              <span>Thiết Lập Luật Chơi Vòng 4 – AI DETECTIVE &amp; TRI ÂN</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-bold text-cyan-300 block mb-1.5">
                  Điểm mỗi câu hỏi AI Detective trả lời đúng:
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={config.aiDetectivePointsPerQuestion || 30}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      aiDetectivePointsPerQuestion: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-amber-300 block mb-1.5">
                  Số lượt thử tối đa giải mã từ khóa TRI ÂN:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.maxKeywordAttempts || 3}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      maxKeywordAttempts: parseInt(e.target.value) || 3,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5">
                  Thời gian quy định toàn vòng 4 (giây):
                </label>
                <input
                  type="number"
                  min="120"
                  max="600"
                  step="30"
                  value={config.baseTimeLimitSeconds}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      baseTimeLimitSeconds: parseInt(e.target.value) || 300,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5">
                  Cơ chế tính điểm từ khóa vs nhiệm vụ dự phòng:
                </label>
                <div className="p-2.5 rounded-xl bg-[#070b1c] border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
                  • Giải mã đúng TRI ÂN: <strong>+100 điểm</strong><br />
                  • Chuyển sang ghép nối 20/11: <strong>10đ / cặp (Tối đa 50đ)</strong><br />
                  • <em>Tuyệt đối không cộng đồng thời cả 2 phần thưởng.</em>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-500/20">
              <button
                type="button"
                onClick={handleResetConfig}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-xs font-mono font-bold cursor-pointer"
              >
                Khôi Phục Mặc Định
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>LƯU CẤU HÌNH</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* SUB-TAB 4: AUDIT LOGS                                        */}
      {/* ============================================================ */}
      {activeSubTab === 'logs' && (
        <div className="bg-[#0c1435]/90 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-400" />
              <span>Nhật Ký Thao Tác Chi Tiết (Audit Logs) ({logs.length})</span>
            </h3>

            <button
              onClick={() => {
                if (window.confirm('Xóa toàn bộ audit logs Vòng 4?')) {
                  Round4Engine.clearLogs();
                  setLogs([]);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold cursor-pointer"
            >
              Xóa Logs
            </button>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] uppercase text-slate-400 bg-slate-900/90 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Đội thi</th>
                  <th className="py-2.5 px-3">Nhiệm vụ</th>
                  <th className="py-2.5 px-3">Nội dung</th>
                  <th className="py-2.5 px-3">Kết quả</th>
                  <th className="py-2.5 px-3">Điểm</th>
                  <th className="py-2.5 px-3">Tổng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50">
                    <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                    </td>
                    <td className="py-2 px-3 text-white font-bold whitespace-nowrap">{log.teamName}</td>
                    <td className="py-2 px-3 text-purple-300 uppercase">{log.step}</td>
                    <td className="py-2 px-3 text-slate-300 max-w-[220px] truncate" title={log.questionTitle}>
                      {log.questionTitle}
                    </td>
                    <td className="py-2 px-3">
                      {log.isCorrect ? (
                        <span className="text-emerald-400 font-bold">ĐÚNG</span>
                      ) : (
                        <span className="text-rose-400 font-bold">SAI</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-amber-400 font-bold">
                      {log.bonusAwarded ? `+${log.bonusAwarded}` : '0'}
                    </td>
                    <td className="py-2 px-3 text-cyan-300 font-bold">{log.newScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: PREVIEW QUESTION (CẢ ĐÚNG VÀ SAI THEO QUY ĐỊNH)      */}
      {/* ============================================================ */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="max-w-2xl w-full rounded-3xl bg-[#0c1435] border-2 border-cyan-400 p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                XEM TRƯỚC CÂU HỎI &amp; GIAO DIỆN PHẢN HỒI
              </span>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕ Đóng
              </button>
            </div>

            <div>
              <span className="text-xs font-mono text-purple-300 font-bold block mb-1">
                NHẬN ĐỊNH CỦA AI:
              </span>
              <p className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/40 text-xs sm:text-sm text-slate-200 italic font-mono">
                "{previewQuestion.aiClaim}"
              </p>
            </div>

            {/* Simulated Incorrect View according to prompt template */}
            <div className="p-4.5 rounded-2xl bg-[#1a0c1e] border-2 border-rose-500 text-xs sm:text-sm space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-black font-mono">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>MẪU GIAO DIỆN KHI HỌC SINH TRẢ LỜI SAI:</span>
              </div>
              <p className="font-mono text-rose-300 font-black">AI ERROR – BẠN ĐÃ BỎ SÓT LỖI!</p>
              <p className="text-slate-200">
                <strong className="text-cyan-300 font-mono">Đáp án đúng:</strong> {previewQuestion.correctAnswerText}
              </p>
              <p className="text-slate-200">
                <strong className="text-amber-400 font-mono">AI sai ở đâu?</strong> {previewQuestion.aiFlawExplanation}
              </p>
              <p className="text-slate-200">
                <strong className="text-emerald-300 font-mono">Kiến thức chính xác:</strong> {previewQuestion.scientificTruth}
              </p>
              <p className="font-mono text-xs text-rose-300 font-bold">
                ⚠️ Hãy kiểm tra thông tin trước khi tin vào AI!
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold font-mono text-xs cursor-pointer"
              >
                Đóng Xem Trước
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: EDIT / ADD QUESTION                                 */}
      {/* ============================================================ */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in overflow-y-auto">
          <div className="max-w-2xl w-full my-8 rounded-3xl bg-[#0c1435] border-2 border-purple-500 p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-mono uppercase border-b border-purple-500/20 pb-3">
              {isAddingNew ? 'Thêm Câu Hỏi AI Detective Mới' : 'Chỉnh Sửa Câu Hỏi AI Detective'}
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Tiêu đề chủ đề:</label>
                <input
                  type="text"
                  value={editingQuestion.title}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Lĩnh vực:</label>
                <select
                  value={editingQuestion.field}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      field: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Vật Lí">Vật Lí</option>
                  <option value="Hóa Học">Hóa Học</option>
                  <option value="Sinh Học">Sinh Học</option>
                  <option value="Khoa Học & Đời Sống">Khoa Học & Đời Sống</option>
                  <option value="AI & Công Nghệ">AI & Công Nghệ</option>
                </select>
              </div>

              <div>
                <label className="text-purple-300 font-bold block mb-1">
                  Nhận định của AI (có chứa lỗi sai khoa học):
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.aiClaim}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, aiClaim: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/40 text-white"
                />
              </div>

              <div>
                <label className="text-cyan-300 font-bold block mb-1">Nội dung đáp án đúng:</label>
                <textarea
                  rows={2}
                  value={editingQuestion.correctAnswerText}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      correctAnswerText: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-white"
                />
              </div>

              <div>
                <label className="text-amber-300 font-bold block mb-1">
                  AI sai ở đâu? (Chỉ ra lỗi cụ thể):
                </label>
                <textarea
                  rows={2}
                  value={editingQuestion.aiFlawExplanation}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      aiFlawExplanation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-white"
                />
              </div>

              <div>
                <label className="text-emerald-300 font-bold block mb-1">
                  Kiến thức khoa học chính xác:
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.scientificTruth}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      scientificTruth: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Điểm thưởng:</label>
                <input
                  type="number"
                  value={editingQuestion.points}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      points: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsAddingNew(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleSaveQuestion(editingQuestion)}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-mono font-bold text-xs cursor-pointer"
              >
                Lưu Câu Hỏi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: GM MANUAL SCORE ADJUSTMENT                          */}
      {/* ============================================================ */}
      {selectedTeamForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-[#0c1435] border-2 border-purple-400 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-mono flex items-center gap-2 border-b border-purple-500/30 pb-3">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Cộng/Trừ Điểm: {selectedTeamForAdjust.teamName}</span>
            </h3>

            <form onSubmit={handleApplyScoreAdjust} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">
                  Mức điểm điều chỉnh (+ hoặc -):
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2 font-mono text-xs font-bold">
                  {[-20, -10, 10, 20].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setAdjustDelta(d)}
                      className={`py-1.5 rounded-lg border cursor-pointer ${
                        adjustDelta === d
                          ? d > 0
                            ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400'
                            : 'bg-rose-500 text-white font-black border-rose-400'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      {d > 0 ? `+${d}` : d}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/40 text-white font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1.5">
                  Lý do điều chỉnh (Bắt buộc kèm log):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giải thích phản biện xuất sắc trên sân khấu..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/40 text-white text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeamForAdjust(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!adjustReason.trim()}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-mono font-black text-xs cursor-pointer disabled:opacity-40"
                >
                  Áp Dụng Điều Chỉnh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
