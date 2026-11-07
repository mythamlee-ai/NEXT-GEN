import { Team, TeamAnswerRecord, RoundNumber, MysteryBoxEffect } from '../types';
import { storageService } from './storageService';
import { RandomEngine } from './randomEngine';
import { ScoringEngine } from './scoringEngine';
import { Round3Service } from './round3Service';

export class GameEngine {
  /**
   * Initializes or gets the questions assigned to the team for Round 1
   * Session persistence: Guarantees exact 9 questions are kept fixed on page refresh
   * Anti-repeat: Prioritizes questions not yet played by this team
   */
  public static getTeamRound1Questions(team: Team) {
    const allQuestions = storageService.getQuestions();

    // 1. Session Persistence check: If already assigned for this session, keep exact questions and order
    if (team.assignedQuestionsRound1 && team.assignedQuestionsRound1.length >= 9) {
      const map = new Map(allQuestions.map((q) => [q.id, q]));
      const list = team.assignedQuestionsRound1
        .map((id) => map.get(id))
        .filter((q): q is typeof allQuestions[0] => !!q);
      if (list.length >= 9) return { questions: list };
    }

    // 2. Anti-repeat check: Query questions already played by this team
    const history = storageService.getTeamQuestionHistory(team.id);
    const playedIds = new Set(history.map((h) => h.questionId));

    (team.answersHistory || []).forEach((ans) => {
      if (ans.questionId) playedIds.add(ans.questionId);
    });

    // 3. Select 3 Physics + 3 Chemistry + 3 Biology and shuffle sequence
    const seed = team.questionSeed || `${team.id}_${Date.now()}`;
    const { questions, warning } = RandomEngine.selectRound1Questions(allQuestions, seed, playedIds);

    const questionIds = questions.map((q) => q.id);

    // 4. Save to team state for session persistence
    const updatedTeam: Team = {
      ...team,
      assignedQuestionsRound1: questionIds,
    };
    storageService.saveTeam(updatedTeam);

    // 5. Record to TeamQuestionHistory
    const now = Date.now();
    const historyEntries = questionIds.map((qId) => ({
      teamId: team.id,
      questionId: qId,
      round: 1,
      playedAt: now,
    }));
    storageService.recordTeamQuestionHistory(historyEntries);

    return { questions, warning };
  }

  /**
   * Gets assigned teachers for Round 2:
   * Mỗi lượt chơi: Random ngẫu nhiên 2 giáo viên trong 10 giáo viên của ngân hàng
   */
  public static getTeamRound2Teachers(team: Team) {
    const allTeachers = storageService.getTeachers().filter((t) => t.active && !t.id.startsWith('tc-'));

    if (team.assignedTeachersRound2 && team.assignedTeachersRound2.length === 2) {
      // Discard any legacy tc-* ids
      const validAssigned = team.assignedTeachersRound2.filter((id) => !id.startsWith('tc-'));
      if (validAssigned.length === 2) {
        const map = new Map(allTeachers.map((t) => [t.id, t]));
        const list = validAssigned
          .map((id) => map.get(id))
          .filter((t): t is typeof allTeachers[0] => !!t);
        if (list.length === 2) return list;
      }
    }

    // Chọn ngẫu nhiên đúng 2 giáo viên cho lượt chơi này
    const selected = RandomEngine.selectRound2Teachers(
      allTeachers,
      team.questionSeed || team.id,
      2
    );
    const updatedTeam: Team = {
      ...team,
      assignedTeachersRound2: selected.map((t) => t.id),
    };
    storageService.saveTeam(updatedTeam);
    return selected;
  }

  /**
   * Gets assigned puzzles for Round 3:
   * Mỗi lượt chơi: Rút ngẫu nhiên 5 câu trong ngân hàng 40 câu ca dao tục ngữ
   * Lưu cố định bộ 5 câu theo team seed để không reroll khi reload trang
   */
  public static getTeamRound3Puzzles(team: Team) {
    const allPuzzles = storageService.getPuzzles().filter((p) => p.active);

    if (team.assignedPuzzlesRound3 && team.assignedPuzzlesRound3.length === 5) {
      const map = new Map(allPuzzles.map((p) => [p.id, p]));
      const list = team.assignedPuzzlesRound3
        .map((id) => map.get(id))
        .filter((p): p is typeof allPuzzles[0] => !!p);
      if (list.length === 5) return list;
    }

    const selected = Round3Service.selectTurnPuzzles(team, allPuzzles, 5);
    const updatedTeam: Team = {
      ...team,
      assignedPuzzlesRound3: selected.map((p) => p.id),
    };
    storageService.saveTeam(updatedTeam);
    return selected;
  }

  /**
   * Gets assigned final challenge for Round 4
   */
  public static getTeamRound4Challenge(team: Team) {
    const allChallenges = storageService.getChallenges();

    if (team.assignedChallengeRound4) {
      const found = allChallenges.find((c) => c.id === team.assignedChallengeRound4);
      if (found) return found;
    }

    const selected = RandomEngine.selectRound4Challenge(allChallenges, team.questionSeed);
    if (selected) {
      const updatedTeam: Team = {
        ...team,
        assignedChallengeRound4: selected.id,
      };
      storageService.saveTeam(updatedTeam);
    }
    return selected;
  }

  /**
   * Records an answer for the team, updates score and time, and persists
   */
  public static recordAnswer(
    team: Team,
    round: RoundNumber,
    questionId: string,
    selectedAnswer: string,
    isCorrect: boolean,
    pointsAwarded: number,
    timeTaken: number,
    hintsUsed?: number
  ): Team {
    const record: TeamAnswerRecord = {
      round,
      questionId,
      selectedAnswer,
      isCorrect,
      pointsAwarded,
      timeTaken,
      timestamp: Date.now(),
      hintsUsed,
    };

    const newScore = team.score + pointsAwarded;
    const newRoundScores = {
      ...team.roundScores,
      [round]: (team.roundScores[round] || 0) + pointsAwarded,
    };

    const newElapsedTime = team.elapsedTime + timeTaken;
    const newRoundTimes = {
      ...team.roundTimes,
      [round]: (team.roundTimes[round] || 0) + timeTaken,
    };

    const updatedTeam: Team = {
      ...team,
      score: newScore,
      roundScores: newRoundScores,
      elapsedTime: newElapsedTime,
      roundTimes: newRoundTimes,
      answersHistory: [...team.answersHistory, record],
      currentQuestionIndex: team.currentQuestionIndex + 1,
    };

    storageService.saveTeam(updatedTeam);
    return updatedTeam;
  }

  /**
   * Awards bonus points from scanning real secret QR codes at field stations
   */
  public static awardBonusPoints(team: Team, points: number, bonusCode: string): Team {
    const alreadyRedeemed = (team.bonusQRCodes || []).includes(bonusCode);
    if (alreadyRedeemed) return team;

    const updatedBonusList = [...(team.bonusQRCodes || []), bonusCode];
    const currentRound = team.currentRound || 4;
    const updatedTeam: Team = {
      ...team,
      score: team.score + points,
      roundScores: {
        ...team.roundScores,
        [currentRound]: (team.roundScores[currentRound] || 0) + points,
      },
      bonusQRCodes: updatedBonusList,
    };
    storageService.saveTeam(updatedTeam);
    return updatedTeam;
  }

  /**
   * Advances the team to the next round or finishes the game, unlocking keywords and treasures
   */
  public static advanceRound(team: Team): Team {
    const roundKeywords: Record<RoundNumber, string> = {
      1: 'LƯỢNG TỬ',
      2: 'NGUYÊN TỐ',
      3: 'TIẾN HÓA',
      4: 'VÔ ĐỊCH NEXT GEN',
    };
    const roundTreasureIds: Record<RoundNumber, string> = {
      1: 'treasure-r1',
      2: 'treasure-r2',
      3: 'treasure-r3',
      4: 'treasure-r4',
    };

    const currentKeyword = roundKeywords[team.currentRound];
    const currentTreasureId = roundTreasureIds[team.currentRound];

    const updatedKeywords = Array.from(new Set([...(team.collectedKeywords || []), currentKeyword]));
    const updatedTreasures = Array.from(new Set([...(team.collectedTreasures || []), currentTreasureId]));

    if (team.currentRound < 4) {
      const nextRound = (team.currentRound + 1) as RoundNumber;
      const updatedTeam: Team = {
        ...team,
        currentRound: nextRound,
        currentQuestionIndex: 0,
        status: 'playing',
        collectedKeywords: updatedKeywords,
        collectedTreasures: updatedTreasures,
      };
      storageService.saveTeam(updatedTeam);
      return updatedTeam;
    } else {
      // Game completed
      const updatedTeam: Team = {
        ...team,
        status: 'finished',
        completedAt: Date.now(),
        collectedKeywords: updatedKeywords,
        collectedTreasures: updatedTreasures,
      };
      storageService.saveTeam(updatedTeam);
      return updatedTeam;
    }
  }

  /**
   * VÒNG 4: VÒNG MAY MẮN – RANDOM CÁC ĐIỂM THƯỞNG (+5, +10, -5, -10, *2, :2)
   * Học sinh nhập mật mã xong sẽ hiện lên số điểm ngẫu nhiên (+5, +10, -5, -10, *2, :2)
   * tính trên tổng số điểm 3 vòng trước.
   */
  public static readonly ROUND_4_BONUS_POOL: Array<{
    effect: MysteryBoxEffect;
    name: string;
    description: string;
  }> = [
    { effect: '+10', name: '💎 Kim Cương PeK (+10)', description: 'CỘNG THÊM +10 ĐIỂM vào tổng điểm 3 vòng trước!' },
    { effect: '+5', name: '✨ Bụi Sao Tri Thức (+5)', description: 'CỘNG THÊM +5 ĐIỂM vào tổng điểm 3 vòng trước!' },
    { effect: '*2', name: '⚡ Vận May Nhân Đôi (*2)', description: 'NHÂN ĐÔI TOÀN BỘ ĐIỂM SỐ (*2) tích lũy từ 3 vòng trước!' },
    { effect: '-5', name: '⚠️ Cạm Bẫy Sương Mù (-5)', description: 'Thử thách trừ -5 ĐIỂM từ tổng điểm 3 vòng trước.' },
    { effect: '-10', name: '🌪️ Cơn Lốc Thử Thách (-10)', description: 'Thử thách trừ -10 ĐIỂM từ tổng điểm 3 vòng trước.' },
    { effect: ':2', name: '🌀 Hố Đen Hư Không (:2)', description: 'CHIA ĐÔI SỐ ĐIỂM HIỆN CÓ (:2) từ 3 vòng trước!' },
  ];

  public static getRandomRound4Effect(): {
    effect: MysteryBoxEffect;
    name: string;
    description: string;
  } {
    const pool = this.ROUND_4_BONUS_POOL;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  public static applyRound4MysteryBox(
    team: Team,
    codeStr: string,
    overrideEffect?: MysteryBoxEffect,
    customName?: string,
    customDesc?: string
  ): {
    team: Team;
    effect: MysteryBoxEffect;
    pointsDelta: number;
    baseScore: number;
    newTotalScore: number;
    codeName: string;
    description: string;
    solutionAnswer: string;
  } {
    const cleanCode = (codeStr || 'LUCKY-BOX').trim().toUpperCase();

    // 1. Tính tổng điểm của 3 vòng thi trước
    const baseScore =
      (team.roundScores[1] || 0) + (team.roundScores[2] || 0) + (team.roundScores[3] || 0);

    let effect: MysteryBoxEffect;
    let codeName = customName || 'Rương Báu May Mắn';
    let description = customDesc || 'Điểm thưởng ngẫu nhiên Vòng 4.';
    let solutionAnswer = 'Chúc mừng đội thi đã xuất sắc giải mã phong ấn kho báu khoa học Pétrus Ký!';

    const configuredCode = storageService.getMysteryCodeByCode(cleanCode);
    if (configuredCode?.solutionAnswer) {
      solutionAnswer = configuredCode.solutionAnswer;
    }

    if (overrideEffect) {
      effect = overrideEffect;
      const matched = this.ROUND_4_BONUS_POOL.find((b) => b.effect === overrideEffect);
      if (configuredCode) {
        codeName = configuredCode.name;
        description = customDesc || matched?.description || configuredCode.description;
      } else if (customName) {
        codeName = customName;
        description = customDesc || matched?.description || 'Phần thưởng bẻ khóa mật mã thành công.';
      } else if (matched) {
        codeName = `Mật Mã [${cleanCode}] - ${matched.name}`;
        description = matched.description;
      }
    } else {
      // Khi học sinh nhập mã: hệ thống random ngẫu nhiên 1 trong 6 hiệu ứng (+5, +10, -5, -10, *2, :2)
      const picked = this.getRandomRound4Effect();
      effect = picked.effect;
      if (configuredCode) {
        codeName = configuredCode.name;
        description = configuredCode.description || picked.description;
      } else {
        codeName = `Mật Mã [${cleanCode}]`;
        description = picked.description;
      }
    }

    // 2. Tính toán biến động điểm từ baseScore
    let newTotalScore: number;
    let pointsDelta: number;

    if (typeof effect === 'string' && effect.startsWith('+')) {
      const num = parseInt(effect.substring(1), 10) || 10;
      pointsDelta = num;
      newTotalScore = baseScore + num;
    } else if (typeof effect === 'string' && effect.startsWith('-')) {
      const num = parseInt(effect.substring(1), 10) || 5;
      pointsDelta = -num;
      newTotalScore = Math.max(0, baseScore - num);
    } else if (effect === '*2') {
      newTotalScore = baseScore * 2;
      pointsDelta = baseScore;
    } else if (effect === ':2') {
      newTotalScore = Math.round(baseScore / 2);
      pointsDelta = newTotalScore - baseScore;
    } else {
      pointsDelta = 10;
      newTotalScore = baseScore + 10;
    }

    // 3. Cập nhật thông tin đội thi
    const updatedTeam: Team = {
      ...team,
      score: newTotalScore,
      roundScores: {
        ...team.roundScores,
        4: pointsDelta,
      },
      round4MysteryCode: cleanCode,
      round4MysteryEffect: effect,
      round4BaseScore: baseScore,
      answersHistory: [
        ...team.answersHistory,
        {
          round: 4,
          questionId: cleanCode,
          selectedAnswer: effect,
          isCorrect: pointsDelta >= 0,
          pointsAwarded: pointsDelta,
          timeTaken: team.roundTimes[4] || 30,
          timestamp: Date.now(),
        },
      ],
    };

    storageService.saveTeam(updatedTeam);

    // 4. Lưu vào lịch sử mã của hệ thống (Game Master theo dõi)
    storageService.recordMysteryCodeClaim(
      cleanCode,
      team.id,
      team.teamName,
      pointsDelta,
      effect
    );

    return {
      team: updatedTeam,
      effect,
      pointsDelta,
      baseScore,
      newTotalScore,
      codeName,
      description,
      solutionAnswer,
    };
  }
}
