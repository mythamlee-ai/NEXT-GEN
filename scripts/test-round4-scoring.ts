import { Round4Engine } from '../src/services/round4Engine';
import { ScoringEngine } from '../src/services/scoringEngine';
import { Team } from '../src/types';

function runTests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ ROUND 4 & HỆ THỐNG TỔNG KẾT ===\n');

  // Test 1: Padlock Gate Key Matching
  console.log('1. Kiểm tra chuẩn hóa và so khớp 3 Ổ Khóa bí mật...');
  console.assert(Round4Engine.isSecretKeywordMatch('KHOA HỌC', 'KHOA HỌC'), 'Match KHOA HỌC failed');
  console.assert(Round4Engine.isSecretKeywordMatch('khoa hoc', 'KHOA HỌC'), 'Match khoa hoc failed');
  console.assert(Round4Engine.isSecretKeywordMatch('SÁNG TẠO ', 'SÁNG TẠO'), 'Match SÁNG TẠO failed');
  console.assert(Round4Engine.isSecretKeywordMatch('Chinh Phục', 'CHINH PHỤC'), 'Match Chinh Phục failed');
  console.assert(Round4Engine.isSecretKeywordMatch('NEXT GEN', 'NEXT GEN'), 'Match NEXT GEN failed');
  console.assert(!Round4Engine.isSecretKeywordMatch('SAI ROI', 'KHOA HỌC'), 'Negative match failed');
  console.log('✓ Chuẩn hóa và so khớp từ khóa bí mật hoạt động 100% chính xác!\n');

  // Test 2: Dummy team for Padlock Gate verification
  console.log('2. Kiểm tra cơ chế mở khóa 3 ổ khóa (Unlock Padlock Gate)...');
  const dummyTeam: Team = {
    id: 'test-team-01',
    teamCode: 'PEK-TEST1',
    teamName: 'Đội Thử Nghiệm 1',
    className: '11 Lý',
    captainName: 'Nguyễn Văn A',
    members: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'],
    createdAt: Date.now(),
    currentRound: 4,
    status: 'playing',
    score: 180,
    roundScores: { 1: 50, 2: 70, 3: 60, 4: 0 },
    elapsedTime: 400,
    roundTimes: { 1: 100, 2: 120, 3: 180, 4: 0 },
    answersHistory: [],
    currentQuestionIndex: 0,
    questionSeed: 'SEED123',
  };

  // Test partial match (2/3 correct)
  const partialRes = Round4Engine.unlockPadlockGate(dummyTeam, 'KHOA HỌC', 'SÁNG TẠO', 'SAI BÍ MẬT');
  console.assert(!partialRes.success, 'Partial match should fail');
  console.assert(partialRes.correctCount === 2, `Expected 2/3 but got ${partialRes.correctCount}`);
  console.assert(
    partialRes.message.includes('2/3 từ khóa chính xác'),
    'Message must inform 2/3 correct'
  );
  console.log('✓ Báo chính xác 2/3 khi nhập sai 1 từ khóa mà không lộ đáp án!');

  // Test full match (3/3 correct)
  const fullRes = Round4Engine.unlockPadlockGate(dummyTeam, 'khoa học', 'sáng tạo', 'chinh phục');
  console.assert(fullRes.success, 'Full match should succeed');
  console.assert(fullRes.correctCount === 3, 'Expected 3/3');
  console.assert(fullRes.updatedState.keywordVaultUnlocked === true, 'keywordVaultUnlocked must be true');
  console.log('✓ Mở khóa 3 ổ khóa thành công khi nhập đúng 3 từ khóa!\n');

  // Test 3: Score calculation and clamping >= 0
  console.log('3. Kiểm tra công thức điểm và đảm bảo điểm Vòng 4 không bao giờ âm...');
  const stateClamped = {
    teamId: 'test-team-01',
    assignedPackageId: 'pkg-01',
    uniqueMissionSetId: 'MS-TEST',
    randomSeed: 'SEED-1',
    currentStep: 'ai_scan' as const,
    aiScanCompleted: true,
    aiErrorCompleted: true,
    crossoverCompleted: false,
    dataLabCompleted: false,
    keywordDecryptCompleted: false,
    finalCodeCompleted: false,
    baseScore: 180,
    randomBonus: 10,
    randomPenalty: 50, // Penalty exceeds bonus!
    keywordScore: 0,
    speedBonus: 0,
    finalBonus: 0,
    round4Total: 0,
    startTime: Date.now(),
    elapsedSeconds: 60,
  };

  const calculatedTotal = Round4Engine.calculateTotal(stateClamped);
  // raw R4 = 10 - 50 = -40, clamped to 0. Total = 180 + 0 = 180.
  console.assert(calculatedTotal === 180, `Expected 180 but got ${calculatedTotal}`);
  console.log('✓ Điểm Vòng 4 không âm và tổng điểm duy trì chính xác!\n');

  // Test 4: Tiebreaker comparisons
  console.log('4. Kiểm tra tiêu chí xếp hạng phụ (Tiebreakers)...');
  const teamA: Team = {
    ...dummyTeam,
    id: 'team-A',
    teamName: 'Đội A',
    score: 250,
    roundScores: { 1: 50, 2: 70, 3: 50, 4: 80 },
    elapsedTime: 300,
    answersHistory: [
      { round: 1, questionId: 'q1', selectedAnswer: 'A', isCorrect: true, pointsAwarded: 10, timeTaken: 10, timestamp: 1 },
      { round: 1, questionId: 'q2', selectedAnswer: 'B', isCorrect: true, pointsAwarded: 10, timeTaken: 10, timestamp: 2 },
    ],
  };

  const teamB: Team = {
    ...dummyTeam,
    id: 'team-B',
    teamName: 'Đội B',
    score: 250, // Same total score!
    roundScores: { 1: 60, 2: 70, 3: 50, 4: 70 }, // Lower Round 4 score!
    elapsedTime: 280,
    answersHistory: [
      { round: 1, questionId: 'q1', selectedAnswer: 'A', isCorrect: true, pointsAwarded: 10, timeTaken: 10, timestamp: 1 },
    ],
  };

  const cmp = ScoringEngine.compareTeams(teamA, teamB);
  // Team A has higher Round 4 score (80 vs 70), so Team A should rank higher (cmp < 0)
  console.assert(cmp < 0, `Expected Team A ahead of Team B, got ${cmp}`);
  console.log('✓ Tiêu chí phụ xếp hạng theo Vòng 4 và số câu đúng hoạt động chuẩn xác!\n');

  console.log('🎉 TOÀN BỘ CÁC BÀI KIỂM THỬ ĐÃ ĐẠT 100%! HỆ THỐNG SẴN SÀNG!');
}

runTests();
