// Automated Test Suite for Round 3: Đuổi Hình Bắt Chữ - Ca Dao Tục Ngữ Việt Nam
import { FORTY_OFFICIAL_PROVERBS } from '../src/data/round3ProverbsData';
import { validateProverbAnswer, normalizeProverbText } from '../src/utils/answerNormalization';
import { ScoringEngine } from '../src/services/scoringEngine';

console.log('====================================================');
console.log('BẮT ĐẦU CHẠY KIỂM THỬ TOÀN DIỆN VÒNG 3 (SCIENCE PEK)');
console.log('====================================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Đủ 40 câu
assert(FORTY_OFFICIAL_PROVERBS.length === 40, '1. Đủ 40 câu ca dao tục ngữ');

// 2. Không trùng đáp án
const answersSet = new Set();
let hasDuplicateAnswer = false;
for (const p of FORTY_OFFICIAL_PROVERBS) {
  const norm = normalizeProverbText(p.answer, true);
  if (answersSet.has(norm)) {
    console.error('Trùng đáp án:', p.answer);
    hasDuplicateAnswer = true;
  }
  answersSet.add(norm);
}
assert(!hasDuplicateAnswer && answersSet.size === 40, '2. Không trùng đáp án giữa 40 câu');

// 3. Không có chữ tiếng Việt trong phần hình đố (visualClues)
let hasTextInVisualClues = false;
for (const p of FORTY_OFFICIAL_PROVERBS) {
  assert(Array.isArray(p.visualClues) && p.visualClues.length >= 3, `VisualClues câu #${p.proverbNumber} hợp lệ`);
  for (const item of p.visualClues) {
    if (/[a-zA-ZÀ-ỹ]{3,}/.test(item)) {
      console.error(`Phát hiện chữ trong visualClue câu #${p.proverbNumber}:`, item);
      hasTextInVisualClues = true;
    }
  }
}
assert(!hasTextInVisualClues, '3. Không có chữ/nhãn lộ đáp án trong phần hình đố');

// 4. Kiểm tra chấm điểm theo tốc độ
assert(ScoringEngine.calculateRound3Score(2, true) === 100, '4.1. 0-5s: 100 điểm');
assert(ScoringEngine.calculateRound3Score(5, true) === 100, '4.2. 5s: 100 điểm');
assert(ScoringEngine.calculateRound3Score(7, true) === 80, '4.3. 6-10s: 80 điểm');
assert(ScoringEngine.calculateRound3Score(10, true) === 80, '4.4. 10s: 80 điểm');
assert(ScoringEngine.calculateRound3Score(13, true) === 60, '4.5. 11-15s: 60 điểm');
assert(ScoringEngine.calculateRound3Score(18, true) === 40, '4.6. 16-20s: 40 điểm');
assert(ScoringEngine.calculateRound3Score(25, true) === 20, '4.7. 21-30s: 20 điểm');
assert(ScoringEngine.calculateRound3Score(35, true) === 0, '4.8. >30s: 0 điểm');
assert(ScoringEngine.calculateRound3Score(4, false) === 0, '4.9. Sai: 0 điểm');

// 5. Kiểm tra thuật toán nhận diện đáp án tiếng Việt (có dấu & không dấu, dấu câu)
const testP1 = FORTY_OFFICIAL_PROVERBS[0]; // "Ăn quả nhớ kẻ trồng cây"
assert(validateProverbAnswer('Ăn quả nhớ kẻ trồng cây', testP1.answer, testP1.acceptedAnswers), '5.1. Đúng có dấu chính xác');
assert(validateProverbAnswer('an qua nho ke trong cay', testP1.answer, testP1.acceptedAnswers), '5.2. Đúng không dấu');
assert(validateProverbAnswer('ĂN QUẢ NHỚ KẺ TRỒNG CÂY.', testP1.answer, testP1.acceptedAnswers), '5.3. Hoa thường & dấu chấm cuối');
assert(validateProverbAnswer('   ăn quả nhớ kẻ trồng cây   ', testP1.answer, testP1.acceptedAnswers), '5.4. Khoảng trắng thừa');
assert(validateProverbAnswer('Ăn quả nhớ người trồng cây', testP1.answer, testP1.acceptedAnswers), '5.5. Biến thể dân gian được chấp nhận');
assert(!validateProverbAnswer('Uống nước nhớ nguồn', testP1.answer, testP1.acceptedAnswers), '5.6. Câu khác bị từ chối');
assert(!validateProverbAnswer('Ăn quả', testP1.answer, testP1.acceptedAnswers), '5.7. Câu thiếu bị từ chối (không fuzzy match bừa)');

console.log('----------------------------------------------------');
console.log(`KẾT QUẢ: ${passedTests}/${totalTests} KIỂM THỬ ĐẠT THÀNH CÔNG.`);
console.log('====================================================');
