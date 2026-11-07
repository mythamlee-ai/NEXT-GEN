import { Question, Teacher, PicturePuzzle, Challenge, Subject } from '../types';

/**
 * Seeded PRNG (Linear Congruential Generator / Mulberry32)
 * Ensures reproducible pseudo-random selection per team code or seed string
 */
export class PRNG {
  private state: number;

  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    this.state = Math.abs(hash) || 123456789;
  }

  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

export class RandomEngine {
  /**
   * Selects 9 questions for Round 1:
   * Bước 1: 3 câu từ PHYSICS
   * Bước 2: 3 câu từ CHEMISTRY
   * Bước 3: 3 câu từ BIOLOGY
   * Tổng: 9 câu.
   * Ưu tiên câu chưa từng xuất hiện với team đó (Anti-repeat).
   * Sau đó shuffle thứ tự 9 câu để người chơi không biết câu nào thuộc môn nào.
   */
  public static selectRound1Questions(
    allQuestions: Question[],
    seed: string,
    playedQuestionIds?: Set<string>
  ): { questions: Question[]; warning?: string } {
    const prng = new PRNG(seed);
    const activeQuestions = allQuestions.filter((q) => q.active);

    const subjects = ['PHYSICS', 'CHEMISTRY', 'BIOLOGY'] as const;
    const chosen: Question[] = [];
    const warnings: string[] = [];

    subjects.forEach((subj) => {
      // Find all active questions for this subject (case insensitive)
      const subjectPool = activeQuestions.filter(
        (q) => q.subject.toUpperCase() === subj
      );

      if (subjectPool.length < 3) {
        warnings.push(`Kho câu hỏi môn ${subj} chỉ có ${subjectPool.length}/3 câu khả dụng.`);
      }

      // Filter out questions already played by this team
      let availablePool = playedQuestionIds
        ? subjectPool.filter((q) => !playedQuestionIds.has(q.id))
        : [...subjectPool];

      // If available unplayed questions are fewer than 3, reset cycle for this subject
      if (availablePool.length < 3) {
        availablePool = [...subjectPool];
      }

      // Shuffle available pool with seeded PRNG
      const shuffled = prng.shuffle(availablePool);

      // Pick distinct 3 questions from this subject
      const selectedForSubject = shuffled.slice(0, 3);

      chosen.push(...selectedForSubject);
    });

    // Shuffle the sequence so subjects alternate excitingly for the player
    const shuffledSequence = prng.shuffle(chosen);

    return {
      questions: shuffledSequence,
      warning: warnings.length > 0 ? warnings.join(' | ') : undefined,
    };
  }

  /**
   * Selects teachers for Round 2:
   * Mỗi lượt chơi chọn ngẫu nhiên 2 câu trong tổng số câu (10 giáo viên trong ngân hàng)
   */
  public static selectRound2Teachers(
    allTeachers: Teacher[],
    seed: string,
    count: number = 2,
    previousTeacherId?: string
  ): Teacher[] {
    const prng = new PRNG(seed + '-r2');
    // Ensure legacy tc-* teachers are completely excluded
    const active = allTeachers.filter(
      (t) => t.active && !t.id.startsWith('tc-')
    );

    if (active.length === 0) return [];

    let candidates = active;
    if (previousTeacherId && active.length > 2) {
      const withoutPrev = active.filter((t) => t.id !== previousTeacherId);
      if (withoutPrev.length >= 2) {
        candidates = withoutPrev;
      }
    }

    const shuffled = prng.shuffle(candidates);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Selects puzzles for Round 3:
   * Mỗi lượt chọn random ngẫu nhiên 3 câu hỏi trong ngân hàng câu hỏi
   */
  public static selectRound3Puzzles(
    allPuzzles: PicturePuzzle[],
    seed: string,
    count: number = 3
  ): PicturePuzzle[] {
    const prng = new PRNG(seed + '-r3');
    const active = allPuzzles.filter((p) => p.active);
    const shuffled = prng.shuffle(active);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Selects final challenge for Round 4
   */
  public static selectRound4Challenge(
    allChallenges: Challenge[],
    seed: string
  ): Challenge | null {
    const prng = new PRNG(seed + '-r4');
    const active = allChallenges.filter((c) => c.active);
    if (active.length === 0) return null;
    const shuffled = prng.shuffle(active);
    return shuffled[0];
  }
}
