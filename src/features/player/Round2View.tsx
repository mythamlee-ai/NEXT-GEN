import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Eye,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Send,
  RotateCcw,
  ShieldCheck,
  Award,
  ChevronRight,
  Info,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Team, Teacher } from '../../types';
import { GameEngine } from '../../services/gameEngine';
import { ScoringEngine } from '../../services/scoringEngine';
import { Timer } from '../../components/Timer';
import { audioManager } from '../../services/audioManager';
import { ChibiMascot } from '../../components/ChibiMascot';
import { validateTeacherNameAnswer } from '../../utils/answerNormalization';
import { keywordService } from '../../services/keywordService';
import { storageService } from '../../services/storageService';
import { DEFAULT_TEACHER_AVATAR_SVG } from '../../data/officialTeachers';

interface Round2ViewProps {
  team: Team;
  onRoundComplete: () => void;
}

export const Round2View: React.FC<Round2ViewProps> = ({ team, onRoundComplete }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Số lượng gợi ý đang mở cho giáo viên hiện tại (1 -> 4)
  // Quy tắc:
  // - Những gợi ý không cần trả lời đáp án (chỉ dùng để tham khảo dữ kiện).
  // - Đáp án từ khóa duy nhất cần trả lời là TÊN GIÁO VIÊN.
  // - Nếu học sinh trả lời sai, tiếp tục mở được gợi ý tiếp theo.
  // - Mỗi lần mở thêm 1 gợi ý, số điểm nhận được nếu trả lời đúng sẽ giảm xuống:
  //   + 1 gợi ý: 40 điểm
  //   + 2 gợi ý: 30 điểm
  //   + 3 gợi ý: 20 điểm
  //   + 4 gợi ý: 10 điểm
  const [cluesOpened, setCluesOpened] = useState<number>(1);

  // Trạng thái nhập tên giáo viên
  const [inputText, setInputText] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Trạng thái hoàn thành câu hiện tại
  const [isSolvedCurrent, setIsSolvedCurrent] = useState<boolean>(false);
  const [isRevealedAnswer, setIsRevealedAnswer] = useState<boolean>(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [pointsEarnedCurrent, setPointsEarnedCurrent] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);

  // Khởi tạo danh sách giáo viên cho đội
  useEffect(() => {
    const list = GameEngine.getTeamRound2Teachers(team);
    setTeachers(list);
    const savedIdx = Math.min(team.currentQuestionIndex || 0, Math.max(0, list.length - 1));
    setCurrentIndex(savedIdx);
    resetTeacherState();
  }, [team.id]);

  const resetTeacherState = () => {
    setCluesOpened(1);
    setInputText('');
    setErrorNotice(null);
    setSuccessNotice(null);
    setIsSolvedCurrent(false);
    setIsRevealedAnswer(false);
    setAttemptsCount(0);
    setPointsEarnedCurrent(0);
  };

  const currentTeacher = teachers[currentIndex] || null;

  // Tính số điểm nhận được nếu trả lời đúng tại mức gợi ý hiện tại
  const getCurrentPotentialPoints = () => {
    return ScoringEngine.getRound2CluePoints(cluesOpened);
  };

  // Mở thêm gợi ý tiếp theo: số điểm nhận được khi trả lời đúng sẽ giảm xuống
  const handleOpenNextClue = () => {
    if (cluesOpened < 4 && !isSolvedCurrent && !isRevealedAnswer) {
      const nextCount = cluesOpened + 1;
      setCluesOpened(nextCount);
      setErrorNotice(null);
      setSuccessNotice(null);
      audioManager.playUnlock();
      audioManager.playPop();
    }
  };

  // Kiểm tra câu trả lời: ĐÁP ÁN TỪ KHÓA LÀ TÊN GIÁO VIÊN
  const handleCheckAnswer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentTeacher || isSolvedCurrent || isRevealedAnswer) return;

    const trimmed = inputText.trim();
    if (!trimmed) {
      setErrorNotice('Vui lòng nhập tên giáo viên vào ô bên dưới!');
      audioManager.playIncorrect();
      return;
    }

    setIsVerifying(true);
    setErrorNotice(null);
    setSuccessNotice(null);
    const nextAttempts = attemptsCount + 1;
    setAttemptsCount(nextAttempts);

    // Kiểm tra tên giáo viên với thuật toán chuẩn hóa tiếng Việt (họ tên đầy đủ, xưng hô Thầy/Cô, tên riêng...)
    const isCorrectTeacher = validateTeacherNameAnswer(trimmed, currentTeacher);

    if (isCorrectTeacher) {
      // TRẢ LỜI ĐÚNG TÊN GIÁO VIÊN!
      const earned = getCurrentPotentialPoints();
      setPointsEarnedCurrent(earned);
      setIsSolvedCurrent(true);
      setCluesOpened(4); // Mở hết toàn bộ 4 gợi ý và lộ diện avatar sắc nét
      setSuccessNotice(`Chính xác! Bạn đã xuất sắc giải mã ${currentTeacher.displayName || currentTeacher.name} và nhận +${earned} điểm.`);
      audioManager.playUnlock();
      audioManager.playVictory();

      try {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
        });
      } catch {
        // Ignored
      }

      // Unlock Round 2 Science Keyword
      const r2Keywords = keywordService.getKeywordsByRound(2);
      const targetKw = r2Keywords[currentIndex % r2Keywords.length];
      if (targetKw) {
        const unlockRes = keywordService.unlockKeywordForTeam(team, targetKw.id);
        if (unlockRes && !unlockRes.alreadyUnlocked) {
          storageService.saveTeam(unlockRes.updatedTeam);
          window.dispatchEvent(new CustomEvent('PEK_KEYWORD_UNLOCKED', { detail: unlockRes.keyword }));
        }
      }

      // Ghi nhận điểm số vào hệ thống
      GameEngine.recordAnswer(
        team,
        2,
        currentTeacher.id,
        trimmed,
        true,
        earned,
        Math.max(1, timeTaken),
        cluesOpened
      );
    } else {
      // TRẢ LỜI CHƯA ĐÚNG:
      audioManager.playIncorrect();

      // Nếu còn gợi ý tiếp theo (chưa đạt mốc 4 gợi ý):
      if (cluesOpened < 4) {
        const nextClueNum = cluesOpened + 1;
        const nextPts = ScoringEngine.getRound2CluePoints(nextClueNum);
        setErrorNotice(
          `Chưa chính xác! Bạn có thể thử đoán lại hoặc bấm "Mở Gợi Ý ${nextClueNum}" bên dưới để nhận thêm dữ kiện (nếu mở, điểm sẽ giảm còn ${nextPts} pts).`
        );
      } else {
        // Đã mở hết 4 gợi ý mà vẫn chưa đúng:
        setErrorNotice(
          'Chưa chính xác! Bạn đã mở hết 4 gợi ý. Bạn có thể tiếp tục thử đoán lại hoặc bấm [Công Bố Đáp Án] để qua câu tiếp theo.'
        );
      }
    }

    setIsVerifying(false);
  };

  // Công bố đáp án khi hết 4 gợi ý mà không có đáp án đúng
  const handleRevealAnswer = () => {
    if (!currentTeacher || isSolvedCurrent || isRevealedAnswer) return;
    setIsRevealedAnswer(true);
    setCluesOpened(4);
    setPointsEarnedCurrent(0);
    audioManager.playWarning();

    // Ghi nhận trả lời không thành công (0 điểm)
    GameEngine.recordAnswer(
      team,
      2,
      currentTeacher.id,
      'KHONG_DOAN_DUNG_GIAO_VIEN',
      false,
      0,
      Math.max(1, timeTaken),
      4
    );
  };

  // Chuyển sang câu hỏi / giáo viên tiếp theo
  const handleGoNextTeacher = () => {
    audioManager.playPop();
    const nextIdx = currentIndex + 1;
    if (nextIdx >= teachers.length) {
      // Đã hoàn thành hết tất cả câu hỏi của Vòng 2!
      const secRes = keywordService.unlockKeywordForTeam(team, 'kw-sec-02');
      if (secRes) {
        storageService.saveTeam(secRes.updatedTeam);
        window.dispatchEvent(new CustomEvent('PEK_KEYWORD_UNLOCKED', { detail: secRes.keyword }));
      }
      onRoundComplete();
    } else {
      setCurrentIndex(nextIdx);
      resetTeacherState();
    }
  };

  // Blur avatar tính theo số gợi ý đã mở và trạng thái hoàn thành
  const isFullyRevealed = isSolvedCurrent || isRevealedAnswer;
  const getAvatarBlurClass = () => {
    if (isFullyRevealed) return 'blur-0 opacity-100';
    if (cluesOpened >= 4) return 'blur-none opacity-95';
    if (cluesOpened === 3) return 'blur-xs opacity-90';
    if (cluesOpened === 2) return 'blur-sm opacity-80';
    return 'blur-md opacity-70 grayscale';
  };

  if (!currentTeacher) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-800">
        <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-md shadow-indigo-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Đã Hoàn Thành Vòng 2!</h2>
        <p className="text-slate-600 mb-6 font-medium">Tất cả nhân vật bí ẩn đã được khám phá. Mật mã bảo mật số 2 (SÁNG TẠO) đã kích hoạt!</p>
        <button
          onClick={() => {
            const secRes = keywordService.unlockKeywordForTeam(team, 'kw-sec-02');
            if (secRes) {
              storageService.saveTeam(secRes.updatedTeam);
            }
            onRoundComplete();
          }}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 text-white font-black hover:opacity-95 transition-all cursor-pointer shadow-lg shadow-indigo-300"
        >
          TIẾN VÀO TRẠM TIẾP THEO →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 text-slate-100 relative z-10 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <ChibiMascot
            expression={isSolvedCurrent ? 'celebrating' : isRevealedAnswer ? 'surprised' : 'thinking'}
            size="sm"
            showSpeechBubble={false}
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-fuchsia-300 uppercase tracking-widest bg-fuchsia-950/80 px-3 py-0.5 rounded-full border border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                VÒNG 2: AI ĐÂY? (TỪ KHÓA LÀ TÊN GIÁO VIÊN)
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-white to-pink-300 flex items-center gap-2">
              <span>Hồ Sơ {currentIndex + 1} / {teachers.length}: Đoán Tên Giáo Viên</span>
              {isSolvedCurrent && (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                  ✓ ĐOÁN ĐÚNG (+{pointsEarnedCurrent} pts)
                </span>
              )}
              {isRevealedAnswer && (
                <span className="text-xs font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-400/50">
                  ĐÃ CÔNG BỐ ĐÁP ÁN (0 pts)
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Live Metrics: Điểm Thưởng & Timer */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-950/80 border border-amber-400/50 px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Award className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-amber-300/80 block leading-tight">Điểm Nếu Trả Lời Đúng</span>
              <span className="text-sm font-black font-mono text-amber-300">
                {isSolvedCurrent ? `+${pointsEarnedCurrent} pts` : isRevealedAnswer ? '0 pts' : `+${getCurrentPotentialPoints()} pts`}
              </span>
            </div>
          </div>

          <Timer
            key={currentTeacher.id}
            timeLimit={currentTeacher.timeLimit || 90}
            onTimeout={() => {
              if (!isSolvedCurrent && !isRevealedAnswer) {
                handleRevealAnswer();
              }
            }}
            isPaused={isSolvedCurrent || isRevealedAnswer}
            onTick={(_timeLeft, taken) => setTimeTaken(taken)}
          />
        </div>
      </div>

      {/* Progress Dots across Teachers */}
      <div className="flex items-center gap-2 mb-6">
        {teachers.map((t, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={t.id}
              className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.8)] scale-y-125'
                  : isDone
                  ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          );
        })}
      </div>

      {/* Main Game Board */}
      <div className="bg-gradient-to-b from-[#180a2b]/95 via-[#230f3b]/85 to-[#120822]/95 border-2 border-fuchsia-400/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(217,70,239,0.35)] backdrop-blur-2xl mb-6 relative overflow-hidden text-white">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
          {/* CỘT TRÁI: AVATAR & THÔNG BÁO GỢI Ý */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-4 border-fuchsia-400 shadow-[0_0_30px_rgba(217,70,239,0.5)] bg-[#0c0517] flex items-center justify-center group">
              <img
                src={currentTeacher.image || DEFAULT_TEACHER_AVATAR_SVG}
                alt="Nhân Vật Bí Ẩn"
                className={`w-full h-full object-cover transition-all duration-700 ${getAvatarBlurClass()}`}
              />

              {/* Overlay làm mờ nếu chưa mở hết hoặc chưa công bố */}
              {!isFullyRevealed && cluesOpened < 4 && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                  <Lock className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] mb-2 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white bg-slate-900/90 px-3 py-1 rounded-full border border-cyan-400/50 shadow-md">
                    Gợi ý đã mở: {cluesOpened}/4
                  </span>
                  <span className="text-[10px] text-cyan-200 mt-1 font-mono font-medium">
                    Mở thêm gợi ý để làm rõ chân dung
                  </span>
                </div>
              )}

              {/* Laser scanner effect */}
              {!isFullyRevealed && (
                <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse pointer-events-none" style={{ top: '35%' }} />
              )}
            </div>

            {/* Thông tin nhân vật khi giải mã xong hoặc công bố đáp án */}
            {isFullyRevealed ? (
              <div className="mt-4 text-center animate-fadeIn bg-[#1e0d33]/90 border border-fuchsia-400/50 rounded-2xl p-4 w-full shadow-[0_0_20px_rgba(217,70,239,0.2)]">
                <span className={`inline-block px-3.5 py-1 rounded-full font-mono font-black text-xs uppercase tracking-wider mb-1 ${
                  isSolvedCurrent ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/50' : 'bg-rose-950/80 text-rose-300 border border-rose-400/50'
                }`}>
                  {isSolvedCurrent ? '★ ĐÃ ĐOÁN ĐÚNG GIÁO VIÊN ★' : 'ĐÁP ÁN CHÍNH THỨC'}
                </span>
                <h3 className="text-xl font-black text-white">{currentTeacher.name}</h3>
                <p className="text-xs text-fuchsia-300 font-bold mt-0.5">
                  {currentTeacher.displayName} • Môn {currentTeacher.subject}
                </p>
                {currentTeacher.homeroom && (
                  <p className="text-[11px] text-cyan-200/80 font-mono mt-0.5">
                    Khối {currentTeacher.grades} • Chủ nhiệm: {currentTeacher.homeroom}
                  </p>
                )}
                {currentTeacher.characteristics && (
                  <p className="text-[11px] text-amber-300 font-semibold mt-1 bg-amber-950/60 rounded-lg p-1.5 border border-amber-400/40">
                    "{currentTeacher.characteristics}"
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 text-center space-y-2">
                <span className="text-xs font-mono text-cyan-200/80 font-bold block">
                  Đang xem {cluesOpened}/4 gợi ý • Đúng nhận: +{getCurrentPotentialPoints()} pts
                </span>

                {/* NÚT MỞ THÊM GỢI Ý TIẾP THEO */}
                {cluesOpened < 4 && !isSolvedCurrent && !isRevealedAnswer && (
                  <button
                    type="button"
                    onClick={handleOpenNextClue}
                    className="px-4 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border-2 border-amber-400/60 text-amber-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] cursor-pointer mx-auto transform hover:scale-102 active:scale-98"
                  >
                    <Unlock className="w-4 h-4 text-amber-400" />
                    <span>Mở Gợi Ý {cluesOpened + 1} (Điểm giảm còn +{ScoringEngine.getRound2CluePoints(cluesOpened + 1)} pts)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: 4 GỢI Ý THAM KHẢO & Ô NHẬP TÊN GIÁO VIÊN */}
          <div className="md:col-span-7 space-y-4">
            {/* Header gợi ý & thang điểm */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-fuchsia-500/30 pb-3 gap-1">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <span>CÁC GỢI Ý THAM KHẢO ({cluesOpened}/4 ĐÃ MỞ):</span>
                </span>
                <p className="text-[11px] text-cyan-200/60 mt-0.5 font-mono">
                  * Dựa vào các dữ kiện gợi ý để giải mã tên Thầy/Cô KHTN Pétrus Ký.
                </p>
              </div>

              <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/50 self-start sm:self-auto font-bold">
                1 mở: 40p | 2 mở: 30p | 3 mở: 20p | 4 mở: 10p
              </span>
            </div>

            {/* Hiển thị 4 gợi ý dạng danh sách tham khảo */}
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((num) => {
                const isRevealed = num <= cluesOpened || isFullyRevealed;
                const clueIdx = num - 1;
                const clueText = currentTeacher.clues[clueIdx];
                const cluePoints = ScoringEngine.getRound2CluePoints(num);

                return (
                  <div
                    key={num}
                    className={`p-3.5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-3 ${
                      isRevealed
                        ? 'bg-[#210c36]/90 border-fuchsia-400/50 text-fuchsia-100 shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                        : 'bg-[#0f061c]/60 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                        isRevealed
                          ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {num}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[11px] font-mono font-bold uppercase text-fuchsia-300/80">
                          {num === 1
                            ? 'Gợi ý 1: Môn dạy'
                            : num === 2
                            ? 'Gợi ý 2: Khối dạy'
                            : num === 3
                            ? 'Gợi ý 3: Đặc điểm nhận diện'
                            : 'Gợi ý 4: Chân dung Avatar'}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 font-bold">
                          (Đoán đúng tại mốc này: +{cluePoints} pts)
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-100">
                        {isRevealed ? (
                          clueText
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="italic text-slate-500">
                              [Gợi ý số {num} đang bị khóa]
                            </span>
                            {num === cluesOpened + 1 && !isFullyRevealed && (
                              <button
                                type="button"
                                onClick={handleOpenNextClue}
                                className="text-[11px] font-mono font-bold text-fuchsia-400 hover:text-fuchsia-300 underline cursor-pointer"
                              >
                                Mở gợi ý này (-10 pts)
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ô DUY NHẤT ĐỂ TRẢ LỜI: ĐOÁN TÊN GIÁO VIÊN */}
            {!isFullyRevealed ? (
              <div className="pt-2">
                <form onSubmit={handleCheckAnswer} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase font-mono font-bold tracking-wider text-fuchsia-300">
                      Từ Khóa Đáp Án: Tên Giáo Viên Bí Ẩn Là Ai?
                    </label>
                    <span className="text-xs font-mono font-black text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/50">
                      Đoán đúng nhận: +{getCurrentPotentialPoints()} pts
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => {
                          setInputText(e.target.value);
                          if (errorNotice) setErrorNotice(null);
                        }}
                        placeholder="Nhập tên giáo viên (VD: Thầy Tiến, Nguyễn Minh Tiến, Cô Thẩm...)"
                        className="w-full bg-[#0a0414] border-2 border-fuchsia-400/60 focus:border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-400/40 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-hidden text-sm transition-all font-bold shadow-[inset_0_0_15px_rgba(217,70,239,0.15)]"
                        autoFocus
                      />
                      <KeyRound className="w-4 h-4 text-fuchsia-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying || !inputText.trim()}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 uppercase tracking-wider"
                    >
                      <Send className="w-4 h-4" />
                      <span>KIỂM TRA TÊN</span>
                    </button>
                  </div>

                  {/* Thông báo lỗi */}
                  {errorNotice && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/80 border-2 border-rose-500/50 text-rose-200 text-xs font-semibold space-y-2 animate-fadeIn">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{errorNotice}</span>
                      </div>

                      {cluesOpened < 4 && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={handleOpenNextClue}
                            className="px-3.5 py-1.5 rounded-xl bg-[#14061f] hover:bg-[#200933] border border-rose-400/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                          >
                            <Unlock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Mở ngay Gợi Ý {cluesOpened + 1} (Điểm giảm còn +{ScoringEngine.getRound2CluePoints(cluesOpened + 1)} pts)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {successNotice && (
                    <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{successNotice}</span>
                    </div>
                  )}

                  {/* Khi đã mở hết 4 gợi ý mà vẫn chưa đoán đúng -> Cho phép Công bố đáp án */}
                  {cluesOpened >= 4 && (
                    <div className="p-3.5 rounded-2xl bg-amber-950/80 border-2 border-amber-400/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="text-amber-200 font-medium">
                        Bạn đã xem hết cả 4 gợi ý. Nếu chưa đoán ra, hãy bấm <strong>[Công Bố Đáp Án]</strong> để xem danh tính Thầy/Cô và qua câu hỏi tiếp theo.
                      </div>
                      <button
                        type="button"
                        onClick={handleRevealAnswer}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 uppercase"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>CÔNG BỐ ĐÁP ÁN</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              /* KHI ĐÃ ĐOÁN ĐÚNG HOẶC ĐÃ CÔNG BỐ ĐÁP ÁN -> NÚT QUA CÂU HỎI TIẾP THEO */
              <div className="p-5 rounded-2xl bg-[#1d0a30]/90 border-2 border-fuchsia-500/40 space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-white text-sm sm:text-base">
                      {isSolvedCurrent ? '🎉 ĐÃ ĐOÁN ĐÚNG GIÁO VIÊN!' : '📢 ĐÃ CÔNG BỐ ĐÁP ÁN GIÁO VIÊN'}
                    </h4>
                    <p className="text-xs text-fuchsia-200/80 mt-0.5 font-medium">
                      {isSolvedCurrent
                        ? `Đội nhận được +${pointsEarnedCurrent} điểm.`
                        : `Rất tiếc đội chưa đoán đúng câu hỏi này (0 điểm).`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoNextTeacher}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all cursor-pointer transform hover:scale-102 active:scale-98 uppercase tracking-wider"
                  >
                    <span>{currentIndex + 1 < teachers.length ? 'QUA CÂU HỎI TIẾP THEO' : 'HOÀN THÀNH VÒNG 2'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
