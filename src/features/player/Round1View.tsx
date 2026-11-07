import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Award,
  Zap,
  Atom,
} from 'lucide-react';
import { Team, Question } from '../../types';
import { GameEngine } from '../../services/gameEngine';
import { ScoringEngine } from '../../services/scoringEngine';
import { Timer } from '../../components/Timer';
import { audioManager } from '../../services/audioManager';
import { ChibiMascot } from '../../components/ChibiMascot';
import { keywordService } from '../../services/keywordService';
import { storageService } from '../../services/storageService';

interface Round1ViewProps {
  team: Team;
  onRoundComplete: () => void;
}

export const Round1View: React.FC<Round1ViewProps> = ({ team, onRoundComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [warningMsg, setWarningMsg] = useState<string | undefined>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);

  useEffect(() => {
    const { questions: qList, warning } = GameEngine.getTeamRound1Questions(team);
    setQuestions(qList);
    setWarningMsg(warning);

    const savedIndex = Math.min(team.currentQuestionIndex || 0, qList.length);
    setCurrentIndex(savedIndex);
  }, [team.id]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerSubmitted || !currentQ) return;

    setSelectedOption(key);
    setIsAnswerSubmitted(true);
    setIsTimeout(false);

    const isCorrect = key === currentQ.correctAnswer;
    const finalTimeTaken = Math.max(1, timeTaken);
    const pointsAwarded = isCorrect
      ? ScoringEngine.calculateQuestionScore(currentQ.points, true, finalTimeTaken, currentQ.timeLimit)
      : 0;

    setEarnedPoints(pointsAwarded);

    if (isCorrect) {
      audioManager.playCorrect();
      // Unlock a keyword from Round 1
      const r1Keywords = keywordService.getKeywordsByRound(1);
      const targetKw = r1Keywords[currentIndex % r1Keywords.length];
      if (targetKw) {
        const unlockRes = keywordService.unlockKeywordForTeam(team, targetKw.id);
        if (unlockRes && !unlockRes.alreadyUnlocked) {
          storageService.saveTeam(unlockRes.updatedTeam);
          window.dispatchEvent(new CustomEvent('PEK_KEYWORD_UNLOCKED', { detail: unlockRes.keyword }));
        }
      }
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch {
        // Fallback
      }
    } else {
      audioManager.playIncorrect();
    }

    GameEngine.recordAnswer(
      team,
      1,
      currentQ.id,
      key,
      isCorrect,
      pointsAwarded,
      finalTimeTaken
    );
  };

  const handleTimeout = () => {
    if (isAnswerSubmitted || !currentQ) return;

    setIsAnswerSubmitted(true);
    setIsTimeout(true);
    setSelectedOption(null);
    setEarnedPoints(0);
    audioManager.playIncorrect();

    GameEngine.recordAnswer(
      team,
      1,
      currentQ.id,
      'TIMEOUT',
      false,
      0,
      currentQ.timeLimit
    );
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsTimeout(false);
    setTimeTaken(0);
    setEarnedPoints(0);

    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      const secRes = keywordService.unlockKeywordForTeam(team, 'kw-sec-01');
      if (secRes) {
        storageService.saveTeam(secRes.updatedTeam);
        window.dispatchEvent(new CustomEvent('PEK_KEYWORD_UNLOCKED', { detail: secRes.keyword }));
      }
      audioManager.playRoundComplete();
      onRoundComplete();
    } else {
      audioManager.playPop();
      setCurrentIndex(nextIdx);
    }
  };

  if (!currentQ) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-800">
        <div className="w-20 h-20 rounded-full bg-cyan-100 border-2 border-cyan-400 text-cyan-600 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-cyan-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-indigo-700 to-purple-700">
          HOÀN THÀNH VÒNG 1!
        </h2>
        <p className="text-slate-600 mb-8 font-mono font-medium">
          Cả 9 mật mã lượng tử đã được giải mã thành công! Mật mã bảo mật số 1 (KHOA HỌC) đã sẵn sàng.
        </p>
        <button
          onClick={() => {
            const secRes = keywordService.unlockKeywordForTeam(team, 'kw-sec-01');
            if (secRes) {
              storageService.saveTeam(secRes.updatedTeam);
            }
            onRoundComplete();
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 text-white font-black text-sm uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-sky-300 cursor-pointer"
        >
          TIẾN VÀO TRẠM TIẾP THEO
        </button>
      </div>
    );
  }

  const isCorrectAnswer = isAnswerSubmitted && selectedOption === currentQ.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 text-slate-100 relative z-10 select-none">
      {warningMsg && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-950/80 border border-amber-400/60 text-amber-200 text-xs flex items-center gap-2 font-medium shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{warningMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <ChibiMascot
            expression={
              isAnswerSubmitted
                ? isCorrectAnswer
                  ? 'celebrating'
                  : 'surprised'
                : 'thinking'
            }
            size="sm"
            showSpeechBubble={false}
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1">
                <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>VÒNG 1: SCIENCE CODE BREAKER</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-300 tracking-tight">
              MẬT MÃ CÂU {currentIndex + 1} / 9
            </h2>
          </div>
        </div>

        {/* Real Countdown Timer */}
        <div className="flex items-center gap-3">
          <Timer
            key={`${currentQ.id}_${currentIndex}`}
            timeLimit={currentQ.timeLimit}
            onTimeout={handleTimeout}
            isPaused={isAnswerSubmitted}
            onTick={(_timeLeft, taken) => setTimeTaken(taken)}
          />
        </div>
      </div>

      {/* 3D Decryption Power Conduit (9 nodes) */}
      <div className="flex items-center gap-1.5 mb-6">
        {questions.map((q, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={q.id}
              className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-cyan-400 ring-2 ring-cyan-200 scale-y-125 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                  : isDone
                  ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          );
        })}
      </div>

      {/* Hologram Question Card */}
      <div className="bg-gradient-to-b from-[#09112e]/90 via-[#0e1a47]/80 to-[#161036]/90 border-2 border-cyan-400/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.35)] backdrop-blur-2xl mb-6 relative overflow-hidden text-white">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>MẬT MÃ KHOA HỌC TỰ NHIÊN</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              +{currentQ.points} ĐIỂM
            </span>
          </div>

          <span className="text-xs text-cyan-300/70 font-mono font-semibold">
            Giới hạn: {currentQ.timeLimit}s
          </span>
        </div>

        {/* Question Prompt */}
        <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6 font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          {currentQ.question}
        </h3>

        {/* 4 Choices Grid (A, B, C, D) with 3D Depth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {(['A', 'B', 'C', 'D'] as const).map((key) => {
            const isSelected = selectedOption === key;
            const isCorrectOption = currentQ.correctAnswer === key;

            let cardClasses = 'bg-[#070d24]/90 hover:bg-[#0c1840] border-2 border-cyan-500/40 text-cyan-100';
            let keyBadgeClasses = 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/50';

            if (!isAnswerSubmitted) {
              cardClasses = 'bg-[#070d24]/90 hover:bg-[#0d1c47] hover:border-cyan-300 border-2 border-cyan-500/40 text-cyan-100 cursor-pointer active:scale-[0.99] shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]';
              keyBadgeClasses = 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/50';
            } else {
              if (isSelected && isCorrectOption) {
                cardClasses = 'bg-emerald-950/90 border-2 border-emerald-400 text-white font-bold shadow-[0_0_25px_rgba(16,185,129,0.6)]';
                keyBadgeClasses = 'bg-emerald-500 text-white font-black shadow-[0_0_10px_rgba(16,185,129,0.8)]';
              } else if (isSelected && !isCorrectOption) {
                cardClasses = 'bg-rose-950/90 border-2 border-rose-500 text-white font-bold shadow-[0_0_25px_rgba(244,63,94,0.6)]';
                keyBadgeClasses = 'bg-rose-500 text-white font-black shadow-[0_0_10px_rgba(244,63,94,0.8)]';
              } else if (!isSelected && isCorrectOption) {
                cardClasses = 'bg-emerald-950/60 border-2 border-emerald-400/80 text-emerald-200 font-semibold';
                keyBadgeClasses = 'bg-emerald-500 text-white font-black';
              } else {
                cardClasses = 'bg-slate-900/60 border-2 border-slate-800 text-slate-500 opacity-50';
                keyBadgeClasses = 'bg-slate-800 text-slate-500 border border-slate-700';
              }
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectOption(key)}
                disabled={isAnswerSubmitted}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 ${cardClasses} disabled:cursor-default`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors shadow-sm ${keyBadgeClasses}`}
                >
                  {key}
                </span>

                <div className="flex-1 pt-0.5">
                  <span className="text-sm leading-relaxed block font-medium">
                    {currentQ.options[key]}
                  </span>

                  {isAnswerSubmitted && isSelected && isCorrectOption && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-emerald-400 font-bold font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Chính xác! (+{earnedPoints} điểm)
                    </span>
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOption && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-rose-400 font-bold font-mono">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      Chưa chính xác
                    </span>
                  )}
                  {isAnswerSubmitted && !isSelected && isCorrectOption && (
                    <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-emerald-400 font-bold font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Đáp án đúng của câu này
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Timeout banner */}
        {isTimeout && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold">Đã hết thời gian bẻ khóa! Đáp án đúng đã hiển thị.</span>
          </div>
        )}

        {/* Short Explanation Card */}
        {isAnswerSubmitted && (
          <div className="bg-[#07102e]/90 border border-cyan-400/50 rounded-2xl p-4 mb-6 transition-all duration-300 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase bg-cyan-950 border border-cyan-400/60 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                GIẢI THÍCH KHOA HỌC
              </span>
              <span className="text-xs text-cyan-200/70 font-mono font-medium">
                [{currentQ.subject} • {currentQ.topic}]
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed font-medium">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Bottom Bar: Action & Next */}
        <div className="flex items-center justify-between pt-4 border-t border-cyan-500/30">
          <p className="text-xs text-cyan-200/70 font-medium">
            {!isAnswerSubmitted
              ? 'Chọn phương án bẻ khóa chính xác'
              : isCorrectAnswer
              ? `Xuất sắc! +${earnedPoints} điểm đã được cộng`
              : 'Đọc kỹ giải thích để tích lũy kiến thức'}
          </p>

          {isAnswerSubmitted && (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <span>{currentIndex === questions.length - 1 ? 'HOÀN THÀNH VÒNG 1' : 'CÂU TIẾP THEO'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
