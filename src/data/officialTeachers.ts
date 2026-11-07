import { Teacher } from '../types';

/**
 * High-definition, beautifully stylized SVG character avatars for GV01, GV02, GV03
 * Designed strictly matching character physical descriptions & visual clue features:
 * - GV01 (Thầy Tiến): Áo sơ mi trắng cà vạt xanh navy, đeo kính cận trí thức, kiểu tóc rẽ ngôi gọn gàng, huy hiệu phân tử Hóa học
 * - GV02 (Cô Thẩm): Áo vest xanh ngọc (teal/cyan), tóc dài uốn lượn nữ tính, nụ cười rạng rỡ, cài áo nguyên tử Vật lí
 * - GV03 (Cô Mai): Phong cách trẻ trung Tiktoker hiện đại, kính gọng tròn sành điệu, áo blouse/cardigan thời trang, khuyên tai cá tính
 */

/**
 * Default elegant mystery avatar for teachers when real photo has not yet been uploaded by Game Master
 */
export const DEFAULT_TEACHER_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="mysteryBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%231e1b4b" />
      <stop offset="50%" stop-color="%23312e81" />
      <stop offset="100%" stop-color="%234338ca" />
    </linearGradient>
    <linearGradient id="silhouetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23a5b4fc" />
      <stop offset="100%" stop-color="%236366f1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="36" fill="url(%23mysteryBg)" />
  <circle cx="200" cy="180" r="140" fill="%23818cf8" opacity="0.2" />
  <circle cx="200" cy="180" r="110" stroke="%23a5b4fc" stroke-width="2" stroke-dasharray="6 6" fill="none" opacity="0.4" />
  <!-- Torso Silhouette -->
  <path d="M110,380 L110,335 Q120,285 200,285 Q280,285 290,335 L290,380 Z" fill="url(%23silhouetteGrad)" opacity="0.85" />
  <!-- Neck -->
  <rect x="182" y="240" width="36" height="48" rx="8" fill="url(%23silhouetteGrad)" opacity="0.9" />
  <!-- Head Silhouette -->
  <ellipse cx="200" cy="180" rx="60" ry="70" fill="url(%23silhouetteGrad)" opacity="0.95" />
  <!-- Mystery Question Mark Badge -->
  <circle cx="200" cy="175" r="32" fill="%231e1b4b" opacity="0.8" />
  <text x="200" y="188" font-family="sans-serif" font-weight="900" font-size="38" fill="%23ffffff" text-anchor="middle">?</text>
  <!-- Bottom Pill: Chưa cập nhật ảnh -->
  <rect x="90" y="348" width="220" height="36" rx="18" fill="%231e1b4b" stroke="%23818cf8" stroke-width="2" />
  <text x="200" y="371" font-family="sans-serif" font-weight="800" font-size="12" fill="%23e0e7ff" text-anchor="middle" letter-spacing="0.5">CHƯA CẬP NHẬT ẢNH THẬT</text>
</svg>`;

export const GV01_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%230f172a" />
      <stop offset="50%" stop-color="%231e293b" />
      <stop offset="100%" stop-color="%230369a1" />
    </linearGradient>
    <linearGradient id="skinGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fcd34d" />
    </linearGradient>
    <linearGradient id="suitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23f8fafc" />
      <stop offset="100%" stop-color="%23e2e8f0" />
    </linearGradient>
    <linearGradient id="tieGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%230284c7" />
      <stop offset="100%" stop-color="%230369a1" />
    </linearGradient>
  </defs>

  <!-- Background with Chemistry Laboratory Glow -->
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad1)" />
  <circle cx="200" cy="180" r="140" fill="%2338bdf8" opacity="0.15" />
  
  <!-- Subtle Hexagonal Chemical Bonds in Background -->
  <polygon points="80,100 100,90 120,100 120,120 100,130 80,120" stroke="%2338bdf8" stroke-width="2" fill="none" opacity="0.3" />
  <polygon points="300,80 320,70 340,80 340,100 320,110 300,100" stroke="%2338bdf8" stroke-width="2" fill="none" opacity="0.3" />
  <polygon points="70,280 90,270 110,280 110,300 90,310 70,300" stroke="%2338bdf8" stroke-width="2" fill="none" opacity="0.3" />

  <!-- Body / Shoulders - Áo sơ mi & Cà vạt (Clue 4 visual feature) -->
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="url(%23suitGrad1)" stroke="%23cbd5e1" stroke-width="3" />
  
  <!-- Sơ mi Collar -->
  <polygon points="160,280 200,320 175,340 145,290" fill="%23ffffff" stroke="%2394a3b8" stroke-width="2" />
  <polygon points="240,280 200,320 225,340 255,290" fill="%23ffffff" stroke="%2394a3b8" stroke-width="2" />
  
  <!-- Cà vạt xanh thanh lịch (TIE / CÀ VẠT) -->
  <polygon points="190,315 210,315 215,380 200,395 185,380" fill="url(%23tieGrad1)" stroke="%23075985" stroke-width="2" />
  <!-- Tie Knot -->
  <polygon points="190,315 210,315 206,335 194,335" fill="%230369a1" />

  <!-- Neck -->
  <rect x="180" y="240" width="40" height="50" rx="8" fill="url(%23skinGrad1)" />

  <!-- Head / Face -->
  <ellipse cx="200" cy="180" rx="65" ry="75" fill="url(%23skinGrad1)" stroke="%23fbbf24" stroke-width="2" />

  <!-- Hair - Tóc rẽ ngôi trí thức (TÓC) -->
  <path d="M130,170 Q130,110 200,105 Q270,110 270,170 Q240,120 200,125 Q150,125 130,170 Z" fill="%231e293b" />
  <path d="M140,140 Q170,125 210,135 Q170,140 140,150 Z" fill="%23334155" />

  <!-- Ears -->
  <ellipse cx="132" cy="185" rx="10" ry="16" fill="url(%23skinGrad1)" />
  <ellipse cx="268" cy="185" rx="10" ry="16" fill="url(%23skinGrad1)" />

  <!-- Kính cận tri thức (GLASSES / KÍNH) -->
  <rect x="150" y="165" width="42" height="30" rx="6" fill="%23e0f2fe" fill-opacity="0.5" stroke="%230f172a" stroke-width="3.5" />
  <rect x="208" y="165" width="42" height="30" rx="6" fill="%23e0f2fe" fill-opacity="0.5" stroke="%230f172a" stroke-width="3.5" />
  <line x1="192" y1="180" x2="208" y2="180" stroke="%230f172a" stroke-width="4" />
  <line x1="135" y1="175" x2="150" y2="175" stroke="%230f172a" stroke-width="3" />
  <line x1="250" y1="175" x2="265" y2="175" stroke="%230f172a" stroke-width="3" />

  <!-- Eyes behind glasses -->
  <circle cx="171" cy="180" r="5" fill="%230f172a" />
  <circle cx="229" cy="180" r="5" fill="%230f172a" />
  <circle cx="173" cy="178" r="1.5" fill="%23ffffff" />
  <circle cx="231" cy="178" r="1.5" fill="%23ffffff" />

  <!-- Eyebrows -->
  <path d="M152,157 Q170,152 188,157" stroke="%231e293b" stroke-width="3.5" fill="none" stroke-linecap="round" />
  <path d="M212,157 Q230,152 248,157" stroke="%231e293b" stroke-width="3.5" fill="none" stroke-linecap="round" />

  <!-- Nose & Smile -->
  <path d="M197,195 Q200,205 203,195" stroke="%23d97706" stroke-width="2" fill="none" />
  <path d="M182,218 Q200,234 218,218" stroke="%23b45309" stroke-width="3" fill="none" stroke-linecap="round" />

  <!-- Badge at bottom corner: GV01 / Thầy Tiến -->
  <rect x="110" y="350" width="180" height="36" rx="18" fill="%230284c7" stroke="%2338bdf8" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="14" fill="%23ffffff" text-anchor="middle" letter-spacing="1">THẦY TIẾN • HOA HOC</text>
</svg>`;

export const GV02_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23042f2e" />
      <stop offset="50%" stop-color="%23134e4a" />
      <stop offset="100%" stop-color="%230f766e" />
    </linearGradient>
    <linearGradient id="skinGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fed7aa" />
      <stop offset="100%" stop-color="%23fdba74" />
    </linearGradient>
    <linearGradient id="suitGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%230d9488" />
      <stop offset="100%" stop-color="%23115e59" />
    </linearGradient>
  </defs>

  <!-- Background with Physics Energy Field / Orbits -->
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad2)" />
  <circle cx="200" cy="180" r="140" fill="%232dd4bf" opacity="0.15" />

  <!-- Physics Planetary / Atomic orbits in background -->
  <ellipse cx="200" cy="180" rx="170" ry="60" stroke="%232dd4bf" stroke-width="2" fill="none" opacity="0.35" transform="rotate(-25 200 180)" />
  <ellipse cx="200" cy="180" rx="170" ry="60" stroke="%232dd4bf" stroke-width="2" fill="none" opacity="0.35" transform="rotate(35 200 180)" />
  <circle cx="90" cy="130" r="6" fill="%235eead4" opacity="0.7" />
  <circle cx="310" cy="220" r="5" fill="%235eead4" opacity="0.7" />

  <!-- Long Hair Behind Shoulders (TÓC DÀI - Clue 4 Visual) -->
  <path d="M120,160 Q100,260 125,360 Q170,360 170,300 L140,200 Z" fill="%23422006" />
  <path d="M280,160 Q300,260 275,360 Q230,360 230,300 L260,200 Z" fill="%23422006" />

  <!-- Body / Outfit - Áo vest / Trang phục màu xanh ngọc (TRANG PHỤC MÀU XANH / ÁO XANH) -->
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="url(%23suitGrad2)" stroke="%235eead4" stroke-width="3" />
  <polygon points="160,280 200,340 180,360 145,290" fill="%23ffffff" stroke="%2399f6e4" stroke-width="1.5" />
  <polygon points="240,280 200,340 220,360 255,290" fill="%23ffffff" stroke="%2399f6e4" stroke-width="1.5" />
  
  <!-- Elegant Pearl Necklace / Phụ kiện -->
  <path d="M170,300 Q200,325 230,300" stroke="%23fef08a" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 8" fill="none" />

  <!-- Neck -->
  <rect x="184" y="240" width="32" height="48" rx="8" fill="url(%23skinGrad2)" />

  <!-- Head / Face -->
  <ellipse cx="200" cy="180" rx="60" ry="70" fill="url(%23skinGrad2)" stroke="%23fbbf24" stroke-width="2" />

  <!-- Front Hair Waves & Bangs (Tóc uốn sóng lãng mạn) -->
  <path d="M135,160 Q140,110 200,105 Q260,110 265,160 Q240,118 200,122 Q160,120 135,160 Z" fill="%23422006" />
  <path d="M140,140 Q160,120 200,135 Q170,130 140,140 Z" fill="%2378350f" />

  <!-- Ears & Earrings (Bông tai ngọc) -->
  <ellipse cx="138" cy="185" rx="8" ry="14" fill="url(%23skinGrad2)" />
  <ellipse cx="262" cy="185" rx="8" ry="14" fill="url(%23skinGrad2)" />
  <circle cx="138" cy="198" r="4.5" fill="%23fef08a" stroke="%23eab308" stroke-width="1" />
  <circle cx="262" cy="198" r="4.5" fill="%23fef08a" stroke="%23eab308" stroke-width="1" />

  <!-- Eyebrows -->
  <path d="M160,158 Q175,152 188,158" stroke="%2378350f" stroke-width="3" fill="none" stroke-linecap="round" />
  <path d="M212,158 Q225,152 240,158" stroke="%2378350f" stroke-width="3" fill="none" stroke-linecap="round" />

  <!-- Eyes - Nụ cười rạng ngời, ánh mắt ấm áp -->
  <ellipse cx="174" cy="175" rx="7" ry="9" fill="%231e293b" />
  <ellipse cx="226" cy="175" rx="7" ry="9" fill="%231e293b" />
  <circle cx="176" cy="173" r="2.5" fill="%23ffffff" />
  <circle cx="228" cy="173" r="2.5" fill="%23ffffff" />
  <!-- Eyelashes -->
  <path d="M166,168 Q174,164 182,168" stroke="%230f172a" stroke-width="2.5" fill="none" />
  <path d="M218,168 Q226,164 234,168" stroke="%230f172a" stroke-width="2.5" fill="none" />

  <!-- Cheerful Nose & Radiant Smile (NỤ CƯỜI RẠNG RỠ) -->
  <path d="M198,193 Q200,200 202,193" stroke="%23f97316" stroke-width="1.8" fill="none" />
  <path d="M180,214 Q200,236 220,214" stroke="%23e11d48" stroke-width="3.5" fill="%23ffe4e6" stroke-linecap="round" />
  <!-- Rosy Cheeks -->
  <ellipse cx="158" cy="195" rx="9" ry="5" fill="%23fb7185" opacity="0.4" />
  <ellipse cx="242" cy="195" rx="9" ry="5" fill="%23fb7185" opacity="0.4" />

  <!-- Badge at bottom corner: GV02 / Cô Thẩm -->
  <rect x="110" y="350" width="180" height="36" rx="18" fill="%230d9488" stroke="%232dd4bf" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="14" fill="%23ffffff" text-anchor="middle" letter-spacing="1">CÔ THẨM • VẬT LÍ</text>
</svg>`;

export const GV03_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%233b0764" />
      <stop offset="50%" stop-color="%23581c87" />
      <stop offset="100%" stop-color="%23ec4899" />
    </linearGradient>
    <linearGradient id="skinGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%23fef08a" />
      <stop offset="100%" stop-color="%23fed7aa" />
    </linearGradient>
    <linearGradient id="suitGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23f43f5e" />
      <stop offset="100%" stop-color="%23a855f7" />
    </linearGradient>
  </defs>

  <!-- Background with TikTok Neon / Modern Creator Aura -->
  <rect width="400" height="400" rx="36" fill="url(%23bgGrad3)" />
  <circle cx="200" cy="180" r="140" fill="%23f472b6" opacity="0.2" />

  <!-- Glowing Soundwaves & Creator Sparkles in Background -->
  <circle cx="90" cy="90" r="16" stroke="%2306b6d4" stroke-width="3" fill="none" opacity="0.7" />
  <circle cx="310" cy="100" r="12" stroke="%23f43f5e" stroke-width="3" fill="none" opacity="0.7" />
  <path d="M70,180 Q85,160 100,180 T130,180" stroke="%2306b6d4" stroke-width="2.5" fill="none" opacity="0.5" />
  <path d="M280,180 Q295,200 310,180 T340,180" stroke="%23f43f5e" stroke-width="2.5" fill="none" opacity="0.5" />

  <!-- Modern Short/Bob Hairstyle with Trendy Highlights (TÓC NGẮN / TÓC CÁ TÍNH) -->
  <path d="M130,165 Q125,100 200,95 Q275,100 270,165 Q255,195 240,210 Q200,120 160,210 Q140,195 130,165 Z" fill="%231e1b4b" />
  <!-- Trendy colored strand (Hóa chất & Video sáng tạo) -->
  <path d="M145,150 Q155,190 160,215" stroke="%23ec4899" stroke-width="4" stroke-linecap="round" fill="none" />
  <path d="M255,150 Q245,190 240,215" stroke="%2306b6d4" stroke-width="4" stroke-linecap="round" fill="none" />

  <!-- Body / Trendy Fashion Outfit (ÁO HỒNG TÍM / TRANG PHỤC NĂNG ĐỘNG) -->
  <path d="M110,380 L110,330 Q120,280 200,280 Q280,280 290,330 L290,380 Z" fill="url(%23suitGrad3)" stroke="%23f472b6" stroke-width="3" />
  
  <!-- Collar & Stylish White T-Shirt Underneath -->
  <polygon points="175,280 200,320 225,280" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2" />
  <circle cx="200" cy="305" r="4" fill="%23ec4899" />

  <!-- Neck -->
  <rect x="185" y="240" width="30" height="46" rx="8" fill="url(%23skinGrad3)" />

  <!-- Head / Face -->
  <ellipse cx="200" cy="180" rx="58" ry="68" fill="url(%23skinGrad3)" stroke="%23fbbf24" stroke-width="2" />

  <!-- Modern Stylish Round Glasses (KÍNH TRÒN SÀNH ĐIỆU - Clue 4 Visual) -->
  <circle cx="170" cy="175" r="22" fill="%23fdf4ff" fill-opacity="0.35" stroke="%23f43f5e" stroke-width="3.5" />
  <circle cx="230" cy="175" r="22" fill="%23fdf4ff" fill-opacity="0.35" stroke="%2306b6d4" stroke-width="3.5" />
  <line x1="192" y1="175" x2="208" y2="175" stroke="%23f43f5e" stroke-width="3.5" />

  <!-- Eyes behind modern glasses -->
  <ellipse cx="170" cy="175" rx="6" ry="8" fill="%230f172a" />
  <ellipse cx="230" cy="175" rx="6" ry="8" fill="%230f172a" />
  <circle cx="172" cy="173" r="2" fill="%23ffffff" />
  <circle cx="232" cy="173" r="2" fill="%23ffffff" />

  <!-- Cheerful smile with bright lip color -->
  <path d="M198,194 Q200,200 202,194" stroke="%23d97706" stroke-width="2" fill="none" />
  <path d="M182,216 Q200,235 218,216" stroke="%23e11d48" stroke-width="3.5" fill="%23fb7185" stroke-linecap="round" />

  <!-- Cute Star / Heart Sticker under eye (Tiktoker style) -->
  <polygon points="152,198 154,203 159,203 155,206 157,211 152,208 147,211 149,206 145,203 150,203" fill="%23ec4899" />

  <!-- Badge at bottom corner: GV03 / Cô Mai -->
  <rect x="110" y="350" width="180" height="36" rx="18" fill="%23db2777" stroke="%23f472b6" stroke-width="2" />
  <text x="200" y="373" font-family="sans-serif" font-weight="900" font-size="14" fill="%23ffffff" text-anchor="middle" letter-spacing="1">CÔ MAI • HOA HOC</text>
</svg>`;

/**
 * 3 Official Active Teachers for Round 2:
 * GV01: NGUYEN MINH TIEN (Thầy Tiến)
 * GV02: LE THI MY THAM (Cô Thẩm)
 * GV03: LE THI HONG MAI (Cô Mai)
 */
export const officialTeachersData: Teacher[] = [
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
    clueAnswers: [
      'hoa hoc',
      '10,11,12',
      'doc toan than',
      'ca vat',
    ],
    clueAcceptedAnswers: [
      // Clue 1: Môn dạy (hoa hoc, hoahoc)
      ['hoa hoc', 'hoahoc', 'hoa', 'mon hoa hoc', 'mon hoa', 'chemistry'],
      // Clue 2: Khối dạy (10,11,12)
      ['10,11,12', '10 11 12', '10 11 va 12', 'ca 3 khoi', 'khoi 10 11 12', '10 11 12'],
      // Clue 3: Đặc điểm (doc toan than, da tai)
      ['doc toan than', 'da tai', 'doc than', 'doc toan than da tai', 'rat da tai', 'single'],
      // Clue 4: Avatar visual features (ca vat, kinh, ao so mi, toc)
      ['ca vat', 'cavat', 'kinh', 'kinh can', 'ao so mi', 'so mi', 'toc', 'caravat', 'tie'],
    ],
    options: ['Thầy Nguyễn Minh Tiến', 'Thầy Lê Quang Đạt', 'Thầy Trần Đình Trí', 'Thầy Hoàng Minh Vũ'],
    correctAnswer: 'NGUYEN MINH TIEN',
    points: 100, // 40 + 30 + 20 + 10 = 100 pts
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
    clueAnswers: [
      'vat li',
      '11,12',
      '2 em be sieu quay',
      'toc dai',
    ],
    clueAcceptedAnswers: [
      // Clue 1: Môn dạy (vat li, vatly)
      ['vat li', 'vatly', 'vat ly', 'mon vat li', 'mon vat ly', 'physics'],
      // Clue 2: Khối dạy (11,12)
      ['11,12', '11 12', '11 va 12', 'khoi 11 12', 'khoi 11 va 12'],
      // Clue 3: Đặc điểm (2 em be sieu quay, 2 em be)
      ['2 em be sieu quay', '2 em be', 'hai em be sieu quay', 'hai em be', '2 con sieu quay', '2 em be quay'],
      // Clue 4: Avatar visual features (toc dai, trang phuc mau xanh, nu cuoi, ao xanh)
      ['toc dai', 'trang phuc mau xanh', 'ao xanh', 'nu cuoi', 'bong tai', 'phu kien', 'kieu toc', 'vay xanh'],
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
    clueAnswers: [
      'hoa hoc',
      '11,12',
      'tiktoker',
      'kinh tron',
    ],
    clueAcceptedAnswers: [
      // Clue 1: Môn dạy (hoa hoc, hoahoc)
      ['hoa hoc', 'hoahoc', 'hoa', 'mon hoa hoc', 'mon hoa', 'chemistry'],
      // Clue 2: Khối dạy (11,12)
      ['11,12', '11 12', '11 va 12', 'khoi 11 12', 'khoi 11 va 12'],
      // Clue 3: Đặc điểm (tiktoker, tik tok, tiktok)
      ['tiktoker', 'tik tok', 'tiktok', 'idol tiktok', 'sang tao video', 'creator'],
      // Clue 4: Avatar visual features (kinh tron, kinh, toc ngan, ao hong, ngoi sao)
      ['kinh tron', 'kinh', 'kinh mat', 'toc ngan', 'ao hong', 'ngoi sao', 'phu kien'],
    ],
    options: ['Cô Lê Thị Hồng Mai', 'Cô Vũ Thị Thu Hà', 'Cô Phan Khánh Linh', 'Cô Hoàng Yến Nhi'],
    correctAnswer: 'LE THI HONG MAI',
    points: 100,
    timeLimit: 90,
    active: true,
  },
];
