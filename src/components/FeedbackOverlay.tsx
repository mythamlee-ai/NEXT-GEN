import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, ArrowRight, Lightbulb } from 'lucide-react';
import { audioManager } from '../services/audioManager';

interface FeedbackOverlayProps {
  isCorrect: boolean;
  isTimeout?: boolean;
  pointsEarned: number;
  correctAnswerText?: string;
  explanation?: string;
  onNext: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  isCorrect,
  isTimeout = false,
  pointsEarned,
  correctAnswerText,
  explanation,
  onNext,
}) => {
  useEffect(() => {
    if (isCorrect) {
      audioManager.playCorrect();
    } else {
      audioManager.playIncorrect();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCorrect, onNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border-2 shadow-2xl transition-all transform animate-in zoom-in-95 duration-200 bg-white ${
          isCorrect
            ? 'border-emerald-400 shadow-emerald-500/20'
            : isTimeout
            ? 'border-amber-400 shadow-amber-500/20'
            : 'border-rose-400 shadow-rose-500/20'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon Badge */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md ${
              isCorrect
                ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-300 animate-bounce-gentle'
                : isTimeout
                ? 'bg-amber-100 text-amber-600 border-2 border-amber-300'
                : 'bg-rose-100 text-rose-600 border-2 border-rose-300'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            ) : isTimeout ? (
              <Clock className="w-12 h-12 stroke-[2.5]" />
            ) : (
              <XCircle className="w-12 h-12 stroke-[2.5]" />
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-2xl sm:text-3xl font-black tracking-tight mb-1 ${
              isCorrect
                ? 'text-emerald-700'
                : isTimeout
                ? 'text-amber-700'
                : 'text-rose-600'
            }`}
          >
            {isCorrect
              ? 'CHÍNH XÁC TUYỆT VỜI!'
              : isTimeout
              ? 'HẾT THỜI GIAN LÀM BÀI!'
              : 'CHƯA CHÍNH XÁC!'}
          </h3>

          {/* Subtitle Score */}
          <div className="font-mono text-sm sm:text-base font-bold mb-4">
            {isCorrect ? (
              <span className="text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
                +{pointsEarned} ĐIỂM THƯỞNG
              </span>
            ) : (
              <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                +0 ĐIỂM (CỐ GẮNG Ở CÂU TIẾP THEO)
              </span>
            )}
          </div>

          {/* Correct Answer Display if wrong/timeout */}
          {!isCorrect && correctAnswerText && (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-4 text-left">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                ĐÁP ÁN ĐÚNG LÀ:
              </span>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {correctAnswerText}
              </p>
            </div>
          )}

          {/* Scientific Explanation */}
          {explanation && (
            <div className="w-full bg-sky-50/70 border border-sky-200 rounded-2xl p-4 mb-6 text-left">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-800 uppercase mb-1">
                <Lightbulb className="w-4 h-4 text-sky-600" />
                <span>BẢN CHẤT KHOA HỌC:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={onNext}
            autoFocus
            className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-102 active:scale-98 cursor-pointer ${
              isCorrect
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/25'
            }`}
          >
            <span>TIẾP TỤC HÀNH TRÌNH</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <span className="text-[11px] text-slate-400 mt-2.5 font-mono">
            Nhấn <kbd className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 font-bold">Enter</kbd> hoặc <kbd className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 font-bold">Space</kbd> để tiếp tục
          </span>
        </div>
      </div>
    </div>
  );
};
