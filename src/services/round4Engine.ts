import { Team } from '../types';
import {
  Round4Package,
  Round4TeamState,
  Round4Log,
  Round4Config,
  Round4MissionStep,
  ScanTarget,
  AIDetectiveQuestion,
  BackupMatchingPair,
} from '../types/round4';
import { defaultRound4Packages } from '../data/round4Packages';
import {
  defaultAIDetectiveQuestions,
  defaultBackupMatchingPairs,
} from '../data/aiDetectiveQuestions';
import { storageService } from './storageService';
import { keywordService } from './keywordService';

const STORAGE_KEYS = {
  ROUND4_PACKAGES: 'pek_round4_packages_db',
  ROUND4_CONFIG: 'pek_round4_config_db',
  ROUND4_LOGS: 'pek_round4_logs_db',
  ROUND4_TEAM_STATE_PREFIX: 'pek_round4_state_',
  AI_DETECTIVE_QUESTIONS: 'pek_ai_detective_questions_db',
  BACKUP_MATCHING_PAIRS: 'pek_backup_matching_pairs_db',
};

export const defaultRound4Config: Round4Config = {
  baseTimeLimitSeconds: 300, // 5 minutes
  difficulty: 'STANDARD',
  maxKeywordAttempts: 3,
  aiDetectivePointsPerQuestion: 30,
  bonusValues: [10, 20, 30, 50],
  penaltyValues: [5, 10, 15, 20],
  speedBonusTable: {
    under2Min: 40,
    under3Min: 30,
    under4Min: 20,
    under4m30s: 10,
    over4m30s: 0,
  },
  finalCodeBonus: 100,
  keywordDecryptBonus: 50,
  animationDurationMs: 2200,
  audioEnabled: true,
};

export class Round4Engine {
  // ==================== CONFIG ====================
  public static getConfig(): Round4Config {
    if (typeof window === 'undefined') return defaultRound4Config;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUND4_CONFIG);
      if (data) {
        return { ...defaultRound4Config, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return defaultRound4Config;
  }

  public static saveConfig(cfg: Partial<Round4Config>): Round4Config {
    const current = this.getConfig();
    const updated = { ...current, ...cfg };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ROUND4_CONFIG, JSON.stringify(updated));
    }
    return updated;
  }

  public static getEffectiveTimeLimit(config?: Round4Config): number {
    const cfg = config || this.getConfig();
    const base = cfg.baseTimeLimitSeconds;
    if (cfg.difficulty === 'ADVANCED') {
      return Math.round(base * 0.85); // -15%
    }
    if (cfg.difficulty === 'FINAL_BOSS') {
      return Math.round(base * 0.75); // -25%
    }
    return base;
  }

  public static calculateSpeedBonus(elapsedSeconds: number, config?: Round4Config): number {
    const cfg = config || this.getConfig();
    const table = cfg.speedBonusTable;
    if (elapsedSeconds < 120) return table.under2Min;
    if (elapsedSeconds < 180) return table.under3Min;
    if (elapsedSeconds < 240) return table.under4Min;
    if (elapsedSeconds < 270) return table.under4m30s;
    return table.over4m30s;
  }

  // ==================== PACKAGES ====================
  public static getPackages(): Round4Package[] {
    if (typeof window === 'undefined') return defaultRound4Packages;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUND4_PACKAGES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          // Sync defaults to ensure all packages have full connectionPairs / sortItems
          const synced = defaultRound4Packages.map((def) => {
            const found = parsed.find((p: Round4Package) => p.id === def.id);
            if (!found) return def;
            return {
              ...def,
              active: found.active !== undefined ? found.active : def.active,
              keywordPuzzle: def.keywordPuzzle, // Always use pristine updated puzzle
            };
          });
          return synced;
        }
      }
    } catch {
      // Fallback
    }
    this.savePackages(defaultRound4Packages);
    return defaultRound4Packages;
  }

  public static savePackages(packages: Round4Package[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ROUND4_PACKAGES, JSON.stringify(packages));
    }
  }

  public static getPackageById(id: string): Round4Package | undefined {
    return this.getPackages().find((p) => p.id === id);
  }

  public static togglePackageActive(id: string): void {
    const list = this.getPackages().map((p) => (p.id === id ? { ...p, active: !p.active } : p));
    this.savePackages(list);
  }

  public static resetPackagesToDefault(): void {
    this.savePackages(defaultRound4Packages);
  }

  // ==================== AI DETECTIVE & BACKUP MISSION ====================
  public static getAIDetectiveQuestions(): AIDetectiveQuestion[] {
    if (typeof window === 'undefined') return defaultAIDetectiveQuestions;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_DETECTIVE_QUESTIONS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return defaultAIDetectiveQuestions;
  }

  public static saveAIDetectiveQuestions(questions: AIDetectiveQuestion[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AI_DETECTIVE_QUESTIONS, JSON.stringify(questions));
      window.dispatchEvent(new CustomEvent('PEK_AI_DETECTIVE_QUESTIONS_UPDATED'));
    }
  }

  public static resetAIDetectiveQuestions(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AI_DETECTIVE_QUESTIONS);
    }
  }

  public static getBackupMatchingPairs(): BackupMatchingPair[] {
    return defaultBackupMatchingPairs;
  }

  // ==================== RANDOM BONUS & PENALTY ====================
  public static rollBonus(config?: Round4Config): number {
    const cfg = config || this.getConfig();
    const arr = cfg.bonusValues && cfg.bonusValues.length > 0 ? cfg.bonusValues : [10, 20, 30, 50];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  public static rollPenalty(config?: Round4Config): number {
    const cfg = config || this.getConfig();
    const arr = cfg.penaltyValues && cfg.penaltyValues.length > 0 ? cfg.penaltyValues : [5, 10, 15, 20];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ==================== TEAM STATE & PERSISTENCE ====================
  public static getTeamState(teamId: string): Round4TeamState | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.ROUND4_TEAM_STATE_PREFIX}${teamId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return null;
  }

  public static saveTeamState(state: Round4TeamState): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `${STORAGE_KEYS.ROUND4_TEAM_STATE_PREFIX}${state.teamId}`,
        JSON.stringify(state)
      );
    }
  }

  /**
   * Assigns or retrieves a consistent mission package for the team.
   * NEVER reshuffles on page reload!
   */
  public static getOrAssignTeamPackage(team: Team): { pkg: Round4Package; state: Round4TeamState } {
    const packages = this.getPackages().filter((p) => p.active);
    const activePackages = packages.length > 0 ? packages : defaultRound4Packages;

    // 1. Check if team already has a persistent state
    let state = this.getTeamState(team.id) || team.round4State;
    if (state && state.assignedPackageId) {
      let needsSave = false;
      if (!state.currentStep || state.currentStep === 'ai_scan') {
        state.currentStep = 'ai_detective';
        needsSave = true;
      }
      if (state.aiDetectiveScore === undefined) {
        state.aiDetectiveScore = 0;
        needsSave = true;
      }
      if (!state.aiDetectiveAnswers) {
        state.aiDetectiveAnswers = {};
        needsSave = true;
      }
      if (state.keywordAttempts === undefined) {
        state.keywordAttempts = 0;
        needsSave = true;
      }
      if (state.backupPairsMatched === undefined) {
        state.backupPairsMatched = [];
        needsSave = true;
      }
      if (state.backupScore === undefined) {
        state.backupScore = 0;
        needsSave = true;
      }
      if (needsSave) {
        this.saveTeamState(state);
      }
      const existingPkg = this.getPackageById(state.assignedPackageId);
      if (existingPkg) {
        return { pkg: existingPkg, state };
      }
    }

    // 2. Assign a new deterministic unique package
    const allTeams = storageService.getTeams();
    const assignedIds = new Set(
      allTeams
        .filter((t) => t.id !== team.id && t.assignedPackageId)
        .map((t) => t.assignedPackageId as string)
    );

    // Pick packages not used recently if available
    let available = activePackages.filter((p) => !assignedIds.has(p.id));
    if (available.length === 0) {
      available = activePackages;
    }

    // Deterministic hash based on team.id and team.questionSeed
    const seedString = `${team.id}_${team.questionSeed || team.teamCode}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }
    const chosenIndex = Math.abs(hash) % available.length;
    const selectedPkg = available[chosenIndex];

    const baseScore =
      (team.roundScores[1] || 0) + (team.roundScores[2] || 0) + (team.roundScores[3] || 0);

    const uniqueMissionSetId = `MS-${team.teamCode}-${Date.now().toString(36).toUpperCase()}`;
    const randomSeed = `SEED-${Math.abs(hash).toString(16).toUpperCase()}`;

    state = {
      teamId: team.id,
      assignedPackageId: selectedPkg.id,
      uniqueMissionSetId,
      randomSeed,
      currentStep: 'ai_detective',
      aiDetectiveScore: 0,
      aiDetectiveAnswers: {},
      aiDetectiveCompleted: false,
      currentQuestionIndex: 0,
      keywordAttempts: 0,
      maxKeywordAttempts: 3,
      keywordSolved: false,
      backupCompleted: false,
      backupPairsMatched: [],
      backupScore: 0,
      keywordVaultUnlocked: true,
      clueFragments: [],
      aiScanCompleted: false,
      aiErrorCompleted: false,
      crossoverCompleted: false,
      dataLabCompleted: false,
      keywordDecryptCompleted: false,
      finalCodeCompleted: false,
      baseScore,
      randomBonus: 0,
      randomPenalty: 0,
      keywordScore: 0,
      speedBonus: 0,
      finalBonus: 0,
      manualAdjustment: 0,
      round4Total: 0,
      startTime: Date.now(),
      elapsedSeconds: 0,
      manualAdjustmentsLog: [],
    };

    // Save state
    this.saveTeamState(state);

    const updatedTeam: Team = {
      ...team,
      assignedPackageId: selectedPkg.id,
      uniqueMissionSetId,
      round4State: state,
    };
    storageService.saveTeam(updatedTeam);

    return { pkg: selectedPkg, state };
  }

  /**
   * Normalizes Vietnamese strings for resilient keyword comparison
   */
  public static normalizeAnswer(input: string): string {
    return input
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/Đ/g, 'D')
      .replace(/[^A-Z0-9]/g, '');
  }

  /**
   * Validates if entered keyword matches the target secret keyword
   */
  public static isSecretKeywordMatch(entered: string, target: string): boolean {
    const cleanEntered = this.normalizeAnswer(entered);
    const cleanTarget = this.normalizeAnswer(target);
    return cleanEntered === cleanTarget;
  }

  /**
   * Verifies the 3 secret padlock keywords (V1: KHOA HỌC, V2: SÁNG TẠO, V3: CHINH PHỤC)
   * If correct, unlocks the gate. If wrong, informs exact count (e.g. 2/3) without revealing answers.
   */
  public static unlockPadlockGate(
    team: Team,
    key1: string,
    key2: string,
    key3: string
  ): {
    success: boolean;
    correctCount: number;
    message: string;
    updatedTeam: Team;
    updatedState: Round4TeamState;
  } {
    const { state } = this.getOrAssignTeamPackage(team);

    const isKey1Correct = this.isSecretKeywordMatch(key1, 'KHOA HỌC');
    const isKey2Correct = this.isSecretKeywordMatch(key2, 'SÁNG TẠO');
    const isKey3Correct = this.isSecretKeywordMatch(key3, 'CHINH PHỤC');

    let correctCount = 0;
    if (isKey1Correct) correctCount++;
    if (isKey2Correct) correctCount++;
    if (isKey3Correct) correctCount++;

    if (correctCount === 3) {
      state.keywordVaultUnlocked = true;
      this.saveTeamState(state);

      const updatedTeam: Team = {
        ...team,
        round4State: state,
      };
      storageService.saveTeam(updatedTeam);

      this.recordLog({
        id: `log-${Date.now()}-vault-unlocked`,
        timestamp: Date.now(),
        teamId: team.id,
        teamName: team.teamName,
        packageId: state.assignedPackageId,
        step: 'keyword_vault',
        questionTitle: 'Mở Khóa Cổng Bảo Mật 3 Ổ Khóa',
        userAnswer: `${key1} | ${key2} | ${key3}`,
        isCorrect: true,
        bonusAwarded: 0,
        penaltyDeducted: 0,
        elapsedSeconds: state.elapsedSeconds || 0,
        newScore: this.calculateTotal(state),
      });

      return {
        success: true,
        correctCount: 3,
        message: 'MỞ KHÓA THÀNH CÔNG! Toàn bộ 3 ổ khóa lượng tử đã được giải phóng.',
        updatedTeam,
        updatedState: state,
      };
    }

    return {
      success: false,
      correctCount,
      message: `Mật mã bảo mật chưa chính xác! Hiện có: ${correctCount}/3 từ khóa chính xác. Vui lòng kiểm tra lại từ khóa thu thập từ Vòng 1, Vòng 2 và Vòng 3!`,
      updatedTeam: team,
      updatedState: state,
    };
  }

  /**
   * GM Manual Unlock for the 3 Padlocks gate
   */
  public static gmManualUnlockGate(teamId: string): boolean {
    const team = storageService.getTeamById(teamId);
    if (!team) return false;

    const { state } = this.getOrAssignTeamPackage(team);
    state.keywordVaultUnlocked = true;
    this.saveTeamState(state);

    const updatedTeam: Team = {
      ...team,
      round4State: state,
    };
    storageService.saveTeam(updatedTeam);

    this.recordLog({
      id: `log-${Date.now()}-gm-vault-unlock`,
      timestamp: Date.now(),
      teamId: team.id,
      teamName: team.teamName,
      packageId: state.assignedPackageId,
      step: 'keyword_vault',
      questionTitle: 'Game Master Mở Khóa Thủ Công 3 Ổ Khóa',
      userAnswer: 'GM_OVERRIDE',
      isCorrect: true,
      bonusAwarded: 0,
      penaltyDeducted: 0,
      elapsedSeconds: state.elapsedSeconds || 0,
      newScore: this.calculateTotal(state),
    });

    return true;
  }

  /**
   * Sets and synchronizes the selected signal target for Step 1 across Player & GM
   */
  public static setSelectedScanTarget(teamId: string, targetId: string): boolean {
    const team = storageService.getTeamById(teamId);
    if (!team) return false;

    const { state } = this.getOrAssignTeamPackage(team);
    state.selectedScanTargetId = targetId;
    this.saveTeamState(state);

    const updatedTeam: Team = {
      ...team,
      round4State: state,
    };
    storageService.saveTeam(updatedTeam);
    return true;
  }

  /**
   * Validates and verifies the signal scan (Step 1) for a team.
   * Usable by both Player (in-app validation) and Game Master (remote confirmation).
   */
  public static verifySignalScan(
    teamId: string,
    targetId?: string,
    verifier: 'PLAYER' | 'GAME_MASTER' = 'PLAYER'
  ): {
    success: boolean;
    isCorrect: boolean;
    message: string;
    error?: string;
    bonusAwarded: number;
    penaltyDeducted: number;
    updatedTeam?: Team;
    updatedState?: Round4TeamState;
    target?: ScanTarget;
    correctTarget?: ScanTarget;
  } {
    const team = storageService.getTeamById(teamId);
    if (!team) {
      return {
        success: false,
        isCorrect: false,
        message: 'Lỗi: Không tìm thấy thông tin đội thi trong hệ thống!',
        error: 'TEAM_NOT_FOUND',
        bonusAwarded: 0,
        penaltyDeducted: 0,
      };
    }

    const { state, pkg } = this.getOrAssignTeamPackage(team);

    // Guard 1: Padlock Gate check
    if (!state.keywordVaultUnlocked) {
      return {
        success: false,
        isCorrect: false,
        message: 'Cổng bảo mật 3 ổ khóa chưa được mở! Đội cần hoàn thành mở khóa cổng trước khi quét tín hiệu.',
        error: 'GATE_LOCKED',
        bonusAwarded: 0,
        penaltyDeducted: 0,
        updatedTeam: team,
        updatedState: state,
      };
    }

    // Guard 2: Already completed check
    if (state.aiScanCompleted) {
      const target = pkg.aiScan.scanTargets.find((t) => t.id === state.aiScanResult?.answer);
      return {
        success: true,
        isCorrect: state.aiScanResult?.isCorrect || false,
        message: `Tín hiệu đã được xác thực trước đó (${target?.label || state.aiScanResult?.answer || 'Đã hoàn thành'}). Trạng thái vòng chơi đã chuyển sang bước tiếp theo.`,
        bonusAwarded: 0,
        penaltyDeducted: 0,
        updatedTeam: team,
        updatedState: state,
        target,
        correctTarget: pkg.aiScan.scanTargets.find((t) => t.id === pkg.aiScan.correctTargetId),
      };
    }

    // Resolve targetId from parameter or from state
    const resolvedTargetId = targetId || state.selectedScanTargetId;
    if (!resolvedTargetId || !resolvedTargetId.trim()) {
      return {
        success: false,
        isCorrect: false,
        message: 'Chưa có dữ liệu tín hiệu! Vui lòng chọn 1 cụm tín hiệu radar khoa học cần quét trước khi xác thực.',
        error: 'NO_SIGNAL_SELECTED',
        bonusAwarded: 0,
        penaltyDeducted: 0,
        updatedTeam: team,
        updatedState: state,
      };
    }

    // Check if target is in the package's scan targets
    const target = pkg.aiScan.scanTargets.find((t) => t.id === resolvedTargetId);
    const correctTarget = pkg.aiScan.scanTargets.find((t) => t.id === pkg.aiScan.correctTargetId);

    if (!target) {
      return {
        success: false,
        isCorrect: false,
        message: `Tín hiệu mã "${resolvedTargetId}" không tồn tại trong dải đo của nhiệm vụ ${pkg.title}!`,
        error: 'INVALID_TARGET',
        bonusAwarded: 0,
        penaltyDeducted: 0,
        updatedTeam: team,
        updatedState: state,
      };
    }

    // Determine correctness
    const isCorrect = target.id === pkg.aiScan.correctTargetId;
    const cfg = this.getConfig();
    let bonus = 0;
    let penalty = 0;

    if (isCorrect) {
      bonus = this.rollBonus(cfg);
      const fragment = `[Mảnh 1 - Vật Lí]: ${pkg.aiScan.title} (${pkg.aiScan.explanation.slice(0, 90)}...)`;
      if (!state.clueFragments) state.clueFragments = [];
      if (!state.clueFragments.includes(fragment)) state.clueFragments.push(fragment);
    } else {
      penalty = this.rollPenalty(cfg);
    }

    const now = Date.now();
    state.selectedScanTargetId = target.id;
    state.scanVerifiedBy = verifier;
    state.scanVerifiedAt = now;
    state.aiScanCompleted = true;
    state.aiScanResult = {
      isCorrect,
      bonus,
      penalty,
      answer: target.id,
      verifiedBy: verifier,
      verifiedAt: now,
    };
    state.randomBonus += bonus;
    state.randomPenalty += penalty;
    state.currentStep = 'ai_error_detector';

    // Ensure Round 4 total never negative
    const rawR4 =
      state.randomBonus -
      state.randomPenalty +
      state.speedBonus +
      state.finalBonus +
      (state.manualAdjustment || 0);
    state.round4Total = Math.max(0, rawR4);

    const totalScore =
      (team.roundScores[1] || 0) +
      (team.roundScores[2] || 0) +
      (team.roundScores[3] || 0) +
      state.round4Total;

    this.saveTeamState(state);

    const updatedTeam: Team = {
      ...team,
      score: totalScore,
      roundScores: {
        ...team.roundScores,
        4: state.round4Total,
      },
      round4State: state,
    };
    storageService.saveTeam(updatedTeam);

    // Record audit log
    this.recordLog({
      id: `log-${now}-ai-scan-${verifier.toLowerCase()}`,
      timestamp: now,
      teamId: team.id,
      teamName: team.teamName,
      packageId: state.assignedPackageId,
      step: 'ai_scan',
      questionTitle: `Quét Tín Hiệu: ${pkg.aiScan.title} (Xác thực bởi ${verifier === 'GAME_MASTER' ? 'Game Master' : 'Player'})`,
      userAnswer: `${target.label} (${target.frequency})`,
      isCorrect,
      bonusAwarded: bonus,
      penaltyDeducted: penalty,
      elapsedSeconds: state.elapsedSeconds || 0,
      newScore: totalScore,
    });

    const resultMessage = isCorrect
      ? `✅ XÁC THỰC TÍN HIỆU THÀNH CÔNG! Cụm ${target.label} khớp chính xác tần số phát chuẩn của lõi. Nhận thưởng +${bonus} điểm và Mảnh Ghép Dữ Kiện 1.`
      : `❌ XÁC THỰC THẤT BẠI! Cụm ${target.label} bị nhiễu sóng, không đồng bộ với tần số lõi (Đáp án chuẩn: ${correctTarget?.label || pkg.aiScan.correctTargetId}). Trừ phạt -${penalty} điểm.`;

    return {
      success: true,
      isCorrect,
      message: resultMessage,
      bonusAwarded: bonus,
      penaltyDeducted: penalty,
      updatedTeam,
      updatedState: state,
      target,
      correctTarget,
    };
  }

  /**
   * GM Manual Score Adjustment with reason and audit log
   */
  public static adjustTeamScore(
    teamId: string,
    delta: number,
    reason: string,
    gmName: string = 'Game Master'
  ): { success: boolean; newScore: number; message: string } {
    const team = storageService.getTeamById(teamId);
    if (!team) return { success: false, newScore: 0, message: 'Không tìm thấy đội!' };

    const { state } = this.getOrAssignTeamPackage(team);
    state.manualAdjustment = (state.manualAdjustment || 0) + delta;

    if (!state.manualAdjustmentsLog) state.manualAdjustmentsLog = [];
    state.manualAdjustmentsLog.push({
      id: `adj-${Date.now()}`,
      timestamp: Date.now(),
      delta,
      reason: `${gmName}: ${reason}`,
    });

    const rawDelta =
      state.randomBonus - state.randomPenalty + state.speedBonus + state.finalBonus + state.manualAdjustment;
    state.round4Total = Math.max(0, rawDelta);

    this.saveTeamState(state);

    const totalScore =
      (team.roundScores[1] || 0) +
      (team.roundScores[2] || 0) +
      (team.roundScores[3] || 0) +
      state.round4Total;

    const updatedTeam: Team = {
      ...team,
      score: totalScore,
      roundScores: {
        ...team.roundScores,
        4: state.round4Total,
      },
      round4State: state,
      round4ScoreBreakdown: {
        baseScore: state.baseScore,
        randomBonus: state.randomBonus,
        randomPenalty: state.randomPenalty,
        keywordScore: state.keywordScore,
        speedBonus: state.speedBonus,
        finalBonus: state.finalBonus,
        manualAdjustment: state.manualAdjustment,
        totalScore,
      },
    };
    storageService.saveTeam(updatedTeam);

    this.recordLog({
      id: `log-${Date.now()}-gm-adjust`,
      timestamp: Date.now(),
      teamId: team.id,
      teamName: team.teamName,
      packageId: state.assignedPackageId,
      step: 'final_code',
      questionTitle: `GM Điều Chỉnh Điểm (${delta > 0 ? '+' : ''}${delta}): ${reason}`,
      userAnswer: reason,
      isCorrect: delta >= 0,
      bonusAwarded: delta > 0 ? delta : 0,
      penaltyDeducted: delta < 0 ? Math.abs(delta) : 0,
      elapsedSeconds: state.elapsedSeconds || 0,
      newScore: totalScore,
    });

    return {
      success: true,
      newScore: totalScore,
      message: `Đã điều chỉnh ${delta > 0 ? '+' : ''}${delta} điểm cho đội ${team.teamName}. Tổng điểm mới: ${totalScore} điểm.`,
    };
  }

  /**
   * Recalculates total score using the strict formula:
   * Recalculates total score using the strict formula:
   * TOTAL = V1 + V2 (Cá nhân) + V3 + V4
   * In Round 4:
   * - AI DETECTIVE: points according to configured questions
   * - Mission 2 vs Mission 3: TRI ÂN (+100) OR Backup Mission (max 50). Never double awarded!
   * - GM manual adjustments
   * Note: Round 4 score never drops below 0.
   */
  public static calculateRound4Only(state: Round4TeamState): number {
    const aiDetectivePts = state.aiDetectiveScore || 0;
    // Strict rule: Either 100 for TRI ÂN or max 50 for Backup Mission
    const mission2or3Pts = state.keywordSolved
      ? (state.keywordScore || 100)
      : (state.backupScore || 0);

    const legacyPts =
      (state.randomBonus || 0) -
      (state.randomPenalty || 0) +
      (state.speedBonus || 0) +
      (state.finalBonus || 0);

    const manual = state.manualAdjustment || 0;
    const rawR4 = aiDetectivePts + mission2or3Pts + legacyPts + manual;
    return Math.max(0, rawR4);
  }

  public static calculateTotal(state: Round4TeamState): number {
    const r4 = this.calculateRound4Only(state);
    return (state.baseScore || 0) + r4;
  }

  /**
   * ==================== NHIỆM VỤ 1: AI DETECTIVE ====================
   * Records student's answer to an AI Detective flaw question, applies points,
   * provides mandatory explanations (both on correct and incorrect).
   */
  public static recordAIDetectiveAnswer(
    team: Team,
    questionId: string,
    selectedOptionId: string,
    elapsedSeconds: number
  ): {
    success: boolean;
    isCorrect: boolean;
    pointsAwarded: number;
    question: AIDetectiveQuestion;
    updatedTeam: Team;
    updatedState: Round4TeamState;
    allQuestionsCompleted: boolean;
  } {
    const { state } = this.getOrAssignTeamPackage(team);
    const questions = this.getAIDetectiveQuestions();
    const qIndex = questions.findIndex((q) => q.id === questionId);
    const question = questions[qIndex] || questions[0];

    if (!state.aiDetectiveAnswers) state.aiDetectiveAnswers = {};

    const isAlreadyAnswered = !!state.aiDetectiveAnswers[question.id];
    const isCorrect = selectedOptionId === question.correctOptionId;
    const pointsAwarded = isAlreadyAnswered ? 0 : isCorrect ? question.points || 30 : 0;

    if (!isAlreadyAnswered) {
      state.aiDetectiveAnswers[question.id] = {
        questionId: question.id,
        selectedOptionId,
        isCorrect,
        pointsAwarded,
        answeredAt: Date.now(),
      };
      state.aiDetectiveScore = (state.aiDetectiveScore || 0) + pointsAwarded;
    }

    const answeredCount = Object.keys(state.aiDetectiveAnswers).length;
    const allQuestionsCompleted = answeredCount >= questions.length;
    if (allQuestionsCompleted) {
      state.aiDetectiveCompleted = true;
      state.currentStep = 'final_keyword'; // Auto proceed to Mission 2
    } else {
      state.currentQuestionIndex = (qIndex + 1) % questions.length;
    }

    state.elapsedSeconds = elapsedSeconds;
    state.round4Total = this.calculateRound4Only(state);

    this.saveTeamState(state);

    const totalScore =
      (team.roundScores[1] || 0) +
      (team.roundScores[2] || 0) +
      (team.roundScores[3] || 0) +
      state.round4Total;

    const updatedTeam: Team = {
      ...team,
      score: totalScore,
      roundScores: {
        ...team.roundScores,
        4: state.round4Total,
      },
      round4State: state,
    };
    storageService.saveTeam(updatedTeam);

    this.recordLog({
      id: `log-${Date.now()}-ai-det-${question.id}`,
      timestamp: Date.now(),
      teamId: team.id,
      teamName: team.teamName,
      packageId: state.assignedPackageId,
      step: 'ai_detective',
      questionTitle: `AI Detective: ${question.title}`,
      userAnswer: selectedOptionId,
      isCorrect,
      bonusAwarded: pointsAwarded,
      penaltyDeducted: 0,
      elapsedSeconds,
      newScore: totalScore,
    });

    return {
      success: true,
      isCorrect,
      pointsAwarded,
      question,
      updatedTeam,
      updatedState: state,
      allQuestionsCompleted,
    };
  }

  /**
   * ==================== NHIỆM VỤ 2: FINAL KEYWORD ====================
   * Verifies the secret keyword "TRI ÂN" (accepts accented/unaccented, uppercase/lowercase).
   * If correct: +100 points, opens 3D treasure chest.
   * If wrong: decrements attempts, allows switching to Backup Mission when exhausted.
   */
  public static verifyFinalKeyword(
    team: Team,
    enteredKeyword: string,
    elapsedSeconds: number
  ): {
    success: boolean;
    isCorrect: boolean;
    attemptsLeft: number;
    canSwitchToBackup: boolean;
    message: string;
    updatedTeam: Team;
    updatedState: Round4TeamState;
  } {
    const { state } = this.getOrAssignTeamPackage(team);
    const cfg = this.getConfig();
    const maxAttempts = cfg.maxKeywordAttempts || 3;

    if (state.keywordSolved) {
      return {
        success: true,
        isCorrect: true,
        attemptsLeft: 0,
        canSwitchToBackup: false,
        message: 'Từ khóa TRI ÂN đã được giải mã thành công trước đó!',
        updatedTeam: team,
        updatedState: state,
      };
    }

    const cleanEntered = this.normalizeAnswer(enteredKeyword);
    // Target is 'TRI ÂN' (normalized to 'TRIAN')
    const isCorrect = cleanEntered === 'TRIAN';

    if (isCorrect) {
      state.keywordSolved = true;
      state.keywordScore = 100;
      // Do not allow double points with backup mission
      state.backupScore = 0;
      state.currentStep = 'treasure_ceremony';
      state.completedTime = Date.now();
      state.elapsedSeconds = elapsedSeconds;
      state.round4Total = this.calculateRound4Only(state);

      this.saveTeamState(state);

      const totalScore =
        (team.roundScores[1] || 0) +
        (team.roundScores[2] || 0) +
        (team.roundScores[3] || 0) +
        state.round4Total;

      const updatedTeam: Team = {
        ...team,
        score: totalScore,
        roundScores: {
          ...team.roundScores,
          4: state.round4Total,
        },
        round4State: state,
      };
      storageService.saveTeam(updatedTeam);

      // Unlock secret keyword in keywordService
      keywordService.unlockKeywordForTeam(team, 'kw-sec-04');

      this.recordLog({
        id: `log-${Date.now()}-final-keyword-tri-an`,
        timestamp: Date.now(),
        teamId: team.id,
        teamName: team.teamName,
        packageId: state.assignedPackageId,
        step: 'final_keyword',
        questionTitle: 'Giải Mã Từ Khóa Tối Mật: TRI ÂN',
        userAnswer: enteredKeyword,
        isCorrect: true,
        bonusAwarded: 100,
        penaltyDeducted: 0,
        keywordAwarded: 'TRI ÂN',
        elapsedSeconds,
        newScore: totalScore,
      });

      return {
        success: true,
        isCorrect: true,
        attemptsLeft: 0,
        canSwitchToBackup: false,
        message:
          'FINAL KEYWORD UNLOCKED! Chúc mừng bạn đã giải mã thành công từ khóa tối mật TRI ÂN (+100 điểm)!',
        updatedTeam,
        updatedState: state,
      };
    }

    // Incorrect case
    const currentAttempts = (state.keywordAttempts || 0) + 1;
    state.keywordAttempts = currentAttempts;
    const attemptsLeft = Math.max(0, maxAttempts - currentAttempts);
    const canSwitchToBackup = attemptsLeft === 0;

    this.saveTeamState(state);

    const message =
      attemptsLeft > 0
        ? `Mật mã chưa chính xác! Bạn còn ${attemptsLeft} lượt thử.`
        : 'Bạn đã sử dụng hết lượt thử giải mã. Cổng nhiệm vụ dự phòng (BACKUP MISSION) đã được mở!';

    return {
      success: true,
      isCorrect: false,
      attemptsLeft,
      canSwitchToBackup,
      message,
      updatedTeam: team,
      updatedState: state,
    };
  }

  /**
   * Switches the team from Final Keyword to Backup Mission
   */
  public static switchToBackupMission(teamId: string): boolean {
    const team = storageService.getTeamById(teamId);
    if (!team) return false;
    const { state } = this.getOrAssignTeamPackage(team);

    state.currentStep = 'backup_matching';
    if (!state.backupPairsMatched) state.backupPairsMatched = [];
    state.backupScore = 0;

    this.saveTeamState(state);
    const updatedTeam: Team = {
      ...team,
      round4State: state,
    };
    storageService.saveTeam(updatedTeam);
    return true;
  }

  /**
   * ==================== NHIỆM VỤ 3: BACKUP MISSION ====================
   * Records a matched pair about Vietnamese Teachers' Day 20/11.
   * 10 points per pair, max 50 points (all 5 pairs).
   */
  public static recordBackupPairMatch(
    team: Team,
    pairId: string,
    elapsedSeconds: number
  ): {
    success: boolean;
    isComplete: boolean;
    scoreAwarded: number;
    currentBackupScore: number;
    matchedPairsCount: number;
    updatedTeam: Team;
    updatedState: Round4TeamState;
  } {
    const { state } = this.getOrAssignTeamPackage(team);
    if (!state.backupPairsMatched) state.backupPairsMatched = [];

    let scoreAwarded = 0;
    if (!state.backupPairsMatched.includes(pairId)) {
      state.backupPairsMatched.push(pairId);
      scoreAwarded = 10;
      state.backupScore = Math.min(50, state.backupPairsMatched.length * 10);
    }

    const isComplete = state.backupPairsMatched.length >= 5;
    if (isComplete) {
      state.backupCompleted = true;
      state.currentStep = 'treasure_ceremony';
      state.completedTime = Date.now();
    }

    state.elapsedSeconds = elapsedSeconds;
    state.round4Total = this.calculateRound4Only(state);

    this.saveTeamState(state);

    const totalScore =
      (team.roundScores[1] || 0) +
      (team.roundScores[2] || 0) +
      (team.roundScores[3] || 0) +
      state.round4Total;

    const updatedTeam: Team = {
      ...team,
      score: totalScore,
      roundScores: {
        ...team.roundScores,
        4: state.round4Total,
      },
      round4State: state,
    };
    storageService.saveTeam(updatedTeam);

    this.recordLog({
      id: `log-${Date.now()}-backup-pair-${pairId}`,
      timestamp: Date.now(),
      teamId: team.id,
      teamName: team.teamName,
      packageId: state.assignedPackageId,
      step: 'backup_matching',
      questionTitle: `Ghép Nối Tri Ân: Cặp ${pairId}`,
      userAnswer: pairId,
      isCorrect: true,
      bonusAwarded: scoreAwarded,
      penaltyDeducted: 0,
      elapsedSeconds,
      newScore: totalScore,
    });

    return {
      success: true,
      isComplete,
      scoreAwarded,
      currentBackupScore: state.backupScore || 0,
      matchedPairsCount: state.backupPairsMatched.length,
      updatedTeam,
      updatedState: state,
    };
  }

  /**
   * Records the answer to a mission step, rolls and locks in the bonus/penalty,
   * adds clue fragments on correct answers, updates the team state, persists everything, and logs the action.
   */
  public static recordStepAnswer(
    team: Team,
    step: Round4MissionStep,
    userAnswer: string,
    isCorrect: boolean,
    questionTitle: string,
    elapsedSeconds: number,
    clueFragmentText?: string
  ): {
    updatedTeam: Team;
    updatedState: Round4TeamState;
    bonusAwarded: number;
    penaltyDeducted: number;
    speedBonusAwarded?: number;
    finalBonusAwarded?: number;
  } {
    const { state, pkg } = this.getOrAssignTeamPackage(team);
    const cfg = this.getConfig();

    let bonus = 0;
    let penalty = 0;
    let speedBonus = state.speedBonus;
    let finalBonus = state.finalBonus;
    let keywordAwarded: string | undefined = undefined;

    if (!state.clueFragments) state.clueFragments = [];

    if (step === 'ai_scan') {
      if (state.aiScanCompleted) {
        return { updatedTeam: team, updatedState: state, bonusAwarded: 0, penaltyDeducted: 0 };
      }
      if (isCorrect) {
        bonus = this.rollBonus(cfg);
        const fragment =
          clueFragmentText || `[Mảnh 1 - Vật Lí]: ${pkg.aiScan.title} (${pkg.aiScan.explanation.slice(0, 90)}...)`;
        if (!state.clueFragments.includes(fragment)) state.clueFragments.push(fragment);
      } else {
        penalty = this.rollPenalty(cfg);
      }
      state.aiScanCompleted = true;
      state.aiScanResult = { isCorrect, bonus, penalty, answer: userAnswer };
      state.randomBonus += bonus;
      state.randomPenalty += penalty;
      state.currentStep = 'ai_error_detector';
    } else if (step === 'ai_error_detector') {
      if (state.aiErrorCompleted) {
        return { updatedTeam: team, updatedState: state, bonusAwarded: 0, penaltyDeducted: 0 };
      }
      if (isCorrect) {
        bonus = this.rollBonus(cfg);
        const fragment =
          clueFragmentText ||
          `[Mảnh 2 - Sinh Học]: ${pkg.aiErrorDetector.title} (${pkg.aiErrorDetector.patchExplanation.slice(0, 90)}...)`;
        if (!state.clueFragments.includes(fragment)) state.clueFragments.push(fragment);
      } else {
        penalty = this.rollPenalty(cfg);
      }
      state.aiErrorCompleted = true;
      state.aiErrorResult = { isCorrect, bonus, penalty, answer: userAnswer };
      state.randomBonus += bonus;
      state.randomPenalty += penalty;
      state.currentStep = 'science_crossover';
    } else if (step === 'science_crossover') {
      if (state.crossoverCompleted) {
        return { updatedTeam: team, updatedState: state, bonusAwarded: 0, penaltyDeducted: 0 };
      }
      if (isCorrect) {
        bonus = this.rollBonus(cfg);
        const fragment =
          clueFragmentText ||
          `[Mảnh 3 - Giao Thoa]: ${pkg.scienceCrossover.title} (${pkg.scienceCrossover.explanation.slice(0, 90)}...)`;
        if (!state.clueFragments.includes(fragment)) state.clueFragments.push(fragment);
      } else {
        penalty = this.rollPenalty(cfg);
      }
      state.crossoverCompleted = true;
      state.crossoverResult = { isCorrect, bonus, penalty, answer: userAnswer };
      state.randomBonus += bonus;
      state.randomPenalty += penalty;
      state.currentStep = 'ai_data_lab';
    } else if (step === 'ai_data_lab') {
      if (state.dataLabCompleted) {
        return { updatedTeam: team, updatedState: state, bonusAwarded: 0, penaltyDeducted: 0 };
      }
      if (isCorrect) {
        bonus = this.rollBonus(cfg);
        const fragment =
          clueFragmentText ||
          `[Mảnh 4 - AI Data]: ${pkg.aiDataLab.title} (${pkg.aiDataLab.explanation.slice(0, 90)}...)`;
        if (!state.clueFragments.includes(fragment)) state.clueFragments.push(fragment);
      } else {
        penalty = this.rollPenalty(cfg);
      }
      state.dataLabCompleted = true;
      state.dataLabResult = { isCorrect, bonus, penalty, answer: userAnswer };
      state.randomBonus += bonus;
      state.randomPenalty += penalty;
      state.currentStep = 'keyword_decrypt';
    } else if (step === 'keyword_decrypt') {
      if (state.keywordDecryptCompleted) {
        return { updatedTeam: team, updatedState: state, bonusAwarded: 0, penaltyDeducted: 0 };
      }
      const kwBonus = cfg.keywordDecryptBonus || 50;
      bonus = kwBonus;
      state.keywordDecryptCompleted = true;
      state.keywordDecryptResult = { isCorrect: true, finalKeyword: 'NEXT GEN' };
      state.keywordScore += kwBonus;
      keywordAwarded = 'NEXT GEN';
      state.currentStep = 'final_code';

      // Unlock 'kw-sec-04' in the official Keyword Service
      const kwUnlock = keywordService.unlockKeywordForTeam(team, 'kw-sec-04');
      if (kwUnlock) {
        window.dispatchEvent(new CustomEvent('PEK_KEYWORD_UNLOCKED', { detail: kwUnlock.keyword }));
      }
    } else if (step === 'final_code') {
      if (state.finalCodeCompleted) {
        return { updatedTeam: team, updatedState: state, bonusAwarded: 0, penaltyDeducted: 0 };
      }
      finalBonus = cfg.finalCodeBonus || 100;
      speedBonus = this.calculateSpeedBonus(elapsedSeconds, cfg);
      state.finalCodeCompleted = true;
      state.finalCodeResult = { isCorrect: true, finalBonus, enteredCode: userAnswer };
      state.finalBonus = finalBonus;
      state.speedBonus = speedBonus;
      state.completedTime = Date.now();
      state.elapsedSeconds = elapsedSeconds;
      state.currentStep = 'system_restored';
    }

    state.elapsedSeconds = elapsedSeconds;

    // Ensure Round 4 total score never drops below 0:
    const rawRound4Delta =
      state.randomBonus -
      state.randomPenalty +
      state.speedBonus +
      state.finalBonus +
      (state.manualAdjustment || 0);
    const round4Delta = Math.max(0, rawRound4Delta);
    state.round4Total = round4Delta;

    const totalScore =
      (team.roundScores[1] || 0) +
      (team.roundScores[2] || 0) +
      (team.roundScores[3] || 0) +
      round4Delta;

    // Save team state
    this.saveTeamState(state);

    const updatedTeam: Team = {
      ...team,
      score: totalScore,
      roundScores: {
        ...team.roundScores,
        4: round4Delta,
      },
      roundTimes: {
        ...team.roundTimes,
        4: elapsedSeconds,
      },
      round4State: state,
      round4ScoreBreakdown: {
        baseScore: state.baseScore,
        randomBonus: state.randomBonus,
        randomPenalty: state.randomPenalty,
        keywordScore: state.keywordScore,
        speedBonus: state.speedBonus,
        finalBonus: state.finalBonus,
        manualAdjustment: state.manualAdjustment,
        totalScore,
      },
    };

    if (step === 'final_code') {
      updatedTeam.status = 'finished';
      updatedTeam.completedAt = Date.now();
    }

    storageService.saveTeam(updatedTeam);

    // Record audit log
    this.recordLog({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      teamId: team.id,
      teamName: team.teamName,
      packageId: state.assignedPackageId,
      step,
      questionTitle,
      userAnswer,
      isCorrect,
      bonusAwarded: bonus,
      penaltyDeducted: penalty,
      keywordAwarded,
      speedBonusAwarded: step === 'final_code' ? speedBonus : undefined,
      elapsedSeconds,
      newScore: totalScore,
    });

    return {
      updatedTeam,
      updatedState: state,
      bonusAwarded: bonus,
      penaltyDeducted: penalty,
      speedBonusAwarded: step === 'final_code' ? speedBonus : undefined,
      finalBonusAwarded: step === 'final_code' ? finalBonus : undefined,
    };
  }

  // ==================== LOGS ====================
  public static getLogs(): Round4Log[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUND4_LOGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public static recordLog(log: Round4Log): void {
    if (typeof window === 'undefined') return;
    try {
      const logs = this.getLogs();
      logs.unshift(log); // Add newest first
      // Keep last 300 logs
      const trimmed = logs.slice(0, 300);
      localStorage.setItem(STORAGE_KEYS.ROUND4_LOGS, JSON.stringify(trimmed));
    } catch {
      // Fallback
    }
  }

  public static clearLogs(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ROUND4_LOGS);
    }
  }
}
