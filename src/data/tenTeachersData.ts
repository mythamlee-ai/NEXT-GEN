import { Teacher } from '../types';
import { GV01_AVATAR_SVG, GV02_AVATAR_SVG, GV03_AVATAR_SVG, DEFAULT_TEACHER_AVATAR_SVG } from './officialTeachers';

/**
 * High-definition SVG Avatars for GV04 -> GV10
 */

export const GV04_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23064e3b" />
      <stop offset="100%" stop-color="%23047857" />
    </linearGradient>
    <linearGradient id="skinGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fcd34d" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad4)" />
  <circle cx="200" cy="180" r="140" fill="%2334d399" opacity="0.15" />
  <!-- Body -->
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="%23065f46" stroke="%236ee7b7" stroke-width="3" />
  <polygon points="175,280 200,330 225,280" fill="%23ffffff" />
  <!-- Neck & Head -->
  <rect x="180" y="240" width="40" height="50" rx="8" fill="url(%23skinGrad4)" />
  <ellipse cx="200" cy="180" rx="65" ry="75" fill="url(%23skinGrad4)" />
  <!-- Hair & Glasses -->
  <path d="M130,170 Q130,110 200,105 Q270,110 270,170 Q240,120 200,125 Q150,125 130,170 Z" fill="%231e293b" />
  <circle cx="170" cy="180" r="20" fill="%23ecfdf5" fill-opacity="0.3" stroke="%23064e3b" stroke-width="3" />
  <circle cx="230" cy="180" r="20" fill="%23ecfdf5" fill-opacity="0.3" stroke="%23064e3b" stroke-width="3" />
  <line x1="190" y1="180" x2="210" y2="180" stroke="%23064e3b" stroke-width="3" />
  <circle cx="170" cy="180" r="4" fill="%23064e3b" />
  <circle cx="230" cy="180" r="4" fill="%23064e3b" />
  <path d="M185,220 Q200,235 215,220" stroke="%23047857" stroke-width="3" fill="none" stroke-linecap="round" />
  <rect x="100" y="350" width="200" height="36" rx="18" fill="%23047857" stroke="%2334d399" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">THẦY KHOA • SINH HỌC</text>
</svg>`;

export const GV05_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%231e1b4b" />
      <stop offset="100%" stop-color="%234338ca" />
    </linearGradient>
    <linearGradient id="skinGrad5" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fdba74" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad5)" />
  <circle cx="200" cy="180" r="140" fill="%23818cf8" opacity="0.15" />
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="%23312e81" stroke="%23a5b4fc" stroke-width="3" />
  <polygon points="175,280 200,325 225,280" fill="%23ffffff" />
  <rect x="182" y="240" width="36" height="50" rx="8" fill="url(%23skinGrad5)" />
  <ellipse cx="200" cy="180" rx="62" ry="72" fill="url(%23skinGrad5)" />
  <!-- Hair waves -->
  <path d="M125,170 Q130,110 200,105 Q270,110 275,170 Q240,115 200,120 Q160,115 125,170 Z" fill="%23311005" />
  <path d="M115,180 Q105,260 120,330 L140,200 Z" fill="%23311005" />
  <path d="M285,180 Q295,260 280,330 L260,200 Z" fill="%23311005" />
  <circle cx="170" cy="175" r="5" fill="%231e1b4b" />
  <circle cx="230" cy="175" r="5" fill="%231e1b4b" />
  <path d="M182,215 Q200,235 218,215" stroke="%23e11d48" stroke-width="3.5" fill="%23ffe4e6" stroke-linecap="round" />
  <rect x="100" y="350" width="200" height="36" rx="18" fill="%234338ca" stroke="%23818cf8" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">CÔ THẢO • HÓA HỌC</text>
</svg>`;

export const GV06_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%237c2d12" />
      <stop offset="100%" stop-color="%23c2410c" />
    </linearGradient>
    <linearGradient id="skinGrad6" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fcd34d" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad6)" />
  <circle cx="200" cy="180" r="140" fill="%23fb923c" opacity="0.15" />
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="%239a3412" stroke="%23fdba74" stroke-width="3" />
  <polygon points="175,280 200,325 225,280" fill="%23ffffff" />
  <rect x="180" y="240" width="40" height="50" rx="8" fill="url(%23skinGrad6)" />
  <ellipse cx="200" cy="180" rx="65" ry="75" fill="url(%23skinGrad6)" />
  <path d="M130,165 Q135,105 200,105 Q265,105 270,165 Z" fill="%2318181b" />
  <circle cx="170" cy="178" r="5" fill="%2318181b" />
  <circle cx="230" cy="178" r="5" fill="%2318181b" />
  <path d="M185,220 Q200,235 215,220" stroke="%23c2410c" stroke-width="3" fill="none" stroke-linecap="round" />
  <rect x="100" y="350" width="200" height="36" rx="18" fill="%23c2410c" stroke="%23fb923c" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">THẦY TRÍ • VẬT LÍ</text>
</svg>`;

export const GV07_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad7" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23831843" />
      <stop offset="100%" stop-color="%23db2777" />
    </linearGradient>
    <linearGradient id="skinGrad7" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fdba74" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad7)" />
  <circle cx="200" cy="180" r="140" fill="%23f472b6" opacity="0.15" />
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="%239d174d" stroke="%23fbcfe8" stroke-width="3" />
  <polygon points="175,280 200,325 225,280" fill="%23ffffff" />
  <rect x="182" y="240" width="36" height="50" rx="8" fill="url(%23skinGrad7)" />
  <ellipse cx="200" cy="180" rx="62" ry="72" fill="url(%23skinGrad7)" />
  <path d="M125,170 Q130,110 200,105 Q270,110 275,170 Z" fill="%23172554" />
  <circle cx="170" cy="175" r="5" fill="%23172554" />
  <circle cx="230" cy="175" r="5" fill="%23172554" />
  <path d="M182,215 Q200,235 218,215" stroke="%23db2777" stroke-width="3.5" fill="%23fce7f3" stroke-linecap="round" />
  <rect x="100" y="350" width="200" height="36" rx="18" fill="%23db2777" stroke="%23f472b6" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">CÔ HÀ • VẬT LÍ</text>
</svg>`;

export const GV08_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad8" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%2314532d" />
      <stop offset="100%" stop-color="%2315803d" />
    </linearGradient>
    <linearGradient id="skinGrad8" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fcd34d" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad8)" />
  <circle cx="200" cy="180" r="140" fill="%234ade80" opacity="0.15" />
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="%23166534" stroke="%2386efac" stroke-width="3" />
  <polygon points="175,280 200,325 225,280" fill="%23ffffff" />
  <rect x="180" y="240" width="40" height="50" rx="8" fill="url(%23skinGrad8)" />
  <ellipse cx="200" cy="180" rx="65" ry="75" fill="url(%23skinGrad8)" />
  <path d="M130,165 Q135,105 200,105 Q265,105 270,165 Z" fill="%231f2937" />
  <circle cx="170" cy="178" r="5" fill="%231f2937" />
  <circle cx="230" cy="178" r="5" fill="%231f2937" />
  <path d="M185,220 Q200,235 215,220" stroke="%2315803d" stroke-width="3" fill="none" stroke-linecap="round" />
  <rect x="100" y="350" width="200" height="36" rx="18" fill="%2315803d" stroke="%234ade80" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">THẦY HUY • SINH HỌC</text>
</svg>`;

export const GV09_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad9" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23581c87" />
      <stop offset="100%" stop-color="%237e22ce" />
    </linearGradient>
    <linearGradient id="skinGrad9" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fdba74" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad9)" />
  <circle cx="200" cy="180" r="140" fill="%23c084fc" opacity="0.15" />
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="%236b21a8" stroke="%23d8b4fe" stroke-width="3" />
  <polygon points="175,280 200,325 225,280" fill="%23ffffff" />
  <rect x="182" y="240" width="36" height="50" rx="8" fill="url(%23skinGrad9)" />
  <ellipse cx="200" cy="180" rx="62" ry="72" fill="url(%23skinGrad9)" />
  <path d="M125,170 Q130,110 200,105 Q270,110 275,170 Z" fill="%233b0764" />
  <circle cx="170" cy="175" r="5" fill="%233b0764" />
  <circle cx="230" cy="175" r="5" fill="%233b0764" />
  <path d="M182,215 Q200,235 218,215" stroke="%237e22ce" stroke-width="3.5" fill="%23f3e8ff" stroke-linecap="round" />
  <rect x="100" y="350" width="200" height="36" rx="18" fill="%237e22ce" stroke="%23c084fc" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">CÔ LAN • HÓA HỌC</text>
</svg>`;

export const GV10_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad10" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%230f172a" />
      <stop offset="100%" stop-color="%23334155" />
    </linearGradient>
    <linearGradient id="skinGrad10" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fcd34d" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad10)" />
  <circle cx="200" cy="180" r="140" fill="%2394a3b8" opacity="0.15" />
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="%231e293b" stroke="%23cbd5e1" stroke-width="3" />
  <polygon points="175,280 200,325 225,280" fill="%23ffffff" />
  <rect x="180" y="240" width="40" height="50" rx="8" fill="url(%23skinGrad10)" />
  <ellipse cx="200" cy="180" rx="65" ry="75" fill="url(%23skinGrad10)" />
  <path d="M130,165 Q135,105 200,105 Q265,105 270,165 Z" fill="%230f172a" />
  <circle cx="170" cy="178" r="5" fill="%230f172a" />
  <circle cx="230" cy="178" r="5" fill="%230f172a" />
  <path d="M185,220 Q200,235 215,220" stroke="%23475569" stroke-width="3" fill="none" stroke-linecap="round" />
  <rect x="100" y="350" width="200" height="36" rx="18" fill="%23334155" stroke="%2394a3b8" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">THẦY ĐẠT • VẬT LÍ</text>
</svg>`;

/**
 * 10 Official Teachers for Round 2 Question Bank:
 * GV01 -> GV10
 */
export const tenOfficialTeachers: Teacher[] = [
  {
    id: 'GV01',
    round: 2,
    name: 'NGUYEN MINH TIEN',
    displayName: 'Thầy Tiến',
    subject: 'HOA HOC',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '10, 11, 12',
    homeroom: '11.1',
    characteristics: 'DOC TOAN THAN, DA TAI',
    image: GV01_AVATAR_SVG,
    clues: [
      'Nơi những phản ứng, chất và thế giới phân tử trở thành những câu chuyện đầy bất ngờ.',
      'Nhân vật này có thể đồng hành cùng học sinh ở cả ba khối của THPT.',
      'Nhân vật này không chỉ có một "hệ kỹ năng" — càng khám phá càng thấy nhiều tài lẻ.',
      'Trang phục lịch lãm với áo sơ mi, cà vạt xanh và cặp kính cận tri thức tỏa sáng.',
    ],
    clueAnswers: ['hoa hoc', '10,11,12', 'doc toan than', 'ca vat'],
    clueAcceptedAnswers: [
      ['hoa hoc', 'hoahoc'],
      ['10,11,12', '10 11 12'],
      ['doc toan than', 'da tai'],
      ['ca vat', 'kinh'],
    ],
    options: ['Thầy Nguyễn Minh Tiến', 'Thầy Lê Quang Đạt', 'Thầy Trần Đình Trí', 'Thầy Hoàng Minh Vũ'],
    correctAnswer: 'NGUYEN MINH TIEN',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV02',
    round: 2,
    name: 'LE THI MY THAM',
    displayName: 'Cô Thẩm',
    subject: 'VAT LI',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '11, 12',
    homeroom: '11.4',
    characteristics: '2 EM BE SIU QUAY',
    image: GV02_AVATAR_SVG,
    clues: [
      'Những định luật, chuyển động, năng lượng và các hiện tượng tự nhiên là lãnh địa quen thuộc của nhân vật này.',
      'Nhân vật này thường đồng hành cùng những lớp đang bước vào các chương quan trọng của THPT.',
      'Ở nhà, nhân vật này có hai "trợ lý nhí" luôn mang đến những pha bất ngờ và nguồn năng lượng không giới hạn.',
      'Mái tóc dài thướt tha, trang phục màu xanh ngọc quý phái cùng nụ cười rạng ngời.',
    ],
    clueAnswers: ['vat li', '11,12', '2 em be sieu quay', 'toc dai'],
    clueAcceptedAnswers: [
      ['vat li', 'vatly'],
      ['11,12', '11 12'],
      ['2 em be sieu quay', '2 em be'],
      ['toc dai', 'trang phuc mau xanh'],
    ],
    options: ['Cô Lê Thị Mỹ Thẩm', 'Cô Nguyễn Phương Thảo', 'Cô Đỗ Mai Lan', 'Cô Lê Thảo Trang'],
    correctAnswer: 'LE THI MY THAM',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV03',
    round: 2,
    name: 'LE THI HONG MAI',
    displayName: 'Cô Mai',
    subject: 'HOA HOC',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '11, 12',
    homeroom: 'KHONG CHU NHIEM',
    characteristics: 'TIKTOKER',
    image: GV03_AVATAR_SVG,
    clues: [
      'Những phản ứng, chất và biến đổi của vật chất là một phần quen thuộc trong thế giới của nhân vật này.',
      'Nhân vật này thường đồng hành cùng học sinh ở hai khối cuối cấp của chương trình THPT.',
      'Không chỉ xuất hiện trong lớp học, nhân vật này còn khá quen thuộc với thế giới video ngắn.',
      'Cặp kính tròn thời trang cực chất, mái tóc năng động cá tính và phong cách rực rỡ.',
    ],
    clueAnswers: ['hoa hoc', '11,12', 'tiktoker', 'kinh tron'],
    clueAcceptedAnswers: [
      ['hoa hoc', 'hoahoc'],
      ['11,12', '11 12'],
      ['tiktoker', 'tik tok', 'tiktok'],
      ['kinh tron', 'kinh'],
    ],
    options: ['Cô Lê Thị Hồng Mai', 'Cô Vũ Thị Thu Hà', 'Cô Phan Khánh Linh', 'Cô Hoàng Yến Nhi'],
    correctAnswer: 'LE THI HONG MAI',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV04',
    round: 2,
    name: 'TRƯƠNG THỊ THANH TUYỀN',
    displayName: 'Cô Tuyền',
    subject: 'VẬT LÍ',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '10',
    homeroom: 'KHÔNG CHỦ NHIỆM',
    characteristics: 'BÍ THƯ CHI BỘ',
    image: DEFAULT_TEACHER_AVATAR_SVG,
    clues: [
      'Ngoài công việc giảng dạy, cô còn đảm nhận một trọng trách quan trọng trong tổ chức Đảng tại trường.',
      'Cô là người giữ vai trò lãnh đạo trong Chi bộ.',
      'Cô hiện giảng dạy môn Vật lí cho học sinh khối 10.',
      'Cô là Bí thư Chi bộ. Họ tên: Trương Thị Thanh Tuyền.',
    ],
    clueAnswers: ['to chuc dang', 'chi bo', 'vat li 10', 'truong thi thanh tuyen'],
    clueAcceptedAnswers: [
      ['to chuc dang', 'dang', 'bi thu'],
      ['chi bo', 'lanh dao chi bo', 'bi thu chi bo'],
      ['vat li', 'vatly', 'khoi 10', '10'],
      ['truong thi thanh tuyen', 'thanh tuyen', 'co tuyen'],
    ],
    options: ['Cô Trương Thị Thanh Tuyền', 'Cô Lê Thị Tú', 'Cô Nguyễn Hoàng Thuý Vy', 'Cô Nguyễn Thị Bích Ngọc'],
    correctAnswer: 'TRƯƠNG THỊ THANH TUYỀN',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV05',
    round: 2,
    name: 'LÊ THỊ TÚ',
    displayName: 'Cô Tú',
    subject: 'VẬT LÍ',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '11, 12',
    homeroom: '11.2',
    characteristics: 'CẬN, ĐÁNG YÊU',
    image: DEFAULT_TEACHER_AVATAR_SVG,
    clues: [
      'Cô giáo này thuộc đội ngũ Vật lí, đồng hành cùng học sinh ở hai khối 11 và 12.',
      'Cô chủ nhiệm lớp 11.2.',
      'Một đặc điểm dễ nhận ra: cô đeo kính và có nét đáng yêu.',
      'Họ tên gồm 3 tiếng, trong đó tên gọi là Tú.',
    ],
    clueAnswers: ['vat li 11 12', '11.2', 'can dang yeu', 'le thi tu'],
    clueAcceptedAnswers: [
      ['vat li', 'vat ly', '11 12', '11,12'],
      ['11.2', '11/2', 'lop 11.2'],
      ['can', 'dang yeu', 'deo kinh', 'kinh'],
      ['le thi tu', 'tu', 'co tu'],
    ],
    options: ['Cô Lê Thị Tú', 'Cô Trương Thị Thanh Tuyền', 'Cô Nguyễn Hoàng Thuý Vy', 'Cô Trần Thị Bảo Quỳnh'],
    correctAnswer: 'LÊ THỊ TÚ',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV06',
    round: 2,
    name: 'NGUYỄN HOÀNG THUÝ VY',
    displayName: 'Cô Vy',
    subject: 'VẬT LÍ',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '10, 12',
    homeroom: '10.4',
    characteristics: 'KỈ LUẬT',
    image: DEFAULT_TEACHER_AVATAR_SVG,
    clues: [
      'Đây là một giáo viên Vật lí đang giảng dạy ở cả khối 10 và khối 12.',
      'Cô là chủ nhiệm lớp 10.4.',
      'Từ khóa đặc trưng của cô là một phẩm chất quan trọng trong môi trường học đường: KỈ LUẬT.',
      'Họ tên có 4 tiếng, hai tiếng cuối là Thuý Vy.',
    ],
    clueAnswers: ['vat li 10 12', '10.4', 'ki luat', 'nguyen hoang thuy vy'],
    clueAcceptedAnswers: [
      ['vat li', 'vat ly', '10 12', '10,12'],
      ['10.4', '10/4', 'lop 10.4'],
      ['ki luat', 'ky luat'],
      ['nguyen hoang thuy vy', 'thuy vy', 'co vy'],
    ],
    options: ['Cô Nguyễn Hoàng Thuý Vy', 'Cô Trương Thị Thanh Tuyền', 'Cô Lê Thị Tú', 'Cô Nguyễn Thị Ninh'],
    correctAnswer: 'NGUYỄN HOÀNG THUÝ VY',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV07',
    round: 2,
    name: 'NGUYỄN THỊ BÍCH NGỌC',
    displayName: 'Cô Ngọc',
    subject: 'HÓA HỌC',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '10, 12',
    homeroom: '10.10',
    characteristics: 'CHƯA CẬP NHẬT',
    image: DEFAULT_TEACHER_AVATAR_SVG,
    clues: [
      'Nhân vật bí ẩn thuộc team Hóa học.',
      'Cô đang đồng hành cùng học sinh khối 10 và 12.',
      'Cô chủ nhiệm một lớp có số hiệu đặc biệt: 10.10.',
      'Họ tên gồm 4 tiếng, hai tiếng cuối là Bích Ngọc.',
    ],
    clueAnswers: ['hoa hoc', '10 12', '10.10', 'nguyen thi bich ngoc'],
    clueAcceptedAnswers: [
      ['hoa hoc', 'hoa'],
      ['10 12', '10,12'],
      ['10.10', '10/10', 'lop 10.10'],
      ['nguyen thi bich ngoc', 'bich ngoc', 'co ngoc'],
    ],
    options: ['Cô Nguyễn Thị Bích Ngọc', 'Cô Trần Thị Bảo Quỳnh', 'Cô Lê Thị Hồng Mai', 'Cô Nguyễn Thị Minh Phượng'],
    correctAnswer: 'NGUYỄN THỊ BÍCH NGỌC',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV08',
    round: 2,
    name: 'TRẦN THỊ BẢO QUỲNH',
    displayName: 'Cô Quỳnh',
    subject: 'HÓA HỌC',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '10',
    homeroom: '10.9',
    characteristics: 'THẠC SĨ',
    image: DEFAULT_TEACHER_AVATAR_SVG,
    clues: [
      'Giáo viên bí ẩn này thuộc bộ môn Hóa học.',
      'Cô đang giảng dạy khối 10 và chủ nhiệm lớp 10.9.',
      'Cô có trình độ học vấn sau đại học – một dấu ấn học thuật đáng chú ý.',
      'Họ tên gồm 4 tiếng, tên gọi cuối cùng là Quỳnh.',
    ],
    clueAnswers: ['hoa hoc', '10.9', 'thac si', 'tran thi bao quynh'],
    clueAcceptedAnswers: [
      ['hoa hoc', 'hoa'],
      ['10.9', '10/9', 'lop 10.9', 'khoi 10'],
      ['thac si', 'sau dai hoc', 'master'],
      ['tran thi bao quynh', 'bao quynh', 'co quynh', 'quynh'],
    ],
    options: ['Cô Trần Thị Bảo Quỳnh', 'Cô Nguyễn Thị Bích Ngọc', 'Cô Lê Thị Hồng Mai', 'Cô Lê Thị Tú'],
    correctAnswer: 'TRẦN THỊ BẢO QUỲNH',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV09',
    round: 2,
    name: 'NGUYỄN THỊ NINH',
    displayName: 'Cô Ninh',
    subject: 'SINH HOC',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '10, 12',
    homeroom: '12.1',
    characteristics: 'GYMMER',
    image: DEFAULT_TEACHER_AVATAR_SVG,
    clues: [
      'Nhân vật bí ẩn thuộc bộ môn nghiên cứu thế giới sống.',
      'Cô đang giảng dạy ở khối 10 và khối 12.',
      'Ngoài bục giảng, cô còn có một sở thích gắn với phòng tập thể hình: GYMMER.',
      'Cô chủ nhiệm lớp 12.1. Họ tên: Nguyễn Thị Ninh.',
    ],
    clueAnswers: ['sinh hoc', '10 12', 'gymmer', 'nguyen thi ninh'],
    clueAcceptedAnswers: [
      ['sinh hoc', 'sinh', 'the gioi song'],
      ['10 12', '10,12'],
      ['gymmer', 'gym', 'the hinh'],
      ['nguyen thi ninh', 'co ninh', 'ninh'],
    ],
    options: ['Cô Nguyễn Thị Ninh', 'Cô Nguyễn Thị Minh Phượng', 'Cô Trương Thị Thanh Tuyền', 'Cô Nguyễn Hoàng Thuý Vy'],
    correctAnswer: 'NGUYỄN THỊ NINH',
    points: 100,
    timeLimit: 90,
    active: true,
  },
  {
    id: 'GV10',
    round: 2,
    name: 'NGUYỄN THỊ MINH PHƯỢNG',
    displayName: 'Cô Phượng',
    subject: 'SINH HOC',
    department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
    grades: '10, 11',
    homeroom: '10.6',
    characteristics: 'SIÊU CAO',
    image: DEFAULT_TEACHER_AVATAR_SVG,
    clues: [
      'Cô giáo bí ẩn thuộc team Sinh học.',
      'Cô đang giảng dạy ở hai khối 10 và 11.',
      'Khi xuất hiện, cô có một lợi thế nổi bật về chiều cao – SIÊU CAO!',
      'Cô chủ nhiệm lớp 10.6. Họ tên: Nguyễn Thị Minh Phượng.',
    ],
    clueAnswers: ['sinh hoc', '10 11', 'sieu cao', 'nguyen thi minh phuong'],
    clueAcceptedAnswers: [
      ['sinh hoc', 'sinh'],
      ['10 11', '10,11'],
      ['sieu cao', 'cao', 'chieu cao'],
      ['nguyen thi minh phuong', 'minh phuong', 'co phuong', 'phuong'],
    ],
    options: ['Cô Nguyễn Thị Minh Phượng', 'Cô Nguyễn Thị Ninh', 'Cô Trương Thị Thanh Tuyền', 'Cô Nguyễn Thị Bích Ngọc'],
    correctAnswer: 'NGUYỄN THỊ MINH PHƯỢNG',
    points: 100,
    timeLimit: 90,
    active: true,
  },
];
