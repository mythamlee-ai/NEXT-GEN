import { ScienceKeyword, PlayerRank, Team } from '../types';

export const DEFAULT_SCIENCE_KEYWORDS: ScienceKeyword[] = [
  // VÒNG 1: KHOA HỌC CƠ BẢN (13 từ khóa)
  {
    id: 'kw-r1-01',
    name: 'Lực',
    round: 1,
    category: 'physics',
    categoryLabel: 'Vật Lí',
    points: 10,
    difficulty: 1,
    isSecret: false,
    description: 'Đại lượng vật lí biểu thị tác dụng của vật này lên vật khác, gây ra gia tốc hoặc biến dạng.',
    hint: 'Xuất hiện khi có sự đẩy, kéo hoặc tương tác giữa hai vật.',
    active: true,
  },
  {
    id: 'kw-r1-02',
    name: 'Năng lượng',
    round: 1,
    category: 'physics',
    categoryLabel: 'Vật Lí',
    points: 10,
    difficulty: 1,
    isSecret: false,
    description: 'Khả năng sinh công hoặc tạo ra nhiệt của một hệ vật lí; không tự sinh ra và không tự mất đi.',
    hint: 'Đơn vị đo chuẩn quốc tế là Joule (J).',
    active: true,
  },
  {
    id: 'kw-r1-03',
    name: 'Điện',
    round: 1,
    category: 'physics',
    categoryLabel: 'Vật Lí',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Dòng chuyển dịch có hướng của các hạt mang điện tích (electron, ion).',
    hint: 'Nguồn sức mạnh vận hành mọi mạch điện tử hiện đại.',
    active: true,
  },
  {
    id: 'kw-r1-04',
    name: 'Từ trường',
    round: 1,
    category: 'physics',
    categoryLabel: 'Vật Lí',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Môi trường vật chất đặc biệt sinh ra xung quanh các điện tích chuyển động hoặc nam châm.',
    hint: 'Tương tác với kim la bàn và các dòng điện.',
    active: true,
  },
  {
    id: 'kw-r1-05',
    name: 'Ánh sáng',
    round: 1,
    category: 'physics',
    categoryLabel: 'Vật Lí',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Bức xạ điện từ có bước sóng trong vùng quang phổ nhìn thấy được bởi mắt người; photon lượng tử.',
    hint: 'Vận tốc xấp xỉ 300.000 km/s trong chân không.',
    active: true,
  },
  {
    id: 'kw-r1-06',
    name: 'Nguyên tử',
    round: 1,
    category: 'chemistry',
    categoryLabel: 'Hóa Học',
    points: 10,
    difficulty: 1,
    isSecret: false,
    description: 'Hạt vô cùng nhỏ cấu tạo nên vật chất, gồm hạt nhân mang điện dương và đám mây electron âm.',
    hint: 'Viên gạch cơ bản của bảng tuần hoàn hóa học Mendeleev.',
    active: true,
  },
  {
    id: 'kw-r1-07',
    name: 'Phân tử',
    round: 1,
    category: 'chemistry',
    categoryLabel: 'Hóa Học',
    points: 10,
    difficulty: 1,
    isSecret: false,
    description: 'Nhóm gồm hai hay nhiều nguyên tử liên kết với nhau bằng các liên kết hóa học.',
    hint: 'Đại diện cho tính chất hóa học của chất nguyên chất.',
    active: true,
  },
  {
    id: 'kw-r1-08',
    name: 'Phản ứng hóa học',
    round: 1,
    category: 'chemistry',
    categoryLabel: 'Hóa Học',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Quá trình biến đổi từ chất này thành chất khác thông qua sự bẻ gãy và tái tạo liên kết.',
    hint: 'Kèm theo sự thay đổi năng lượng (tỏa nhiệt hoặc thu nhiệt).',
    active: true,
  },
  {
    id: 'kw-r1-09',
    name: 'Axit – Bazơ',
    round: 1,
    category: 'chemistry',
    categoryLabel: 'Hóa Học',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Cặp hợp chất nền tảng định nghĩa môi trường pH: cho nhận proton H+ hoặc electron.',
    hint: 'Làm đổi màu giấy quỳ tím: đỏ (axit), xanh (bazơ).',
    active: true,
  },
  {
    id: 'kw-r1-10',
    name: 'Tế bào',
    round: 1,
    category: 'biology',
    categoryLabel: 'Sinh Học',
    points: 10,
    difficulty: 1,
    isSecret: false,
    description: 'Đơn vị cấu tạo và chức năng cơ bản của mọi sinh vật sống trên Trái Đất.',
    hint: 'Gồm màng sinh chất, tế bào chất và nhân/vùng nhân.',
    active: true,
  },
  {
    id: 'kw-r1-11',
    name: 'ADN',
    round: 1,
    category: 'biology',
    categoryLabel: 'Sinh Học',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Axit Deoxyribonucleic - phân tử xoắn kép mang mã di truyền của mọi dạng sống.',
    hint: 'Cấu tạo từ 4 loại nuclêôtit: A, T, G, X.',
    active: true,
  },
  {
    id: 'kw-r1-12',
    name: 'Gen',
    round: 1,
    category: 'biology',
    categoryLabel: 'Sinh Học',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Một đoạn phân tử ADN mang thông tin mã hóa cho một chuỗi polypeptide hoặc phân tử ARN.',
    hint: 'Đơn vị di truyền quyết định các tính trạng của sinh vật.',
    active: true,
  },
  {
    id: 'kw-r1-13',
    name: 'Hệ sinh thái',
    round: 1,
    category: 'biology',
    categoryLabel: 'Sinh Học',
    points: 20,
    difficulty: 3,
    isSecret: false,
    description: 'Hệ thống hoàn chỉnh gồm quần xã sinh vật và sinh cảnh xung quanh cùng tương tác.',
    hint: 'Có chu trình tuần hoàn vật chất và dòng năng lượng liên tục.',
    active: true,
  },

  // VÒNG 2: CON NGƯỜI & CÔNG NGHỆ (5 từ khóa)
  {
    id: 'kw-r2-01',
    name: 'Giáo viên',
    round: 2,
    category: 'technology',
    categoryLabel: 'Nhân Lực',
    points: 10,
    difficulty: 1,
    isSecret: false,
    description: 'Người truyền cảm hứng tri thức khoa học, dẫn dắt thế hệ Next Gen tại Trường Pétrus Ký.',
    hint: 'Những người thầy, người cô tuyệt vời trong vòng thi AI ĐÂY.',
    active: true,
  },
  {
    id: 'kw-r2-02',
    name: 'Nhà khoa học',
    round: 2,
    category: 'technology',
    categoryLabel: 'Tiên Phong',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Người thực hiện các nghiên cứu có hệ thống để khám phá các quy luật tự nhiên và vũ trụ.',
    hint: 'Những bộ óc vĩ đại như Einstein, Newton, Marie Curie.',
    active: true,
  },
  {
    id: 'kw-r2-03',
    name: 'Trí tuệ nhân tạo',
    round: 2,
    category: 'technology',
    categoryLabel: 'AI Tech',
    points: 20,
    difficulty: 3,
    isSecret: false,
    description: 'Hệ thống máy tính có khả năng mô phỏng tư duy, học tập và giải quyết vấn đề của con người.',
    hint: 'Trí tuệ số học máy, mạng nơ-ron và mô hình ngôn ngữ lớn.',
    active: true,
  },
  {
    id: 'kw-r2-04',
    name: 'Robot',
    round: 2,
    category: 'technology',
    categoryLabel: 'Tự Động Hóa',
    points: 20,
    difficulty: 3,
    isSecret: false,
    description: 'Cỗ máy cơ điện tử tự hành hoặc điều khiển từ xa, thực hiện nhiệm vụ phức tạp thay con người.',
    hint: 'Trợ thủ số đắc lực trong mọi trạm thí nghiệm không gian.',
    active: true,
  },
  {
    id: 'kw-r2-05',
    name: 'Sáng tạo',
    round: 2,
    category: 'special',
    categoryLabel: 'Tư Duy',
    points: 25,
    difficulty: 4,
    isSecret: false,
    description: 'Khả năng tạo ra những ý tưởng mới mẻ, độc đáo và giải pháp đột phá chưa từng có.',
    hint: 'Phẩm chất cốt lõi của nhà thám hiểm Next Gen.',
    active: true,
  },

  // VÒNG 3: QUAN SÁT & SUY LUẬN (6 từ khóa)
  {
    id: 'kw-r3-01',
    name: 'Quan sát',
    round: 3,
    category: 'logic',
    categoryLabel: 'Kỹ Năng',
    points: 10,
    difficulty: 1,
    isSecret: false,
    description: 'Bước đầu tiên trong phương pháp nghiên cứu khoa học: thu thập dữ liệu bằng giác quan và dụng cụ.',
    hint: 'Nhìn sâu vào các chi tiết ẩn giấu của câu đố hình ảnh.',
    active: true,
  },
  {
    id: 'kw-r3-02',
    name: 'Suy luận',
    round: 3,
    category: 'logic',
    categoryLabel: 'Kỹ Năng',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Quá trình tư duy đi từ tiền đề đã biết để rút ra kết luận logic xác thực.',
    hint: 'Nối kết các manh mối rải rác trong mật thư khoa học.',
    active: true,
  },
  {
    id: 'kw-r3-03',
    name: 'Liên tưởng',
    round: 3,
    category: 'logic',
    categoryLabel: 'Tư Duy',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Sự kết nối giữa các khái niệm khác nhau trong bộ nhớ, gợi mở góc nhìn mới.',
    hint: 'Cầu nối giữa hiện tượng đời thực và định luật tự nhiên.',
    active: true,
  },
  {
    id: 'kw-r3-04',
    name: 'Logic',
    round: 3,
    category: 'logic',
    categoryLabel: 'Tư Duy',
    points: 20,
    difficulty: 3,
    isSecret: false,
    description: 'Quy luật của tư duy đúng đắn, chặt chẽ và không mâu thuẫn.',
    hint: 'Bảo đảm tính thuyết phục và chuẩn xác của đáp án.',
    active: true,
  },
  {
    id: 'kw-r3-05',
    name: 'Giải mã',
    round: 3,
    category: 'logic',
    categoryLabel: 'Thực Hành',
    points: 20,
    difficulty: 3,
    isSecret: false,
    description: 'Phân tích và biến đổi tín hiệu mật mã thành thông điệp có ý nghĩa rõ ràng.',
    hint: 'Mở khóa bí ẩn ẩn giấu sau các bức tranh ma trận.',
    active: true,
  },
  {
    id: 'kw-r3-06',
    name: 'Khám phá',
    round: 3,
    category: 'logic',
    categoryLabel: 'Hành Trình',
    points: 25,
    difficulty: 4,
    isSecret: false,
    description: 'Tìm ra những điều mới lạ, những quy luật chưa được biết đến trong tự nhiên.',
    hint: 'Động lực không ngừng đưa nhân loại vươn tới các vì sao.',
    active: true,
  },

  // VÒNG 4: CÔNG NGHỆ & TƯƠNG LAI (7 từ khóa)
  {
    id: 'kw-r4-01',
    name: 'Camera',
    round: 4,
    category: 'technology',
    categoryLabel: 'Phần Cứng',
    points: 15,
    difficulty: 2,
    isSecret: false,
    description: 'Thiết bị quang điện tử ghi lại hình ảnh tĩnh hoặc video thời gian thực.',
    hint: 'Mắt thần quét mã QR và tương tác thị giác máy tính.',
    active: true,
  },
  {
    id: 'kw-r4-02',
    name: 'Mã QR',
    round: 4,
    category: 'technology',
    categoryLabel: 'Mã Hóa',
    points: 20,
    difficulty: 2,
    isSecret: false,
    description: 'Quick Response Code - ma trận mã vạch 2 chiều lưu trữ dữ liệu với tốc độ đọc cực cao.',
    hint: 'Cửa ngõ kết nối không gian vật lí và thế giới số.',
    active: true,
  },
  {
    id: 'kw-r4-03',
    name: 'AI Vision',
    round: 4,
    category: 'technology',
    categoryLabel: 'AI Tech',
    points: 25,
    difficulty: 3,
    isSecret: false,
    description: 'Thị giác máy tính ứng dụng trí tuệ nhân tạo để nhận diện khuôn mặt và vật thể.',
    hint: 'Giúp robot và máy móc thấu hiểu môi trường quanh chúng.',
    active: true,
  },
  {
    id: 'kw-r4-04',
    name: 'Công nghệ',
    round: 4,
    category: 'technology',
    categoryLabel: 'Khoa Học',
    points: 20,
    difficulty: 3,
    isSecret: false,
    description: 'Tập hợp các kỹ thuật, kỹ năng, phương pháp dùng trong sản xuất và nghiên cứu khoa học.',
    hint: 'Đòn bẩy nâng cao đời sống và năng suất nhân loại.',
    active: true,
  },
  {
    id: 'kw-r4-05',
    name: 'Dữ liệu',
    round: 4,
    category: 'technology',
    categoryLabel: 'Thông Tin',
    points: 20,
    difficulty: 3,
    isSecret: false,
    description: 'Dầu mỏ của kỷ nguyên số: tập hợp các giá trị, thông tin được xử lý bởi máy tính.',
    hint: 'Cơ sở để huấn luyện các thuật toán thông minh.',
    active: true,
  },
  {
    id: 'kw-r4-06',
    name: 'Kết nối',
    round: 4,
    category: 'technology',
    categoryLabel: 'Mạng Lưới',
    points: 25,
    difficulty: 4,
    isSecret: false,
    description: 'Sự liên thông giữa các thiết bị, con người và tri thức qua mạng lưới toàn cầu.',
    hint: 'Sức mạnh đồng đội và giao thức mạng thế hệ mới.',
    active: true,
  },
  {
    id: 'kw-r4-07',
    name: 'Khám phá vũ trụ',
    round: 4,
    category: 'space',
    categoryLabel: 'Vũ Trụ',
    points: 25,
    difficulty: 4,
    isSecret: false,
    description: 'Hành trình vượt ra ngoài bầu khí quyển Trái Đất để thám hiểm không gian vũ trụ bao la.',
    hint: 'Vươn tới trạm quỹ đạo và các thiên hà xa xôi.',
    active: true,
  },

  // TỪ KHÓA ẨN (SECRET KEYWORDS) - 4 từ khóa đặc biệt
  {
    id: 'kw-sec-01',
    name: 'KHOA HỌC',
    round: 'secret',
    category: 'special',
    categoryLabel: 'Huyền Thoại',
    points: 50,
    difficulty: 4,
    isSecret: true,
    description: 'Hệ thống tri thức về tự nhiên, xã hội và tư duy được kiểm chứng qua thực tiễn.',
    hint: 'Mở khóa khi hoàn thành xuất sắc các thử thách chính của cuộc thi.',
    active: true,
  },
  {
    id: 'kw-sec-02',
    name: 'SÁNG TẠO',
    round: 'secret',
    category: 'special',
    categoryLabel: 'Huyền Thoại',
    points: 50,
    difficulty: 4,
    isSecret: true,
    description: 'Tia lửa năng lượng biến những ý tưởng táo bạo thành hiện thực vĩ đại.',
    hint: 'Mở khóa khi giải mã chuỗi manh mối bí mật trong trạm AI ĐÂY.',
    active: true,
  },
  {
    id: 'kw-sec-03',
    name: 'CHINH PHỤC',
    round: 'secret',
    category: 'special',
    categoryLabel: 'Tối Thượng',
    points: 75,
    difficulty: 5,
    isSecret: true,
    description: 'Ý chí kiên định vượt qua mọi giới hạn để chạm tay vào đỉnh vinh quang tri thức.',
    hint: 'Mở khóa khi giải mã bức tranh ma trận tại Vòng 3 mà không cần gợi ý.',
    active: true,
  },
  {
    id: 'kw-sec-04',
    name: 'TRI ÂN',
    round: 'secret',
    category: 'special',
    categoryLabel: 'Chúa Tể',
    points: 100,
    difficulty: 5,
    isSecret: true,
    description: 'Lòng biết ơn sâu sắc dành cho những người thầy, người cô đã dẫn đường và truyền cảm hứng trên hành trình tri thức.',
    hint: 'Mật mã tối mật Vòng 4 – Món quà tri ân Ngày Nhà giáo Việt Nam 20/11!',
    active: true,
  },
];

const KEYWORDS_STORAGE_KEY = 'pek_science_keywords_db';

class KeywordService {
  public getKeywords(): ScienceKeyword[] {
    if (typeof window === 'undefined') return DEFAULT_SCIENCE_KEYWORDS;
    try {
      const data = localStorage.getItem(KEYWORDS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Self-heal/migrate kw-sec-04 to TRI ÂN if it had an old name
          const sec04 = parsed.find((k: ScienceKeyword) => k.id === 'kw-sec-04');
          if (sec04 && sec04.name !== 'TRI ÂN') {
            sec04.name = 'TRI ÂN';
            sec04.description = 'Lòng biết ơn sâu sắc dành cho những người thầy, người cô đã dẫn đường và truyền cảm hứng trên hành trình tri thức.';
            sec04.hint = 'Mật mã tối mật Vòng 4 – Món quà tri ân Ngày Nhà giáo Việt Nam 20/11!';
            this.saveKeywords(parsed);
          }
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    this.saveKeywords(DEFAULT_SCIENCE_KEYWORDS);
    return DEFAULT_SCIENCE_KEYWORDS;
  }

  public saveKeywords(keywords: ScienceKeyword[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYWORDS_STORAGE_KEY, JSON.stringify(keywords));
  }

  public getKeywordById(id: string): ScienceKeyword | undefined {
    return this.getKeywords().find((k) => k.id === id);
  }

  public getKeywordsByRound(round: number | 'secret'): ScienceKeyword[] {
    return this.getKeywords().filter((k) => k.round === round && k.active);
  }

  public getTeamKeywords(team: Team): ScienceKeyword[] {
    const unlockedIds = new Set(team.unlockedKeywordIds || team.unlockedKeywords || []);
    return this.getKeywords().filter((k) => unlockedIds.has(k.id));
  }

  public calculateKeywordScore(team: Team): number {
    const keywords = this.getTeamKeywords(team);
    return keywords.reduce((sum, k) => sum + (k.points || 0), 0);
  }

  public calculateTotalScore(team: Team): number {
    const questionScore = Object.values(team.roundScores || {}).reduce((a, b) => a + (b || 0), 0);
    const kwScore = this.calculateKeywordScore(team);
    return questionScore + kwScore;
  }

  public unlockKeywordForTeam(team: Team, keywordId: string): { updatedTeam: Team; keyword: ScienceKeyword; alreadyUnlocked: boolean } | null {
    const keyword = this.getKeywordById(keywordId);
    if (!keyword) return null;

    const existingIds = new Set(team.unlockedKeywordIds || team.unlockedKeywords || []);
    if (existingIds.has(keywordId)) {
      return { updatedTeam: team, keyword, alreadyUnlocked: true };
    }

    existingIds.add(keywordId);
    const newUnlockedIds = Array.from(existingIds);
    const updatedTeam: Team = {
      ...team,
      unlockedKeywordIds: newUnlockedIds,
      unlockedKeywords: newUnlockedIds,
    };

    const newKwScore = this.calculateKeywordScore(updatedTeam);
    updatedTeam.keywordScore = newKwScore;
    updatedTeam.score = this.calculateTotalScore(updatedTeam);

    return { updatedTeam, keyword, alreadyUnlocked: false };
  }

  public getAllKeywords(): ScienceKeyword[] {
    return this.getKeywords();
  }

  public updateKeyword(id: string, updates: Partial<ScienceKeyword>): void {
    const list = this.getKeywords().map((k) => (k.id === id ? { ...k, ...updates } : k));
    this.saveKeywords(list);
  }

  public deleteKeyword(id: string): void {
    const list = this.getKeywords().filter((k) => k.id !== id);
    this.saveKeywords(list);
  }

  public addKeyword(newKw: Omit<ScienceKeyword, 'id'>): ScienceKeyword {
    const id = 'kw-custom-' + Date.now();
    const created: ScienceKeyword = { ...newKw, id };
    const list = [...this.getKeywords(), created];
    this.saveKeywords(list);
    return created;
  }

  public resetToDefaults(): void {
    this.saveKeywords(DEFAULT_SCIENCE_KEYWORDS);
  }

  public getRank(totalPoints: number): PlayerRank {
    if (totalPoints >= 800) {
      return {
        rank: 'NEXT GEN CHAMPION',
        badge: '🌌',
        color: 'from-amber-400 via-pink-500 to-purple-600 text-amber-300',
        glow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)] border-amber-400',
        minPoints: 800,
        maxPoints: 9999,
      };
    }
    if (totalPoints >= 500) {
      return {
        rank: 'SCIENCE HERO',
        badge: '🚀',
        color: 'from-cyan-400 via-blue-500 to-indigo-600 text-cyan-300',
        glow: 'shadow-[0_0_25px_rgba(6,182,212,0.5)] border-cyan-400',
        minPoints: 500,
        maxPoints: 799,
      };
    }
    if (totalPoints >= 250) {
      return {
        rank: 'SCIENCE MASTER',
        badge: '⚡',
        color: 'from-purple-400 via-fuchsia-500 to-pink-500 text-fuchsia-300',
        glow: 'shadow-[0_0_20px_rgba(217,70,239,0.5)] border-fuchsia-400',
        minPoints: 250,
        maxPoints: 499,
      };
    }
    if (totalPoints >= 100) {
      return {
        rank: 'SCIENCE EXPLORER',
        badge: '🧪',
        color: 'from-emerald-400 via-teal-500 to-cyan-500 text-emerald-300',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)] border-emerald-400',
        minPoints: 100,
        maxPoints: 249,
      };
    }
    return {
      rank: 'NEW EXPLORER',
      badge: '🔹',
      color: 'from-sky-400 to-blue-500 text-sky-300',
      glow: 'shadow-[0_0_15px_rgba(56,189,248,0.4)] border-sky-400',
      minPoints: 0,
      maxPoints: 99,
    };
  }
}

export const keywordService = new KeywordService();
