import React, { useEffect, useState, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { audioManager } from '../services/audioManager';

interface TimerProps {
  timeLimit: number; // in seconds
  onTimeout: () => void;
  isPaused?: boolean;
  onTick?: (timeLeft: number, timeTaken: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
  timeLimit,
  onTimeout,
  isPaused = false,
  onTick,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    onTickRef.current = onTick;
  }, [onTimeout, onTick]);

  // Reset when timeLimit changes
  useEffect(() => {
    setTimeLeft(timeLimit);
    startTimeRef.current = Date.now();
  }, [timeLimit]);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTimeoutRef.current();
          return 0;
        }

        const next = prev - 1;
        const timeTaken = timeLimit - next;
        if (onTickRef.current) {
          onTickRef.current(next, timeTaken);
        }

        // Ticking audio in last 5 seconds
        if (next <= 5) {
          audioManager.playTick();
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, timeLimit]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));

  const isCritical = timeLeft <= 10;
  const isWarning = timeLeft <= 20 && !isCritical;

  return (
    <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-2xl px-4 py-2 shadow-md">
      <div
        className={`p-2 rounded-xl transition-colors ${
          isCritical
            ? 'bg-rose-100 text-rose-600 animate-pulse'
            : isWarning
            ? 'bg-amber-100 text-amber-700'
            : 'bg-sky-100 text-sky-700'
        }`}
      >
        {isCritical ? (
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        ) : (
          <Clock className="w-5 h-5" />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Thời Gian Còn
          </span>
          <span
            className={`font-mono text-xl font-black tracking-wider ${
              isCritical
                ? 'text-rose-600 animate-pulse'
                : isWarning
                ? 'text-amber-700'
                : 'text-slate-900'
            }`}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Dynamic Smooth Progress Bar */}
        <div className="w-32 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isCritical
                ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                : isWarning
                ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                : 'bg-sky-500 shadow-sm shadow-sky-500/50'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
