import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  SkipForward,
  Shuffle,
  Zap,
  Sliders,
  FileText,
  Search,
  Check,
  Edit,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { Team, PicturePuzzle, Round3Config, Round3AuditLog } from '../../types';
import { storageService } from '../../services/storageService';
import { Round3Service, defaultRound3Config } from '../../services/round3Service';
import { ScoringEngine } from '../../services/scoringEngine';
import { audioManager } from '../../services/audioManager';
import { Round3VisualStage } from '../player/Round3VisualStage';

interface Round3AdminViewProps {
  onRefresh?: () => void;
}

export const Round3AdminView: React.FC<Round3AdminViewProps> = ({ onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'control' | 'bank' | 'logs'>('control');
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [proverbs, setProverbs] = useState<PicturePuzzle[]>([]);
  const [config, setConfig] = useState<Round3Config>(Round3Service.getConfig());
  const [logs, setLogs] = useState<Round3AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewPuzzle, setPreviewPuzzle] = useState<PicturePuzzle | null>(null);

  // Manual score adjustment modal / form state
  const [scoreAdjustDelta, setScoreAdjustDelta] = useState<number>(20);
  const [scoreAdjustReason, setScoreAdjustReason] = useState<string>('');
  const [showAdjustDialog, setShowAdjustDialog] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = () => {
    const allTeams = storageService.getTeams();
    setTeams(allTeams);
    if (!selectedTeamId && allTeams.length > 0) {
      // Prioritize team currently in Round 3
      const r3Team = allTeams.find((t) => t.currentRound === 3) || allTeams[0];
      setSelectedTeamId(r3Team.id);
    }
    setProverbs(Round3Service.getProverbBank());
    setConfig(Round3Service.getConfig());
    setLogs(Round3Service.getLogs());
  };

  useEffect(() => {
    loadData();
    const unsub = storageService.subscribe(() => {
      setTeams(storageService.getTeams());
    });
    return unsub;
  }, []);

  const selectedTeam = teams.find((t) => t.id === selectedTeamId) || null;

  // Retrieve current active puzzles for selected team
  const assignedPuzzles: PicturePuzzle[] = React.useMemo(() => {
    if (!selectedTeam || !selectedTeam.assignedPuzzlesRound3) return [];
    const map = new Map(proverbs.map((p) => [p.id, p]));
    return selectedTeam.assignedPuzzlesRound3
      .map((id) => map.get(id))
      .filter((p): p is PicturePuzzle => !!p);
  }, [selectedTeam, proverbs]);

  const currentPuzzleIdx = selectedTeam ? Math.min(selectedTeam.currentQuestionIndex, assignedPuzzles.length - 1) : 0;
  const currentPuzzle = assignedPuzzles[currentPuzzleIdx] || null;

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // 1. GM Confirm Correct
  const handleConfirmCorrect = () => {
    if (!selectedTeam || !currentPuzzle) return;
    audioManager.playFanfare();
    const updated = Round3Service.overrideAnswer(selectedTeam, currentPuzzle.id, true, 100);
    setTeams(storageService.getTeams());
    setLogs(Round3Service.getLogs());
    showNotice(`Đã xác nhận ĐÚNG cho đội "${selectedTeam.teamName}" (+100 điểm)`);
    onRefresh?.();
  };

  // 2. GM Confirm Wrong
  const handleConfirmWrong = () => {
    if (!selectedTeam || !currentPuzzle) return;
    audioManager.playWrong();
    const updated = Round3Service.overrideAnswer(selectedTeam, currentPuzzle.id, false, 0);
    setTeams(storageService.getTeams());
    setLogs(Round3Service.getLogs());
    showNotice(`Đã xác nhận SAI cho câu hỏi này (0 điểm)`);
    onRefresh?.();
  };

  // 3. GM Swap / Change Question
  const handleSwapQuestion = () => {
    if (!selectedTeam || !currentPuzzle) return;
    audioManager.playPop();
    const res = Round3Service.swapCurrentQuestion(selectedTeam, currentPuzzle.id);
    if (res) {
      setTeams(storageService.getTeams());
      setLogs(Round3Service.getLogs());
      showNotice(`Đã đổi sang câu hỏi mới: #${res.newPuzzle.proverbNumber} "${res.newPuzzle.answer}"`);
      onRefresh?.();
    } else {
      showNotice(`Không còn câu hỏi thay thế khả dụng trong ngân hàng!`);
    }
  };

  // 4. GM Skip Question
  const handleSkipQuestion = () => {
    if (!selectedTeam || !currentPuzzle) return;
    audioManager.playClick();
    Round3Service.skipQuestion(selectedTeam, currentPuzzle.id);
    setTeams(storageService.getTeams());
    setLogs(Round3Service.getLogs());
    showNotice(`Đã bỏ qua câu hỏi #${currentPuzzle.proverbNumber}`);
    onRefresh?.();
  };

  // 5. GM Replay Question
  const handleReplayQuestion = () => {
    if (!selectedTeam || !currentPuzzle) return;
    audioManager.playButtonTap();
    Round3Service.addAuditLog({
      teamId: selectedTeam.id,
      teamName: selectedTeam.teamName,
      puzzleId: currentPuzzle.id,
      puzzleAnswer: currentPuzzle.answer,
      action: 'GM_REPLAY',
      note: `Game Master phát lại câu hỏi #${currentPuzzle.proverbNumber}`,
    });
    setLogs(Round3Service.getLogs());
    window.dispatchEvent(new CustomEvent('PEK_ROUND3_REPLAY_EVENT', { detail: { teamId: selectedTeam.id } }));
    showNotice(`Đã phát lệnh phát lại câu #${currentPuzzle.proverbNumber} cho đội "${selectedTeam.teamName}"`);
  };

  // 6. GM Toggle Steal Privilege
  const handleToggleSteal = () => {
    const current = Round3Service.getStealPrivilege();
    const nextTeamId = current?.teamId ? null : selectedTeamId;
    Round3Service.setStealPrivilege(nextTeamId);
    showNotice(nextTeamId ? `ĐÃ KÍCH HOẠT CƯỚP QUYỀN cho đội ${selectedTeam?.teamName}` : `ĐÃ TẮT CƯỚP QUYỀN`);
  };

  // 7. Manual Score Adjust
  const handleApplyScoreAdjust = () => {
    if (!selectedTeam) return;
    Round3Service.adjustTeamScore(selectedTeam, scoreAdjustDelta, scoreAdjustReason || 'Điều chỉnh thủ công từ GM');
    setTeams(storageService.getTeams());
    setLogs(Round3Service.getLogs());
    setShowAdjustDialog(false);
    setScoreAdjustReason('');
    showNotice(`Đã điều chỉnh ${scoreAdjustDelta >= 0 ? '+' : ''}${scoreAdjustDelta} điểm cho "${selectedTeam.teamName}"`);
    onRefresh?.();
  };

  // Filter proverbs for Bank tab
  const filteredProverbs = proverbs.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.answer && p.answer.toLowerCase().includes(q)) ||
      (p.correctAnswer && p.correctAnswer.toLowerCase().includes(q)) ||
      (p.topic && p.topic.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.proverbNumber && p.proverbNumber.toString().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-navigation */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-900/40 via-purple-900/40 to-slate-900/60 border border-amber-400/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
            <span className="text-xs font-mono font-black text-amber-300 uppercase tracking-widest bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              GAME MASTER • ROUND 3 CONTROL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Điều Hành Vòng 3: Đuổi Hình Bắt Chữ (Ca Dao, Tục Ngữ)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Ngân hàng 40 câu chính thức • Rút 5 câu/lượt • Chấm điểm theo tốc độ • Quyền can thiệp & chấm điểm tức thời
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveSubTab('control')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'control'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Điều Khiển Đấu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('bank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'bank'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Ngân Hàng 40 Câu ({proverbs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'logs'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Nhật Ký GM ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Action Toast Notice */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 text-sm font-bold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 1: LIVE MATCH CONTROL                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'control' && (
        <div className="space-y-6">
          {/* Team Selector Strip */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>CHỌN ĐỘI THI ĐẤU VÒNG 3:</span>
              </label>
              {selectedTeam && (
                <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Vòng Hiện Tại: {selectedTeam.currentRound} • Điểm: {selectedTeam.score}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {teams.map((t) => {
                const isSelected = t.id === selectedTeamId;
                const isR3 = t.currentRound === 3;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTeamId(t.id);
                      audioManager.playButtonTap();
                    }}
                    className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                        : isR3
                        ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{t.teamName}</span>
                    <span className="font-mono text-[10px] opacity-80">({t.score}đ)</span>
                    {isR3 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Question & GM Secret Panel */}
          {selectedTeam && currentPuzzle ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT 7 COLS: Live Visual Preview */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-6 rounded-3xl bg-slate-950 text-white border border-amber-400/40 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest bg-amber-950 px-3 py-1 rounded-full border border-amber-400/40">
                        CÂU ĐANG THI ĐẤU: {currentPuzzleIdx + 1} / {assignedPuzzles.length}
                      </span>
                      <h3 className="text-lg font-black text-white mt-2">
                        {currentPuzzle.topic}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400 block">Thời Gian Mặc Định</span>
                      <span className="text-lg font-mono font-black text-cyan-300">
                        {currentPuzzle.timeLimit || 30} GIÂY
                      </span>
                    </div>
                  </div>

                  {/* Visual Stage rendered */}
                  <Round3VisualStage
                    visualClues={currentPuzzle.visualClues || []}
                    proverbNumber={currentPuzzle.proverbNumber}
                  />
                </div>
              </div>

              {/* RIGHT 5 COLS: GM Secret Answer & Live Override Controls */}
              <div className="lg:col-span-5 space-y-4">
                {/* Secret Answer Card (Only GM Sees) */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/10 via-purple-500/10 to-slate-900/90 border-2 border-amber-400 shadow-xl text-white space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-400/30 pb-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-amber-400" />
                      <span className="font-mono text-xs font-black uppercase tracking-wider text-amber-300">
                        ĐÁP ÁN BÍ MẬT (DÀNH CHO GM)
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-400/40 font-bold">
                      BẢO MẬT
                    </span>
                  </div>

                  {/* Canonical Answer */}
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Đáp Án Chuẩn:
                    </span>
                    <p className="text-xl sm:text-2xl font-black text-amber-300 tracking-wide bg-amber-950/60 p-3 rounded-2xl border border-amber-400/40">
                      "{currentPuzzle.answer || currentPuzzle.correctAnswer}"
                    </p>
                  </div>

                  {/* Accepted Variants */}
                  {currentPuzzle.acceptedAnswers && currentPuzzle.acceptedAnswers.length > 0 && (
                    <div>
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                        Các Biến Thể Được Chấp Nhận:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentPuzzle.acceptedAnswers.map((alias, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium bg-slate-800 text-slate-200 px-2.5 py-1 rounded-xl border border-slate-700"
                          >
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800">
                    {currentPuzzle.explanation}
                  </p>
                </div>

                {/* Instant GM Override Actions */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider">
                    BẢNG ĐIỀU KHIỂN & CHẤM ĐIỂM TỨC THÌ:
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleConfirmCorrect}
                      className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>XÁC NHẬN ĐÚNG (+100đ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmWrong}
                      className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>XÁC NHẬN SAI (0đ)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleSwapQuestion}
                      title="Đổi câu này sang câu khác chưa dùng trong ngân hàng 40 câu"
                      className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>Đổi Câu Khác</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipQuestion}
                      title="Bỏ qua câu này và chuyển sang câu tiếp theo"
                      className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <SkipForward className="w-4 h-4" />
                      <span>Bỏ Qua</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReplayQuestion}
                      title="Phát lại câu này (reset lại timer trên máy người chơi)"
                      className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Phát Lại</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleToggleSteal}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Bật/Tắt Cướp Quyền</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAdjustDialog(true)}
                      className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Chỉnh Điểm</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl">
              <p className="text-slate-600 font-medium">
                Vui lòng chọn đội để xem bộ 5 câu đố Vòng 3 và điều khiển trận đấu.
              </p>
            </div>
          )}

          {/* Answers History of Selected Team in Round 3 */}
          {selectedTeam && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-mono text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>LỊCH SỬ TRẢ LỜI VÒNG 3 CỦA ĐỘI "{selectedTeam.teamName}":</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 font-mono text-slate-500 bg-slate-50">
                      <th className="p-3">Câu Hỏi</th>
                      <th className="p-3">Đáp Án Học Sinh Nhập</th>
                      <th className="p-3">Kết Quả</th>
                      <th className="p-3">Thời Gian</th>
                      <th className="p-3">Điểm Nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTeam.answersHistory
                      .filter((a) => a.round === 3)
                      .map((ans, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-900">{ans.questionId}</td>
                          <td className="p-3 font-medium text-slate-800 font-mono">"{ans.selectedAnswer}"</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                ans.isCorrect
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {ans.isCorrect ? 'ĐÚNG' : 'SAI / TIMEOUT'}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-600">{ans.timeTaken}s</td>
                          <td className="p-3 font-mono font-bold text-amber-700">+{ans.pointsAwarded}đ</td>
                        </tr>
                      ))}
                    {selectedTeam.answersHistory.filter((a) => a.round === 3).length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 italic">
                          Chưa có câu trả lời nào được ghi nhận cho Vòng 3.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PROVERB BANK (40 OFFICIAL QUESTIONS)                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'bank' && (
        <div className="space-y-4">
          {/* Bank Controls Bar */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm câu ca dao, số thứ tự, chủ đề..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                {filteredProverbs.length} / {proverbs.length} Câu Đố
              </span>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Khôi phục ngân hàng 40 câu ca dao tục ngữ chuẩn ban đầu?')) {
                    Round3Service.resetProverbBank();
                    setProverbs(Round3Service.getProverbBank());
                    showNotice('Đã khôi phục đủ 40 câu ca dao tục ngữ chuẩn!');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đặt Lại 40 Câu Gốc</span>
              </button>
            </div>
          </div>

          {/* Grid of 40 Proverbs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProverbs.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3 hover:border-amber-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-white font-mono font-black text-xs shadow-xs">
                      #{item.proverbNumber ? item.proverbNumber.toString().padStart(2, '0') : item.id}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                      {item.category || item.topic}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    Đã dùng: {item.usageCount || 0} lần
                  </span>
                </div>

                {/* Visual Clues Preview */}
                <div className="p-4 rounded-2xl bg-[#120722] border border-fuchsia-500/30 flex items-center justify-center gap-2 sm:gap-3 flex-wrap min-h-[70px]">
                  {(item.visualClues || []).map((c, idx) => (
                    <span
                      key={idx}
                      className="text-2xl sm:text-3xl drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* Secret Answer */}
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
                    ĐÁP ÁN CHUẨN:
                  </span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    "{item.answer || item.correctAnswer}"
                  </p>
                </div>

                {/* Accepted Aliases count */}
                {item.acceptedAnswers && item.acceptedAnswers.length > 1 && (
                  <p className="text-[11px] text-slate-500 font-mono">
                    {item.acceptedAnswers.length} biến thể chấp nhận (không dấu, xưng hô, dấu câu)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: AUDIT LOGS & SETTINGS                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6">
          {/* Config Settings Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>CẤU HÌNH QUY TẮC THI ĐẤU VÒNG 3:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Thời Gian Cho Mỗi Câu (Giây)
                </label>
                <input
                  type="number"
                  value={config.timeLimitPerQuestion}
                  onChange={(e) => {
                    const val = Math.max(10, Math.min(120, parseInt(e.target.value) || 30));
                    const updated = Round3Service.saveConfig({ timeLimitPerQuestion: val });
                    setConfig(updated);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="allowStealCheck"
                  checked={config.allowSteal}
                  onChange={(e) => {
                    const updated = Round3Service.saveConfig({ allowSteal: e.target.checked });
                    setConfig(updated);
                  }}
                  className="w-5 h-5 rounded text-amber-600 cursor-pointer"
                />
                <label htmlFor="allowStealCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Kích hoạt cơ chế Cướp Quyền Trả Lời (Steal Privilege)
                </label>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>NHẬT KÝ THAO TÁC CỦA GAME MASTER (AUDIT TRAIL):</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-500">
                {logs.length} bản ghi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 font-mono text-slate-500 bg-slate-50">
                    <th className="p-3">Thời Gian</th>
                    <th className="p-3">Đội Thi</th>
                    <th className="p-3">Hành Động</th>
                    <th className="p-3">Điểm Trước / Sau</th>
                    <th className="p-3">Chi Tiết / Lý Do</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{log.teamName}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        {log.oldScore !== undefined && log.newScore !== undefined
                          ? `${log.oldScore} → ${log.newScore}`
                          : '-'}
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{log.note}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                        Chưa có nhật ký can thiệp thủ công nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manual Score Adjust Modal */}
      {showAdjustDialog && selectedTeam && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-lg font-black text-slate-900">
              Điều Chỉnh Điểm Số: {selectedTeam.teamName}
            </h3>
            <p className="text-xs text-slate-600">
              Điểm hiện tại: <strong className="font-mono text-amber-600">{selectedTeam.score} điểm</strong>
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Điểm cộng / trừ (+ hoặc -):
              </label>
              <input
                type="number"
                value={scoreAdjustDelta}
                onChange={(e) => setScoreAdjustDelta(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-base"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Lý do điều chỉnh (sẽ lưu vào Nhật Ký):
              </label>
              <textarea
                value={scoreAdjustReason}
                onChange={(e) => setScoreAdjustReason(e.target.value)}
                rows={2}
                placeholder="VD: Cộng điểm thưởng câu hỏi phụ, bù điểm kỹ thuật..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjustDialog(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyScoreAdjust}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-md"
              >
                Xác Nhận Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
