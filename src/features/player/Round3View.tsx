import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle,
  ArrowRight,
  Send,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Eye,
  Sliders,
  Award,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Team, PicturePuzzle } from '../../types';
import { GameEngine } from '../../services/gameEngine';
import { ScoringEngine } from '../../services/scoringEngine';
import { Round3Service } from '../../services/round3Service';
import { Timer } from '../../components/Timer';
import { audioManager } from '../../services/audioManager';
import { ChibiMascot } from '../../components/ChibiMascot';
import { keywordService } from '../../services/keywordService';
import { storageService } from '../../services/storageService';
import { Round3VisualStage } from './Round3VisualStage';

interface Round3ViewProps {
  team: Team;
  onRoundComplete: () => void;
}

export const Round3View: React.FC<Round3ViewProps> = ({ team, onRoundComplete }) => {
  const [puzzles, setPuzzles] = useState<PicturePuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [textInput, setTextInput] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShake, setIsShake] = useState<boolean>(false);
  const [flyingScore, setFlyingScore] = useState<number | null>(null);

  // Real-time Game Master events listener
  const [stealNotice, setStealNotice] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    isTimeout: boolean;
    pointsEarned: number;
    explanation: string;
    correctAnswerText: string;
    tierDescription: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or resume 5 puzzles for Round 3
  useEffect(() => {
    const list = GameEngine.getTeamRound3Puzzles(team);
    setPuzzles(list);
    const savedIdx = Math.min(team.currentQuestionIndex, list.length);
    setCurrentIndex(savedIdx);
  }, [team.id]);

  // Focus input on question change
  useEffect(() => {
    if (!isAnswerSubmitted) {
      inputRef.current?.focus();
    }
  }, [currentIndex, isAnswerSubmitted]);

  // Listen to GM live events (Overrides, Question Swaps, Steal changes)
  useEffect(() => {
    const handleOverride = (e: any) => {
      const detail = e.detail;
      if (detail && detail.teamId === team.id) {
        audioManager.playFanfare();
      }
    };

    const handleSwap = (e: any) => {
      const detail = e.detail;
      if (detail && detail.teamId === team.id) {
        const freshList = GameEngine.getTeamRound3Puzzles(team);
        setPuzzles(freshList);
      }
    };

    const handleSteal = (e: any) => {
      const detail = e.detail;
      if (detail && detail.teamId) {
        setStealNotice(`Đội khác đang cướp quyền!`);
        setTimeout(() => setStealNotice(null), 4000);
      }
    };

    window.addEventListener('PEK_ROUND3_OVERRIDE_EVENT', handleOverride);
    window.addEventListener('PEK_ROUND3_QUESTION_SWAPPED', handleSwap);
    window.addEventListener('PEK_ROUND3_STEAL_CHANGED', handleSteal);

    return () => {
      window.removeEventListener('PEK_ROUND3_OVERRIDE_EVENT', handleOverride);
      window.removeEventListener('PEK_ROUND3_QUESTION_SWAPPED', handleSwap);
      window.removeEventListener('PEK_ROUND3_STEAL_CHANGED', handleSteal);
    };
  }, [team.id]);

  const currentPuzzle = puzzles[currentIndex];

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#34d399', '#22d3ee', '#f472b6', '#a855f7'],
    });
  };

  const handleSubmitAnswer = (timeout: boolean = false) => {
    if (isAnswerSubmitted || !currentPuzzle) return;
    setIsAnswerSubmitted(true);

    const actualTime = timeout ? currentPuzzle.timeLimit : Math.max(1, timeTaken);
    const userInput = timeout ? '' : textInput.trim();

    // Verify using Round3Service without leaking secret data before submit
    const result = timeout
      ? {
          isCorrect: false,
          pointsAwarded: 0,
          canonicalAnswer: currentPuzzle.answer || currentPuzzle.correctAnswer,
          explanation: currentPuzzle.explanation || `Đáp án: "${currentPuzzle.answer || currentPuzzle.correctAnswer}"`,
          timeTaken: currentPuzzle.timeLimit,
          tierDescription: 'Hết giờ (0 điểm)',
        }
      : Round3Service.verifyAnswer(currentPuzzle.id, userInput, actualTime);

    if (result.isCorrect) {
      if (!isMuted) audioManager.playCorrect();
      triggerConfetti();
      setFlyingScore(result.pointsAwarded);

      // Unlock Round 3 keyword for this question
      const r3Keywords = keywordService.getKeywordsByRound(3);
      const targetKw = r3Keywords[currentIndex % r3Keywords.length];
      if (targetKw) {
        const unlockRes = keywordService.unlockKeywordForTeam(team, targetKw.id);
        if (unlockRes && !unlockRes.alreadyUnlocked) {
          storageService.saveTeam(unlockRes.updatedTeam);
          window.dispatchEvent(new CustomEvent('PEK_KEYWORD_UNLOCKED', { detail: unlockRes.keyword }));
        }
      }
    } else {
      if (!isMuted) audioManager.playWrong();
      setIsShake(true);
      setTimeout(() => setIsShake(false), 600);
    }

    // Record answer in GameEngine
    GameEngine.recordAnswer(
      team,
      3,
      currentPuzzle.id,
      timeout ? 'TIMEOUT' : userInput,
      result.isCorrect,
      result.pointsAwarded,
      actualTime
    );

    setFeedback({
      show: true,
      isCorrect: result.isCorrect,
      isTimeout: timeout,
      pointsEarned: result.pointsAwarded,
      explanation: result.explanation,
      correctAnswerText: result.canonicalAnswer,
      tierDescription: result.tierDescription,
    });
  };

  const handleNextPuzzle = () => {
    setFeedback(null);
    setTextInput('');
    setIsAnswerSubmitted(false);
    setTimeTaken(0);
    setFlyingScore(null);

    const nextIdx = currentIndex + 1;
    if (nextIdx >= puzzles.length) {
      // Completed all 5 proverbs: unlock SECRET KEYWORD 3 (kw-sec-03: CHINH PHỤC)
      const secRes = keywordService.unlockKeywordForTeam(team, 'kw-sec-03');
      if (secRes) {
        storageService.saveTeam(secRes.updatedTeam);
        window.dispatchEvent(new CustomEvent('PEK_KEYWORD_UNLOCKED', { detail: secRes.keyword }));
      }
      if (!isMuted) audioManager.playRoundComplete();
      onRoundComplete();
    } else {
      setCurrentIndex(nextIdx);
    }
  };

  if (!currentPuzzle || currentIndex >= puzzles.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-100 relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 mx-auto flex items-center justify-center mb-5 shadow-[0_0_35px_rgba(251,191,36,0.7)] animate-bounce">
          <Award className="w-10 h-10" />
        </div>
        <span className="text-xs font-mono font-black text-amber-300 uppercase tracking-widest px-4 py-1 rounded-full bg-amber-950/80 border border-amber-400/50 mb-3 inline-block">
          HOÀN THÀNH XUẤT SẮC
        </span>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-orange-400 mb-3">
          Chúc Mừng Đội Thi Đã Vượt Qua Vòng 3!
        </h2>
        <p className="text-slate-300 mb-8 font-medium max-w-lg mx-auto">
          Tất cả 5 câu ca dao, tục ngữ Việt Nam đã được giải mã! Mật mã bảo mật số 3 (CHINH PHỤC) đã chính thức được kích hoạt trong Kho Khóa Lượng Tử để sẵn sàng bước vào Trạm Cuối AI Lab!
        </p>
        <button
          onClick={() => {
            const secRes = keywordService.unlockKeywordForTeam(team, 'kw-sec-03');
            if (secRes) {
              storageService.saveTeam(secRes.updatedTeam);
            }
            onRoundComplete();
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-black text-lg hover:opacity-95 transition-all cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.6)] transform hover:scale-105 active:scale-95"
        >
          TIẾN VÀO TRẠM CUỐI (ROUND 4: AI LAB) →
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 sm:py-8 text-slate-100 relative z-10 select-none ${isShake ? 'animate-shake' : ''}`}>
      {/* Top Controls: Mascot + Live Header + Timer + Mute + Low Power */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <ChibiMascot expression="thinking" size="sm" showSpeechBubble={false} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 uppercase tracking-widest bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                VÒNG 3: ĐUỔI HÌNH BẮT CHỮ
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 border border-purple-400/40 font-bold">
                CA DAO TỤC NGỮ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-orange-400">
              CÂU ĐỐ {currentIndex + 1} / {puzzles.length}
            </h2>
          </div>
        </div>

        {/* Right side: Timer & Quick UI controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Reduced Motion Toggle */}
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            title={reducedMotion ? 'Bật hiệu ứng đầy đủ' : 'Bật chế độ giảm hiệu ứng (cho máy yếu)'}
            className={`p-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              reducedMotion
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden md:inline">{reducedMotion ? 'Tiết Kiệm' : 'Hiệu Ứng'}</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
          </button>

          {/* Circular Countdown Timer (30 seconds) */}
          <Timer
            key={currentPuzzle.id}
            timeLimit={currentPuzzle.timeLimit || 30}
            onTimeout={() => handleSubmitAnswer(true)}
            isPaused={isAnswerSubmitted}
            onTick={(timeLeft, taken) => {
              setTimeRemaining(timeLeft);
              setTimeTaken(taken);
            }}
          />
        </div>
      </div>

      {/* Steal privilege banner if active */}
      {stealNotice && (
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-red-600/30 via-rose-600/40 to-red-600/30 border border-rose-500 text-rose-200 text-center text-xs font-mono font-black animate-pulse flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-rose-400" />
          <span>{stealNotice}</span>
        </div>
      )}

      {/* Speed Bonus Guide Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-4 text-[10px] sm:text-xs font-mono text-center font-bold">
        <div className={`p-1.5 rounded-xl border transition-all ${timeRemaining > 25 ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
          0-5s: 100đ
        </div>
        <div className={`p-1.5 rounded-xl border transition-all ${timeRemaining <= 25 && timeRemaining > 20 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
          6-10s: 80đ
        </div>
        <div className={`p-1.5 rounded-xl border transition-all ${timeRemaining <= 20 && timeRemaining > 15 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.5)]' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
          11-15s: 60đ
        </div>
        <div className={`p-1.5 rounded-xl border transition-all ${timeRemaining <= 15 && timeRemaining > 10 ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
          16-20s: 40đ
        </div>
        <div className={`p-1.5 rounded-xl border transition-all ${timeRemaining <= 10 && timeRemaining > 0 ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
          21-30s: 20đ
        </div>
      </div>

      {/* 3D Holographic Visual Clues Stage */}
      <Round3VisualStage
        visualClues={currentPuzzle.visualClues || []}
        proverbNumber={currentPuzzle.proverbNumber}
        reducedMotion={reducedMotion}
        isCorrect={feedback?.isCorrect}
        isWrong={feedback && !feedback.isCorrect ? true : null}
        isTimeout={feedback?.isTimeout}
        timeRemaining={timeRemaining}
      />

      {/* Answer Input Area (only active when not submitted) */}
      {!isAnswerSubmitted && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitAnswer(false);
          }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Nhập câu ca dao hoặc tục ngữ Việt Nam (có dấu hoặc không dấu)..."
              autoFocus
              className="w-full px-5 py-4 rounded-2xl bg-slate-900/90 border-2 border-amber-400/60 focus:border-amber-300 focus:shadow-[0_0_25px_rgba(251,191,36,0.6)] text-white text-base sm:text-lg font-medium outline-hidden transition-all placeholder:text-slate-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-300/60 pointer-events-none">
              ENTER ↵
            </span>
          </div>

          <button
            type="submit"
            disabled={!textInput.trim()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:opacity-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span>XÁC NHẬN</span>
          </button>
        </form>
      )}

      {/* Flying Score Animation on Correct */}
      {flyingScore !== null && flyingScore > 0 && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce">
          <div className="px-6 py-3 rounded-3xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-3xl sm:text-4xl shadow-[0_0_40px_rgba(251,191,36,0.9)] border-2 border-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-600 animate-spin" />
            <span>+{flyingScore} ĐIỂM!</span>
          </div>
        </div>
      )}

      {/* Feedback Overlay upon Answer Submission */}
      {feedback && feedback.show && (
        <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#180a2b]/95 to-[#0c0417]/95 border-2 border-fuchsia-400/60 shadow-[0_0_35px_rgba(217,70,239,0.35)] backdrop-blur-2xl animate-fade-in relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                feedback.isCorrect
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
              }`}
            >
              {feedback.isCorrect ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3
                  className={`text-xl font-black ${
                    feedback.isCorrect ? 'text-emerald-300' : 'text-rose-400'
                  }`}
                >
                  {feedback.isCorrect
                    ? 'CHÍNH XÁC! GIẢI MÃ THÀNH CÔNG!'
                    : feedback.isTimeout
                    ? 'ĐÃ HẾT THỜI GIAN QUY ĐỊNH!'
                    : 'CHƯA CHÍNH XÁC!'}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full font-mono font-black text-xs border ${
                    feedback.isCorrect
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400/50'
                      : 'bg-rose-950/80 text-rose-300 border-rose-400/50'
                  }`}
                >
                  {feedback.pointsEarned > 0 ? `+${feedback.pointsEarned} ĐIỂM` : '0 ĐIỂM'}
                </span>
              </div>

              {/* Reveal Canonical Proverb */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-400/30">
                <span className="text-[11px] font-mono text-amber-300 font-bold block uppercase tracking-wider mb-1">
                  ĐÁP ÁN CHUẨN:
                </span>
                <p className="text-lg sm:text-xl font-black text-white">
                  "{feedback.correctAnswerText}"
                </p>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  {feedback.explanation}
                </p>
              </div>

              {/* Tier speed note */}
              {feedback.isCorrect && (
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Clock className="w-4 h-4" />
                  <span>Thời gian hoàn thành: {timeTaken}s • {feedback.tierDescription}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleNextPuzzle}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-black text-base flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:opacity-95 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <span>{currentIndex + 1 >= puzzles.length ? 'HOÀN THÀNH VÒNG 3' : 'CÂU ĐỐ TIẾP THEO'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
