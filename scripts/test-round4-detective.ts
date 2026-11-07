/**
 * Test script verifying Round 4 "AI DETECTIVE – GIẢI MÃ KHO BÁU TRI ÂN"
 */

// Mock browser environment for node execution
const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) || null,
  setItem: (key: string, val: string) => storageMap.set(key, val),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};

(global as any).window = {
  localStorage: mockLocalStorage,
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
};
(global as any).localStorage = mockLocalStorage;
(global as any).CustomEvent = class CustomEvent {
  type: string;
  detail: any;
  constructor(type: string, params: any = {}) {
    this.type = type;
    this.detail = params.detail;
  }
};

import { Round4Engine } from '../src/services/round4Engine';
import { keywordService } from '../src/services/keywordService';
import { storageService } from '../src/services/storageService';
import { Team } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('--- TEST 1: Question & Pair Banks ---');
  const questions = Round4Engine.getAIDetectiveQuestions();
  assert(questions.length >= 8, `Expected at least 8 AI Detective questions, got ${questions.length}`);
  
  const pairs = Round4Engine.getBackupMatchingPairs();
  assert(pairs.length === 5, `Expected exactly 5 backup matching pairs for 20/11, got ${pairs.length}`);
  assert(pairs.some(p => p.leftTitle.includes('Hoa tươi')), 'Contains Hoa tươi pair');
  assert(pairs.some(p => p.leftTitle.includes('Người thầy')), 'Contains Người thầy pair');

  console.log('\n--- TEST 2: Secret Keyword TRI ÂN ---');
  const keywords = keywordService.getKeywords();
  const sec04 = keywords.find(k => k.id === 'kw-sec-04');
  assert(!!sec04, 'kw-sec-04 exists');
  assert(sec04?.name === 'TRI ÂN', `kw-sec-04 name is "TRI ÂN", got: "${sec04?.name}"`);

  console.log('\n--- TEST 3: AI Detective Question Flow & Mandatory Feedback ---');
  const testTeam: Team = {
    id: 'team-test-01',
    teamCode: 'TEST01',
    teamName: 'Đội Test AI',
    captainName: 'A',
    members: ['A', 'B'],
    className: '10A1',
    score: 0,
    roundScores: { 1: 50, 2: 50, 3: 50, 4: 0 },
    currentRound: 4,
    status: 'playing',
    elapsedTime: 0,
    createdAt: Date.now(),
    roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
    answersHistory: [],
    currentQuestionIndex: 0,
    questionSeed: 'seed-123',
    unlockedKeywordIds: [],
    unlockedKeywords: [],
  };
  storageService.saveTeam(testTeam);

  const q1 = questions[0];
  const rightOption = q1.correctOptionId;
  const wrongOption = q1.options.find(o => o.id !== rightOption)!.id;

  // Answer correctly
  const res1 = Round4Engine.recordAIDetectiveAnswer(testTeam, q1.id, rightOption, 25);
  assert(res1.isCorrect === true, 'Correct option identified as correct');
  assert(res1.pointsAwarded === 30, `Awarded 30 points, got ${res1.pointsAwarded}`);
  assert(res1.question.aiFlawExplanation.length > 20, 'Has detailed "AI sai ở đâu?" explanation');
  assert(res1.question.scientificTruth.length > 20, 'Has detailed "Kiến thức chính xác" explanation');
  assert(res1.updatedState.aiDetectiveAnswers?.[q1.id]?.isCorrect === true, 'State recorded correct answer');

  // Answer next question incorrectly
  const q2 = questions[1];
  const q2WrongOption = q2.options.find(o => o.id !== q2.correctOptionId)!.id;
  const res2 = Round4Engine.recordAIDetectiveAnswer(res1.updatedTeam, q2.id, q2WrongOption, 45);
  assert(res2.isCorrect === false, 'Wrong option identified as incorrect');
  assert(res2.pointsAwarded === 0, 'No points awarded for wrong answer');
  assert(res2.question.correctAnswerText.length > 10, 'Has "Đáp án đúng" content');
  assert(res2.question.aiFlawExplanation.includes('chuyển pha nhiệt động học'), 'Detailed thermodynamic flaw identified');

  console.log('\n--- TEST 4: Final Keyword Verification (TRI ÂN Normalization) ---');
  let currentTeam = res2.updatedTeam;
  const wrongKwRes = Round4Engine.verifyFinalKeyword(currentTeam, 'SAI ROI', 60);
  assert(wrongKwRes.isCorrect === false, 'Wrong keyword rejected');
  assert(wrongKwRes.attemptsLeft === 2, `Attempts left decremented to 2, got ${wrongKwRes.attemptsLeft}`);

  // Test various acceptable formats of "TRI ÂN"
  const variations = ['TRI ÂN', 'tri an', '  Tri Ân  ', 'TrI An'];
  for (const variant of variations) {
    const isNormalizedMatch = (Round4Engine as any).normalizeAnswer(variant) === (Round4Engine as any).normalizeAnswer('TRI ÂN');
    assert(isNormalizedMatch, `Variant "${variant}" matches TRI ÂN normalization`);
  }

  // Submit correct keyword
  const correctKwRes = Round4Engine.verifyFinalKeyword(wrongKwRes.updatedTeam, 'tri an', 120);
  assert(correctKwRes.isCorrect === true, 'Accent-less "tri an" accepted as correct!');
  assert(correctKwRes.updatedState.keywordSolved === true, 'keywordSolved marked true');
  assert(correctKwRes.updatedState.keywordScore === 100, 'Awarded 100 bonus points for TRI ÂN');
  assert(correctKwRes.updatedTeam.roundScores[4] === 30 + 100, `Round 4 total is 130, got ${correctKwRes.updatedTeam.roundScores[4]}`);

  console.log('\n--- TEST 5: Backup Mission & Anti-Duplicate Scoring Rule ---');
  const backupTeam: Team = {
    id: 'team-backup-02',
    teamCode: 'TEST02',
    teamName: 'Đội Thử Nghiệm Backup',
    captainName: 'C',
    members: ['C', 'D'],
    className: '10A2',
    score: 0,
    roundScores: { 1: 50, 2: 50, 3: 50, 4: 0 },
    currentRound: 4,
    status: 'playing',
    elapsedTime: 0,
    createdAt: Date.now(),
    roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
    answersHistory: [],
    currentQuestionIndex: 0,
    questionSeed: 'seed-456',
    unlockedKeywordIds: [],
    unlockedKeywords: [],
  };
  storageService.saveTeam(backupTeam);

  // Fail 3 times
  let t = backupTeam;
  let lastRes: any = null;
  for (let i = 0; i < 3; i++) {
    lastRes = Round4Engine.verifyFinalKeyword(t, `WRONG_${i}`, 30);
    t = lastRes.updatedTeam;
  }
  const failedState = Round4Engine.getTeamState(t.id)!;
  assert(failedState.keywordAttempts === 3, `3 attempts used, got ${failedState.keywordAttempts}`);
  assert(lastRes.attemptsLeft === 0, 'Attempts left is 0');
  assert(lastRes.canSwitchToBackup === true, 'canSwitchToBackup is true after 3 failures');

  // Switch to backup mission
  const switched = Round4Engine.switchToBackupMission(t.id);
  assert(switched === true, 'Successfully switched to backup_matching');
  const switchedState = Round4Engine.getTeamState(t.id)!;
  assert(switchedState.currentStep === 'backup_matching', 'Current step is backup_matching');

  // Match all 5 pairs
  for (const pair of pairs) {
    const matchRes = Round4Engine.recordBackupPairMatch(t, pair.id, 45);
    t = matchRes.updatedTeam;
  }
  const finalBackupState = Round4Engine.getTeamState(t.id)!;
  assert(finalBackupState.backupPairsMatched?.length === 5, 'All 5 pairs matched');
  assert(finalBackupState.backupScore === 50, `Backup score is 50, got ${finalBackupState.backupScore}`);
  assert(t.roundScores[4] === 50, `Team R4 score from backup is 50, got ${t.roundScores[4]}`);

  // Test mutual exclusivity in calculateRound4Only
  const testExclusivityState = {
    ...finalBackupState,
    keywordSolved: true,
    keywordScore: 100,
    backupScore: 50,
  };
  const r4ScoreExclusivity = Round4Engine.calculateRound4Only(testExclusivityState as any);
  assert(r4ScoreExclusivity === 100, `Mutual exclusivity enforced: 100 bonus overrides backup 50, got ${r4ScoreExclusivity}`);

  console.log('\n🎉 ALL ROUND 4 AI DETECTIVE & TRI ÂN TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
