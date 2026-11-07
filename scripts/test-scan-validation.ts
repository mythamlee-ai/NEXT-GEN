import { Round4Engine } from '../src/services/round4Engine';
import { storageService } from '../src/services/storageService';
import { Team } from '../src/types';

console.log('=== BẮT ĐẦU KIỂM THỬ XÁC THỰC QUÉT TÍN HIỆU (ROUND 4) ===\n');

// Mock localStorage if in Node environment
if (typeof window === 'undefined') {
  (global as any).window = global;
  const store: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => {
      store[key] = String(val);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  };
  (global as any).sessionStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, val: string) => {
      store[key] = String(val);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
}

let testPassed = 0;
let testFailed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ [PASS] ${msg}`);
    testPassed++;
  } else {
    console.error(`❌ [FAIL] ${msg}`);
    testFailed++;
  }
}

// Prepare a mock test team
const testTeam: Team = {
  id: 'test_team_scan_01',
  teamCode: 'PEK-SCAN',
  teamName: 'Đội Thử Nghiệm Laser',
  className: '12 Lí 1',
  captainName: 'Test Captain',
  members: ['Test Captain', 'Test Member 2'],
  createdAt: Date.now(),
  currentRound: 4,
  status: 'playing',
  score: 150,
  roundScores: { 1: 50, 2: 40, 3: 60, 4: 0 },
  elapsedTime: 200,
  roundTimes: { 1: 60, 2: 50, 3: 90, 4: 0 },
  answersHistory: [],
  currentQuestionIndex: 0,
  questionSeed: 'TEST_SEED_2026',
};

storageService.saveTeam(testTeam);

// 1. Tình huống: Mở khóa cổng trước khi vào vòng quét
const { pkg, state } = Round4Engine.getOrAssignTeamPackage(testTeam);
console.log(`1. Gói nhiệm vụ được cấp phát: ${pkg.id} - ${pkg.title}`);
console.log(`- Tín hiệu chuẩn của gói: ${pkg.aiScan.correctTargetId}`);

// Mở khóa cổng 3 ổ khóa
Round4Engine.gmManualUnlockGate(testTeam.id);
const unlockedTeam = storageService.getTeamById(testTeam.id)!;
assert(unlockedTeam.round4State?.keywordVaultUnlocked === true, 'Cổng bảo mật 3 ổ khóa đã được mở.');

// 2. Tình huống 1: Nhấn nút khi CHƯA có tín hiệu
console.log('\n2. Kiểm thử: Nhấn nút khi CHƯA có tín hiệu');
const resNoSignal = Round4Engine.verifySignalScan(testTeam.id, undefined, 'PLAYER');
assert(resNoSignal.success === false, 'Hệ thống từ chối xác thực khi chưa có tín hiệu.');
assert(resNoSignal.error === 'NO_SIGNAL_SELECTED', 'Mã lỗi trả về chính xác là NO_SIGNAL_SELECTED.');
assert(resNoSignal.message.includes('Chưa có dữ liệu tín hiệu'), 'Thông báo giải thích rõ lý do cần chọn tín hiệu.');

// 3. Tình huống 2: Nhấn nút khi tín hiệu KHÔNG HỢP LỆ (mã rác/không tồn tại)
console.log('\n3. Kiểm thử: Nhấn nút khi tín hiệu KHÔNG HỢP LỆ (mã rác)');
const resInvalidTarget = Round4Engine.verifySignalScan(testTeam.id, 'SIGNAL_FAKE_9999', 'PLAYER');
assert(resInvalidTarget.success === false, 'Hệ thống từ chối mã tín hiệu không thuộc gói.');
assert(resInvalidTarget.error === 'INVALID_TARGET', 'Mã lỗi là INVALID_TARGET.');

// 4. Tình huống 3: Chọn tín hiệu trên lưới và đồng bộ giữa Player & GM
console.log('\n4. Kiểm thử: Đồng bộ chọn tín hiệu giữa Player và GM');
const correctTargetId = pkg.aiScan.correctTargetId;
const wrongTargetId = pkg.aiScan.scanTargets.find((t) => t.id !== correctTargetId)!.id;

Round4Engine.setSelectedScanTarget(testTeam.id, wrongTargetId);
const teamAfterSelect = storageService.getTeamById(testTeam.id)!;
assert(
  teamAfterSelect.round4State?.selectedScanTargetId === wrongTargetId,
  'Tín hiệu chọn được lưu và đồng bộ sang đối tượng team cho GM giám sát.'
);

// 5. Tình huống 4: Nhấn nút khi tín hiệu SAI
console.log('\n5. Kiểm thử: Nhấn nút khi tín hiệu SAI');
const resWrong = Round4Engine.verifySignalScan(testTeam.id, wrongTargetId, 'PLAYER');
assert(resWrong.success === true, 'Quá trình xác thực hoàn tất thành công.');
assert(resWrong.isCorrect === false, 'Xác định chính xác tín hiệu là SAI.');
assert(resWrong.penaltyDeducted > 0, `Đã áp dụng mức phạt ngẫu nhiên (-${resWrong.penaltyDeducted}đ).`);

const teamAfterWrong = storageService.getTeamById(testTeam.id)!;
assert(teamAfterWrong.round4State?.aiScanCompleted === true, 'Đã cập nhật trạng thái aiScanCompleted = true.');
assert(teamAfterWrong.round4State?.currentStep === 'ai_error_detector', 'Đã chuyển trạng thái sang bước ai_error_detector.');

// 6. Tình huống 5: Nhấn liên tục nhiều lần (chống duplicate / spam)
console.log('\n6. Kiểm thử: Nhấn liên tục nhiều lần (Duplicate / Spam Protection)');
const resSpam = Round4Engine.verifySignalScan(testTeam.id, wrongTargetId, 'PLAYER');
assert(resSpam.success === true, 'Nhấn lại không làm crash hệ thống.');
assert(resSpam.bonusAwarded === 0, 'Không cộng thưởng lặp lại khi đã hoàn thành.');
assert(resSpam.penaltyDeducted === 0, 'Không trừ phạt lặp lại khi đã hoàn thành.');

// 7. Tình huống 6: Game Master xác thực cho đội khác với tín hiệu ĐÚNG
console.log('\n7. Kiểm thử: Game Master xác thực với tín hiệu ĐÚNG');
const testTeam2: Team = {
  ...testTeam,
  id: 'test_team_scan_02',
  teamCode: 'PEK-GM-VERIFY',
  teamName: 'Đội Lượng Tử Beta',
};
storageService.saveTeam(testTeam2);
Round4Engine.getOrAssignTeamPackage(testTeam2);
Round4Engine.gmManualUnlockGate(testTeam2.id);

const pkg2 = Round4Engine.getOrAssignTeamPackage(testTeam2).pkg;
Round4Engine.setSelectedScanTarget(testTeam2.id, pkg2.aiScan.correctTargetId);

const resGmVerify = Round4Engine.verifySignalScan(testTeam2.id, pkg2.aiScan.correctTargetId, 'GAME_MASTER');
assert(resGmVerify.success === true, 'GM xác thực thành công.');
assert(resGmVerify.isCorrect === true, 'Kết quả xác thực ĐÚNG.');
assert(resGmVerify.bonusAwarded > 0, `Đã cộng thưởng may mắn (+${resGmVerify.bonusAwarded}đ).`);

const team2After = storageService.getTeamById(testTeam2.id)!;
assert(team2After.round4State?.scanVerifiedBy === 'GAME_MASTER', 'Ghi nhận người xác thực là GAME_MASTER.');
assert(typeof team2After.round4State?.scanVerifiedAt === 'number', 'Ghi nhận thời điểm xác thực chính xác.');
assert(
  team2After.round4State?.clueFragments?.length! >= 1,
  'Đội nhận được Mảnh ghép dữ kiện 1 khi tín hiệu đúng.'
);

// 8. Tình huống 7: Kiểm tra Audit Log ghi nhận đầy đủ
console.log('\n8. Kiểm thử: Audit Logs');
const logs = Round4Engine.getLogs();
const scanLogs = logs.filter((l) => l.step === 'ai_scan');
assert(scanLogs.length >= 2, `Ghi nhận đầy đủ audit log cho các lần xác thực (${scanLogs.length} logs).`);

console.log(`\n========================================`);
console.log(`KẾT QUẢ: ${testPassed} PASS, ${testFailed} FAIL`);
if (testFailed === 0) {
  console.log('🎉 TOÀN BỘ CÁC TÌNH HUỐNG KIỂM THỬ ĐÃ ĐẠT 100%!');
}
