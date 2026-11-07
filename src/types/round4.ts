import { RoundNumber } from './index';

export type ScienceCoreType = 'physics' | 'chemistry' | 'biology' | 'ai_tech';

export type Round4MissionStep =
  | 'ai_detective'       // Nhiệm vụ 1: AI Detective - Phát hiện và sửa lỗi AI
  | 'final_keyword'      // Nhiệm vụ 2: Final Keyword - Giải mã từ khóa tối mật TRI ÂN
  | 'backup_matching'    // Nhiệm vụ 3: Backup Mission - Ghép nối Tri Ân (nếu không giải được từ khóa)
  | 'treasure_ceremony'  // Màn hình kết thúc: Kho báu giải mã & Tri ân Ngày Nhà giáo Việt Nam 20/11
  // Legacy steps for full compatibility:
  | 'ai_scan'
  | 'ai_error_detector'
  | 'science_crossover'
  | 'ai_data_lab'
  | 'keyword_vault'
  | 'keyword_decrypt'
  | 'final_code'
  | 'system_restored';

export interface AIDetectiveQuestion {
  id: string;
  title: string;
  field: 'Vật Lí' | 'Hóa Học' | 'Sinh Học' | 'Khoa Học & Đời Sống' | 'AI & Công Nghệ';
  aiClaim: string; // Nhận định của AI (có chứa lỗi sai khoa học)
  questionText: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctOptionId: string;
  correctAnswerText: string; // Nội dung đáp án đúng
  aiFlawExplanation: string; // AI sai ở đâu? (Chỉ ra lỗi cụ thể)
  scientificTruth: string; // Kiến thức chính xác (Giải thích khoa học ngắn gọn, dễ hiểu)
  points: number; // Mặc định 25 - 30 điểm
  timeLimitSeconds?: number;
}

export interface BackupMatchingPair {
  id: string;
  leftId: string;
  leftTitle: string;
  leftIcon: string;
  leftDescription: string;
  rightId: string;
  rightTitle: string;
  rightDescription: string;
  meaning: string;
}

export type DecryptMiniGameType =
  | 'sort'
  | 'science_connection'
  | 'word_matrix'
  | 'logic_combination'
  | 'image_association'
  | 'ai_error'
  | 'science_network';

export type Round4Difficulty = 'STANDARD' | 'ADVANCED' | 'FINAL_BOSS';

export interface ScanTarget {
  id: string;
  label: string;
  value: string;
  isAnomaly: boolean;
  frequency: string;
  wavelength?: string;
  description: string;
}

export interface AIScanMission {
  title: string;
  core: ScienceCoreType;
  prompt: string;
  systemTelemetry: string;
  scanTargets: ScanTarget[];
  correctTargetId: string;
  explanation: string;
  visualGraphic: string; // Type of animated SVG/Canvas diagram to render
}

export interface AIErrorDetectorMission {
  title: string;
  core: ScienceCoreType;
  simulationTopic: string;
  aiSimulationText: string;
  bugDescription: string;
  options: {
    id: string;
    text: string;
    isFlaw: boolean;
  }[];
  correctOptionId: string;
  patchExplanation: string;
}

export interface ScienceCrossoverMission {
  title: string;
  coresInvolved: ScienceCoreType[];
  scenario: string;
  scientificDilemma: string;
  options: {
    id: string;
    text: string;
    reasoning: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface AIDataLabMission {
  title: string;
  core: ScienceCoreType;
  datasetName: string;
  chartType: 'spectrum' | 'kinetics' | 'decay' | 'neural_loss' | 'titration';
  dataPoints: { x: number | string; y: number; label?: string }[];
  question: string;
  inputUnit: string;
  options?: { id: string; text: string }[];
  correctOptionId?: string;
  numericalTarget?: number;
  numericalTolerance?: number;
  explanation: string;
}

export interface KeywordPuzzle {
  type: DecryptMiniGameType;
  title: string;
  instruction: string;
  keysUsed: string[]; // e.g. ['KHOA HỌC', 'SÁNG TẠO', 'CHINH PHỤC']
  // Configuration depending on mini-game type
  sortItems?: { id: string; text: string; correctOrder: number }[];
  connectionPairs?: { id: string; left: string; right: string; category: string }[];
  matrixGrid?: string[][]; // 4x4 or 5x5 character grid
  matrixTargetWords?: string[];
  logicGates?: { id: string; name: string; inputs: number[]; expectedOutput: number }[];
  finalKeyword: string; // e.g. 'NEXT GEN'
  explanation: string;
}

export interface Round4Package {
  id: string;
  packageNumber: number;
  title: string;
  codeName: string;
  theme: string;
  description: string;
  aiScan: AIScanMission;
  aiErrorDetector: AIErrorDetectorMission;
  scienceCrossover: ScienceCrossoverMission;
  aiDataLab: AIDataLabMission;
  keywordPuzzle: KeywordPuzzle;
  finalCode: {
    code: string;
    hint: string;
    systemChecksum: string;
  };
  active: boolean;
}

export interface Round4TeamState {
  teamId: string;
  assignedPackageId: string;
  uniqueMissionSetId: string;
  randomSeed: string;
  currentStep: Round4MissionStep;
  // Keyword Vault Gate (V1, V2, V3 Padlocks)
  keywordVaultUnlocked?: boolean;
  clueFragments?: string[];
  // Selected signal target in Step 1
  selectedScanTargetId?: string;
  scanVerifiedBy?: 'PLAYER' | 'GAME_MASTER';
  scanVerifiedAt?: number;
  // Step completion status
  aiScanCompleted: boolean;
  aiScanResult?: {
    isCorrect: boolean;
    bonus: number;
    penalty: number;
    answer: string;
    verifiedBy?: 'PLAYER' | 'GAME_MASTER';
    verifiedAt?: number;
  };
  aiErrorCompleted: boolean;
  aiErrorResult?: { isCorrect: boolean; bonus: number; penalty: number; answer: string };
  crossoverCompleted: boolean;
  crossoverResult?: { isCorrect: boolean; bonus: number; penalty: number; answer: string };
  dataLabCompleted: boolean;
  dataLabResult?: { isCorrect: boolean; bonus: number; penalty: number; answer: string };
  keywordDecryptCompleted: boolean;
  keywordDecryptResult?: { isCorrect: boolean; finalKeyword: string };
  finalCodeCompleted: boolean;
  finalCodeResult?: { isCorrect: boolean; finalBonus: number; enteredCode: string };
  // Financial score breakdown
  baseScore: number;
  randomBonus: number;
  randomPenalty: number;
  keywordScore: number;
  speedBonus: number;
  finalBonus: number;
  // --- AI DETECTIVE & TRI ÂN THEME (ROUND 4) ---
  aiDetectiveScore?: number;
  aiDetectiveAnswers?: Record<
    string,
    {
      questionId: string;
      selectedOptionId: string;
      isCorrect: boolean;
      pointsAwarded: number;
      answeredAt: number;
    }
  >;
  aiDetectiveCompleted?: boolean;
  currentQuestionIndex?: number;
  // Mission 2: Final Keyword (TRI ÂN)
  keywordAttempts?: number;
  maxKeywordAttempts?: number;
  keywordSolved?: boolean;
  // Mission 3: Backup Mission
  backupCompleted?: boolean;
  backupPairsMatched?: string[];
  backupScore?: number;
  // Manual adjustments
  manualAdjustment?: number;
  round4Total: number;
  startTime: number;
  completedTime?: number;
  elapsedSeconds: number;
  manualAdjustmentsLog?: { id: string; timestamp: number; delta: number; reason: string }[];
}

export interface Round4Log {
  id: string;
  timestamp: number;
  teamId: string;
  teamName: string;
  packageId: string;
  step: Round4MissionStep;
  questionTitle: string;
  userAnswer: string;
  isCorrect: boolean;
  bonusAwarded: number;
  penaltyDeducted: number;
  keywordAwarded?: string;
  speedBonusAwarded?: number;
  elapsedSeconds: number;
  newScore: number;
}

export interface Round4Config {
  baseTimeLimitSeconds: number; // default 300 (5 minutes), range 180 - 420
  difficulty: Round4Difficulty;
  maxKeywordAttempts: number; // default 3
  aiDetectivePointsPerQuestion: number; // default 30
  bonusValues: number[]; // [10, 20, 30, 50]
  penaltyValues: number[]; // [5, 10, 15, 20]
  speedBonusTable: {
    under2Min: number; // +40
    under3Min: number; // +30
    under4Min: number; // +20
    under4m30s: number; // +10
    over4m30s: number; // 0
  };
  finalCodeBonus: number; // default +100
  keywordDecryptBonus: number; // default +50
  animationDurationMs: number; // default 2200
  audioEnabled: boolean;
}
