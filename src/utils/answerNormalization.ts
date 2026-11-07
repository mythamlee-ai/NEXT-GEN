/**
 * Chuẩn hóa đáp án tiếng Việt (normalizeVietnameseAnswer):
 * - Chuyển chữ thường (lowercase)
 * - Cắt khoảng trắng đầu cuối (trim)
 * - Loại bỏ toàn bộ dấu thanh và dấu tiếng Việt (NFD decomposition)
 * - Thay thế đ/Đ -> d
 * - Chuẩn hóa dấu phẩy, khoảng trắng, gạch nối
 * - Hỗ trợ các biến thể viết liền / tách từ hợp lý (ví dụ: "hoa hoc" <-> "hoahoc", "vat li" <-> "vatly")
 * - KHÔNG quá dễ dãi đến mức câu trả lời hoàn toàn khác cũng được chấp nhận.
 */
export function normalizeVietnameseAnswer(input: string): string {
  if (!input) return '';

  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    // Replace punctuation like , ; / - with standard delimiter or space
    .replace(/[,;\/\\+]/g, ',')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strict and intelligent answer validator:
 * Checks whether user input matches any accepted answer string or key pattern
 */
export function validateTeacherClueAnswer(
  userInput: string,
  acceptedList: string[],
  primaryAnswer?: string
): boolean {
  if (!userInput || !userInput.trim()) return false;

  const rawClean = userInput.trim().toLowerCase();
  const normalizedUser = normalizeVietnameseAnswer(userInput);
  const userNoSpaces = normalizedUser.replace(/[\s,]+/g, '');

  const targets = [...acceptedList];
  if (primaryAnswer && !targets.includes(primaryAnswer)) {
    targets.push(primaryAnswer);
  }

  for (const target of targets) {
    const rawTarget = target.trim().toLowerCase();
    const normalizedTarget = normalizeVietnameseAnswer(target);
    const targetNoSpaces = normalizedTarget.replace(/[\s,]+/g, '');

    // 1. Exact match raw or normalized
    if (rawClean === rawTarget || normalizedUser === normalizedTarget) {
      return true;
    }

    // 2. Exact match when spaces/commas are compressed (e.g., '10,11,12' vs '10 11 12' or 'hoahoc' vs 'hoa hoc')
    if (userNoSpaces === targetNoSpaces) {
      return true;
    }

    // 3. Special handling for comma / list format e.g. "10, 11, 12", "10 11 va 12"
    if (target.includes(',') || target.includes('11') || target.includes('12')) {
      // Check if user contains the required grade numbers
      const userNumbers = normalizedUser.match(/\b(10|11|12)\b/g);
      const targetNumbers = normalizedTarget.match(/\b(10|11|12)\b/g);
      if (userNumbers && targetNumbers) {
        const userSet = new Set(userNumbers);
        const targetSet = new Set(targetNumbers);
        if (targetSet.size === userSet.size && [...targetSet].every((n) => userSet.has(n))) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Dedicated validator for Teacher Name Keyword (Đáp án từ khóa vòng 2):
 * Chấp nhận tên đầy đủ có dấu/không dấu (VD: "Nguyễn Minh Tiến", "NGUYEN MINH TIEN")
 * Chấp nhận xưng hô (VD: "Thầy Tiến", "thay tien", "Cô Thẩm", "co tham", "Cô Mai", "co mai")
 * Chấp nhận tên riêng (VD: "Tiến", "Thẩm", "Mai")
 * KHÔNG chấp nhận tên giáo viên khác trong trường.
 */
export function validateTeacherNameAnswer(
  userInput: string,
  teacher: { name: string; displayName?: string; correctAnswer?: string }
): boolean {
  if (!userInput || !userInput.trim()) return false;

  const userNorm = normalizeVietnameseAnswer(userInput);
  const userNoSpaces = userNorm.replace(/[\s,]+/g, '');

  // Build target aliases list for this specific teacher
  const rawList = [
    teacher.name,
    teacher.displayName || '',
    teacher.correctAnswer || '',
  ];

  // Extract base first name (tên gọi)
  const normName = normalizeVietnameseAnswer(teacher.name);
  const nameParts = normName.split(' ').filter(Boolean);
  const lastName = nameParts[nameParts.length - 1] || ''; // e.g. "tien", "tham", "mai"

  if (lastName) {
    rawList.push(lastName);
    rawList.push(`thay ${lastName}`);
    rawList.push(`co ${lastName}`);
  }

  // Also include last two words (e.g. "thuy vy", "bich ngoc", "bao quynh", "minh phuong", "thanh tuyen")
  if (nameParts.length >= 2) {
    const lastTwo = nameParts.slice(-2).join(' ');
    rawList.push(lastTwo);
    rawList.push(`thay ${lastTwo}`);
    rawList.push(`co ${lastTwo}`);
  }

  if (teacher.displayName) {
    const dispNorm = normalizeVietnameseAnswer(teacher.displayName);
    rawList.push(dispNorm);
    const dispWithoutPrefix = dispNorm.replace(/^(thay|co)\s+/i, '');
    rawList.push(dispWithoutPrefix);
  }

  for (const target of rawList) {
    if (!target) continue;
    const targetNorm = normalizeVietnameseAnswer(target);
    const targetNoSpaces = targetNorm.replace(/[\s,]+/g, '');

    if (userNorm === targetNorm || userNoSpaces === targetNoSpaces) {
      return true;
    }
  }

  return false;
}

/**
 * Chuẩn hóa đáp án Ca dao / Tục ngữ:
 * - lowercase, trim
 * - loại bỏ tất cả dấu câu (.,;:!?-–"'`()[]{})
 * - chuẩn hóa khoảng trắng
 * - hỗ trợ giữ dấu hoặc bỏ dấu tiếng Việt
 */
export function normalizeProverbText(input: string, removeAccents: boolean = false): string {
  if (!input) return '';
  let str = input.toLowerCase().trim();
  if (removeAccents) {
    str = str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd');
  }
  return str
    .replace(/[.,;:!?'"“”‘’()\[\]{}\-–—_\/\\+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validate Vietnamese Proverb Answer (Vòng 3: Đuổi Hình Bắt Chữ - Ca dao tục ngữ):
 * - Chính xác theo nội dung câu ca dao / tục ngữ
 * - Chấp nhận có dấu hoặc không dấu
 * - Không phân biệt hoa/thường, dấu câu, khoảng trắng thừa
 * - Tuyệt đối không dùng fuzzy matching để tránh nhận nhầm
 */
export function validateProverbAnswer(
  userInput: string,
  targetAnswer: string,
  acceptedList: string[] = []
): boolean {
  if (!userInput || !userInput.trim()) return false;

  const userCleanWithAccents = normalizeProverbText(userInput, false);
  const userCleanNoAccents = normalizeProverbText(userInput, true);
  const userNoSpacesWithAccents = userCleanWithAccents.replace(/\s+/g, '');
  const userNoSpacesNoAccents = userCleanNoAccents.replace(/\s+/g, '');

  const targets = [targetAnswer, ...acceptedList].filter(Boolean);

  for (const target of targets) {
    const targetWithAccents = normalizeProverbText(target, false);
    const targetNoAccents = normalizeProverbText(target, true);
    const targetNoSpacesWithAccents = targetWithAccents.replace(/\s+/g, '');
    const targetNoSpacesNoAccents = targetNoAccents.replace(/\s+/g, '');

    // 1. Exact match with accents
    if (userCleanWithAccents === targetWithAccents || userNoSpacesWithAccents === targetNoSpacesWithAccents) {
      return true;
    }

    // 2. Exact match unaccented
    if (userCleanNoAccents === targetNoAccents || userNoSpacesNoAccents === targetNoSpacesNoAccents) {
      return true;
    }
  }

  return false;
}
