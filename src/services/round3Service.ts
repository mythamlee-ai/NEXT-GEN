import { PicturePuzzle, Team, Round3Config, Round3AuditLog } from '../types';
import { FORTY_OFFICIAL_PROVERBS, defaultProverbPuzzles, proverbToPicturePuzzle, Round3ProverbItem } from '../data/round3ProverbsData';
import { storageService } from './storageService';
import { ScoringEngine } from './scoringEngine';
import { validateProverbAnswer } from '../utils/answerNormalization';
import { PRNG } from './randomEngine';

export const defaultRound3Config: Round3Config = {
  timeLimitPerQuestion: 30,
  allowSteal: false,
  autoLockOnTimeout: true,
  scoreScheme: {
    sec0to5: 100,
    sec6to10: 80,
    sec11to15: 60,
    sec16to20: 40,
    sec21to30: 20,
    timeout: 0,
  },
};

const R3_KEYS = {
  CONFIG: 'pek_round3_config_v2',
  LOGS: 'pek_round3_audit_logs_v2',
  USED_IDS: 'pek_round3_used_question_ids_v2',
  STEAL_STATE: 'pek_round3_steal_state_v2',
};

export class Round3Service {
  /**
   * Get Round 3 configuration
   */
  public static getConfig(): Round3Config {
    if (typeof window === 'undefined') return defaultRound3Config;
    try {
      const raw = localStorage.getItem(R3_KEYS.CONFIG);
      return raw ? { ...defaultRound3Config, ...JSON.parse(raw) } : defaultRound3Config;
    } catch {
      return defaultRound3Config;
    }
  }

  /**
   * Save Round 3 configuration
   */
  public static saveConfig(cfg: Partial<Round3Config>): Round3Config {
    const updated = { ...this.getConfig(), ...cfg };
    if (typeof window !== 'undefined') {
      localStorage.setItem(R3_KEYS.CONFIG, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('PEK_ROUND3_CONFIG_UPDATED', { detail: updated }));
    }
    return updated;
  }

  /**
   * Get full 40 proverbs bank from storage or defaults
   */
  public static getProverbBank(): PicturePuzzle[] {
    const stored = storageService.getPuzzles();
    if (stored && stored.length >= 40 && stored.some((p) => p.visualClues && p.visualClues.length > 0)) {
      return stored;
    }
    // Seed with 40 official proverbs if not already populated
    storageService.savePuzzles(defaultProverbPuzzles);
    return defaultProverbPuzzles;
  }

  /**
   * Reset proverb bank back to 40 official proverbs
   */
  public static resetProverbBank(): PicturePuzzle[] {
    storageService.savePuzzles(defaultProverbPuzzles);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(R3_KEYS.USED_IDS);
    }
    return defaultProverbPuzzles;
  }

  /**
   * Get list of recently used question IDs across sessions/turns
   */
  public static getUsedQuestionIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(R3_KEYS.USED_IDS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Mark question IDs as used in cycling history
   */
  public static markQuestionsUsed(ids: string[]): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getUsedQuestionIds();
      const updated = Array.from(new Set([...existing, ...ids]));
      // If we have cycled through all 40 questions, clear history to start a new cycle
      const allActive = this.getProverbBank().filter((p) => p.active);
      if (updated.length >= allActive.length) {
        localStorage.setItem(R3_KEYS.USED_IDS, JSON.stringify(ids));
      } else {
        localStorage.setItem(R3_KEYS.USED_IDS, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Error saving used question IDs:', e);
    }
  }

  /**
   * Selects 5 random questions for a team turn:
   * - No duplicates within turn
   * - Avoids repeating questions across turns until full cycle of 40 is complete
   * - Deterministic based on team seed/id so reloads preserve the turn
   */
  public static selectTurnPuzzles(
    team: Team,
    allPuzzles: PicturePuzzle[],
    count: number = 5
  ): PicturePuzzle[] {
    const active = allPuzzles.filter((p) => p.active);
    if (active.length === 0) return [];

    const usedIds = new Set(this.getUsedQuestionIds());
    // Filter out already used questions in this cycle
    let candidatePool = active.filter((p) => !usedIds.has(p.id));

    // If remaining candidate pool has less than requested count, reset cycle
    if (candidatePool.length < count) {
      candidatePool = [...active];
      if (typeof window !== 'undefined') {
        localStorage.removeItem(R3_KEYS.USED_IDS);
      }
    }

    const prng = new PRNG((team.questionSeed || team.id) + '-r3-proverbs');
    const shuffled = prng.shuffle(candidatePool);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // Mark as used
    this.markQuestionsUsed(selected.map((p) => p.id));

    // Increment usageCount on selected puzzles
    this.incrementUsageCounts(selected.map((p) => p.id));

    return selected;
  }

  /**
   * Increment usage count for puzzles
   */
  private static incrementUsageCounts(ids: string[]): void {
    const bank = storageService.getPuzzles();
    let modified = false;
    const updated = bank.map((p) => {
      if (ids.includes(p.id)) {
        modified = true;
        return { ...p, usageCount: (p.usageCount || 0) + 1 };
      }
      return p;
    });
    if (modified) {
      storageService.savePuzzles(updated);
    }
  }

  /**
   * Strips secret answer fields from a puzzle before sending to Player view
   * Player ONLY receives visualClues and basic metadata.
   */
  public static sanitizeForPlayer(puzzle: PicturePuzzle): PicturePuzzle {
    return {
      id: puzzle.id,
      round: 3,
      topic: puzzle.topic,
      visualClues: puzzle.visualClues || [],
      difficulty: puzzle.difficulty || 'medium',
      timeLimit: puzzle.timeLimit || 30,
      points: puzzle.points || 100,
      active: puzzle.active,
      proverbNumber: puzzle.proverbNumber,
      category: puzzle.category || '',
      question: puzzle.question,
      hint: puzzle.hint,
      // Hide canonical answer and accepted aliases prior to submission
      correctAnswer: '',
      answer: '',
      acceptedAliases: [],
      acceptedAnswers: [],
      explanation: '',
    };
  }

  /**
   * Verifies player answer securely against canonical answer and accepted variants:
   * Returns verification result and calculated points based on speed.
   */
  public static verifyAnswer(
    puzzleId: string,
    userInput: string,
    timeTaken: number
  ): {
    isCorrect: boolean;
    pointsAwarded: number;
    canonicalAnswer: string;
    explanation: string;
    timeTaken: number;
    tierDescription: string;
  } {
    const bank = this.getProverbBank();
    const puzzle = bank.find((p) => p.id === puzzleId);

    if (!puzzle) {
      return {
        isCorrect: false,
        pointsAwarded: 0,
        canonicalAnswer: '',
        explanation: '',
        timeTaken,
        tierDescription: 'Không tìm thấy câu hỏi',
      };
    }

    const canonical = puzzle.answer || puzzle.correctAnswer;
    const accepted = puzzle.acceptedAnswers || puzzle.acceptedAliases || [];

    const isCorrect = validateProverbAnswer(userInput, canonical, accepted);
    const pointsAwarded = ScoringEngine.calculateRound3Score(timeTaken, isCorrect);
    const tier = ScoringEngine.getRound3TierDescription(timeTaken).tier;

    return {
      isCorrect,
      pointsAwarded,
      canonicalAnswer: canonical,
      explanation: puzzle.explanation || `Đáp án chính xác: "${canonical}"`,
      timeTaken,
      tierDescription: tier,
    };
  }

  /**
   * Audit Logs
   */
  public static getLogs(): Round3AuditLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(R3_KEYS.LOGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public static addAuditLog(log: Omit<Round3AuditLog, 'id' | 'timestamp'>): Round3AuditLog {
    const entry: Round3AuditLog = {
      ...log,
      id: 'r3-log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
    };
    if (typeof window !== 'undefined') {
      const existing = this.getLogs();
      const updated = [entry, ...existing].slice(0, 300);
      localStorage.setItem(R3_KEYS.LOGS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('PEK_ROUND3_LOGS_UPDATED', { detail: updated }));
    }
    return entry;
  }

  /**
   * Game Master Action: Manual Override Answer (Correct / Wrong)
   */
  public static overrideAnswer(
    team: Team,
    puzzleId: string,
    isCorrect: boolean,
    customPoints?: number,
    note?: string
  ): Team {
    const bank = this.getProverbBank();
    const puzzle = bank.find((p) => p.id === puzzleId);
    const puzzleAnswer = puzzle ? puzzle.answer || puzzle.correctAnswer : '';

    const points = customPoints !== undefined ? customPoints : (isCorrect ? 100 : 0);
    const oldScore = team.score;
    const newScore = Math.max(0, oldScore + points);

    // Update team answers history
    const updatedHistory = team.answersHistory.map((ans) => {
      if (ans.round === 3 && ans.questionId === puzzleId) {
        return {
          ...ans,
          isCorrect,
          pointsAwarded: points,
        };
      }
      return ans;
    });

    // If answer not yet recorded, append it
    const alreadyAnswered = updatedHistory.some((ans) => ans.round === 3 && ans.questionId === puzzleId);
    if (!alreadyAnswered) {
      updatedHistory.push({
        round: 3,
        questionId: puzzleId,
        selectedAnswer: isCorrect ? puzzleAnswer : 'GM_OVERRIDE_WRONG',
        isCorrect,
        pointsAwarded: points,
        timeTaken: 15,
        timestamp: Date.now(),
      });
    }

    const updatedTeam: Team = {
      ...team,
      score: newScore,
      answersHistory: updatedHistory,
    };

    storageService.saveTeam(updatedTeam);

    this.addAuditLog({
      teamId: team.id,
      teamName: team.teamName,
      puzzleId,
      puzzleAnswer,
      action: isCorrect ? 'GM_CORRECT_OVERRIDE' : 'GM_WRONG_OVERRIDE',
      oldScore,
      newScore,
      note: note || `Game Master xác nhận ${isCorrect ? 'ĐÚNG' : 'SAI'} (${points > 0 ? '+' : ''}${points} điểm)`,
    });

    window.dispatchEvent(new CustomEvent('PEK_ROUND3_OVERRIDE_EVENT', {
      detail: { teamId: team.id, puzzleId, isCorrect, points }
    }));

    return updatedTeam;
  }

  /**
   * Game Master Action: Change/Swap current question with an unused one
   */
  public static swapCurrentQuestion(team: Team, currentPuzzleId: string): { updatedTeam: Team; newPuzzle: PicturePuzzle } | null {
    const bank = this.getProverbBank();
    const active = bank.filter((p) => p.active);
    const assignedIds = new Set(team.assignedPuzzlesRound3 || []);
    
    // Pick an active puzzle not in current assigned list
    const candidate = active.find((p) => !assignedIds.has(p.id));
    if (!candidate) return null;

    const newAssigned = (team.assignedPuzzlesRound3 || []).map((id) => (id === currentPuzzleId ? candidate.id : id));
    const updatedTeam: Team = {
      ...team,
      assignedPuzzlesRound3: newAssigned,
    };
    storageService.saveTeam(updatedTeam);

    this.addAuditLog({
      teamId: team.id,
      teamName: team.teamName,
      puzzleId: candidate.id,
      puzzleAnswer: candidate.answer || candidate.correctAnswer,
      action: 'GM_CHANGE_QUESTION',
      note: `Game Master đổi câu "${currentPuzzleId}" sang câu mới #${candidate.proverbNumber}: "${candidate.answer}"`,
    });

    window.dispatchEvent(new CustomEvent('PEK_ROUND3_QUESTION_SWAPPED', {
      detail: { teamId: team.id, oldId: currentPuzzleId, newPuzzle: candidate }
    }));

    return { updatedTeam, newPuzzle: candidate };
  }

  /**
   * Game Master Action: Skip question
   */
  public static skipQuestion(team: Team, currentPuzzleId: string): Team {
    const bank = this.getProverbBank();
    const puzzle = bank.find((p) => p.id === currentPuzzleId);

    const updatedHistory = [
      ...team.answersHistory.filter((a) => !(a.round === 3 && a.questionId === currentPuzzleId)),
      {
        round: 3 as const,
        questionId: currentPuzzleId,
        selectedAnswer: 'GM_SKIPPED',
        isCorrect: false,
        pointsAwarded: 0,
        timeTaken: 30,
        timestamp: Date.now(),
      },
    ];

    const updatedTeam: Team = {
      ...team,
      currentQuestionIndex: team.currentQuestionIndex + 1,
      answersHistory: updatedHistory,
    };

    storageService.saveTeam(updatedTeam);

    this.addAuditLog({
      teamId: team.id,
      teamName: team.teamName,
      puzzleId: currentPuzzleId,
      puzzleAnswer: puzzle?.answer || puzzle?.correctAnswer,
      action: 'GM_SKIP',
      note: `Game Master bỏ qua câu hỏi #${puzzle?.proverbNumber || ''}`,
    });

    window.dispatchEvent(new CustomEvent('PEK_ROUND3_QUESTION_SKIPPED', {
      detail: { teamId: team.id, puzzleId: currentPuzzleId }
    }));

    return updatedTeam;
  }

  /**
   * Game Master Action: Adjust score
   */
  public static adjustTeamScore(team: Team, delta: number, reason: string): Team {
    const oldScore = team.score;
    const newScore = Math.max(0, oldScore + delta);

    const updatedTeam: Team = {
      ...team,
      score: newScore,
    };

    storageService.saveTeam(updatedTeam);

    this.addAuditLog({
      teamId: team.id,
      teamName: team.teamName,
      puzzleId: 'MANUAL_SCORE_ADJUST',
      action: 'GM_ADJUST_SCORE',
      oldScore,
      newScore,
      note: `${delta >= 0 ? '+' : ''}${delta} điểm: ${reason}`,
    });

    return updatedTeam;
  }

  /**
   * Steal privilege state (Cướp quyền trả lời)
   */
  public static setStealPrivilege(teamId: string | null): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(R3_KEYS.STEAL_STATE, JSON.stringify({ teamId, timestamp: Date.now() }));
      window.dispatchEvent(new CustomEvent('PEK_ROUND3_STEAL_CHANGED', { detail: { teamId } }));
    }
  }

  public static getStealPrivilege(): { teamId: string | null; timestamp: number } | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(R3_KEYS.STEAL_STATE);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
