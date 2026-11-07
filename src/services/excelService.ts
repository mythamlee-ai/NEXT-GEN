import * as XLSX from 'xlsx';
import { Question, Teacher, PicturePuzzle, Challenge, Team } from '../types';
import { storageService } from './storageService';
import { ScoringEngine } from './scoringEngine';

export class ExcelService {
  /**
   * Generates and downloads a standardized template Excel file for PeK Science Quest
   */
  public static downloadTemplate() {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Vong1_LyHoaSinh
    const r1Data = [
      {
        Ma_Cau_Hoi: 'phy-01',
        Mon_Hoc: 'Vật lý', // 'Vật lý' | 'Hóa học' | 'Sinh học'
        Chu_De: 'Quang học & Sóng ánh sáng',
        Do_Kho: 'Dễ', // 'Dễ' | 'Trung bình' | 'Khó'
        Cau_Hoi: 'Hiện tượng tán sắc ánh sáng của Newton qua lăng kính chứng minh điều gì?',
        Dap_An_A: 'Ánh sáng trắng là tập hợp của vô số ánh sáng đơn sắc từ đỏ đến tím',
        Dap_An_B: 'Lăng kính đã tự nhuộm màu cho chùm ánh sáng trắng đi qua',
        Dap_An_C: 'Mọi ánh sáng đơn sắc đều có cùng vận tốc trong thuỷ tinh',
        Dap_An_D: 'Ánh sáng đỏ bị lệch nhiều nhất khi đi qua lăng kính',
        Dap_An_Dung: 'A', // 'A' | 'B' | 'C' | 'D'
        Giai_Thich: 'Ánh sáng trắng là hỗn hợp của nhiều ánh sáng đơn sắc...',
        Diem_So: 10,
        Thoi_Gian_Giay: 45,
      },
      {
        Ma_Cau_Hoi: 'che-01',
        Mon_Hoc: 'Hóa học',
        Chu_De: 'Bảng tuần hoàn',
        Do_Kho: 'Dễ',
        Cau_Hoi: 'Khí nào chiếm tỉ lệ thể tích lớn nhất trong bầu khí quyển Trái Đất?',
        Dap_An_A: 'Khí Ôxi (O2)',
        Dap_An_B: 'Khí Nitơ (N2)',
        Dap_An_C: 'Khí Argon (Ar)',
        Dap_An_D: 'Khí Cacbonic (CO2)',
        Dap_An_Dung: 'B',
        Giai_Thich: 'Khí Nitơ chiếm xấp xỉ 78% thể tích không khí...',
        Diem_So: 10,
        Thoi_Gian_Giay: 45,
      },
      {
        Ma_Cau_Hoi: 'bio-01',
        Mon_Hoc: 'Sinh học',
        Chu_De: 'Sinh học tế bào',
        Do_Kho: 'Dễ',
        Cau_Hoi: 'Bào quan nào được ví như "nhà máy năng lượng" của tế bào sinh vật nhân thực?',
        Dap_An_A: 'Ti thể (Mitochondria)',
        Dap_An_B: 'Bộ máy Golgi',
        Dap_An_C: 'Lưới nội chất hạt',
        Dap_An_D: 'Ribôxôm tự do',
        Dap_An_Dung: 'A',
        Giai_Thich: 'Ti thể thực hiện hô hấp tế bào tổng hợp ATP...',
        Diem_So: 10,
        Thoi_Gian_Giay: 45,
      },
    ];
    const ws1 = XLSX.utils.json_to_sheet(r1Data);
    XLSX.utils.book_append_sheet(wb, ws1, 'Vong1_LyHoaSinh');

    // Sheet 2: Vong2_GiaoVien
    const r2Data = [
      {
        Ma_Dinh_Danh: 'GV01',
        Ho_Va_Ten: 'NGUYEN MINH TIEN',
        Ten_Hien_Thi: 'Thầy Tiến',
        Bo_Mon: 'HOA HOC',
        Khoi_Day: '10, 11, 12',
        Lop_Chu_Nhiem: '11.1',
        Dac_Diem: 'DOC TOAN THAN, DA TAI',
        Goi_Y_1: 'Nơi những phản ứng, chất và thế giới phân tử trở thành những câu chuyện đầy bất ngờ.',
        Dap_An_Clue_1: 'hoa hoc',
        Goi_Y_2: 'Nhân vật này có thể đồng hành cùng học sinh ở cả ba khối của THPT.',
        Dap_An_Clue_2: '10,11,12',
        Goi_Y_3: 'Nhân vật này không chỉ có một "hệ kỹ năng" — càng khám phá càng thấy nhiều tài lẻ.',
        Dap_An_Clue_3: 'doc toan than',
        Goi_Y_4: 'Trang phục lịch lãm với áo sơ mi, cà vạt xanh và cặp kính cận tri thức tỏa sáng.',
        Dap_An_Clue_4: 'ca vat',
        Diem_Toi_Da: 100,
        Thoi_Gian_Giay: 90,
      },
    ];
    const ws2 = XLSX.utils.json_to_sheet(r2Data);
    XLSX.utils.book_append_sheet(wb, ws2, 'Vong2_GiaoVien');

    // Sheet 3: Vong3_DuoiHinh
    const r3Data = [
      {
        Ma_Cau_Do: 'puz-01',
        Chu_De: 'Vật lý Hiện đại',
        Kieu_Cau_Hoi: 'Trắc nghiệm', // 'Trắc nghiệm' | 'Tự luận'
        Hinh_Anh_URL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        Cau_Do: 'Hiện tượng không gian cong uốn lượn xung quanh vật thể có khối lượng khổng lồ là gì?',
        Dap_An_A: 'Thấu kính hấp dẫn (Gravitational Lensing)',
        Dap_An_B: 'Sóng âm siêu tần trong vũ trụ',
        Dap_An_C: 'Giao thoa ánh sáng đơn sắc',
        Dap_An_D: 'Phản xạ toàn phần',
        Dap_An_Chuan: 'A',
        Tu_Khoa_Dong_Nghia: 'THAU KINH HAP DAN',
        Giai_Thich: 'Theo Thuyết tương đối rộng, trường hấp dẫn bẻ cong ánh sáng...',
        Diem_So: 20,
        Thoi_Gian_Giay: 60,
      },
      {
        Ma_Cau_Do: 'puz-02',
        Chu_De: 'Hóa học & Sinh thái',
        Kieu_Cau_Hoi: 'Tự luận',
        Hinh_Anh_URL: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
        Cau_Do: 'Một phản ứng tỏa nhiệt cực mạnh giữa nhiên liệu và chất ôxi hóa phát ra ánh sáng. Từ khóa 2 từ: _ _ _ _ _ _ _ _ ?',
        Dap_An_A: '',
        Dap_An_B: '',
        Dap_An_C: '',
        Dap_An_D: '',
        Dap_An_Chuan: 'SỰ CHÁY',
        Tu_Khoa_Dong_Nghia: 'SU CHAY, PHAN UNG CHAY, CHAY',
        Giai_Thich: 'Sự cháy là phản ứng hóa học có tỏa nhiệt và phát ra ánh sáng...',
        Diem_So: 20,
        Thoi_Gian_Giay: 60,
      },
    ];
    const ws3 = XLSX.utils.json_to_sheet(r3Data);
    XLSX.utils.book_append_sheet(wb, ws3, 'Vong3_DuoiHinh');

    // Sheet 4: Vong4_MatMaQR
    const r4Data = [
      {
        Ma_Tram: 'ch-01',
        Tieu_De: 'MẬT MÃ CỦA ĐANH GIAO KHOA HỌC',
        Nhiem_Vu: 'Quét mã QR tại Trạm Cứu hộ Phòng Lab Tổ Tự Nhiên để kích hoạt Khóa Lượng Tử.',
        Cot_Truyen: 'Dữ liệu ghi nhận: Mật mã tối thượng ẩn giấu trong chuỗi phản ứng liên kết hydro...',
        Ma_QR_Du_Kien: 'PEK-QUANTUM-2026',
        Ten_Vat_Pham: 'Chìa Khóa Năng Lượng Lõi (The Quantum Core)',
        Diem_Thuong: 50,
        Thoi_Gian_Giay: 180,
      },
    ];
    const ws4 = XLSX.utils.json_to_sheet(r4Data);
    XLSX.utils.book_append_sheet(wb, ws4, 'Vong4_MatMaQR');

    XLSX.writeFile(wb, 'PEK_Mau_De_Thi_Khoa_Hoc.xlsx');
  }

  /**
   * Imports an Excel workbook and parses content into the Question Bank
   */
  public static async importExcel(file: File): Promise<{
    success: boolean;
    message: string;
    details?: { r1: number; r2: number; r3: number; r4: number };
  }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          let r1Count = 0;
          let r2Count = 0;
          let r3Count = 0;
          let r4Count = 0;

          // 1. Sheet Round 1
          const ws1Name = workbook.SheetNames.find((n) =>
            n.toLowerCase().includes('vong1') || n.toLowerCase().includes('round1')
          );
          if (ws1Name) {
            const rawR1 = XLSX.utils.sheet_to_json<any>(workbook.Sheets[ws1Name]);
            rawR1.forEach((row, idx) => {
              const subjRaw = (row.Mon_Hoc || '').toLowerCase();
              let subject: Question['subject'] = 'physics';
              if (subjRaw.includes('hóa') || subjRaw.includes('chem')) subject = 'chemistry';
              if (subjRaw.includes('sinh') || subjRaw.includes('bio')) subject = 'biology';

              const diffRaw = (row.Do_Kho || '').toLowerCase();
              let difficulty: Question['difficulty'] = 'medium';
              if (diffRaw.includes('dễ') || diffRaw.includes('easy')) difficulty = 'easy';
              if (diffRaw.includes('khó') || diffRaw.includes('hard')) difficulty = 'hard';

              const q: Question = {
                id: String(row.Ma_Cau_Hoi || `q-excel-${Date.now()}-${idx}`),
                round: 1,
                subject,
                topic: String(row.Chu_De || 'Khoa học phổ thông'),
                difficulty,
                type: 'mcq',
                question: String(row.Cau_Hoi || ''),
                options: {
                  A: String(row.Dap_An_A || ''),
                  B: String(row.Dap_An_B || ''),
                  C: String(row.Dap_An_C || ''),
                  D: String(row.Dap_An_D || ''),
                },
                correctAnswer: (String(row.Dap_An_Dung || 'A').toUpperCase() as any) || 'A',
                explanation: String(row.Giai_Thich || ''),
                points: Number(row.Diem_So) || (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20),
                timeLimit: Number(row.Thoi_Gian_Giay) || 45,
                active: true,
              };

              if (q.question.trim()) {
                storageService.saveQuestion(q);
                r1Count++;
              }
            });
          }

          // 2. Sheet Round 2 (Teachers)
          const ws2Name = workbook.SheetNames.find((n) =>
            n.toLowerCase().includes('vong2') || n.toLowerCase().includes('giaovien')
          );
          if (ws2Name) {
            const rawR2 = XLSX.utils.sheet_to_json<any>(workbook.Sheets[ws2Name]);
            rawR2.forEach((row, idx) => {
              const teacher: Teacher = {
                id: String(row.Ma_Dinh_Danh || `GV${String(idx + 1).padStart(2, '0')}`),
                round: 2,
                name: String(row.Ho_Va_Ten || ''),
                displayName: String(row.Ten_Hien_Thi || row.Ho_Va_Ten || ''),
                subject: String(row.Bo_Mon || 'Khoa học Tự nhiên'),
                department: String(row.To_Chuyen_Mon || 'Tổ KHTN PeK'),
                grades: String(row.Khoi_Day || '10, 11, 12'),
                homeroom: String(row.Lop_Chu_Nhiem || ''),
                characteristics: String(row.Dac_Diem || ''),
                image: String(
                  row.Hinh_Anh_URL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                ),
                clues: [
                  String(row.Goi_Y_1 || 'Gợi ý 1'),
                  String(row.Goi_Y_2 || 'Gợi ý 2'),
                  String(row.Goi_Y_3 || 'Gợi ý 3'),
                  String(row.Goi_Y_4 || 'Gợi ý 4'),
                ],
                clueAnswers: [
                  String(row.Dap_An_Clue_1 || 'hoa hoc'),
                  String(row.Dap_An_Clue_2 || '10,11,12'),
                  String(row.Dap_An_Clue_3 || 'dac diem'),
                  String(row.Dap_An_Clue_4 || 'avatar'),
                ],
                clueAcceptedAnswers: [
                  [String(row.Dap_An_Clue_1 || 'hoa hoc')],
                  [String(row.Dap_An_Clue_2 || '10,11,12')],
                  [String(row.Dap_An_Clue_3 || 'dac diem')],
                  [String(row.Dap_An_Clue_4 || 'avatar')],
                ],
                options: [
                  String(row.Dap_An_A || row.Ho_Va_Ten || ''),
                  String(row.Dap_An_B || 'Giáo viên B'),
                  String(row.Dap_An_C || 'Giáo viên C'),
                  String(row.Dap_An_D || 'Giáo viên D'),
                ],
                correctAnswer: String(row.Dap_An_Chuan || row.Ho_Va_Ten || ''),
                points: Number(row.Diem_Toi_Da) || 100,
                timeLimit: Number(row.Thoi_Gian_Giay) || 90,
                active: true,
              };

              if (teacher.name.trim()) {
                storageService.saveTeacher(teacher);
                r2Count++;
              }
            });
          }

          // 3. Sheet Round 3 (Puzzles)
          const ws3Name = workbook.SheetNames.find((n) =>
            n.toLowerCase().includes('vong3') || n.toLowerCase().includes('duoihinh')
          );
          if (ws3Name) {
            const rawR3 = XLSX.utils.sheet_to_json<any>(workbook.Sheets[ws3Name]);
            rawR3.forEach((row, idx) => {
              const isMcq = (row.Kieu_Cau_Hoi || '').toLowerCase().includes('trắc');
              const aliases = String(row.Tu_Khoa_Dong_Nghia || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);

              const puzzle: PicturePuzzle = {
                id: String(row.Ma_Cau_Do || `puz-excel-${idx}`),
                round: 3,
                topic: String(row.Chu_De || 'Khoa học'),
                type: isMcq ? 'mcq' : 'text',
                image: String(
                  row.Hinh_Anh_URL ||
                    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
                ),
                question: String(row.Cau_Do || ''),
                options: isMcq
                  ? {
                      A: String(row.Dap_An_A || ''),
                      B: String(row.Dap_An_B || ''),
                      C: String(row.Dap_An_C || ''),
                      D: String(row.Dap_An_D || ''),
                    }
                  : undefined,
                correctAnswer: String(row.Dap_An_Chuan || 'A'),
                acceptedAliases: aliases,
                explanation: String(row.Giai_Thich || ''),
                points: Number(row.Diem_So) || 20,
                timeLimit: Number(row.Thoi_Gian_Giay) || 60,
                active: true,
              };

              if (puzzle.question && puzzle.question.trim()) {
                storageService.savePuzzle(puzzle);
                r3Count++;
              }
            });
          }

          // 4. Sheet Round 4 (QR Challenges)
          const ws4Name = workbook.SheetNames.find((n) =>
            n.toLowerCase().includes('vong4') || n.toLowerCase().includes('matma') || n.toLowerCase().includes('qr')
          );
          if (ws4Name) {
            const rawR4 = XLSX.utils.sheet_to_json<any>(workbook.Sheets[ws4Name]);
            rawR4.forEach((row, idx) => {
              const challenge: Challenge = {
                id: String(row.Ma_Tram || `ch-excel-${idx}`),
                round: 4,
                type: 'qr',
                title: String(row.Tieu_De || 'Thử thách QR Trạm Thực Địa'),
                task: String(row.Nhiem_Vu || ''),
                clueStory: String(row.Cot_Truyen || ''),
                expectedCode: String(row.Ma_QR_Du_Kien || 'PEK-FINAL').toUpperCase(),
                secretArtifactName: String(row.Ten_Vat_Pham || 'Mật mã tối thượng'),
                points: Number(row.Diem_Thuong) || 50,
                timeLimit: Number(row.Thoi_Gian_Giay) || 180,
                active: true,
              };

              if (challenge.expectedCode.trim()) {
                storageService.saveChallenge(challenge);
                r4Count++;
              }
            });
          }

          resolve({
            success: true,
            message: `Nhập dữ liệu thành công từ file Excel: Đã cập nhật ${r1Count} câu Vòng 1, ${r2Count} giáo viên Vòng 2, ${r3Count} câu Vòng 3 và ${r4Count} trạm Vòng 4.`,
            details: { r1: r1Count, r2: r2Count, r3: r3Count, r4: r4Count },
          });
        } catch (err: unknown) {
          resolve({
            success: false,
            message: 'Không thể đọc file Excel. Vui lòng đảm bảo file có đúng định dạng .xlsx theo mẫu.',
          });
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
  /**
   * Exports full 10-column tournament ranking & individual member breakdown into Excel (.xlsx)
   */
  public static exportTournamentReport(teams: Team[]) {
    const wb = XLSX.utils.book_new();
    const sorted = [...teams].sort(ScoringEngine.compareTeams);

    // Sheet 1: Bang_Diem_Chuan_10_Cot
    const reportRows = sorted.map((t, idx) => {
      const r4 = t.round4State;
      const baseV4 = (t.roundScores[1] || 0) + (t.roundScores[2] || 0) + (t.roundScores[3] || 0);
      return {
        Thu_Hang: idx + 1,
        Ten_Doi: t.teamName,
        Lop: t.className,
        Ma_Doi: t.teamCode,
        Doi_Truong: t.captainName || (t.members && t.members[0]) || '',
        Diem_V1: t.roundScores[1] || 0,
        Diem_V2_Ca_Nhan: t.roundScores[2] || 0,
        Diem_V3: t.roundScores[3] || 0,
        Co_Ban_V4: baseV4,
        Thuong_V4: r4?.randomBonus || 0,
        Phat_V4: r4?.randomPenalty || 0,
        Toc_Do_V4: r4?.speedBonus || 0,
        Ma_Cuoi_V4: (r4?.finalBonus || 0) + (r4?.keywordScore || 0),
        Tong_Diem: t.score,
        Thoi_Gian_Thi_Dau: ScoringEngine.formatTime(t.elapsedTime),
        Trang_Thai: t.status === 'finished' ? 'Đã hoàn thành' : 'Đang thi đấu',
      };
    });

    const ws1 = XLSX.utils.json_to_sheet(reportRows);
    XLSX.utils.book_append_sheet(wb, ws1, 'Bang_Tong_Sap_10_Cot');

    // Sheet 2: Chi_Tiet_Thanh_Vien_Vong_2
    const memberRows: any[] = [];
    sorted.forEach((t) => {
      const members = t.members && t.members.length > 0 ? t.members : [t.captainName || 'Thành viên 1'];
      members.forEach((m, mIdx) => {
        const mScore =
          t.memberScores && t.memberScores[m] !== undefined
            ? t.memberScores[m]
            : Math.round((t.roundScores[2] || 0) / members.length);
        memberRows.push({
          Ten_Doi: t.teamName,
          Lop: t.className,
          Ten_Thanh_Vien: m,
          Vai_Tro: mIdx === 0 ? 'Đội trưởng' : 'Thành viên',
          Diem_Vong_2_Solo: mScore,
        });
      });
    });

    const ws2 = XLSX.utils.json_to_sheet(memberRows);
    XLSX.utils.book_append_sheet(wb, ws2, 'Diem_Ca_Nhan_Thanh_Vien');

    XLSX.writeFile(wb, `PEK_BANG_TONG_SAP_NEXT_GEN_${Date.now()}.xlsx`);
  }

  /**
   * Exports CSV file formatted cleanly with all 10 columns
   */
  public static exportToCsv(teams: Team[]) {
    const sorted = [...teams].sort(ScoringEngine.compareTeams);
    const headers = [
      'Thu Hang',
      'Ten Doi',
      'Lop',
      'Diem V1',
      'Diem V2 (Ca Nhan)',
      'Diem V3',
      'Co Ban V4',
      'Thuong V4',
      'Phat V4',
      'Toc Do V4',
      'Tong Diem',
      'Thoi Gian',
    ];

    const rows = sorted.map((t, idx) => {
      const r4 = t.round4State;
      const baseV4 = (t.roundScores[1] || 0) + (t.roundScores[2] || 0) + (t.roundScores[3] || 0);
      return [
        idx + 1,
        `"${t.teamName.replace(/"/g, '""')}"`,
        `"${t.className}"`,
        t.roundScores[1] || 0,
        t.roundScores[2] || 0,
        t.roundScores[3] || 0,
        baseV4,
        r4?.randomBonus || 0,
        r4?.randomPenalty || 0,
        r4?.speedBonus || 0,
        t.score,
        `"${ScoringEngine.formatTime(t.elapsedTime)}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PEK_Leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
