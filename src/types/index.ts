/**
 * Core Data Models & Types for PEK SCIENCE QUEST - THE FINAL CODE
 * Hành Trình Truy Tìm Kho Báu Khoa Học PeK
 */

export type Subject = 'physics' | 'chemistry' | 'biology' | 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'EASY' | 'MEDIUM';

export type RoundNumber = 1 | 2 | 3 | 4;

export type GameStatus = 'waiting' | 'in_progress' | 'paused' | 'completed';

export type TeamStatus = 'ready' | 'playing' | 'round_completed' | 'finished' | 'disqualified';

export type TreasureItemType = 'keyword' | 'key' | 'map_fragment' | 'artifact' | 'gem';

// Entity: Treasure Item (Vật phẩm kho báu thu thập được sau mỗi vòng)
export interface TreasureItem {
  id: string;
  round: RoundNumber;
  type: TreasureItemType;
  name: string;
  keyword: string;
  description: string;
  icon: string; // identifier: 'key' | 'map' | 'gem' | 'compass' | 'magnifier'
  badgeColor: string;
  unlocked: boolean;
}

// Entity 1: Team
export interface Team {
  id: string;
  teamCode: string; // e.g. "PEK-7F29"
  teamName: string;
  className: string; // e.g. "12A1", "11 Lý", "10A3"
  captainName: string; // Đội Trưởng
  members?: string[]; // Danh sách thành viên (tùy chọn)
  createdAt: number;
  currentRound: RoundNumber;
  status: TeamStatus;
  score: number;
  roundScores: Record<RoundNumber, number>;
  elapsedTime: number; // in seconds
  roundTimes: Record<RoundNumber, number>;
  completedAt?: number;
  answersHistory: TeamAnswerRecord[];
  currentQuestionIndex: number;
  // Seed for deterministic question selection per team
  questionSeed: string;
  assignedQuestionsRound1?: string[]; // IDs of 9 questions
  assignedTeachersRound2?: string[];   // IDs of teachers
  assignedPuzzlesRound3?: string[];    // IDs of puzzles
  assignedChallengeRound4?: string;    // ID of final challenge
  round4MysteryCode?: string;          // Mật mã nhận được Vòng 4
  round4MysteryEffect?: MysteryBoxEffect; // Hiệu ứng hộp quà: '+10' | '+5' | '-5' | '-10' | ':2' | '*2'
  round4BaseScore?: number;            // Điểm tổng của 3 vòng trước
  unlockedNextGenCodes?: string[];    // e.g. ['NEXTGEN-ALPHA', 'NEXTGEN-BETA', 'NEXTGEN-GAMMA', 'NEXTGEN-CHAMPION-2026']
  bonusQRCodes?: string[];            // Codes of scanned bonus QR stations
  unlockedKeywords?: string[];        // IDs of unlocked ScienceKeywords
  keywordScore?: number;              // Total points from collected keywords
  unlockedKeywordIds?: string[];      // IDs of unlocked keywords for quick lookup
  collectedKeywords?: string[];       // Legacy alias for unlockedKeywords
  collectedTreasures?: string[];      // IDs of collected round treasures
  cameraModeUsed?: 'qr' | 'vision' | 'manual';
  teamPhoto?: string;                 // Base64 captured photo of the whole team for certificate
  // Round 4 Futuristic AI Lab state & scores
  uniqueMissionSetId?: string;
  assignedPackageId?: string;
  round4State?: import('./round4').Round4TeamState;
  memberScores?: Record<string, number>; // Điểm cá nhân từng thành viên tại Vòng 2
  specialAwards?: string[]; // Danh hiệu phụ: MVP, Speed Master, Science Wizard, Best Team Synergy
  round4ScoreBreakdown?: {
    baseScore: number;
    randomBonus: number;
    randomPenalty: number;
    keywordScore: number;
    speedBonus: number;
    finalBonus: number;
    manualAdjustment?: number;
    totalScore: number;
  };
  updatedAt?: number;
  version?: number;
}

// Round 4 Mystery Box Luck Modifiers
export type MysteryBoxEffect =
  | '+30'
  | '+25'
  | '+20'
  | '+15'
  | '+10'
  | '+5'
  | '-5'
  | '-10'
  | ':2'
  | '*2';

export interface MysteryTreasureCode {
  id: string;
  code: string;               // Mật mã học sinh nhận được (VD: LUCKY-GOLD, NEXTGEN-CHAMPION)
  name: string;               // Tên rương / Hộp quà bí ẩn / Tên trạm
  solutionAnswer?: string;    // Đáp án khoa học / Nội dung giải mã trả về khi học sinh nhập mã này
  hint?: string;              // Gợi ý mật thư trạm
  effect: MysteryBoxEffect;   // Biến động điểm: '+10' | '+5' | '-5' | '-10' | ':2' | '*2'
  description: string;
  claimedByTeamId?: string;   // Đội đã nhập
  claimedByTeamName?: string;
  claimedAt?: number;
  pointsDelta?: number;       // Điểm cộng hoặc trừ thực tế
  active: boolean;
}

export interface TeamAnswerRecord {
  round: RoundNumber;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
  timeTaken: number; // in seconds
  timestamp: number;
  hintsUsed?: number;
}

// History of questions assigned to teams to avoid repeating questions across sessions
export interface TeamQuestionHistory {
  teamId: string;
  questionId: string;
  round: number;
  playedAt: number;
}

// Entity 2: Question (Round 1 - The Science Island / Science Code Breaker)
export interface Question {
  id: string; // P01-P30, C01-C30, B01-B30
  round: 1;
  subject: Subject;
  topic?: string;
  difficulty: Difficulty;
  type?: 'mcq';
  question: string;
  image?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  points: number;
  timeLimit: number; // in seconds
  effectHint?: string;
  active: boolean;
}

// Entity 3: Teacher (Round 2 - The Mystery Teacher: AI ĐÂY?)
export interface TeacherClueInfo {
  index: 1 | 2 | 3 | 4;
  title: string;
  clueText: string;
  points: number;
  answer: string;
  acceptedAnswers: string[];
}

export interface Teacher {
  id: string; // e.g. 'GV01', 'GV02', 'GV03'
  round: 2;
  name: string; // Full official name: e.g. 'NGUYEN MINH TIEN'
  displayName: string; // Friendly title: e.g. 'Thầy Tiến'
  subject: string; // HOA HOC, VAT LI
  department: string; // e.g. 'Tổ Khoa học Tự nhiên Pétrus Ký'
  grades?: string; // e.g. '10, 11, 12'
  homeroom?: string; // e.g. '11.1' or 'Không chủ nhiệm'
  characteristics?: string; // e.g. 'DOC TOAN THAN, DA TAI'
  image: string; // SVG data URI or image URL
  clues: [string, string, string, string]; // 4 progressive clues
  clueAnswers?: [string, string, string, string]; // Primary answer for clues 1-4
  clueAcceptedAnswers?: [string[], string[], string[], string[]]; // Accepted aliases for clues 1-4
  options?: string[]; // Optional for backward compatibility
  correctAnswer: string; // Teacher's exact name
  points: number; // Max total points for Round 2 (100 pts: 40 + 30 + 20 + 10)
  timeLimit: number; // in seconds
  active: boolean;
}

// Entity 4: Picture Puzzle (Round 3 - Đuổi Hình Bắt Chữ / Ca Dao Tục Ngữ Việt Nam)
export interface PicturePuzzle {
  id: string;
  round: 3;
  topic: string;
  type?: 'mcq' | 'text';
  image?: string; // fallback or legacy image
  question?: string;
  hint?: string;
  acceptedAliases?: string[];
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation?: string;
  points: number;
  timeLimit: number;
  active: boolean;
  // Gameshow proverb fields
  proverbNumber?: number;
  visualClues?: string[]; // Array of emoji/symbols e.g. ['🍎', '🙏', '👨‍🌾', '🌳']
  answer?: string; // Standard proverb answer
  acceptedAnswers?: string[]; // Accepted variations
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  usageCount?: number;
}

export interface Round3Config {
  timeLimitPerQuestion: number; // default 30s
  allowSteal: boolean;          // Bật/tắt cướp quyền
  autoLockOnTimeout: boolean;   // default true
  scoreScheme: {
    sec0to5: number;   // 100
    sec6to10: number;  // 80
    sec11to15: number; // 60
    sec16to20: number; // 40
    sec21to30: number; // 20
    timeout: number;   // 0
  };
}

export interface Round3AuditLog {
  id: string;
  timestamp: number;
  teamId: string;
  teamName: string;
  puzzleId: string;
  puzzleAnswer?: string;
  action:
    | 'AUTO_ANSWER'
    | 'GM_CORRECT_OVERRIDE'
    | 'GM_WRONG_OVERRIDE'
    | 'GM_ADJUST_SCORE'
    | 'GM_CHANGE_QUESTION'
    | 'GM_SKIP'
    | 'GM_REPLAY'
    | 'STEAL_ATTEMPT';
  oldScore?: number;
  newScore?: number;
  note: string;
}

// Entity 5: Challenge (Round 4 - The Final Treasure / QR Stations)
export interface Challenge {
  id: string;
  round: 4;
  title: string;
  type?: string;
  task: string;
  clueStory: string;
  expectedCode: string; // Target secret code
  qrTargetUrl?: string;
  secretArtifactName: string;
  points: number;
  timeLimit: number;
  active: boolean;
}

// Entity 6: Global Game Configuration
export interface GameConfig {
  gameName: string;
  tagline: string;
  organization: string;
  gameStatus: GameStatus;
  globalCurrentRound: RoundNumber;
  roundSettings: {
    1: { name: string; subtitle: string; timePerQuestion: number; totalQuestions: number; basePoints: number };
    2: { name: string; subtitle: string; timePerQuestion: number; totalTeachers: number; basePoints: number };
    3: { name: string; subtitle: string; timePerQuestion: number; totalPuzzles: number; basePoints: number };
    4: { name: string; subtitle: string; timeLimit: number; totalChallenges: number; basePoints: number };
  };
  scoringRules: {
    r1EasyPoints: number;
    r1MediumPoints: number;
    r1HardPoints: number;
    r2MaxPoints: number;
    r2HintPenalty: number;
    r3Points: number;
    r4Points: number;
  };
  difficultyDistribution: {
    easyPercent: number;
    mediumPercent: number;
    hardPercent: number;
  };
}

export type ActiveTab = 'player' | 'admin';
export type AdminTab = 'dashboard' | 'teams' | 'treasure' | 'keywords' | 'round3' | 'round4' | 'projector' | 'questions' | 'settings' | 'diagnostics';
export type QuestionBankTab = 'all' | 'physics' | 'chemistry' | 'biology' | 'teachers' | 'puzzles' | 'challenges';
export type PlayerSubView = 'game' | 'map' | 'leaderboard';

// ==================== SCIENCE KEYWORDS SYSTEM ====================
export type KeywordCategory = 'physics' | 'chemistry' | 'biology' | 'technology' | 'logic' | 'space' | 'special';

export interface ScienceKeyword {
  id: string;
  name: string;
  round: RoundNumber | 'secret';
  category: KeywordCategory;
  categoryLabel?: string;
  points: number;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 to 5 stars
  isSecret: boolean;
  description: string;
  hint?: string;
  active: boolean;
}

export type PlayerRankTitle = 
  | 'NEW EXPLORER'
  | 'SCIENCE EXPLORER'
  | 'SCIENCE MASTER'
  | 'SCIENCE HERO'
  | 'NEXT GEN CHAMPION';

export interface PlayerRank {
  rank: PlayerRankTitle;
  badge: string;
  color: string;
  glow: string;
  minPoints: number;
  maxPoints: number;
}

