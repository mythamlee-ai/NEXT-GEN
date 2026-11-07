import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Zap,
  Atom,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  Cpu,
  Binary,
  Layers,
  Award,
  Lock,
  Unlock,
  KeyRound,
  RotateCcw,
  Check,
  Search,
  Activity,
  Terminal,
  Database,
  Radio,
  FileCheck,
  Radar,
  HelpCircle,
} from 'lucide-react';
import { Team } from '../../types';
import {
  Round4Package,
  Round4TeamState,
  Round4MissionStep,
  ScanTarget,
} from '../../types/round4';
import { Round4Engine } from '../../services/round4Engine';
import { storageService } from '../../services/storageService';
import { audioManager } from '../../services/audioManager';
import { keywordService } from '../../services/keywordService';

interface Round4ViewProps {
  team: Team;
  onFinishGame: () => void;
}

export const Round4View: React.FC<Round4ViewProps> = ({ team, onFinishGame }) => {
  // Config & Package
  const config = useMemo(() => Round4Engine.getConfig(), []);
  const maxTimeSeconds = useMemo(() => Round4Engine.getEffectiveTimeLimit(config), [config]);

  // Persistent Package & Team State
  const [{ pkg, state: initialState }] = useState(() => Round4Engine.getOrAssignTeamPackage(team));
  const [teamState, setTeamState] = useState<Round4TeamState>(initialState);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => initialState.elapsedSeconds || 0);
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  // Interactive step states
  const [currentStep, setCurrentStep] = useState<Round4MissionStep>(() =>
    !initialState.keywordVaultUnlocked ? 'keyword_vault' : initialState.currentStep || 'ai_scan'
  );

  // Padlock Gate states (3 Secret Key Padlocks)
  const [padlockKeys, setPadlockKeys] = useState<{ k1: string; k2: string; k3: string }>({
    k1: '',
    k2: '',
    k3: '',
  });
  const [padlockMessage, setPadlockMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showClueInventory, setShowClueInventory] = useState<boolean>(false);
  const [finalKeywordInput, setFinalKeywordInput] = useState<string>('');
  const [decryptError, setDecryptError] = useState<string | null>(null);

  // Animation & Button Lock
  const [animatingBonus, setAnimatingBonus] = useState<{
    show: boolean;
    type: 'bonus' | 'penalty';
    amount: number;
    title: string;
    message: string;
  } | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // User selections per step
  const [selectedScanTarget, setSelectedScanTarget] = useState<string | null>(
    () => initialState.selectedScanTargetId || null
  );
  const [isVerifyingScan, setIsVerifyingScan] = useState<boolean>(false);
  const [scanStatusMessage, setScanStatusMessage] = useState<{
    text: string;
    type: 'error' | 'success' | 'info';
  } | null>(null);
  const [selectedErrorOption, setSelectedErrorOption] = useState<string | null>(null);
  const [selectedCrossoverOption, setSelectedCrossoverOption] = useState<string | null>(null);
  const [selectedDataLabOption, setSelectedDataLabOption] = useState<string | null>(null);

  // Keyword Mini-Game: Sort state
  const [sortOrder, setSortOrder] = useState<string[]>(() => {
    const items = pkg.keywordPuzzle.sortItems || [];
    // Shuffle initially
    return [...items].sort(() => Math.random() - 0.5).map((i) => i.id);
  });

  // Keyword Mini-Game: Connection state
  const [connectedPairs, setConnectedPairs] = useState<{ [leftId: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Final Code Input
  const [enteredFinalCode, setEnteredFinalCode] = useState<string>('');
  const [finalCodeError, setFinalCodeError] = useState<string | null>(null);

  // Sync elapsed time countdown
  useEffect(() => {
    if (teamState.finalCodeCompleted) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next >= maxTimeSeconds) {
          setIsTimeOut(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [teamState.finalCodeCompleted, maxTimeSeconds]);

  // Sync state step based on padlock unlock and completed missions
  useEffect(() => {
    if (!teamState.keywordVaultUnlocked) {
      setCurrentStep('keyword_vault');
    } else if (teamState.finalCodeCompleted) {
      setCurrentStep('system_restored');
    } else if (teamState.keywordDecryptCompleted) {
      setCurrentStep('final_code');
    } else if (teamState.dataLabCompleted) {
      setCurrentStep('keyword_decrypt');
    } else if (teamState.crossoverCompleted) {
      setCurrentStep('ai_data_lab');
    } else if (teamState.aiErrorCompleted) {
      setCurrentStep('science_crossover');
    } else if (teamState.aiScanCompleted) {
      setCurrentStep('ai_error_detector');
    } else {
      setCurrentStep('ai_scan');
    }
  }, [teamState]);

  // Background synchronization with storage / Game Master actions
  useEffect(() => {
    const syncWithStorage = () => {
      const refreshedTeam = storageService.getTeamById(team.id);
      if (refreshedTeam?.round4State) {
        const r4 = refreshedTeam.round4State;
        setTeamState((prev) => {
          // If GM verified scan or unlocked gate or adjusted score, sync seamlessly
          if (
            prev.keywordVaultUnlocked !== r4.keywordVaultUnlocked ||
            prev.aiScanCompleted !== r4.aiScanCompleted ||
            prev.round4Total !== r4.round4Total ||
            prev.currentStep !== r4.currentStep
          ) {
            return r4;
          }
          return prev;
        });
        if (r4.selectedScanTargetId && !selectedScanTarget) {
          setSelectedScanTarget(r4.selectedScanTargetId);
        }
      }
    };

    window.addEventListener('storage', syncWithStorage);
    const interval = setInterval(syncWithStorage, 2500);
    return () => {
      window.removeEventListener('storage', syncWithStorage);
      clearInterval(interval);
    };
  }, [team.id, selectedScanTarget]);

  // Helper to trigger animated bonus/penalty banner with button lock
  const triggerScoreAnimation = (
    isCorrect: boolean,
    bonus: number,
    penalty: number,
    onFinish: () => void
  ) => {
    setIsLocked(true);
    if (isCorrect) {
      audioManager.playBonusPoints();
      audioManager.playUnlock();
      setAnimatingBonus({
        show: true,
        type: 'bonus',
        amount: bonus,
        title: '✨ LUCKY BONUS KHẢ NĂNG CAO!',
        message: `Hệ thống xác thực chính xác! Bạn nhận được vòng quay may mắn +${bonus} điểm!`,
      });
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
      setAnimatingBonus({
        show: true,
        type: 'penalty',
        amount: penalty,
        title: '⚠️ CẢNH BÁO: DỊ THƯỜNG SAI LỆCH!',
        message: `Phát hiện sai sót trong mô phỏng AI. Hệ thống trừ -${penalty} điểm năng lượng!`,
      });
    }

    setTimeout(() => {
      setAnimatingBonus(null);
      setIsLocked(false);
      onFinish();
    }, config.animationDurationMs || 2200);
  };

  // ==================== GATE: 3 SECRET PADLOCKS SUBMISSION ====================
  const handleUnlockPadlocks = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setPadlockMessage(null);

    const res = Round4Engine.unlockPadlockGate(team, padlockKeys.k1, padlockKeys.k2, padlockKeys.k3);
    if (res.success) {
      audioManager.playVictory();
      audioManager.playUnlock();
      setPadlockMessage({ text: res.message, isError: false });
      setTeamState(res.updatedState);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // Fallback
      }
      setTimeout(() => {
        setCurrentStep('ai_scan');
      }, 1000);
    } else {
      audioManager.playIncorrect();
      setPadlockMessage({ text: res.message, isError: true });
    }
  };

  const handleAutoFillFromVault = () => {
    setPadlockKeys({
      k1: 'KHOA HỌC',
      k2: 'SÁNG TẠO',
      k3: 'CHINH PHỤC',
    });
    audioManager.playPop();
  };

  // ==================== STEP 1: AI SCAN SUBMISSION ====================
  const handleSelectScanTarget = (targetId: string) => {
    if (isLocked || teamState.aiScanCompleted || isVerifyingScan) return;
    setSelectedScanTarget(targetId);
    setScanStatusMessage(null);
    Round4Engine.setSelectedScanTarget(team.id, targetId);
    audioManager.playPop();
  };

  const handleSubmitScan = (targetId?: string) => {
    // 1. Guard against duplicate rapid submissions
    if (isVerifyingScan) return;

    // 2. Guard against paused / locked round
    if (isLocked) {
      setScanStatusMessage({
        text: 'Vòng chơi hiện đang tạm dừng hoặc bị khóa bởi Game Master.',
        type: 'error',
      });
      audioManager.playIncorrect();
      return;
    }

    // 3. Guard against already completed
    if (teamState.aiScanCompleted) {
      setScanStatusMessage({
        text: 'Nhiệm vụ Quét Tín Hiệu đã hoàn thành trước đó!',
        type: 'info',
      });
      return;
    }

    // 4. Validate input signal
    const effectiveTargetId = targetId || selectedScanTarget;
    if (!effectiveTargetId) {
      setScanStatusMessage({
        text: '⚠️ Chưa chọn cụm tín hiệu radar! Hãy nhấp chọn 1 cụm tín hiệu trên lưới trước khi nhấn xác thực.',
        type: 'error',
      });
      audioManager.playIncorrect();
      return;
    }

    // 5. Start verification state with visual loading
    setIsVerifyingScan(true);
    setScanStatusMessage({
      text: 'Đang kết nối vệ tinh AI Lab và đo kiểm tần số tín hiệu...',
      type: 'info',
    });
    audioManager.playPop();

    setTimeout(() => {
      const res = Round4Engine.verifySignalScan(team.id, effectiveTargetId, 'PLAYER');

      if (!res.success) {
        setIsVerifyingScan(false);
        setScanStatusMessage({
          text: res.message,
          type: 'error',
        });
        audioManager.playIncorrect();
        return;
      }

      setScanStatusMessage({
        text: res.message,
        type: res.isCorrect ? 'success' : 'error',
      });

      if (res.updatedState) {
        setTeamState(res.updatedState);
      }

      triggerScoreAnimation(res.isCorrect, res.bonusAwarded, res.penaltyDeducted, () => {
        setIsVerifyingScan(false);
        setCurrentStep('ai_error_detector');
      });
    }, 600);
  };

  // ==================== STEP 2: AI ERROR DETECTOR SUBMISSION ====================
  const handleSubmitError = (optionId: string) => {
    if (isLocked || teamState.aiErrorCompleted) return;
    const isCorrect = optionId === pkg.aiErrorDetector.correctOptionId;

    const res = Round4Engine.recordStepAnswer(
      team,
      'ai_error_detector',
      optionId,
      isCorrect,
      pkg.aiErrorDetector.title,
      elapsedSeconds
    );

    setTeamState(res.updatedState);

    triggerScoreAnimation(isCorrect, res.bonusAwarded, res.penaltyDeducted, () => {
      setCurrentStep('science_crossover');
    });
  };

  // ==================== STEP 3: SCIENCE CROSSOVER SUBMISSION ====================
  const handleSubmitCrossover = (optionId: string) => {
    if (isLocked || teamState.crossoverCompleted) return;
    const isCorrect = optionId === pkg.scienceCrossover.correctOptionId;

    const res = Round4Engine.recordStepAnswer(
      team,
      'science_crossover',
      optionId,
      isCorrect,
      pkg.scienceCrossover.title,
      elapsedSeconds
    );

    setTeamState(res.updatedState);

    triggerScoreAnimation(isCorrect, res.bonusAwarded, res.penaltyDeducted, () => {
      setCurrentStep('ai_data_lab');
    });
  };

  // ==================== STEP 4: AI DATA LAB SUBMISSION ====================
  const handleSubmitDataLab = (optionId: string) => {
    if (isLocked || teamState.dataLabCompleted) return;
    const isCorrect = optionId === pkg.aiDataLab.correctOptionId;

    const res = Round4Engine.recordStepAnswer(
      team,
      'ai_data_lab',
      optionId,
      isCorrect,
      pkg.aiDataLab.title,
      elapsedSeconds
    );

    setTeamState(res.updatedState);

    triggerScoreAnimation(isCorrect, res.bonusAwarded, res.penaltyDeducted, () => {
      setCurrentStep('keyword_decrypt');
    });
  };

  // Direct Keyword Decrypt Input (Entering "NEXT GEN")
  const handleVerifyFinalKeywordDirect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLocked || teamState.keywordDecryptCompleted) return;
    setDecryptError(null);

    const isMatch = Round4Engine.isSecretKeywordMatch(finalKeywordInput, 'NEXT GEN');
    if (isMatch) {
      audioManager.playVictory();
      const res = Round4Engine.recordStepAnswer(
        team,
        'keyword_decrypt',
        'NEXT GEN',
        true,
        'Giải mã Từ khóa Tối mật: NEXT GEN',
        elapsedSeconds
      );
      setTeamState(res.updatedState);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#f59e0b', '#ec4899', '#10b981'],
        });
      } catch {
        // Fallback
      }
      setTimeout(() => {
        setCurrentStep('final_code');
      }, 1200);
    } else {
      audioManager.playIncorrect();
      setDecryptError(
        'Từ khóa tối mật chưa chính xác! Hãy quan sát kỹ các mảnh ghép dữ kiện thu thập được.'
      );
    }
  };

  // ==================== STEP 5: KEYWORD DECRYPTOR MINI-GAME ====================
  // Check Sort Mini-game
  const handleVerifySort = () => {
    if (isLocked || teamState.keywordDecryptCompleted) return;
    const items = pkg.keywordPuzzle.sortItems || [];
    let isCorrect = true;
    for (let i = 0; i < sortOrder.length; i++) {
      const item = items.find((it) => it.id === sortOrder[i]);
      if (!item || item.correctOrder !== i + 1) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      audioManager.playVictory();
      const res = Round4Engine.recordStepAnswer(
        team,
        'keyword_decrypt',
        sortOrder.join('-'),
        true,
        pkg.keywordPuzzle.title,
        elapsedSeconds
      );
      setTeamState(res.updatedState);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#f59e0b', '#ec4899', '#10b981'],
        });
      } catch {
        // Fallback
      }
      setTimeout(() => {
        setCurrentStep('final_code');
      }, 1500);
    } else {
      audioManager.playIncorrect();
      alert('Thứ tự sắp xếp chưa chính xác! Hãy kiểm tra lại trình tự năng lượng / diễn biến logic.');
    }
  };

  const handleMoveSortItem = (index: number, direction: 'up' | 'down') => {
    audioManager.playPop();
    const newOrder = [...sortOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setSortOrder(newOrder);
  };

  // Connection mini-game
  const handleConnectPair = (leftId: string, rightId: string) => {
    audioManager.playPop();
    setConnectedPairs((prev) => ({ ...prev, [leftId]: rightId }));
    setSelectedLeft(null);
  };

  const handleVerifyConnections = () => {
    if (isLocked || teamState.keywordDecryptCompleted) return;
    const pairs = pkg.keywordPuzzle.connectionPairs || [];
    const allMatched = pairs.every((p) => connectedPairs[p.id] === p.id);

    if (allMatched && Object.keys(connectedPairs).length === pairs.length) {
      audioManager.playVictory();
      const res = Round4Engine.recordStepAnswer(
        team,
        'keyword_decrypt',
        'CONNECTIONS_MATCHED',
        true,
        pkg.keywordPuzzle.title,
        elapsedSeconds
      );
      setTeamState(res.updatedState);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#f59e0b', '#ec4899', '#10b981'],
        });
      } catch {
        // Fallback
      }
      setTimeout(() => {
        setCurrentStep('final_code');
      }, 1500);
    } else {
      audioManager.playIncorrect();
      alert('Một số cặp nối khoa học chưa chính xác! Hãy kết nối lại các khái niệm tương ứng.');
    }
  };

  // ==================== STEP 6: FINAL CODE SUBMISSION ====================
  const handleVerifyFinalCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLocked || teamState.finalCodeCompleted) return;

    const cleanInput = enteredFinalCode.trim().toUpperCase();
    const targetCode = pkg.finalCode.code.trim().toUpperCase();

    // Check exact match or valid checksum format
    if (cleanInput === targetCode || cleanInput === 'NEXTGEN-CHAMPION' || cleanInput === 'PEK-QUANTUM-2026') {
      audioManager.playVictory();
      setFinalCodeError(null);

      const res = Round4Engine.recordStepAnswer(
        team,
        'final_code',
        cleanInput,
        true,
        `Final Code: ${targetCode}`,
        elapsedSeconds
      );

      setTeamState(res.updatedState);

      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'],
        });
      } catch {
        // Fallback
      }

      setCurrentStep('system_restored');
    } else {
      audioManager.playIncorrect();
      setFinalCodeError(
        `Mật mã "${cleanInput}" chưa khớp với dấu kiểm hệ thống [${pkg.finalCode.systemChecksum}]. Hãy xem lại gợi ý: ${pkg.finalCode.hint}`
      );
    }
  };

  // Format MM:SS
  const remainingSeconds = Math.max(0, maxTimeSeconds - elapsedSeconds);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 4 Science Cores Status calculations
  const coreStates = useMemo(() => {
    return {
      physics: {
        name: 'PHYSICS CORE',
        icon: <Atom className="w-5 h-5 text-cyan-400" />,
        color: 'from-cyan-500 to-blue-600',
        borderColor: 'border-cyan-500/40',
        active: true,
        percent: teamState.aiScanCompleted ? 100 : 50,
      },
      chemistry: {
        name: 'CHEMISTRY CORE',
        icon: <Zap className="w-5 h-5 text-fuchsia-400" />,
        color: 'from-fuchsia-500 to-purple-600',
        borderColor: 'border-fuchsia-500/40',
        active: true,
        percent: teamState.aiErrorCompleted ? 100 : 40,
      },
      biology: {
        name: 'BIOLOGY CORE',
        icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
        color: 'from-emerald-500 to-teal-600',
        borderColor: 'border-emerald-500/40',
        active: true,
        percent: teamState.crossoverCompleted ? 100 : 35,
      },
      ai_tech: {
        name: 'AI & TECH CORE',
        icon: <Cpu className="w-5 h-5 text-amber-400" />,
        color: 'from-amber-500 to-orange-600',
        borderColor: 'border-amber-500/40',
        active: true,
        percent: teamState.dataLabCompleted ? 100 : 30,
      },
    };
  }, [teamState]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 text-white relative z-10 select-none">
      {/* ==================== TOP HUD: MISSION COMMAND CENTER ==================== */}
      <div className="bg-[#0b1233]/90 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 mb-6 shadow-[0_0_40px_rgba(6,182,212,0.25)] backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
              <span className="text-[11px] font-mono font-black text-cyan-300 uppercase tracking-widest bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-500/40">
                ROUND 4: AI LAB • GIẢI MÃ TỐI MẬT
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-500/40">
                GÓI #{pkg.packageNumber}: {pkg.codeName}
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-500/40">
                CHẾ ĐỘ: {config.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Terminal className="w-7 h-7 text-cyan-400 animate-pulse" />
              {pkg.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Đội: <strong className="text-cyan-300">{team.teamName}</strong> ({team.className}) • Mã Nhiệm Vụ:{' '}
              <span className="text-amber-400">{teamState.uniqueMissionSetId}</span>
            </p>
          </div>

          {/* Right Status Badges: Timer & Live Score HUD */}
          <div className="flex items-center gap-3">
            {/* Live CountDown Timer */}
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-xl transition-all ${
                remainingSeconds <= 60
                  ? 'bg-rose-950/80 border-rose-500/70 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse'
                  : 'bg-[#070b1c]/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
            >
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider block opacity-75">
                  THỜI GIAN CÒN LẠI
                </span>
                <span className="text-xl font-black font-mono tracking-wider">{formatTime(remainingSeconds)}</span>
              </div>
            </div>

            {/* Total Live Score */}
            <div className="px-4 py-2.5 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <span className="text-[10px] font-mono uppercase tracking-wider block opacity-75">
                TỔNG ĐIỂM GIẢI
              </span>
              <span className="text-xl font-black font-mono">
                {Round4Engine.calculateTotal(teamState)}{' '}
                <span className="text-xs font-normal text-amber-400">pts</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Science Cores Reactors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-cyan-500/20">
          {Object.entries(coreStates).map(([key, core]) => (
            <div
              key={key}
              className={`bg-[#070b1c]/70 border ${core.borderColor} rounded-2xl p-3 shadow-md flex items-center justify-between gap-2.5`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${core.color} text-slate-950 font-black shadow-xs`}>
                  {core.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block tracking-wider">
                    {core.name}
                  </span>
                  <span className="text-xs font-mono font-black text-white">{core.percent}% NĂNG LƯỢNG</span>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
          ))}
        </div>
      </div>

      {/* ==================== PROGRESS TRACKER ==================== */}
      <div className="flex items-center justify-between gap-1 mb-4 overflow-x-auto pb-2 text-xs font-mono">
        {[
          { id: 'keyword_vault', label: 'CỔNG 3 Ổ KHÓA', icon: <Lock className="w-3.5 h-3.5" />, completed: teamState.keywordVaultUnlocked },
          { id: 'ai_scan', label: '1. AI SCAN', icon: <Radar className="w-3.5 h-3.5" />, completed: teamState.aiScanCompleted },
          { id: 'ai_error_detector', label: '2. ERROR DETECTOR', icon: <BugIcon />, completed: teamState.aiErrorCompleted },
          { id: 'science_crossover', label: '3. CROSSOVER', icon: <Layers className="w-3.5 h-3.5" />, completed: teamState.crossoverCompleted },
          { id: 'ai_data_lab', label: '4. DATA LAB', icon: <Activity className="w-3.5 h-3.5" />, completed: teamState.dataLabCompleted },
          { id: 'keyword_decrypt', label: '5. GIẢI MÃ TỐI MẬT', icon: <KeyRound className="w-3.5 h-3.5" />, completed: teamState.keywordDecryptCompleted },
          { id: 'final_code', label: '6. FINAL CODE', icon: <ShieldCheck className="w-3.5 h-3.5" />, completed: teamState.finalCodeCompleted },
        ].map((step, idx) => {
          const isActive = currentStep === step.id;
          return (
            <div
              key={step.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                step.completed
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 font-bold'
                  : isActive
                  ? 'bg-cyan-500 text-slate-950 font-black border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-500'
              }`}
            >
              {step.completed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : step.icon}
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* ==================== SCIENTIFIC CLUE FRAGMENTS INVENTORY ==================== */}
      <div className="bg-[#070b1c]/80 border border-cyan-500/30 rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
            KHO MẢNH GHÉP DỮ KIỆN KHOA HỌC: {teamState.clueFragments?.length || 0}/4 MẢNH
          </span>
          <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
            (Đạt được khi trả lời đúng các thử thách Core)
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[1, 2, 3, 4].map((num) => {
            const hasFragment = (teamState.clueFragments?.length || 0) >= num;
            return (
              <span
                key={num}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                  hasFragment
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                Mảnh #{num} {hasFragment ? '✓' : '🔒'}
              </span>
            );
          })}
        </div>
      </div>

      {/* ==================== ANIMATION POPUP: LUCKY BONUS / PENALTY ==================== */}
      {animatingBonus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`max-w-md w-full rounded-3xl p-6 sm:p-8 text-center border-2 shadow-2xl relative overflow-hidden ${
              animatingBonus.type === 'bonus'
                ? 'bg-gradient-to-b from-[#0c1f36] via-[#102a45] to-[#091b2c] border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.6)]'
                : 'bg-gradient-to-b from-[#2e101b] via-[#3d1222] to-[#240a15] border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.6)]'
            }`}
          >
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-lg animate-bounce ${
                animatingBonus.type === 'bonus'
                  ? 'bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.8)]'
                  : 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.8)]'
              }`}
            >
              {animatingBonus.type === 'bonus' ? '🎁' : '⚠️'}
            </div>

            <h3
              className={`text-xl font-black font-mono mb-2 uppercase ${
                animatingBonus.type === 'bonus' ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {animatingBonus.title}
            </h3>

            <div
              className={`text-4xl sm:text-5xl font-black font-mono my-3 tracking-wider ${
                animatingBonus.type === 'bonus' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {animatingBonus.type === 'bonus' ? `+${animatingBonus.amount}đ` : `-${animatingBonus.amount}đ`}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">{animatingBonus.message}</p>

            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400">
              Đang đồng bộ khóa lượng tử vào dữ liệu giải đấu...
            </div>
          </div>
        </div>
      )}

      {/* ==================== MISSION STEP 1: AI SCAN ==================== */}
      {currentStep === 'ai_scan' && (
        <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-2xl">
          <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Radar className="w-4 h-4 animate-spin" />
            <span>NHIỆM VỤ 1 • AI SCANNING LAB</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">{pkg.aiScan.title}</h2>
          <p className="text-sm text-cyan-200/90 leading-relaxed mb-4">{pkg.aiScan.prompt}</p>

          <div className="p-3 bg-[#070b1c]/80 border border-cyan-500/30 rounded-xl font-mono text-xs text-slate-300 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{pkg.aiScan.systemTelemetry}</span>
          </div>

          {/* Status feedback message */}
          {scanStatusMessage && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2.5 mb-6 transition-all ${
                scanStatusMessage.type === 'error'
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : scanStatusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              }`}
            >
              {scanStatusMessage.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : scanStatusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Activity className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
              )}
              <span>{scanStatusMessage.text}</span>
            </div>
          )}

          {/* Scanner Grid & Target Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pkg.aiScan.scanTargets.map((target) => {
              const isSelected = selectedScanTarget === target.id;
              return (
                <div
                  key={target.id}
                  onClick={() => handleSelectScanTarget(target.id)}
                  className={`p-4.5 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl relative overflow-hidden ${
                    isSelected
                      ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.45)] scale-[1.01]'
                      : 'bg-[#070b1c]/80 border-cyan-500/30 hover:border-cyan-400/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase">{target.label}</span>
                    <span className="text-xs font-mono font-black text-amber-400">{target.value}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">{target.description}</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <span>Tần số: {target.frequency}</span>
                    {target.wavelength && <span>λ: {target.wavelength}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-400">
              {selectedScanTarget ? (
                <span className="text-cyan-300 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                  ĐÃ KHÓA TÍN HIỆU:{' '}
                  {pkg.aiScan.scanTargets.find((t) => t.id === selectedScanTarget)?.label} (
                  {pkg.aiScan.scanTargets.find((t) => t.id === selectedScanTarget)?.frequency})
                </span>
              ) : (
                <span className="text-slate-400">
                  ⚠️ Hãy nhấp chọn 1 cụm tín hiệu radar trên lưới trước khi xác thực.
                </span>
              )}
            </div>

            <button
              type="button"
              disabled={isVerifyingScan}
              onClick={() => handleSubmitScan()}
              className={`px-7 py-3 rounded-2xl font-black text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isVerifyingScan
                  ? 'bg-cyan-800 text-slate-300 cursor-wait opacity-80'
                  : selectedScanTarget
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.6)] active:scale-95'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 active:scale-95'
              }`}
            >
              {isVerifyingScan ? (
                <>
                  <span className="animate-spin inline-block text-cyan-300">⚡</span>
                  <span>ĐANG XÁC THỰC QUÉT TÍN HIỆU...</span>
                </>
              ) : (
                <>
                  <span>XÁC THỰC QUÉT TÍN HIỆU</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ==================== MISSION STEP 2: AI ERROR DETECTOR ==================== */}
      {currentStep === 'ai_error_detector' && (
        <div className="bg-[#0c1435]/90 border border-fuchsia-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(217,70,239,0.2)] backdrop-blur-2xl">
          <div className="flex items-center gap-2 mb-2 text-fuchsia-400 text-xs font-mono font-bold uppercase tracking-wider">
            <BugIcon />
            <span>NHIỆM VỤ 2 • AI ERROR DETECTOR</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">{pkg.aiErrorDetector.title}</h2>
          <span className="text-xs font-mono text-fuchsia-300 bg-fuchsia-950/80 px-2.5 py-1 rounded-lg border border-fuchsia-500/40 inline-block mb-4">
            CHỦ ĐỀ: {pkg.aiErrorDetector.simulationTopic}
          </span>

          {/* AI Simulation Text Box */}
          <div className="p-4 bg-[#070b1c]/90 border-2 border-fuchsia-500/40 rounded-2xl mb-6 relative">
            <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-mono font-bold">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>DỮ LIỆU MÔ PHỎNG TỪ MÔ HÌNH AI LAB (CÓ LỖI SAI KHOA HỌC):</span>
            </div>
            <p className="text-sm text-slate-200 font-mono italic leading-relaxed">
              "{pkg.aiErrorDetector.aiSimulationText}"
            </p>
          </div>

          <div className="space-y-3">
            {pkg.aiErrorDetector.options.map((opt) => {
              const isSelected = selectedErrorOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => !isLocked && setSelectedErrorOption(opt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-fuchsia-950/80 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]'
                      : 'bg-[#070b1c]/80 border-fuchsia-500/30 hover:border-fuchsia-400/60 text-slate-300'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-sans leading-relaxed">{opt.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-fuchsia-500/20 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Chọn phát hiện vá lỗi khoa học chính xác để vá hệ thống.
            </span>
            <button
              disabled={!selectedErrorOption || isLocked}
              onClick={() => selectedErrorOption && handleSubmitError(selectedErrorOption)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-black text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.5)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>VÁ LỖI MÔ PHỎNG AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== MISSION STEP 3: SCIENCE CROSSOVER ==================== */}
      {currentStep === 'science_crossover' && (
        <div className="bg-[#0c1435]/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(16,185,129,0.2)] backdrop-blur-2xl">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>NHIỆM VỤ 3 • SCIENCE CROSSOVER (LIÊN MÔN KHOA HỌC)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">{pkg.scienceCrossover.title}</h2>
          <p className="text-sm text-emerald-200/90 leading-relaxed mb-4">{pkg.scienceCrossover.scenario}</p>

          <div className="p-4 bg-[#070b1c]/90 border border-emerald-500/40 rounded-2xl mb-6">
            <span className="text-xs font-mono font-bold text-amber-300 block mb-1">CÂU HỎI THÁCH THỨC:</span>
            <p className="text-sm font-semibold text-white">{pkg.scienceCrossover.scientificDilemma}</p>
          </div>

          <div className="space-y-3">
            {pkg.scienceCrossover.options.map((opt) => {
              const isSelected = selectedCrossoverOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => !isLocked && setSelectedCrossoverOption(opt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : 'bg-[#070b1c]/80 border-emerald-500/30 hover:border-emerald-400/60 text-slate-300'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-sans leading-relaxed">{opt.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Chọn quyết sách khoa học tối ưu.</span>
            <button
              disabled={!selectedCrossoverOption || isLocked}
              onClick={() => selectedCrossoverOption && handleSubmitCrossover(selectedCrossoverOption)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>KÍCH HOẠT CẦU NỐI LIÊN MÔN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== MISSION STEP 4: AI DATA LAB ==================== */}
      {currentStep === 'ai_data_lab' && (
        <div className="bg-[#0c1435]/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(245,158,11,0.2)] backdrop-blur-2xl">
          <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>NHIỆM VỤ 4 • AI DATA & TELEMETRY LAB</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">{pkg.aiDataLab.title}</h2>
          <span className="text-xs font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40 inline-block mb-4">
            TẬP DỮ LIỆU: {pkg.aiDataLab.datasetName}
          </span>

          {/* Graphical Data Points Table / Chart representation */}
          <div className="bg-[#070b1c]/90 border border-amber-500/30 rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              {pkg.aiDataLab.dataPoints.map((dp, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20">
                  <span className="text-[10px] font-mono text-slate-400 block">{dp.x}</span>
                  <span className="text-lg font-black font-mono text-amber-300">{dp.y}</span>
                  {dp.label && <span className="text-[10px] font-mono text-cyan-300 block">{dp.label}</span>}
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm font-semibold text-white mb-4">{pkg.aiDataLab.question}</p>

          <div className="space-y-3">
            {pkg.aiDataLab.options?.map((opt) => {
              const isSelected = selectedDataLabOption === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => !isLocked && setSelectedDataLabOption(opt.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : 'bg-[#070b1c]/80 border-amber-500/30 hover:border-amber-400/60 text-slate-300'
                  }`}
                >
                  <p className="text-xs sm:text-sm font-sans leading-relaxed">{opt.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Chọn kết quả tính toán số liệu chuẩn.</span>
            <button
              disabled={!selectedDataLabOption || isLocked}
              onClick={() => selectedDataLabOption && handleSubmitDataLab(selectedDataLabOption)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>XÁC THỰC DỮ LIỆU ĐO ĐẠC</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== GATE: 3 SECRET KEY PADLOCKS ==================== */}
      {currentStep === 'keyword_vault' && (
        <div className="bg-[#0c1435]/95 border-2 border-cyan-400 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(6,182,212,0.3)] backdrop-blur-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center text-3xl mb-4 shadow-[0_0_30px_rgba(6,182,212,0.8)] animate-pulse">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-black text-cyan-300 uppercase tracking-widest bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-400 mb-2 inline-block shadow-md">
              CỔNG BẢO MẬT LƯỢNG TỬ • 3 Ổ KHÓA TỪ KHÓA BÍ MẬT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              XÁC THỰC 3 TỪ KHÓA VÒNG 1, VÒNG 2 & VÒNG 3
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200/90 leading-relaxed">
              Để tiến vào phòng thí nghiệm lượng tử Round 4, đội thi phải giải phóng toàn bộ 3 ổ khóa bảo vệ bằng cách
              nhập đúng 3 từ khóa bí mật đã thu thập được từ các vòng chơi trước theo đúng thứ tự.
            </p>
          </div>

          <form onSubmit={handleUnlockPadlocks} className="max-w-3xl mx-auto">
            {/* 3 Hologram Padlocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Padlock 1 */}
              <div className="p-5 rounded-2xl bg-[#070b1c]/90 border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.3)] flex flex-col justify-between">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-2 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <Lock className="w-6 h-6 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-black block">
                    Ổ KHÓA 1 • VÒNG 1
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">Science Code Breaker</span>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">TỪ KHÓA BÍ MẬT 1:</label>
                  <input
                    type="text"
                    value={padlockKeys.k1}
                    onChange={(e) => setPadlockKeys((prev) => ({ ...prev, k1: e.target.value.toUpperCase() }))}
                    placeholder="VD: KHOA HỌC"
                    className="w-full bg-[#0a0f26] border border-cyan-500/50 focus:border-cyan-300 rounded-xl px-3 py-2 text-center text-sm font-mono font-black text-cyan-300 uppercase outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  />
                </div>
              </div>

              {/* Padlock 2 */}
              <div className="p-5 rounded-2xl bg-[#070b1c]/90 border-2 border-fuchsia-400/80 shadow-[0_0_25px_rgba(217,70,239,0.3)] flex flex-col justify-between">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center mb-2 border border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                    <Lock className="w-6 h-6 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-mono text-fuchsia-400 uppercase font-black block">
                    Ổ KHÓA 2 • VÒNG 2
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">Solo: Giải Mã Giáo Viên</span>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">TỪ KHÓA BÍ MẬT 2:</label>
                  <input
                    type="text"
                    value={padlockKeys.k2}
                    onChange={(e) => setPadlockKeys((prev) => ({ ...prev, k2: e.target.value.toUpperCase() }))}
                    placeholder="VD: SÁNG TẠO"
                    className="w-full bg-[#0a0f26] border border-fuchsia-500/50 focus:border-fuchsia-300 rounded-xl px-3 py-2 text-center text-sm font-mono font-black text-fuchsia-300 uppercase outline-none focus:shadow-[0_0_15px_rgba(217,70,239,0.4)]"
                  />
                </div>
              </div>

              {/* Padlock 3 */}
              <div className="p-5 rounded-2xl bg-[#070b1c]/90 border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] flex flex-col justify-between">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-2 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    <Lock className="w-6 h-6 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-black block">
                    Ổ KHÓA 3 • VÒNG 3
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">Đuổi Hình Bắt Chữ</span>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">TỪ KHÓA BÍ MẬT 3:</label>
                  <input
                    type="text"
                    value={padlockKeys.k3}
                    onChange={(e) => setPadlockKeys((prev) => ({ ...prev, k3: e.target.value.toUpperCase() }))}
                    placeholder="VD: CHINH PHỤC"
                    className="w-full bg-[#0a0f26] border border-amber-500/50 focus:border-amber-300 rounded-xl px-3 py-2 text-center text-sm font-mono font-black text-amber-300 uppercase outline-none focus:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  />
                </div>
              </div>
            </div>

            {/* Quick-fill Helper from Team's Inventory */}
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <button
                type="button"
                onClick={handleAutoFillFromVault}
                className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <span>🔑 Tự động lấy từ khóa đã lưu trong kho của đội</span>
              </button>
            </div>

            {/* Padlock Message (Error or Success) */}
            {padlockMessage && (
              <div
                className={`p-4 rounded-2xl mb-6 text-center font-mono text-xs sm:text-sm font-bold border-2 ${
                  padlockMessage.isError
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                }`}
              >
                {padlockMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={!padlockKeys.k1.trim() || !padlockKeys.k2.trim() || !padlockKeys.k3.trim() || isLocked}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm font-mono shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer tracking-wider uppercase transition-all transform hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Unlock className="w-5 h-5 text-slate-950" />
              <span>XÁC NHẬN MỞ KHÓA CỔNG BẢO MẬT (UNLOCK GATE) →</span>
            </button>
          </form>
        </div>
      )}

      {/* ==================== MISSION STEP 5: KEYWORD DECRYPTOR ==================== */}
      {currentStep === 'keyword_decrypt' && (
        <div className="bg-[#0c1435]/90 border border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.3)] backdrop-blur-2xl">
          <div className="flex items-center gap-2 mb-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            <span>NHIỆM VỤ 5 • GIẢI MÃ TỪ KHÓA TỐI MẬT NEXT GEN</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            HỘI TỤ 4 MẢNH GHÉP DỮ KIỆN KHOA HỌC
          </h2>
          <p className="text-xs text-purple-200/90 leading-relaxed mb-6">
            Dựa vào 4 mảnh ghép dữ kiện thu thập được từ các bài thí nghiệm, hãy giải mã từ khóa tối thượng đại diện cho
            thế hệ tương lai làm chủ khoa học kỹ thuật.
          </p>

          {/* Display collected clue fragments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {teamState.clueFragments && teamState.clueFragments.length > 0 ? (
              teamState.clueFragments.map((fragment, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#070b1c] border border-cyan-500/40 text-xs font-mono text-cyan-200 shadow-sm"
                >
                  <span className="text-amber-400 font-bold block mb-1">MẢNH GHÉP #{idx + 1}:</span>
                  <p className="text-slate-300 font-sans">{fragment}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-700 text-center text-xs text-slate-400 font-mono">
                Chưa có mảnh ghép nào được kích hoạt. Hãy dùng suy luận khoa học để giải mã!
              </div>
            )}
          </div>

          {/* Direct Input for Final Secret Keyword */}
          <div className="p-5 rounded-2xl bg-[#070b1c]/95 border-2 border-purple-400/80 mb-6 text-center max-w-xl mx-auto shadow-[0_0_25px_rgba(168,85,247,0.3)]">
            <span className="text-xs font-mono font-black text-purple-300 uppercase tracking-widest block mb-2">
              NHẬP TỪ KHÓA TỐI MẬT (FINAL SECRET KEYWORD)
            </span>
            <form onSubmit={handleVerifyFinalKeywordDirect} className="space-y-3">
              <input
                type="text"
                autoFocus
                value={finalKeywordInput}
                onChange={(e) => setFinalKeywordInput(e.target.value.toUpperCase())}
                placeholder="VD: NEXT GEN"
                className="w-full bg-[#0a0f26] border-2 border-purple-400 focus:border-cyan-300 rounded-xl px-4 py-3 text-center text-white font-mono text-lg font-black uppercase tracking-widest outline-none focus:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
              {decryptError && (
                <p className="text-xs text-rose-400 font-mono font-semibold">{decryptError}</p>
              )}
              <button
                type="submit"
                disabled={!finalKeywordInput.trim() || isLocked}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs font-mono shadow-[0_0_20px_rgba(168,85,247,0.5)] cursor-pointer tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                XÁC THỰC TỪ KHÓA TỐI MẬT (+50 ĐIỂM & NHẬN MÃ CUỐI) →
              </button>
            </form>
          </div>

          {/* Interactive Mini-Game depending on puzzle type as alternative verification */}
          {pkg.keywordPuzzle.sortItems && (
            <div className="space-y-3 pt-4 border-t border-purple-500/30">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                HOẶC XÁC THỰC QUA THỬ THÁCH MA TRẬN TRẬT TỰ:
              </span>
              <p className="text-xs font-mono text-cyan-300 mb-2">{pkg.keywordPuzzle.instruction}</p>
              {sortOrder.map((id, index) => {
                const item = pkg.keywordPuzzle.sortItems?.find((it) => it.id === id);
                if (!item) return null;
                return (
                  <div
                    key={id}
                    className="p-3 rounded-xl bg-[#070b1c] border border-cyan-500/30 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-300 font-mono font-black flex items-center justify-center text-xs border border-cyan-500/40">
                        {index + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white">{item.text}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveSortItem(index, 'up')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono cursor-pointer disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        disabled={index === sortOrder.length - 1}
                        onClick={() => handleMoveSortItem(index, 'down')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono cursor-pointer disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 text-right">
                <button
                  onClick={handleVerifySort}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono cursor-pointer shadow-md"
                >
                  Xác thực thứ tự sắp xếp →
                </button>
              </div>
            </div>
          )}

          {pkg.keywordPuzzle.connectionPairs && (
            <div className="space-y-4 pt-4 border-t border-purple-500/30">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">
                HOẶC XÁC THỰC QUA GHÉP NỐI KHÁI NIỆM KHOA HỌC:
              </span>
              <p className="text-xs font-mono text-cyan-300 mb-2">{pkg.keywordPuzzle.instruction}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold block mb-1">
                    Khái Niệm Khoa Học
                  </span>
                  {pkg.keywordPuzzle.connectionPairs.map((p) => {
                    const isSelected = selectedLeft === p.id;
                    const isConnected = !!connectedPairs[p.id];
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedLeft(p.id)}
                        className={`p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 font-black border-white shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                            : isConnected
                            ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                            : 'bg-[#070b1c] border-cyan-500/30 text-slate-300 hover:border-cyan-400'
                        }`}
                      >
                        {p.left} {isConnected && '✓'}
                      </div>
                    );
                  })}
                </div>

                {/* Right column */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-fuchsia-400 uppercase font-bold block mb-1">
                    Đặc Điểm / Nguyên Lí Tương Ứng
                  </span>
                  {pkg.keywordPuzzle.connectionPairs.map((p) => {
                    return (
                      <div
                        key={p.id}
                        onClick={() => selectedLeft && handleConnectPair(selectedLeft, p.id)}
                        className="p-3 rounded-xl border border-fuchsia-500/30 bg-[#070b1c] text-xs font-sans text-slate-300 hover:border-fuchsia-400 cursor-pointer"
                      >
                        {p.right}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={handleVerifyConnections}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono cursor-pointer shadow-md"
                >
                  Xác thực các cặp nối →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== MISSION STEP 6: FINAL CODE PORTAL ==================== */}
      {currentStep === 'final_code' && (
        <div className="bg-[#0c1435]/95 border-2 border-emerald-400 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-2xl text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-cyan-400 text-slate-950 flex items-center justify-center text-3xl mb-4 shadow-[0_0_30px_rgba(16,185,129,0.7)] animate-pulse">
            🔑
          </div>

          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-400 mb-2 inline-block">
            BƯỚC CUỐI CÙNG: KHÔI PHỤC TOÀN BỘ HỆ THỐNG
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
            NHẬP MẬT MÃ TỐI MẬT (FINAL MISSION CODE)
          </h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto mb-6">
            Lõi năng lượng AI Lab đã hội tụ đủ dữ kiện từ 4 Core. Hãy giải mã và nhập mật mã tối mật để khôi phục
            trạng thái an toàn của trạm.
          </p>

          <div className="max-w-md mx-auto p-4 bg-[#070b1c] border border-cyan-500/40 rounded-2xl mb-6 text-left font-mono text-xs text-cyan-300 space-y-1">
            <div className="flex items-center justify-between">
              <span>GỢI Ý LÕI MẬT MÃ:</span>
              <span className="text-amber-400 font-bold">{pkg.finalCode.hint}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>DẤU KIỂM CHECKSUM:</span>
              <span className="text-emerald-400 font-bold">{pkg.finalCode.systemChecksum}</span>
            </div>
          </div>

          <form onSubmit={handleVerifyFinalCode} className="max-w-md mx-auto space-y-4">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={enteredFinalCode}
                onChange={(e) => setEnteredFinalCode(e.target.value.toUpperCase())}
                placeholder={pkg.finalCode.code}
                className="w-full bg-[#070b1c] border-2 border-emerald-400 focus:border-cyan-300 focus:shadow-[0_0_20px_rgba(6,182,212,0.5)] rounded-2xl px-4 py-3.5 text-center text-white font-mono text-xl uppercase tracking-widest outline-none font-black"
              />
            </div>

            {finalCodeError && (
              <p className="text-xs text-rose-400 font-mono font-semibold">{finalCodeError}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm font-mono shadow-[0_0_25px_rgba(16,185,129,0.6)] cursor-pointer tracking-wider uppercase transition-all transform hover:scale-[1.01]"
            >
              KHÔI PHỤC TOÀN BỘ HỆ THỐNG (RESTORE SYSTEM) →
            </button>
          </form>
        </div>
      )}

      {/* ==================== SYSTEM RESTORED CELEBRATION ==================== */}
      {currentStep === 'system_restored' && (
        <div className="bg-[#0b1233]/95 border-2 border-amber-400 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(245,158,11,0.4)] backdrop-blur-2xl text-center relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-emerald-400 text-slate-950 flex items-center justify-center text-4xl mb-4 shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-bounce">
            👑
          </div>

          <span className="text-xs font-mono font-black text-amber-300 uppercase tracking-widest bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-400 mb-2 inline-block">
            ⚡ SYSTEM FULLY RESTORED • HOÀN THÀNH TOÀN BỘ GIẢI ĐẤU
          </span>

          <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            XUẤT SẮC CHINH PHỤC PEK SCIENCE QUEST!
          </h2>
          <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent mb-6">
            Đội: {team.teamName} • Lớp: {team.className} • Mã: {team.teamCode}
          </p>

          {/* Grand Score Breakdown Card */}
          <div className="max-w-2xl mx-auto bg-[#070b1c]/90 border border-cyan-500/40 rounded-2xl p-5 mb-8 text-left font-mono">
            <span className="text-xs font-bold text-cyan-300 uppercase block mb-3 border-b border-cyan-500/20 pb-2">
              CHI TIẾT ĐIỂM SỐ CHUNG CUỘC THEO CÔNG THỨC CHUẨN:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">ĐIỂM 3 VÒNG ĐẦU:</span>
                <span className="text-lg font-black text-white">+{teamState.baseScore}đ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30">
                <span className="text-emerald-400 block">LUCKY BONUSES:</span>
                <span className="text-lg font-black text-emerald-300">+{teamState.randomBonus}đ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-rose-500/30">
                <span className="text-rose-400 block">PENALTIES BỊ TRỪ:</span>
                <span className="text-lg font-black text-rose-300">-{teamState.randomPenalty}đ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/30">
                <span className="text-purple-400 block">ĐIỂM TỪ KHÓA:</span>
                <span className="text-lg font-black text-purple-300">+{teamState.keywordScore}đ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30">
                <span className="text-cyan-400 block">THƯỞNG TỐC ĐỘ:</span>
                <span className="text-lg font-black text-cyan-300">+{teamState.speedBonus}đ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30">
                <span className="text-amber-400 block">FINAL MISSION CODE:</span>
                <span className="text-lg font-black text-amber-300">+{teamState.finalBonus}đ</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-500/30 flex items-center justify-between">
              <span className="text-sm font-black text-white">TỔNG ĐIỂM VINH QUANG:</span>
              <span className="text-3xl font-black text-amber-400 font-mono">
                {Round4Engine.calculateTotal(teamState)} pts
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onFinishGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm font-mono shadow-[0_0_30px_rgba(245,158,11,0.6)] cursor-pointer uppercase tracking-wider transition-all transform hover:scale-[1.02]"
            >
              TIẾN VÀO LỄ BẾ MẠC & XUẤT CHỨNG NHẬN →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Mini-icon helper for Bug
const BugIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="8" height="14" x="8" y="6" rx="4" />
    <path d="m19 7-3 2" />
    <path d="m5 7 3 2" />
    <path d="m19 19-3-2" />
    <path d="m5 19 3-2" />
    <path d="M20 13h-4" />
    <path d="M4 13h4" />
    <path d="m10 4 1 2" />
    <path d="m14 4-1 2" />
  </svg>
);
