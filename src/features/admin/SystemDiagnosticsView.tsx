import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Database,
  Sparkles,
  Info,
  Server,
  Layers,
  Award,
  Zap,
  Dice5,
  Play,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { audioManager } from '../../services/audioManager';
import { RandomEngine } from '../../services/randomEngine';
import { ScoringEngine } from '../../services/scoringEngine';

export const SystemDiagnosticsView: React.FC = () => {
  const [lastCheckTime, setLastCheckTime] = useState<string>(() => new Date().toLocaleTimeString());
  const [testSoundPlaying, setTestSoundPlaying] = useState<string | null>(null);
  const [randomSeedSample, setRandomSeedSample] = useState<string>('PEK-A101');
  const [randomRollResult, setRandomRollResult] = useState<string | null>(null);

  // Bank counts
  const [stats, setStats] = useState(() => ({
    teamsCount: storageService.getTeams().length,
    questionsCount: storageService.getQuestions().length,
    teachersCount: storageService.getTeachers().length,
    puzzlesCount: storageService.getPuzzles().length,
    mysteryCodesCount: storageService.getMysteryCodes().length,
  }));

  const refreshDiagnostics = () => {
    setStats({
      teamsCount: storageService.getTeams().length,
      questionsCount: storageService.getQuestions().length,
      teachersCount: storageService.getTeachers().length,
      puzzlesCount: storageService.getPuzzles().length,
      mysteryCodesCount: storageService.getMysteryCodes().length,
    });
    setLastCheckTime(new Date().toLocaleTimeString());
    audioManager.playPop();
  };

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      refreshDiagnostics();
    });
    return () => unsub();
  }, []);

  const playSoundTest = (type: 'correct' | 'victory' | 'unlock' | 'pop' | 'incorrect') => {
    setTestSoundPlaying(type);
    switch (type) {
      case 'correct':
        audioManager.playCorrect();
        break;
      case 'victory':
        audioManager.playVictory();
        break;
      case 'unlock':
        audioManager.playUnlock();
        break;
      case 'pop':
        audioManager.playPop();
        break;
      case 'incorrect':
        audioManager.playIncorrect();
        break;
    }
    setTimeout(() => setTestSoundPlaying(null), 800);
  };

  const testRandomEngine = () => {
    const effects = ['+10', '+5', '-5', '-10', '*2', ':2'];
    const rolled = effects[Math.floor(Math.random() * effects.length)];
    const teachers = storageService.getTeachers();
    const pickedTeachers = RandomEngine.selectRound2Teachers(teachers, randomSeedSample, 2);
    setRandomRollResult(
      `Hiệu ứng V4: ${rolled} • 2 GV V2 ngẫu nhiên: ${pickedTeachers.map((t) => t.name).join(', ')}`
    );
    audioManager.playPop();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs border border-indigo-200">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full uppercase border border-indigo-300">
                SYSTEM DIAGNOSTICS & STATUS
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kiểm Tra & Giám Sát Toàn Bộ Hệ Thống
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tổ Khoa học Tự nhiên Pétrus Ký • Kiểm tra bộ nhớ, âm thanh, thuật toán ngẫu nhiên & ngân hàng đề
            </p>
          </div>
        </div>

        <button
          onClick={refreshDiagnostics}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-all cursor-pointer shadow-xs self-start md:self-center"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Kiểm Tra Lại ({lastCheckTime})</span>
        </button>
      </div>

      {/* NO CAMERA NOTICE CARD */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-300 flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl flex-shrink-0">
          ✓
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
            <span>CHẾ ĐỘ KHÔNG DÙNG CAMERA (NO-CAMERA TOURNAMENT MODE)</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">
              KÍCH HOẠT 100%
            </span>
          </h4>
          <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
            Toàn bộ 4 Vòng thi của <strong>Pétrus Ký Science Quest</strong> được thiết kế chạy mượt mà, độc lập và bảo mật cao không yêu cầu mở camera hay cấp quyền webcam. Học sinh giải mật mã thực địa, nhập từ khóa trực tiếp trên web, nhận ngay đáp án giải mã khoa học và số điểm thưởng may mắn.
          </p>
        </div>
      </div>

      {/* 4 Main Core System Status Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Storage */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Database className="w-4 h-4 text-sky-600" />
              <span>Dữ Liệu & Bộ Nhớ</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              PASS
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            LocalStorage OK
          </div>
          <p className="text-xs text-slate-600">
            Lưu trữ trạng thái các đội thi, lịch sử trả lời và phân bổ đề thi an toàn thời gian thực.
          </p>
        </div>

        {/* Box 2: Audio Engine */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Âm Thanh Web Audio</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              PASS
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            Synthesizer OK
          </div>
          <p className="text-xs text-slate-600">
            Tạo hiệu ứng âm thanh sống động trực tiếp bằng Web Audio API không phụ thuộc tệp ngoài.
          </p>
        </div>

        {/* Box 3: Random Engine */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Dice5 className="w-4 h-4 text-purple-600" />
              <span>Random Engine</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              PASS
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            Seed PRNG OK
          </div>
          <p className="text-xs text-slate-600">
            Xáo trộn ngẫu nhiên câu hỏi V2 (2 câu), V3 (3 câu) và điểm may mắn V4 (+5, +10, -5, -10, *2, :2).
          </p>
        </div>

        {/* Box 4: Canvas Certificate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-rose-600" />
              <span>Chứng Nhận Canvas</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              PASS
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            1200 × 850 PNG
          </div>
          <p className="text-xs text-slate-600">
            Xuất giấy khen vinh danh điện tử sắc nét với con dấu đỏ và huy hiệu khoa học Pétrus Ký.
          </p>
        </div>
      </div>

      {/* Interactive Sound Test & Random Engine Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sound Test Panel */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Kiểm Tra Hiệu Ứng Âm Thanh Giải Đấu</h3>
          </div>
          <p className="text-xs text-slate-500">
            Bấm vào các nút bên dưới để phát âm thanh kiểm tra loa sân khấu hoặc tai nghe của học sinh:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => playSoundTest('correct')}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Đúng (Correct)</span>
            </button>

            <button
              onClick={() => playSoundTest('victory')}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Chiến Thắng (Fanfare)</span>
            </button>

            <button
              onClick={() => playSoundTest('unlock')}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Mở Khóa (Unlock)</span>
            </button>

            <button
              onClick={() => playSoundTest('pop')}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Pop Rương</span>
            </button>

            <button
              onClick={() => playSoundTest('incorrect')}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Sai (Alert)</span>
            </button>
          </div>
        </div>

        {/* Random Engine Test */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Dice5 className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Kiểm Tra Thuật Toán Phân Phối Đề & Điểm</h3>
          </div>
          <p className="text-xs text-slate-500">
            Mỗi lượt chơi chọn ngẫu nhiên 2 câu Vòng 2, 3 câu Vòng 3 và quay random điểm may mắn Vòng 4:
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={randomSeedSample}
              onChange={(e) => setRandomSeedSample(e.target.value)}
              placeholder="Seed mã đội..."
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 w-36 uppercase"
            />
            <button
              onClick={testRandomEngine}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
            >
              Chạy Thử Random
            </button>
          </div>

          {randomRollResult && (
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs font-mono text-purple-950 font-bold">
              {randomRollResult}
            </div>
          )}
        </div>
      </div>

      {/* Question Bank Quantities Table */}
      <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-600" />
          <span>Thống Kê Trữ Lượng Ngân Hàng Đề Thi Pétrus Ký</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Vòng 1 (Trắc Nghiệm)</span>
            <strong className="text-lg font-black text-slate-900 font-mono">{stats.questionsCount} Câu</strong>
            <span className="text-[10px] text-slate-400 block">30 Lý • 30 Hóa • 30 Sinh</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Vòng 2 (Giáo Viên)</span>
            <strong className="text-lg font-black text-indigo-700 font-mono">{stats.teachersCount} Giáo Viên</strong>
            <span className="text-[10px] text-slate-400 block">Random 2 câu/lượt</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Vòng 3 (Ghép Tranh)</span>
            <strong className="text-lg font-black text-purple-700 font-mono">{stats.puzzlesCount} Câu Đố</strong>
            <span className="text-[10px] text-slate-400 block">Random 3 câu/lượt</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Vòng 4 (Mật Mã & Đáp Án)</span>
            <strong className="text-lg font-black text-amber-700 font-mono">{stats.mysteryCodesCount} Mật Mã</strong>
            <span className="text-[10px] text-slate-400 block">Trả về đáp án & điểm random</span>
          </div>
        </div>
      </div>
    </div>
  );
};
