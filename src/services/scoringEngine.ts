import { Team, TeamAnswerRecord } from '../types';

export class ScoringEngine {
  /**
   * Calculates points for a given question answer
   */
  public static calculateQuestionScore(
    basePoints: number,
    isCorrect: boolean,
    timeTaken: number,
    timeLimit: number
  ): number {
    if (!isCorrect) return 0;
    // Base score is guaranteed on correct
    let points = basePoints;
    // Fast answer bonus: if answered within first 25% of time limit, +2 bonus points
    if (timeTaken <= timeLimit * 0.25) {
      points += 2;
    }
    return points;
  }

  /**
   * Calculates points for Round 3: Đuổi Hình Bắt Chữ - Ca Dao Tục Ngữ
   * 0–5 giây: 100 điểm
   * 6–10 giây: 80 điểm
   * 11–15 giây: 60 điểm
   * 16–20 giây: 40 điểm
   * 21–30 giây: 20 điểm
   * Sai / hết giờ: 0 điểm
   */
  public static calculateRound3Score(timeTaken: number, isCorrect: boolean): number {
    if (!isCorrect) return 0;
    const rounded = Math.max(1, Math.round(timeTaken));
    if (rounded <= 5) return 100;
    if (rounded <= 10) return 80;
    if (rounded <= 15) return 60;
    if (rounded <= 20) return 40;
    if (rounded <= 30) return 20;
    return 0;
  }

  /**
   * Helper to describe score tier for Round 3
   */
  public static getRound3TierDescription(timeTaken: number): { tier: string; points: number; badgeColor: string } {
    const rounded = Math.max(1, Math.round(timeTaken));
    if (rounded <= 5) return { tier: 'Tốc Độ Sấm Sét (0-5s)', points: 100, badgeColor: 'from-amber-400 to-yellow-300' };
    if (rounded <= 10) return { tier: 'Phản Xạ Xuất Sắc (6-10s)', points: 80, badgeColor: 'from-emerald-400 to-teal-300' };
    if (rounded <= 15) return { tier: 'Nhạy Bén (11-15s)', points: 60, badgeColor: 'from-cyan-400 to-blue-300' };
    if (rounded <= 20) return { tier: 'Kiên Trì (16-20s)', points: 40, badgeColor: 'from-purple-400 to-pink-300' };
    if (rounded <= 30) return { tier: 'Về Đích Kịp Giờ (21-30s)', points: 20, badgeColor: 'from-indigo-400 to-slate-300' };
    return { tier: 'Hết Giờ / Quá 30s', points: 0, badgeColor: 'from-rose-500 to-red-600' };
  }

  /**
   * Calculates points for Round 2 Clue solving:
   * Clue 1: 40 điểm
   * Clue 2: 30 điểm
   * Clue 3: 20 điểm
   * Clue 4: 10 điểm
   */
  public static getRound2CluePoints(clueNumber: number): number {
    switch (clueNumber) {
      case 1:
        return 40;
      case 2:
        return 30;
      case 3:
        return 20;
      case 4:
        return 10;
      default:
        return 10;
    }
  }

  /**
   * Calculates points for Round 2 Teacher clue guessing (legacy support)
   */
  public static calculateTeacherScore(
    maxPoints: number,
    cluesOpenedCount: number,
    penaltyPerClue: number = 8
  ): number {
    const penalty = Math.max(0, (cluesOpenedCount - 1) * penaltyPerClue);
    return Math.max(10, maxPoints - penalty);
  }

  /**
   * Compares two teams for Leaderboard ranking:
   * 1. Higher total score
   * 2. Lower elapsed time
   * 3. Higher number of correct answers
   * 4. Earliest completion time
   */
  public static compareTeams(a: Team, b: Team): number {
    // 1. Total score (descending)
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // 2. Tiêu chí phụ 1: Điểm Vòng 4 cao hơn
    const r4A = a.roundScores[4] || 0;
    const r4B = b.roundScores[4] || 0;
    if (r4B !== r4A) {
      return r4B - r4A;
    }

    // 3. Tiêu chí phụ 2: Tổng số câu đúng cao hơn
    const aCorrect = a.answersHistory.filter((ans) => ans.isCorrect).length;
    const bCorrect = b.answersHistory.filter((ans) => ans.isCorrect).length;
    if (bCorrect !== aCorrect) {
      return bCorrect - aCorrect;
    }

    // 4. Tiêu chí phụ 3: Hoàn thành nhanh hơn (thời gian ít hơn)
    if (a.elapsedTime !== b.elapsedTime) {
      return a.elapsedTime - b.elapsedTime;
    }

    // 5. Earliest completedAt or createdAt
    const aTime = a.completedAt || a.createdAt;
    const bTime = b.completedAt || b.createdAt;
    return aTime - bTime;
  }

  /**
   * Formats seconds into MM:SS
   */
  public static formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  /**
   * Generates a unique Team Code e.g. "PEK-7F29"
   */
  public static generateTeamCode(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'PEK-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
