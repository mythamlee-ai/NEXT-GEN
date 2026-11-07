import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  RotateCcw,
  Check,
  Search,
  Award,
  HelpCircle,
  BookOpen,
  Heart,
  Flame,
  GraduationCap,
  Activity,
  Bot,
  Brain,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Team } from '../../types';
import {
  Round4TeamState,
  Round4MissionStep,
  AIDetectiveQuestion,
  BackupMatchingPair,
} from '../../types/round4';
import { Round4Engine } from '../../services/round4Engine';
import { storageService } from '../../services/storageService';
import { audioManager } from '../../services/audioManager';

interface Round4ViewProps {
  team: Team;
  onFinishGame: () => void;
}

export const Round4View: React.FC<Round4ViewProps> = ({ team, onFinishGame }) => {
  const config = useMemo(() => Round4Engine.getConfig(), []);
  const maxTimeSeconds = useMemo(() => Round4Engine.getEffectiveTimeLimit(config), [config]);

  // Questions and pairs
  const [questions, setQuestions] = useState<AIDetectiveQuestion[]>(() =>
    Round4Engine.getAIDetectiveQuestions()
  );
  const backupPairs = useMemo(() => Round4Engine.getBackupMatchingPairs(), []);

  // Team state initialization
  const [{ state: initialState }] = useState(() => Round4Engine.getOrAssignTeamPackage(team));
  const [teamState, setTeamState] = useState<Round4TeamState>(initialState);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => initialState.elapsedSeconds || 0);

  // Current Mission Step
  const currentStep: Round4MissionStep = useMemo(() => {
    const s = teamState.currentStep as Round4MissionStep;
    if (s === 'treasure_ceremony' || s === 'system_restored') return 'treasure_ceremony';
    if (s === 'backup_matching') return 'backup_matching';
    if (s === 'final_keyword' || s === 'keyword_decrypt' || s === 'final_code') return 'final_keyword';
    return 'ai_detective';
  }, [teamState.currentStep]);

  // ==================== MISSION 1: AI DETECTIVE STATE ====================
  const [currentQIndex, setCurrentQIndex] = useState<number>(() => {
    const answeredCount = Object.keys(initialState.aiDetectiveAnswers || {}).length;
    return Math.min(answeredCount, Math.max(0, questions.length - 1));
  });
  const currentQuestion = questions[currentQIndex] || questions[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{
    show: boolean;
    isCorrect: boolean;
    question: AIDetectiveQuestion;
    pointsAwarded: number;
  } | null>(null);

  // ==================== MISSION 2: FINAL KEYWORD STATE ====================
  const [enteredKeyword, setEnteredKeyword] = useState<string>('');
  const [keywordFeedback, setKeywordFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
    attemptsLeft: number;
    canSwitchToBackup: boolean;
  } | null>(null);

  // ==================== MISSION 3: BACKUP MATCHING STATE ====================
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>(() => initialState.backupPairsMatched || []);
  const [pairMatchFeedback, setPairMatchFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Scramble right items deterministically or once on mount
  const scrambledRightPairs = useMemo(() => {
    return [...backupPairs].sort((a, b) => (a.id > b.id ? -1 : 1));
  }, [backupPairs]);

  // Sync Timer
  useEffect(() => {
    if (currentStep === 'treasure_ceremony') return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep]);

  // Sync background storage updates from Game Master
  useEffect(() => {
    const syncTeam = () => {
      const refreshed = storageService.getTeamById(team.id);
      if (refreshed?.round4State) {
        setTeamState(refreshed.round4State);
        if (refreshed.round4State.backupPairsMatched) {
          setMatchedPairs(refreshed.round4State.backupPairsMatched);
        }
      }
    };
    window.addEventListener('storage', syncTeam);
    const interval = setInterval(syncTeam, 2000);
    return () => {
      window.removeEventListener('storage', syncTeam);
      clearInterval(interval);
    };
  }, [team.id]);

  // ==================== HANDLERS: MISSION 1 (AI DETECTIVE) ====================
  const handleConfirmAnswer = () => {
    if (!selectedOptionId || !currentQuestion) return;

    audioManager.playClick();
    const res = Round4Engine.recordAIDetectiveAnswer(
      team,
      currentQuestion.id,
      selectedOptionId,
      elapsedSeconds
    );

    setTeamState(res.updatedState);

    if (res.isCorrect) {
      audioManager.playBonusPoints();
      audioManager.playUnlock();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // Fallback
      }
    } else {
      audioManager.playIncorrect();
    }

    setFeedbackModal({
      show: true,
      isCorrect: res.isCorrect,
      question: res.question,
      pointsAwarded: res.pointsAwarded,
    });
  };

  const handleNextQuestion = () => {
    setFeedbackModal(null);
    setSelectedOptionId(null);

    const answeredCount = Object.keys(teamState.aiDetectiveAnswers || {}).length;
    if (answeredCount >= questions.length || currentQIndex >= questions.length - 1) {
      // Advance to Mission 2: Final Keyword
      audioManager.playRoundComplete();
      const nextState: Round4TeamState = {
        ...teamState,
        aiDetectiveCompleted: true,
        currentStep: 'final_keyword',
      };
      Round4Engine.saveTeamState(nextState);
      const updatedTeam: Team = { ...team, round4State: nextState };
      storageService.saveTeam(updatedTeam);
      setTeamState(nextState);
    } else {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  // ==================== HANDLERS: MISSION 2 (FINAL KEYWORD: TRI ÂN) ====================
  const handleVerifyKeyword = () => {
    if (!enteredKeyword.trim()) return;

    audioManager.playClick();
    const res = Round4Engine.verifyFinalKeyword(team, enteredKeyword, elapsedSeconds);
    setTeamState(res.updatedState);

    if (res.isCorrect) {
      audioManager.playVictory();
      audioManager.playUnlock();
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6'],
        });
      } catch {
        // Fallback
      }
    } else {
      audioManager.playIncorrect();
    }

    setKeywordFeedback({
      show: true,
      isCorrect: res.isCorrect,
      message: res.message,
      attemptsLeft: res.attemptsLeft,
      canSwitchToBackup: res.canSwitchToBackup,
    });
  };

  const handleSwitchToBackup = () => {
    audioManager.playPop();
    Round4Engine.switchToBackupMission(team.id);
    const refreshed = storageService.getTeamById(team.id);
    if (refreshed?.round4State) {
      setTeamState(refreshed.round4State);
    }
  };

  // ==================== HANDLERS: MISSION 3 (BACKUP MATCHING) ====================
  const handleSelectLeftCard = (leftId: string) => {
    // Check if this pair is already matched
    const isAlreadyMatched = matchedPairs.some(
      (pId) => backupPairs.find((p) => p.id === pId)?.leftId === leftId
    );
    if (isAlreadyMatched) return;

    audioManager.playPop();
    setSelectedLeftId(leftId);
    setPairMatchFeedback(null);
  };

  const handleSelectRightCard = (rightId: string) => {
    if (!selectedLeftId) {
      setPairMatchFeedback({
        type: 'error',
        text: 'Vui lòng chọn 1 thẻ biểu trưng ở cột bên trái trước!',
      });
      audioManager.playIncorrect();
      return;
    }

    // Check if the left card and right card form a valid pair
    const matchingPair = backupPairs.find(
      (p) => p.leftId === selectedLeftId && p.rightId === rightId
    );

    if (matchingPair) {
      // Correct Match!
      audioManager.playBonusPoints();
      audioManager.playUnlock();
      const res = Round4Engine.recordBackupPairMatch(team, matchingPair.id, elapsedSeconds);
      setMatchedPairs(res.updatedState.backupPairsMatched || []);
      setTeamState(res.updatedState);
      setSelectedLeftId(null);

      setPairMatchFeedback({
        type: 'success',
        text: `✨ CHÍNH XÁC! +10 điểm (${matchingPair.leftTitle} ➔ ${matchingPair.rightTitle})`,
      });

      if (res.isComplete) {
        audioManager.playVictory();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#ec4899', '#f59e0b', '#06b6d4', '#10b981'],
          });
        } catch {
          // Fallback
        }
      }
    } else {
      // Incorrect Match
      audioManager.playIncorrect();
      setPairMatchFeedback({
        type: 'error',
        text: 'Chưa chính xác! Ý nghĩa này chưa tương ứng với biểu trưng đã chọn. Hãy thử lại!',
      });
    }
  };

  // Formatting helpers
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentRound4Score = Round4Engine.calculateRound4Only(teamState);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* ==================== CYBER INVESTIGATION LAB HEADER ==================== */}
      <div className="bg-gradient-to-r from-[#0c1435]/95 via-[#130b2e]/95 to-[#08182b]/95 border-2 border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_35px_rgba(6,182,212,0.25)] backdrop-blur-2xl relative overflow-hidden">
        {/* Neon Glow accents */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-[11px] font-mono font-bold text-cyan-300 uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>PHÒNG ĐIỀU TRA KHOA HỌC • AI DETECTIVE</span>
              </span>
              <span className="text-[11px] font-mono text-amber-300 font-bold bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                VÒNG 4: AI DETECTIVE &amp; KHO BÁU TỐI MẬT
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-200">
              {team.teamName} – {team.className}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div className="bg-[#070b1c]/90 border border-cyan-500/40 px-3.5 py-2 rounded-2xl flex items-center gap-2 font-mono shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">THỜI GIAN</span>
                <span className="text-base font-black text-cyan-300">{formatTime(elapsedSeconds)}</span>
              </div>
            </div>

            {/* Score Pill */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 px-4 py-2 rounded-2xl flex items-center gap-2 font-mono shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-amber-300 block leading-none">ĐIỂM VÒNG 4</span>
                <span className="text-lg font-black text-amber-300">{currentRound4Score}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Breadcrumb / Mission Indicator */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-cyan-500/20 text-xs font-mono">
          <div
            className={`p-2 rounded-xl flex items-center gap-2 transition-all ${
              currentStep === 'ai_detective'
                ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : teamState.aiDetectiveCompleted
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/40 text-slate-500 border border-slate-800'
            }`}
          >
            <Brain className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Tìm Lỗi AI ({Object.keys(teamState.aiDetectiveAnswers || {}).length}/{questions.length})</span>
          </div>

          <div
            className={`p-2 rounded-xl flex items-center gap-2 transition-all ${
              currentStep === 'final_keyword'
                ? 'bg-purple-500/20 border border-purple-400 text-purple-300 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : teamState.keywordSolved
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/40 text-slate-500 border border-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Mật Mã Tối Mật (100đ)</span>
          </div>

          <div
            className={`p-2 rounded-xl flex items-center gap-2 transition-all ${
              currentStep === 'backup_matching'
                ? 'bg-amber-500/20 border border-amber-400 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : teamState.backupCompleted
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/40 text-slate-500 border border-slate-800'
            }`}
          >
            <Heart className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Ghép Nối 20/11 ({matchedPairs.length}/5)</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* NHIỆM VỤ 1: AI DETECTIVE – PHÁT HIỆN VÀ SỬA LỖI AI           */}
      {/* ============================================================ */}
      {currentStep === 'ai_detective' && (
        <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-400">
                <Brain className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                  NHIỆM VỤ 1 • AI DETECTIVE: TÌM LỖI SAI CỦA AI
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Hồ Sơ Điều Tra #{currentQIndex + 1}: {currentQuestion.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                Môn: {currentQuestion.field}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
                +{currentQuestion.points}đ
              </span>
            </div>
          </div>

          {/* AI Claim Box (Cyber Detective Styling) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#060e28] to-[#120a28] border-2 border-purple-500/40 relative shadow-[0_0_25px_rgba(168,85,247,0.15)]">
            <div className="flex items-center gap-2 mb-2 text-purple-300 text-xs font-mono font-bold">
              <Bot className="w-4 h-4 text-purple-400 animate-bounce" />
              <span>DỮ LIỆU ĐƯỢC TẠO BỞI MÔ HÌNH AI (ĐANG BỊ NGHI NGỜ CHỨA LỖI SAI):</span>
            </div>
            <blockquote className="text-sm sm:text-base text-slate-100 italic leading-relaxed font-mono bg-[#050816]/70 p-4 rounded-xl border border-purple-500/30">
              "{currentQuestion.aiClaim}"
            </blockquote>
          </div>

          {/* Question Prompt */}
          <div>
            <h3 className="text-sm font-bold text-cyan-200 mb-3 flex items-center gap-2 font-mono">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>{currentQuestion.questionText}</span>
            </h3>

            {/* Options Grid */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.01]'
                        : 'bg-[#070b1c]/80 border-slate-700/80 text-slate-300 hover:border-cyan-400/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs uppercase ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {opt.id.replace('opt-', '')}
                      </span>
                      <span className="text-xs sm:text-sm font-sans leading-relaxed">{opt.text}</span>
                    </div>

                    {isSelected && <Check className="w-5 h-5 text-cyan-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-mono text-slate-400">
              {selectedOptionId ? (
                <span className="text-cyan-300 font-bold">
                  ✓ Đã chọn phương án. Nhấn Xác Nhận để kiểm tra lỗi AI.
                </span>
              ) : (
                'Hãy đọc kỹ nhận định của AI và chọn 1 phương án phản biện.'
              )}
            </span>

            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={handleConfirmAnswer}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <span>XÁC NHẬN CÂU TRẢ LỜI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MANDATORY FEEDBACK MODAL: AI DETECTIVE (CORRECT & INCORRECT) */}
      {/* ============================================================ */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className={`max-w-2xl w-full rounded-3xl p-6 sm:p-8 border-2 shadow-2xl relative overflow-hidden ${
              feedbackModal.isCorrect
                ? 'bg-[#091829] border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)]'
                : 'bg-[#1a0c1e] border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.3)]'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              {feedbackModal.isCorrect ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 text-2xl">
                  ✨
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 text-2xl animate-bounce">
                  ⚠️
                </div>
              )}

              <div>
                <h3
                  className={`text-xl font-black font-mono tracking-wide ${
                    feedbackModal.isCorrect ? 'text-emerald-300' : 'text-rose-400'
                  }`}
                >
                  {feedbackModal.isCorrect
                    ? 'CHÍNH XÁC – ĐÃ PHÁT HIỆN LỖI AI!'
                    : 'AI ERROR – BẠN ĐÃ BỎ SÓT LỖI!'}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {feedbackModal.isCorrect
                    ? `Cộng thưởng +${feedbackModal.pointsAwarded} điểm vào quỹ điểm Vòng 4`
                    : 'Không phát hiện được lỗi sai của AI trong nhận định này'}
                </span>
              </div>
            </div>

            {/* Mandatory Response Content as specified */}
            <div className="space-y-3.5 bg-black/40 rounded-2xl p-4.5 border border-white/10 text-xs sm:text-sm font-sans leading-relaxed">
              <div>
                <strong className="text-cyan-300 font-mono block mb-1">
                  🎯 ĐÁP ÁN ĐÚNG:
                </strong>
                <p className="text-white font-medium bg-cyan-950/50 p-2.5 rounded-xl border border-cyan-500/30">
                  {feedbackModal.question.correctAnswerText}
                </p>
              </div>

              <div>
                <strong className="text-amber-400 font-mono block mb-1">
                  🔍 AI SAI Ở ĐÂU?
                </strong>
                <p className="text-slate-200 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                  {feedbackModal.question.aiFlawExplanation}
                </p>
              </div>

              <div>
                <strong className="text-emerald-300 font-mono block mb-1">
                  🔬 KIẾN THỨC CHÍNH XÁC:
                </strong>
                <p className="text-slate-200 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                  {feedbackModal.question.scientificTruth}
                </p>
              </div>

              {!feedbackModal.isCorrect && (
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold text-center">
                  ⚠️ "Hãy kiểm tra thông tin trước khi tin vào AI!"
                </div>
              )}
            </div>

            {/* Modal Next Button */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black font-mono text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer"
              >
                <span>
                  {currentQIndex < questions.length - 1
                    ? 'CÂU HỎI TIẾP THEO'
                    : 'TIẾN VÀO GIẢI MÃ TỐI MẬT'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* NHIỆM VỤ 2: FINAL KEYWORD – GIẢI MÃ TỐI MẬT TRI ÂN            */}
      {/* ============================================================ */}
      {currentStep === 'final_keyword' && (
        <div className="bg-[#0c1435]/90 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(168,85,247,0.25)] backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-950/80 border border-purple-400/50 text-purple-400">
                <KeyRound className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block font-bold">
                  NHIỆM VỤ 2 • FINAL KEYWORD: GIẢI MÃ TỐI MẬT
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Dung Hợp 3 Từ Khóa Khoa Học &amp; Mở Rương Kho Báu
                </h2>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              PHẦN THƯỞNG: +100 ĐIỂM
            </span>
          </div>

          {/* 4 Keywords Sequence Display (3 Collected + 1 Secret Locked) */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-300 font-bold block">
              CHUỖI 4 TỪ KHÓA KHOA HỌC &amp; MẬT MÃ TỐI MẬT:
            </span>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-cyan-950/70 border border-cyan-400/50 text-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="text-[10px] font-mono text-cyan-400 block mb-1">VÒNG 1 • CODE BREAKER</span>
                <span className="text-sm sm:text-base font-black font-mono text-white tracking-widest">KHOA HỌC</span>
              </div>

              <div className="p-4 rounded-2xl bg-fuchsia-950/70 border border-fuchsia-400/50 text-center shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                <span className="text-[10px] font-mono text-fuchsia-400 block mb-1">VÒNG 2 • AI ĐÂY?</span>
                <span className="text-sm sm:text-base font-black font-mono text-white tracking-widest">SÁNG TẠO</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-400/50 text-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="text-[10px] font-mono text-amber-400 block mb-1">VÒNG 3 • ĐUỔI HÌNH BẮT CHỮ</span>
                <span className="text-sm sm:text-base font-black font-mono text-white tracking-widest">CHINH PHỤC</span>
              </div>

              {/* 4th Box: Does NOT reveal the keyword before solving; only shows 5-character hint */}
              <div className="p-4 rounded-2xl bg-purple-950/70 border-2 border-purple-400/60 text-center shadow-[0_0_20px_rgba(168,85,247,0.3)] relative overflow-hidden flex flex-col justify-between">
                <span className="text-[10px] font-mono text-purple-300 block mb-1 font-bold">
                  VÒNG 4 • MẬT MÃ TỐI MẬT
                </span>
                {teamState.keywordSolved ? (
                  <span className="text-sm sm:text-base font-black font-mono text-amber-300 tracking-widest animate-pulse">
                    TRI ÂN (+100đ)
                  </span>
                ) : (
                  <div className="flex flex-col items-center justify-center my-auto">
                    <div className="flex items-center gap-1.5 text-amber-300 font-mono text-sm sm:text-base font-black tracking-widest">
                      <Lock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>• • • • •</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 mt-1">
                      GỢI Ý: GỒM 5 KÍ TỰ
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Decryption Riddle Box: Only shows 5-character hint */}
          <div className="p-5 rounded-2xl bg-[#070b1c]/90 border border-purple-500/30 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans space-y-3 shadow-[0_0_25px_rgba(168,85,247,0.2)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-2">
              <div className="flex items-center gap-2 text-purple-300 font-mono font-bold">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>GỢI Ý TỪ KHÓA TỐI MẬT CUỐI CÙNG:</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/60 text-amber-300 text-xs font-mono font-black animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                🔑 GỢI Ý TỪ KHÓA: GỒM 5 KÍ TỰ
              </span>
            </div>

            <p>
              Hành trình nghiên cứu <strong className="text-cyan-300">KHOA HỌC</strong>, không ngừng{' '}
              <strong className="text-fuchsia-300">SÁNG TẠO</strong> để <strong className="text-amber-300">CHINH PHỤC</strong> đỉnh cao tri thức... Tất cả đều bắt đầu từ công lao dạy dỗ của quý Thầy Cô giáo.
            </p>

            <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-amber-300 font-mono font-bold text-xs sm:text-sm flex items-center gap-2">
                <span>💡</span>
                <span>Gợi ý: Mật mã gồm 5 kí tự (2 từ). Hướng về Ngày Nhà giáo Việt Nam 20/11.</span>
              </span>

              {/* 5-character visual slots tracking user input */}
              <div className="flex items-center gap-1.5 shrink-0">
                {[0, 1, 2, 3, 4].map((i) => {
                  const cleanTyped = enteredKeyword.replace(/\s+/g, '');
                  const char = cleanTyped[i];
                  return (
                    <div
                      key={i}
                      className={`w-8 h-10 rounded-lg border flex items-center justify-center font-mono text-sm font-black transition-all ${
                        char
                          ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)] scale-105'
                          : 'border-purple-500/40 bg-purple-950/40 text-purple-400/50'
                      }`}
                    >
                      {char ? char.toUpperCase() : '?'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Input Box for Final Keyword */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300 block">
              NHẬP TỪ KHÓA TỐI MẬT (Gợi ý: Từ khóa gồm 5 kí tự, không phân biệt hoa/thường, có dấu hoặc không dấu):
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Nhập từ khóa tối mật (gợi ý: gồm 5 kí tự)..."
                value={enteredKeyword}
                onChange={(e) => setEnteredKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyKeyword()}
                className="flex-1 px-5 py-3.5 rounded-2xl bg-slate-900/90 border-2 border-purple-500/50 text-white font-mono font-bold text-base tracking-wider focus:outline-none focus:border-cyan-400 uppercase placeholder-slate-600 shadow-inner"
              />

              <button
                type="button"
                onClick={handleVerifyKeyword}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:from-purple-400 hover:to-amber-400 text-slate-950 font-black text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(236,72,153,0.5)] cursor-pointer active:scale-95 transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>XÁC NHẬN MẬT MÃ</span>
              </button>
            </div>

            {/* Keyword Feedback Message */}
            {keywordFeedback && (
              <div
                className={`p-4 rounded-2xl border text-xs font-mono flex items-start justify-between gap-3 ${
                  keywordFeedback.isCorrect
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {keywordFeedback.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <span>{keywordFeedback.message}</span>
                </div>

                {keywordFeedback.canSwitchToBackup && (
                  <button
                    type="button"
                    onClick={handleSwitchToBackup}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs font-mono hover:bg-amber-400 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  >
                    VÀO BACKUP MISSION →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Backup Mission Shortcut Button */}
          <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Lượt thử đã dùng: {teamState.keywordAttempts || 0} / {teamState.maxKeywordAttempts || 3}
            </span>

            <button
              type="button"
              onClick={handleSwitchToBackup}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-950/60 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Chuyển sang Nhiệm vụ Ghép Nối Tri Ân (Tối đa 50đ)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* NHIỆM VỤ 3: BACKUP MISSION – GHÉP NỐI TRI ÂN (20/11)          */}
      {/* ============================================================ */}
      {currentStep === 'backup_matching' && (
        <div className="bg-[#0c1435]/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(245,158,11,0.25)] backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-950/80 border border-amber-400/50 text-amber-400">
                <Heart className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                  NHIỆM VỤ 3 • BACKUP MISSION: GHÉP NỐI TRI ÂN
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Ghép Nối 5 Cặp Biểu Trưng &amp; Ý Nghĩa Ngày Nhà Giáo Việt Nam
                </h2>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40 block">
                ĐÃ GHÉP: {matchedPairs.length}/5 CẶP (+{matchedPairs.length * 10}đ)
              </span>
            </div>
          </div>

          <p className="text-xs font-mono text-slate-300">
            👉 <strong>Hướng dẫn:</strong> Nhấp chọn 1 biểu trưng ở cột <strong>BÊN TRÁI</strong>, sau đó nhấp chọn ý nghĩa tương ứng ở cột <strong>BÊN PHẢI</strong>. Mỗi cặp ghép chính xác nhận ngay 10 điểm (Tối đa 50 điểm).
          </p>

          {/* Feedback Banner */}
          {pairMatchFeedback && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2 transition-all ${
                pairMatchFeedback.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
              }`}
            >
              {pairMatchFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{pairMatchFeedback.text}</span>
            </div>
          )}

          {/* 2-Column Matching Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: 5 Items */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-300 block uppercase">
                CỘT 1: BIỂU TRƯNG TRI ÂN
              </span>

              {backupPairs.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);
                const isSelected = selectedLeftId === pair.leftId;

                return (
                  <div
                    key={pair.leftId}
                    onClick={() => handleSelectLeftCard(pair.leftId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md flex items-center justify-between gap-3 ${
                      isMatched
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 opacity-80 cursor-default'
                        : isSelected
                        ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-[1.02]'
                        : 'bg-[#070b1c]/80 border-slate-700/80 text-slate-300 hover:border-cyan-400/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pair.leftIcon}</span>
                      <div>
                        <span className="text-sm font-bold text-white block">{pair.leftTitle}</span>
                        <span className="text-xs text-slate-400">{pair.leftDescription}</span>
                      </div>
                    </div>

                    {isMatched ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : isSelected ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-slate-950">
                        ĐANG CHỌN
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Right Column: 5 Meanings */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-amber-300 block uppercase">
                CỘT 2: Ý NGHĨA KHOA HỌC &amp; GIÁO DỤC
              </span>

              {scrambledRightPairs.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);

                return (
                  <div
                    key={pair.rightId}
                    onClick={() => !isMatched && handleSelectRightCard(pair.rightId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-md flex items-center justify-between gap-3 ${
                      isMatched
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 opacity-80 cursor-default'
                        : 'bg-[#070b1c]/80 border-slate-700/80 text-slate-300 hover:border-amber-400/60 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-white block">{pair.rightTitle}</span>
                      <span className="text-xs text-slate-400">{pair.rightDescription}</span>
                    </div>

                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completion Button */}
          {matchedPairs.length >= 5 && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-in fade-in">
              <span className="text-xs font-mono font-bold text-emerald-300">
                🎉 HOÀN THÀNH TOÀN BỘ 5 CẶP GHÉP NỐI! ĐẠT TỐI ĐA +50 ĐIỂM!
              </span>

              <button
                type="button"
                onClick={() => {
                  const updated: Round4TeamState = {
                    ...teamState,
                    backupCompleted: true,
                    currentStep: 'treasure_ceremony',
                  };
                  Round4Engine.saveTeamState(updated);
                  setTeamState(updated);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs font-mono flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              >
                <span>TIẾN VÀO MÀN HÌNH TRI ÂN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MÀN HÌNH KẾT THÚC: KHO BÁU GIẢI MÃ & TRI ÂN 20/11             */}
      {/* ============================================================ */}
      {currentStep === 'treasure_ceremony' && (
        <div className="bg-gradient-to-b from-[#0e173e] via-[#1a0f35] to-[#070b1c] border-2 border-amber-400/60 rounded-3xl p-8 sm:p-12 shadow-[0_0_60px_rgba(245,158,11,0.35)] backdrop-blur-2xl text-center space-y-8 relative overflow-hidden">
          {/* Confetti & Golden Sparkles */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />

          {/* 3D Glowing Treasure Chest Representation */}
          <div className="relative inline-block mx-auto">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-600 p-1 shadow-[0_0_50px_rgba(245,158,11,0.8)] animate-pulse flex items-center justify-center">
              <div className="w-full h-full bg-[#080d24] rounded-3xl flex flex-col items-center justify-center gap-2">
                <span className="text-5xl sm:text-6xl">🏆</span>
                <span className="text-xs font-mono font-black text-amber-300 tracking-wider">
                  KHO BÁU TRI ÂN
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Final Headline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 uppercase tracking-wide font-mono">
              KHO BÁU ĐÃ ĐƯỢC GIẢI MÃ!
            </h2>

            {/* Mandatory Message Body */}
            <div className="p-6 rounded-2xl bg-black/50 border border-amber-400/40 text-slate-200 text-sm sm:text-base font-medium leading-relaxed shadow-inner font-sans">
              "TRI THỨC GIÚP CHÚNG TA KHÁM PHÁ THẾ GIỚI. TƯ DUY PHẢN BIỆN GIÚP CHÚNG TA KHÔNG MÙ QUÁNG TIN VÀO AI. VÀ NHỮNG NGƯỜI THẦY, NGƯỜI CÔ LUÔN LÀ NGƯỜI TRUYỀN CẢM HỨNG TRÊN HÀNH TRÌNH TRƯỞNG THÀNH."
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 font-mono tracking-wider">
              CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11!
            </h3>
          </div>

          {/* Score Summary Card */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 font-mono text-xs space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Điểm AI Detective:</span>
              <span className="text-cyan-300 font-bold">+{teamState.aiDetectiveScore || 0}đ</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>{teamState.keywordSolved ? 'Mật mã TRI ÂN:' : 'Ghép nối 20/11:'}</span>
              <span className="text-amber-300 font-bold">
                +{teamState.keywordSolved ? 100 : teamState.backupScore || 0}đ
              </span>
            </div>
            {teamState.manualAdjustment ? (
              <div className="flex justify-between text-slate-300">
                <span>Điều chỉnh Game Master:</span>
                <span className="text-purple-300 font-bold">{teamState.manualAdjustment > 0 ? `+${teamState.manualAdjustment}` : teamState.manualAdjustment}đ</span>
              </div>
            ) : null}
            <div className="flex justify-between pt-2 border-t border-slate-700 text-sm font-black text-white">
              <span>TỔNG ĐIỂM VÒNG 4:</span>
              <span className="text-amber-400">{currentRound4Score} ĐIỂM</span>
            </div>
          </div>

          {/* Final Finish Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={onFinishGame}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-black text-sm font-mono shadow-[0_0_35px_rgba(245,158,11,0.6)] cursor-pointer active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>HOÀN THÀNH HÀNH TRÌNH • XEM BẢNG VINH DANH TOÀN CUỘC</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
