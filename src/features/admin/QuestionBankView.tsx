import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  XCircle,
  X,
  Atom,
  Flame,
  Dna,
  Users,
  Image as ImageIcon,
  QrCode,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  Search,
  Eye,
  BarChart3,
  Clock,
  Sparkles,
  HelpCircle,
  KeyRound,
  Gift,
  Zap,
} from 'lucide-react';
import {
  Question,
  Teacher,
  PicturePuzzle,
  Challenge,
  QuestionBankTab,
  MysteryTreasureCode,
  MysteryBoxEffect,
} from '../../types';
import { storageService } from '../../services/storageService';
import { ExcelService } from '../../services/excelService';
import { StationPrintModal } from './StationPrintModal';
import { ConfirmModal } from '../../components/ConfirmModal';
import { audioManager } from '../../services/audioManager';
import { ImageUploadDropzone } from '../../components/ImageUploadDropzone';
import { GV01_AVATAR_SVG, GV02_AVATAR_SVG, GV03_AVATAR_SVG, DEFAULT_TEACHER_AVATAR_SVG } from '../../data/officialTeachers';

interface QuestionBankViewProps {
  onRefresh: () => void;
}

type SubjectFilter = 'all' | 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY';

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onRefresh }) => {
  // Main view tab: round 1 questions vs teachers vs puzzles vs challenges
  const [mainTab, setMainTab] = useState<'r1_questions' | 'teachers' | 'puzzles' | 'challenges'>('r1_questions');
  
  // Subject Filter for Round 1: 'all' | 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY'
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Active status filter: 'all' | 'active' | 'inactive'
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [showPrintStations, setShowPrintStations] = useState<boolean>(false);
  const [isProcessingExcel, setIsProcessingExcel] = useState<boolean>(false);

  // Responsive React State for items
  const [questions, setQuestions] = useState<Question[]>(() => storageService.getQuestions());
  const [teachers, setTeachers] = useState<Teacher[]>(() => storageService.getTeachers());
  const [puzzles, setPuzzles] = useState<PicturePuzzle[]>(() => storageService.getPuzzles());
  const [challenges, setChallenges] = useState<Challenge[]>(() => storageService.getChallenges());
  const [mysteryCodes, setMysteryCodes] = useState<MysteryTreasureCode[]>(() =>
    storageService.getMysteryCodes()
  );

  const reloadAllData = () => {
    setQuestions([...storageService.getQuestions()]);
    setTeachers([...storageService.getTeachers()]);
    setPuzzles([...storageService.getPuzzles()]);
    setChallenges([...storageService.getChallenges()]);
    setMysteryCodes([...storageService.getMysteryCodes()]);
    onRefresh();
  };

  // Modal state
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Teacher Bank State (Vòng 2: Add, Edit, Preview, Active/Inactive, Edit Clue, Edit Answer, Edit Avatar)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isNewTeacher, setIsNewTeacher] = useState<boolean>(false);
  const [previewTeacher, setPreviewTeacher] = useState<Teacher | null>(null);

  // Puzzle State (Vòng 3: Add, Edit, Drag & Drop Image)
  const [editingPuzzle, setEditingPuzzle] = useState<PicturePuzzle | null>(null);
  const [isNewPuzzle, setIsNewPuzzle] = useState<boolean>(false);

  // Round 4 Mystery Codes State & Handlers
  const [editingCode, setEditingCode] = useState<MysteryTreasureCode | null>(null);
  const [isNewCode, setIsNewCode] = useState<boolean>(false);
  const [testSimCode, setTestSimCode] = useState<string>('');
  const [testSimResult, setTestSimResult] = useState<{
    code: string;
    name: string;
    solutionAnswer: string;
    effect: MysteryBoxEffect;
  } | null>(null);

  const handleOpenAddCode = () => {
    const newCode: MysteryTreasureCode = {
      id: `box-${Date.now()}`,
      code: '',
      name: 'Trạm Mật Mã Mới',
      solutionAnswer: '',
      hint: '',
      effect: '+10',
      description: 'Mật mã thực địa do Ban Tổ chức thiết lập.',
      active: true,
    };
    setEditingCode(newCode);
    setIsNewCode(true);
  };

  const handleSaveCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCode || !editingCode.code.trim()) return;
    const clean: MysteryTreasureCode = {
      ...editingCode,
      code: editingCode.code.trim().toUpperCase(),
    };
    storageService.saveMysteryCode(clean);
    audioManager.playUnlock();
    setEditingCode(null);
    reloadAllData();
  };

  const handleDeleteCode = (id: string, codeStr: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Xóa Mật Mã Trạm Vòng 4',
      message: `Bạn có chắc chắn muốn xóa mật mã [${codeStr}] khỏi ngân hàng?`,
      type: 'danger',
      onConfirm: () => {
        storageService.deleteMysteryCode(id);
        audioManager.playPop();
        reloadAllData();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleResetCodes = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Khôi Phục Danh Sách Mật Mã Mặc Định',
      message: 'Hệ thống sẽ nạp lại toàn bộ các mật mã mẫu chuẩn của Trường Pétrus Ký. Tiếp tục?',
      type: 'warning',
      onConfirm: () => {
        storageService.resetMysteryCodes();
        audioManager.playUnlock();
        reloadAllData();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleToggleCodeActive = (item: MysteryTreasureCode) => {
    storageService.saveMysteryCode({
      ...item,
      active: !item.active,
    });
    audioManager.playPop();
    reloadAllData();
  };

  const handleSimulateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = testSimCode.trim().toUpperCase();
    if (!clean) return;
    const found = storageService.getMysteryCodeByCode(clean);
    const effects: MysteryBoxEffect[] = ['*2', '+10', '+5', '-5', '-10', ':2'];
    const randomEff = effects[Math.floor(Math.random() * effects.length)];
    if (found) {
      setTestSimResult({
        code: found.code,
        name: found.name,
        solutionAnswer: found.solutionAnswer || 'Đã giải phóng thành công phong ấn kho báu!',
        effect: randomEff,
      });
    } else {
      setTestSimResult({
        code: clean,
        name: `Mã tùy chọn [${clean}]`,
        solutionAnswer: 'Mã hợp lệ từ thực địa. Đã giải phóng phong ấn kho báu!',
        effect: randomEff,
      });
    }
    audioManager.playPop();
  };

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    onConfirm: () => {},
  });

  // Calculate statistics for questions
  const totalQuestions = questions.length;
  const physicsQuestions = questions.filter(
    (q) => q.subject.toUpperCase() === 'PHYSICS'
  );
  const chemistryQuestions = questions.filter(
    (q) => q.subject.toUpperCase() === 'CHEMISTRY'
  );
  const biologyQuestions = questions.filter(
    (q) => q.subject.toUpperCase() === 'BIOLOGY'
  );
  const activeCount = questions.filter((q) => q.active).length;

  // Filtered Questions according to Subject, Search Query, and Active Status
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // 1. Subject Filter
      if (subjectFilter !== 'all') {
        if (q.subject.toUpperCase() !== subjectFilter) return false;
      }

      // 2. Active Status Filter
      if (activeFilter === 'active' && !q.active) return false;
      if (activeFilter === 'inactive' && q.active) return false;

      // 3. Search Query (ID, Question Content, Topic)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchId = q.id.toLowerCase().includes(query);
        const matchText = q.question.toLowerCase().includes(query);
        const matchTopic = (q.topic || '').toLowerCase().includes(query);
        if (!matchId && !matchText && !matchTopic) return false;
      }

      return true;
    });
  }, [questions, subjectFilter, activeFilter, searchQuery]);

  const handleToggleQuestionActive = (q: Question) => {
    storageService.saveQuestion({ ...q, active: !q.active });
    audioManager.playPop();
    reloadAllData();
  };

  const handleDeleteQuestion = (id: string, qTitle: string = 'câu hỏi này') => {
    audioManager.playButtonTap();
    setConfirmDialog({
      isOpen: true,
      title: 'Xóa Câu Hỏi Khỏi Ngân Hàng',
      message: `Bạn có chắc chắn muốn xóa câu hỏi [${id}] "${qTitle.substring(0, 60)}..."? Hành động này sẽ cập nhật ngay ngân hàng dữ liệu.`,
      type: 'danger',
      onConfirm: () => {
        storageService.deleteQuestion(id);
        reloadAllData();
        audioManager.playPop();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    // Ensure options map and flat optionA..D are strictly in sync
    const syncedQuestion: Question = {
      ...editingQuestion,
      optionA: editingQuestion.options.A,
      optionB: editingQuestion.options.B,
      optionC: editingQuestion.options.C,
      optionD: editingQuestion.options.D,
      options: {
        A: editingQuestion.options.A,
        B: editingQuestion.options.B,
        C: editingQuestion.options.C,
        D: editingQuestion.options.D,
      },
    };

    storageService.saveQuestion(syncedQuestion);
    setEditingQuestion(null);
    audioManager.playUnlock();
    reloadAllData();
  };

  const handleOpenAddQuestion = () => {
    const subj = subjectFilter === 'CHEMISTRY' ? 'CHEMISTRY' : subjectFilter === 'BIOLOGY' ? 'BIOLOGY' : 'PHYSICS';
    const prefix = subj === 'PHYSICS' ? 'P' : subj === 'CHEMISTRY' ? 'C' : 'B';
    const newId = `${prefix}${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')}`;

    const newQ: Question = {
      id: newId,
      round: 1,
      subject: subj,
      topic: 'Chủ đề mới',
      difficulty: 'MEDIUM',
      type: 'mcq',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
      },
      correctAnswer: 'A',
      explanation: '',
      points: 15,
      timeLimit: 45,
      active: true,
    };
    setEditingQuestion(newQ);
    setIsNewQuestion(true);
  };

  const handleExportData = () => {
    const data = {
      questions: storageService.getQuestions(),
      teachers: storageService.getTeachers(),
      puzzles: storageService.getPuzzles(),
      challenges: storageService.getChallenges(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pek_science_quest_bank_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    audioManager.playUnlock();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
      setIsProcessingExcel(true);
      ExcelService.importExcel(file)
        .then((result: { success: boolean; message: string }) => {
          setIsProcessingExcel(false);
          reloadAllData();
          if (result.success) {
            audioManager.playVictory();
            setImportStatus(result.message);
          } else {
            setImportStatus(result.message);
          }
        })
        .catch((err: unknown) => {
          setIsProcessingExcel(false);
          setImportStatus(`Lỗi đọc file Excel: ${err instanceof Error ? err.message : 'Định dạng file không hỗ trợ'}`);
        });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          localStorage.setItem('pek_science_quest_questions_bank', JSON.stringify(parsed.questions));
        }
        reloadAllData();
        audioManager.playVictory();
        setImportStatus('Đã cập nhật thành công ngân hàng câu hỏi từ file!');
      } catch {
        setImportStatus('Lỗi: File JSON không đúng cấu trúc quy chuẩn.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToDefaults = () => {
    audioManager.playButtonTap();
    setConfirmDialog({
      isOpen: true,
      title: 'Khôi Phục 90 Câu Gốc Chuẩn (30 Lý - 30 Hóa - 30 Sinh)',
      message: 'Hành động này sẽ khôi phục toàn bộ 90 câu hỏi Vòng 1 về bộ câu hỏi chuẩn ban đầu của Tổ Khoa học Tự nhiên PeK. Bạn có chắc chắn muốn tiếp tục?',
      type: 'warning',
      onConfirm: () => {
        storageService.factoryReset();
        reloadAllData();
        audioManager.playUnlock();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const getSubjectBadge = (subject: string) => {
    const upper = subject.toUpperCase();
    if (upper === 'PHYSICS') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
          <Atom className="w-3.5 h-3.5 text-sky-600" />
          <span>Vật lí</span>
        </span>
      );
    }
    if (upper === 'CHEMISTRY') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Hóa học</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <Dna className="w-3.5 h-3.5 text-emerald-600" />
        <span>Sinh học</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {mainTab === 'r1_questions' && (
            <button
              onClick={handleOpenAddQuestion}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Câu Hỏi Mới</span>
            </button>
          )}

          {/* Download Excel Template */}
          <button
            onClick={() => ExcelService.downloadTemplate()}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Mẫu Excel Nhập Đề</span>
          </button>

          {/* Station Print Modal */}
          <button
            onClick={() => setShowPrintStations(true)}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-600" />
            <span>In Thẻ Mật Thư Trạm (QR)</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Xuất JSON</span>
          </button>

          {/* Import JSON/Excel */}
          <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isProcessingExcel ? 'Đang đọc...' : 'Nhập Excel/JSON'}</span>
            <input type="file" accept=".json,.csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Restore 90 Fixed Questions */}
        <button
          onClick={handleResetToDefaults}
          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Khôi Phục 90 Câu Gốc Chuẩn</span>
        </button>
      </div>

      {importStatus && (
        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center justify-between shadow-sm">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="text-sky-700 hover:text-sky-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Section Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
        <button
          onClick={() => setMainTab('r1_questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            mainTab === 'r1_questions'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Kho Câu Hỏi Vòng 1 ({totalQuestions})</span>
        </button>

        <button
          onClick={() => setMainTab('teachers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mainTab === 'teachers'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Giáo Viên Vòng 2 ({teachers.length})</span>
        </button>

        <button
          onClick={() => setMainTab('puzzles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mainTab === 'puzzles'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Đuổi Hình Bắt Chữ Vòng 3 ({puzzles.length})</span>
        </button>

        <button
          onClick={() => setMainTab('challenges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mainTab === 'challenges'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Mật Mã & Từ Khóa Vòng 4 ({mysteryCodes.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VÒNG 1: NGÂN HÀNG CÂU HỎI KHOA HỌC (90 CÂU CỐ ĐỊNH)                     */}
      {/* ========================================================================= */}
      {mainTab === 'r1_questions' && (
        <div className="space-y-6">
          {/* SECTION 9: THỐNG KÊ TỔNG QUAN GAME MASTER */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Tổng Câu */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                  Tổng Câu Hỏi
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 font-mono font-bold px-1.5 py-0.5 rounded">
                  Chuẩn 90
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 font-mono">{totalQuestions}</span>
                <span className="text-xs text-slate-500">câu</span>
              </div>
            </div>

            {/* Vật Lí */}
            <div className="bg-white border border-sky-200 rounded-2xl p-4 shadow-sm bg-sky-50/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-sky-700 uppercase font-bold flex items-center gap-1">
                  <Atom className="w-3.5 h-3.5 text-sky-600" />
                  Vật Lí
                </span>
                <span className="text-xs bg-sky-100 text-sky-800 font-mono font-bold px-1.5 py-0.5 rounded">
                  P01–P30
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-sky-900 font-mono">{physicsQuestions.length}</span>
                <span className="text-xs text-slate-500">/ 30 câu</span>
              </div>
            </div>

            {/* Hóa Học */}
            <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm bg-amber-50/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-amber-700 uppercase font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  Hóa Học
                </span>
                <span className="text-xs bg-amber-100 text-amber-800 font-mono font-bold px-1.5 py-0.5 rounded">
                  C01–C30
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-900 font-mono">{chemistryQuestions.length}</span>
                <span className="text-xs text-slate-500">/ 30 câu</span>
              </div>
            </div>

            {/* Sinh Học */}
            <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm bg-emerald-50/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-emerald-700 uppercase font-bold flex items-center gap-1">
                  <Dna className="w-3.5 h-3.5 text-emerald-600" />
                  Sinh Học
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded">
                  B01–B30
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-900 font-mono">{biologyQuestions.length}</span>
                <span className="text-xs text-slate-500">/ 30 câu</span>
              </div>
            </div>

            {/* Đang Kích Hoạt */}
            <div className="bg-white border border-indigo-200 rounded-2xl p-4 shadow-sm bg-indigo-50/30 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-indigo-700 uppercase font-bold">
                  Đang Kích Hoạt
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-indigo-900 font-mono">{activeCount}</span>
                <span className="text-xs text-slate-500">/ {totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* SECTION 8: FILTER & SEARCH CONTROLS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* FILTER: Tất cả / Vật lí / Hóa học / Sinh học */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSubjectFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    subjectFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tất cả ({totalQuestions})
                </button>

                <button
                  onClick={() => setSubjectFilter('PHYSICS')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    subjectFilter === 'PHYSICS'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5" />
                  <span>Vật lí ({physicsQuestions.length})</span>
                </button>

                <button
                  onClick={() => setSubjectFilter('CHEMISTRY')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    subjectFilter === 'CHEMISTRY'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hóa học ({chemistryQuestions.length})</span>
                </button>

                <button
                  onClick={() => setSubjectFilter('BIOLOGY')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    subjectFilter === 'BIOLOGY'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Dna className="w-3.5 h-3.5" />
                  <span>Sinh học ({biologyQuestions.length})</span>
                </button>
              </div>

              {/* Active Toggle filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    activeFilter === 'all' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Mọi trạng thái
                </button>
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    activeFilter === 'active' ? 'bg-white shadow-xs font-bold text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  Chỉ đang bật
                </button>
                <button
                  onClick={() => setActiveFilter('inactive')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    activeFilter === 'inactive' ? 'bg-white shadow-xs font-bold text-rose-700' : 'text-slate-600'
                  }`}
                >
                  Chỉ đang tắt
                </button>
              </div>
            </div>

            {/* SEARCH input by ID, question content, and topic */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo ID (ví dụ: P01, C15, B28), nội dung câu hỏi, hoặc chủ đề..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* LIST OF QUESTIONS */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Không tìm thấy câu hỏi nào phù hợp</p>
                <p className="text-xs text-slate-500 mt-1">Thử đổi từ khóa tìm kiếm hoặc chọn lọc môn khác.</p>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const stats = storageService.getQuestionStats(q.id);

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      q.active
                        ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Main Question Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          {/* ID badge */}
                          <span
                            className={`font-mono text-xs px-2.5 py-0.5 rounded-md font-black ${
                              q.subject.toUpperCase() === 'PHYSICS'
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : q.subject.toUpperCase() === 'CHEMISTRY'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {q.id}
                          </span>

                          {/* Subject badge */}
                          {getSubjectBadge(q.subject)}

                          {/* Topic badge */}
                          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">
                            {q.topic || 'Khoa học tổng hợp'}
                          </span>

                          {/* Points badge */}
                          <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold font-mono">
                            +{q.points} điểm
                          </span>

                          {/* Time limit */}
                          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {q.timeLimit}s
                          </span>

                          {/* Difficulty */}
                          <span className="text-xs text-slate-500 font-mono">
                            [{q.difficulty}]
                          </span>
                        </div>

                        {/* Question Text */}
                        <p className="text-sm font-bold text-slate-900 mb-3 leading-relaxed">
                          {q.question}
                        </p>

                        {/* 4 Choices */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 mb-3">
                          {(['A', 'B', 'C', 'D'] as const).map((key) => {
                            const isCorrect = q.correctAnswer === key;
                            return (
                              <div
                                key={key}
                                className={`p-2.5 rounded-xl border transition-all ${
                                  isCorrect
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                                    : 'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <span className={`mr-1 font-mono ${isCorrect ? 'text-emerald-700' : 'text-slate-500'}`}>
                                  {key}.
                                </span>
                                {q.options[key]}
                                {isCorrect && (
                                  <span className="ml-2 text-[10px] text-emerald-700 font-mono font-bold uppercase bg-emerald-100/80 px-1.5 py-0.5 rounded">
                                    Đáp án đúng
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3">
                            <strong className="text-slate-800">Giải thích chi tiết:</strong> {q.explanation}
                          </div>
                        )}

                        {/* SECTION 9: THỐNG KÊ CHI TIẾT CÂU HỎI */}
                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-1 font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            <span className="text-slate-400">Đã dùng:</span>
                            <strong className="text-slate-800">{stats.timesUsed} lượt</strong>
                          </div>

                          <div className="flex items-center gap-1 font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <span>Tỉ lệ đúng:</span>
                            <strong>{stats.totalAnswers > 0 ? `${stats.correctRate}%` : 'Chưa có'}</strong>
                            {stats.totalAnswers > 0 && (
                              <span className="text-[10px] text-emerald-600">({stats.correctCount}/{stats.totalAnswers})</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <span>Tỉ lệ sai:</span>
                            <strong>{stats.totalAnswers > 0 ? `${stats.incorrectRate}%` : 'Chưa có'}</strong>
                            {stats.totalAnswers > 0 && (
                              <span className="text-[10px] text-rose-600">({stats.incorrectCount}/{stats.totalAnswers})</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            <Clock className="w-3 h-3 text-sky-600" />
                            <span>T/g TB:</span>
                            <strong>{stats.totalAnswers > 0 ? `${stats.avgTime}s` : '--'}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex lg:flex-col items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggleQuestionActive(q)}
                          title={q.active ? 'Tắt câu hỏi (Không đưa vào random)' : 'Bật kích hoạt câu hỏi'}
                          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            q.active
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {q.active ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span className="text-[11px] lg:hidden">Đang bật</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-slate-400" />
                              <span className="text-[11px] lg:hidden">Đang tắt</span>
                            </>
                          )}
                        </button>

                        {/* View Details */}
                        <button
                          onClick={() => setViewingQuestion(q)}
                          title="Xem chi tiết"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer border border-slate-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Question */}
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setIsNewQuestion(false);
                          }}
                          title="Chỉnh sửa câu hỏi"
                          className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 transition-all cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Question */}
                        <button
                          onClick={() => handleDeleteQuestion(q.id, q.question)}
                          title="Xóa câu hỏi khỏi ngân hàng"
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VÒNG 2: GIÁO VIÊN BÍ ẨN (TEACHER BANK: GV01, GV02, GV03...)               */}
      {/* ========================================================================= */}
      {mainTab === 'teachers' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>Ngân Hàng Giáo Viên Thử Thách Vòng 2</span>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  {teachers.filter((t) => t.active).length} đang kích hoạt / {teachers.length} giáo viên
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chỉ những giáo viên ở trạng thái <strong>Kích Hoạt (Active)</strong> mới xuất hiện trong lượt random của Vòng 2.
              </p>
            </div>

            <button
              onClick={() => {
                const nextId = `GV0${teachers.length + 1}`;
                const newT: Teacher = {
                  id: nextId,
                  round: 2,
                  name: 'TÊN GIÁO VIÊN MỚI',
                  displayName: 'Thầy/Cô Mới',
                  subject: 'HOA HOC',
                  department: 'Tổ Khoa học Tự nhiên Pétrus Ký',
                  grades: '10, 11, 12',
                  homeroom: '10.1',
                  characteristics: 'ĐẶC ĐIỂM BÍ MẬT',
                  image: teachers[0]?.image || '',
                  clues: [
                    'Gợi ý môn dạy bí ẩn...',
                    'Gợi ý khối lớp đồng hành...',
                    'Gợi ý đặc điểm nhận diện...',
                    'Gợi ý đặc điểm trang phục / avatar...',
                  ],
                  clueAnswers: ['hoa hoc', '10,11,12', 'dac diem', 'avatar'],
                  clueAcceptedAnswers: [
                    ['hoa hoc', 'hoahoc'],
                    ['10,11,12', '10 11 12'],
                    ['dac diem'],
                    ['avatar'],
                  ],
                  correctAnswer: 'TÊN GIÁO VIÊN MỚI',
                  points: 100,
                  timeLimit: 90,
                  active: true,
                };
                setEditingTeacher(newT);
                setIsNewTeacher(true);
                audioManager.playPop();
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Giáo Viên Mới (GV04+)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((t) => (
              <div
                key={t.id}
                className={`p-5 bg-white border rounded-3xl shadow-sm space-y-4 transition-all ${
                  t.active ? 'border-indigo-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-200 bg-slate-100 flex-shrink-0 shadow-xs">
                      <img
                        src={t.image || DEFAULT_TEACHER_AVATAR_SVG}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/70 text-white font-mono font-bold text-[9px] text-center py-0.5">
                        {t.id}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{t.name}</h4>
                      <p className="text-xs font-bold text-indigo-700">{t.displayName || t.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
                          {t.subject}
                        </span>
                        {t.homeroom && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            CN: {t.homeroom}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active / Inactive badge button */}
                  <button
                    onClick={() => {
                      const updated = { ...t, active: !t.active };
                      storageService.saveTeacher(updated);
                      reloadAllData();
                      audioManager.playPop();
                    }}
                    title={t.active ? 'Bấm để Tắt giáo viên này' : 'Bấm để Bật giáo viên này'}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      t.active
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600 border border-slate-300'
                    }`}
                  >
                    {t.active ? '● Đang Bật' : '○ Đang Tắt'}
                  </button>
                </div>

                {/* 4 Clues Summary */}
                <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
                  {t.clues.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="font-mono font-bold text-[10px] text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 flex-shrink-0">
                        C{i + 1}
                      </span>
                      <p className="line-clamp-2 text-[11px] leading-tight text-slate-600">
                        {c}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions: Preview & Edit */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Khối {t.grades || '10, 11, 12'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewTeacher(t);
                        audioManager.playPop();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeacher(t);
                        setIsNewTeacher(false);
                        audioManager.playPop();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VÒNG 3: ĐUỔI HÌNH BẮT CHỮ                                                */}
      {/* ========================================================================= */}
      {mainTab === 'puzzles' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Danh Sách Câu Đố Đuổi Hình Bắt Chữ Vòng 3</h3>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
              {puzzles.length} câu đố
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {puzzles.map((p) => (
              <div key={p.id} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
                <div className="relative w-full rounded-2xl overflow-hidden border border-purple-500/30 bg-[#120722] p-4 flex items-center justify-center min-h-[120px] gap-2 sm:gap-3 flex-wrap group">
                  {p.visualClues && p.visualClues.length > 0 ? (
                    p.visualClues.map((c, i) => (
                      <span key={i} className="text-3xl sm:text-4xl drop-shadow-[0_0_10px_rgba(251,191,36,0.7)] select-none">
                        {c}
                      </span>
                    ))
                  ) : p.image ? (
                    <img
                      src={p.image}
                      alt={p.topic}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">Không có dữ liệu hình ảnh</span>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-900/80 text-white px-2 py-0.5 rounded-full border border-purple-400/40">
                      #{p.proverbNumber ? p.proverbNumber.toString().padStart(2, '0') : p.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{p.topic}</h4>
                    <span className="text-xs bg-purple-50 text-purple-800 font-mono font-bold px-2 py-0.5 rounded-md inline-block mt-0.5">
                      Mật mã: {p.correctAnswer}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingPuzzle(p);
                      setIsNewPuzzle(false);
                      audioManager.playPop();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sửa Ảnh / Đố</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 italic">Gợi ý: "{p.hint}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VÒNG 4: NGÂN HÀNG MẬT MÃ & TỪ KHÓA TRẠM THỰC ĐỊA                           */}
      {/* ========================================================================= */}
      {mainTab === 'challenges' && (
        <div className="space-y-6">
          {/* Header & Main Actions */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs border border-amber-300">
                🔑
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase border border-amber-300">
                    VÒNG 4: THE FINAL TREASURE
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                    100% Không Cần Camera
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  Ngân Hàng Mật Mã & Từ Khóa Trạm Vòng 4
                </h3>
                <p className="text-xs text-slate-500 max-w-xl">
                  Học sinh nhập mật mã bàn phím → Hệ thống tự động đối soát, trả về <strong>đáp án giải mã khoa học</strong> và quay <strong>số điểm random may mắn (+5, +10, -5, -10, *2, :2)</strong>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenAddCode}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Thêm Mật Mã Mới</span>
              </button>

              <button
                onClick={handleResetCodes}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                title="Khôi phục các mật mã mẫu của trường Pétrus Ký"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Khôi Phục Mặc Định</span>
              </button>
            </div>
          </div>

          {/* Quick KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block mb-1">
                Tổng Mật Mã Ngân Hàng
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900 font-mono">{mysteryCodes.length}</span>
                <span className="text-xs text-slate-400">từ khóa trạm</span>
              </div>
            </div>

            <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm bg-emerald-50/20">
              <span className="text-[11px] font-mono text-emerald-700 uppercase font-bold block mb-1">
                Đang Kích Hoạt
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-800 font-mono">
                  {mysteryCodes.filter((c) => c.active).length}
                </span>
                <span className="text-xs text-emerald-600">sẵn sàng</span>
              </div>
            </div>

            <div className="bg-white border border-sky-200 rounded-2xl p-4 shadow-sm bg-sky-50/20">
              <span className="text-[11px] font-mono text-sky-700 uppercase font-bold block mb-1">
                Số Đội Đã Bẻ Khóa
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-sky-800 font-mono">
                  {mysteryCodes.filter((c) => !!c.claimedByTeamId).length}
                </span>
                <span className="text-xs text-slate-500">lượt nhập</span>
              </div>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm bg-amber-50/20">
              <span className="text-[11px] font-mono text-amber-800 uppercase font-bold block mb-1">
                6 Hiệu Ứng Random
              </span>
              <span className="text-xs font-mono font-black text-amber-900 block truncate">
                +5, +10, -5, -10, *2, :2
              </span>
            </div>
          </div>

          {/* SIMULATOR TOOL FOR GAME MASTER */}
          <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white border-2 border-amber-400/30 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                Thử Nghiệm Bẻ Khóa Nhanh (Game Master Code Simulator)
              </h4>
            </div>
            <p className="text-xs text-slate-300 mb-3 max-w-2xl">
              Nhập mã bất kỳ để kiểm tra xem hệ thống sẽ hiển thị tên trạm, nội dung đáp án giải mã khoa học và hiệu ứng random như thế nào đối với học sinh:
            </p>

            <form onSubmit={handleSimulateCode} className="flex flex-col sm:flex-row gap-2 max-w-xl">
              <input
                type="text"
                value={testSimCode}
                onChange={(e) => setTestSimCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã thử nghiệm (VD: PEK-QUANTUM-2026)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-mono font-bold uppercase text-xs border border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                disabled={!testSimCode.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-xs uppercase cursor-pointer transition-all"
              >
                Kiểm Tra Trả Về
              </button>
            </form>

            {testSimResult && (
              <div className="mt-4 p-4 rounded-2xl bg-white/10 border border-white/20 text-xs space-y-2 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-300 text-sm">
                      [{testSimResult.code}]
                    </span>
                    <strong className="text-white">{testSimResult.name}</strong>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-xs bg-amber-400 text-slate-950">
                    Random Điểm: {testSimResult.effect}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[11px] mb-0.5">
                    ĐÁP ÁN GIẢI MÃ KHOA HỌC TRẢ VỀ:
                  </span>
                  <p className="text-indigo-200 font-medium leading-relaxed bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-800">
                    {testSimResult.solutionAnswer}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mystery Codes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mysteryCodes.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between shadow-sm ${
                  c.active
                    ? 'bg-white border-slate-200 hover:border-amber-400'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Code & Effect */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-slate-900 text-amber-400 font-mono font-black text-xs tracking-wider border border-slate-700 shadow-xs">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleCodeActive(c)}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                          c.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-slate-200 text-slate-600 border-slate-300'
                        }`}
                        title="Bấm để bật/tắt kích hoạt"
                      >
                        {c.active ? '● Đang mở' : '○ Tạm khóa'}
                      </button>
                    </div>

                    <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300">
                      {c.effect === '*2' && '🌟 Nhân đôi (*2)'}
                      {c.effect === '+10' && '💎 +10 Điểm'}
                      {c.effect === '+5' && '✨ +5 Điểm'}
                      {c.effect === '-5' && '⚠️ -5 Điểm'}
                      {c.effect === '-10' && '⚡ -10 Điểm'}
                      {c.effect === ':2' && '🌀 Chia đôi (:2)'}
                    </span>
                  </div>

                  {/* Name & Hint */}
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{c.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
                    {c.hint && (
                      <p className="text-[11px] text-amber-700 italic mt-1 bg-amber-50/60 px-2 py-1 rounded-lg border border-amber-200/60">
                        💡 Gợi ý mật thư: {c.hint}
                      </p>
                    )}
                  </div>

                  {/* Scientific Solution Answer (ĐÁP ÁN TRẢ VỀ CHO HỌC SINH) */}
                  <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-bold font-mono text-[11px] uppercase">
                      <span>🔬 ĐÁP ÁN KHOA HỌC TRẢ VỀ:</span>
                    </div>
                    <p className="text-indigo-950 font-semibold leading-relaxed">
                      {c.solutionAnswer || (
                        <span className="italic text-slate-400">
                          Chưa đặt đáp án giải mã khoa học cụ thể.
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Claim Status */}
                  {c.claimedByTeamId && (
                    <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <span>✓ Đã nhập bởi: {c.claimedByTeamName || c.claimedByTeamId}</span>
                      {c.pointsDelta !== undefined && (
                        <span className="font-bold">
                          {c.pointsDelta >= 0 ? `+${c.pointsDelta}` : c.pointsDelta} pts
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingCode(c);
                      setIsNewCode(false);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sửa Từ Khóa & Đáp Án</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCode(c.id, c.code)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    title="Xóa mật mã"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW QUESTION DETAILS                                              */}
      {/* ========================================================================= */}
      {viewingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                  {viewingQuestion.id}
                </span>
                {getSubjectBadge(viewingQuestion.subject)}
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">
                  {viewingQuestion.topic}
                </span>
              </div>
              <button
                onClick={() => setViewingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">{viewingQuestion.question}</h3>

              <div className="space-y-2 mb-4">
                {(['A', 'B', 'C', 'D'] as const).map((key) => {
                  const isCorrect = viewingQuestion.correctAnswer === key;
                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-xl border text-xs font-medium ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <strong className={isCorrect ? 'text-emerald-700' : 'text-slate-600'}>{key}:</strong>{' '}
                      {viewingQuestion.options[key]}
                      {isCorrect && (
                        <span className="ml-2 text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                          Đáp án đúng
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 mb-4">
                <strong>Giải thích:</strong> {viewingQuestion.explanation}
              </div>

              {/* Stats in View Modal */}
              {(() => {
                const s = storageService.getQuestionStats(viewingQuestion.id);
                return (
                  <div className="grid grid-cols-4 gap-2 text-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Lượt dùng</span>
                      <strong className="text-slate-900 font-mono text-sm">{s.timesUsed}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tỉ lệ đúng</span>
                      <strong className="text-emerald-700 font-mono text-sm">
                        {s.totalAnswers > 0 ? `${s.correctRate}%` : '--'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tỉ lệ sai</span>
                      <strong className="text-rose-700 font-mono text-sm">
                        {s.totalAnswers > 0 ? `${s.incorrectRate}%` : '--'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">T/g trung bình</span>
                      <strong className="text-sky-700 font-mono text-sm">
                        {s.totalAnswers > 0 ? `${s.avgTime}s` : '--'}
                      </strong>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingQuestion(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / ADD QUESTION (WITH WARNING BANNER PER REQUIREMENT 8)        */}
      {/* ========================================================================= */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {isNewQuestion ? 'Thêm Câu Hỏi Mới Vào Ngân Hàng' : `Chỉnh Sửa Câu Hỏi [${editingQuestion.id}]`}
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MANDATORY WARNING BANNER AS REQUIRED BY PROMPT */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950 uppercase tracking-wide">
                  CẢNH BÁO QUAN TRỌNG DÀNH CHO GAME MASTER
                </p>
                <p className="mt-0.5 text-amber-900 leading-relaxed">
                  Thay đổi nội dung câu hỏi hoặc đáp án sẽ ảnh hưởng trực tiếp đến tất cả các lượt chơi sau của các đội thi! Vui lòng kiểm tra kỹ độ chính xác khoa học trước khi lưu.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã câu hỏi (ID)</label>
                  <input
                    type="text"
                    disabled={!isNewQuestion}
                    value={editingQuestion.id}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-800 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Môn học</label>
                  <select
                    value={editingQuestion.subject.toUpperCase()}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        subject: e.target.value as 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY',
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                  >
                    <option value="PHYSICS">Vật lí (PHYSICS)</option>
                    <option value="CHEMISTRY">Hóa học (CHEMISTRY)</option>
                    <option value="BIOLOGY">Sinh học (BIOLOGY)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chủ đề kiến thức</label>
                  <input
                    type="text"
                    value={editingQuestion.topic || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, topic: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nội dung câu hỏi</label>
                <textarea
                  rows={3}
                  required
                  value={editingQuestion.question}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 leading-relaxed font-medium"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">4 Lựa chọn trả lời</label>
                {(['A', 'B', 'C', 'D'] as const).map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-600 w-5">{key}:</span>
                    <input
                      type="text"
                      required
                      value={editingQuestion.options[key]}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          options: { ...editingQuestion.options, [key]: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-800"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đáp án đúng</label>
                  <select
                    value={editingQuestion.correctAnswer}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        correctAnswer: e.target.value as 'A' | 'B' | 'C' | 'D',
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-emerald-800"
                  >
                    <option value="A">Đáp án A</option>
                    <option value="B">Đáp án B</option>
                    <option value="C">Đáp án C</option>
                    <option value="D">Đáp án D</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Độ khó</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        difficulty: e.target.value as 'EASY' | 'MEDIUM',
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="EASY">Dễ (EASY)</option>
                    <option value="MEDIUM">Trung bình (MEDIUM)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Điểm số</label>
                  <input
                    type="number"
                    value={editingQuestion.points}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, points: Number(e.target.value) || 10 })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">T/g làm bài (giây)</label>
                  <input
                    type="number"
                    value={editingQuestion.timeLimit}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, timeLimit: Number(e.target.value) || 45 })
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Giải thích đáp án</label>
                <textarea
                  rows={2}
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingQuestion.active}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, active: e.target.checked })}
                  className="w-4 h-4 rounded text-sky-600 cursor-pointer"
                />
                <label htmlFor="activeCheck" className="font-bold text-slate-700 cursor-pointer">
                  Kích hoạt câu hỏi này trong ngân hàng (Active)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/30 cursor-pointer"
                >
                  Lưu & Áp Dụng Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* QR Stations Modal */}
      {showPrintStations && (
        <StationPrintModal onClose={() => setShowPrintStations(false)} />
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHỈNH SỬA / THÊM GIÁO VIÊN VÒNG 2                                  */}
      {/* ========================================================================= */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-700 uppercase">
                  {isNewTeacher ? 'THÊM MỚI GIÁO VIÊN' : `CHỈNH SỬA HỒ SƠ: ${editingTeacher.id}`}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {isNewTeacher ? 'Tạo Giáo Viên Mới Cho Vòng 2' : `Cập Nhật ${editingTeacher.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                storageService.saveTeacher(editingTeacher);
                reloadAllData();
                setEditingTeacher(null);
                audioManager.playUnlock();
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mã Định Danh (ID)</label>
                  <input
                    type="text"
                    value={editingTeacher.id}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, id: e.target.value.toUpperCase() })}
                    disabled={!isNewTeacher}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tên Hiển Thị (Xưng hô)</label>
                  <input
                    type="text"
                    value={editingTeacher.displayName || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, displayName: e.target.value })}
                    placeholder="VD: Thầy Tiến, Cô Thẩm..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Họ Tên Đầy Đủ (Không dấu/Có dấu)</label>
                  <input
                    type="text"
                    value={editingTeacher.name}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value, correctAnswer: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Môn Dạy (Bộ môn)</label>
                  <input
                    type="text"
                    value={editingTeacher.subject}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                    placeholder="VD: HOA HOC, VAT LI..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Khối Dạy</label>
                  <input
                    type="text"
                    value={editingTeacher.grades || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, grades: e.target.value })}
                    placeholder="VD: 10, 11, 12 hoặc 11, 12"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lớp Chủ Nhiệm</label>
                  <input
                    type="text"
                    value={editingTeacher.homeroom || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, homeroom: e.target.value })}
                    placeholder="VD: 11.1 hoặc KHONG CHU NHIEM"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Đặc Điểm Nhận Diện</label>
                <input
                  type="text"
                  value={editingTeacher.characteristics || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, characteristics: e.target.value })}
                  placeholder="VD: DOC TOAN THAN, DA TAI hoặc TIKTOKER"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              {/* 4 Clues Inputs */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="font-black text-slate-800 text-xs uppercase block">
                  4 Manh Mối Suy Luận & Đáp Án Chấp Nhận:
                </span>

                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-indigo-700">MANH MỐI {idx + 1}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {idx === 0 ? 'Môn dạy' : idx === 1 ? 'Khối lớp' : idx === 2 ? 'Đặc điểm' : 'Avatar'}
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={editingTeacher.clues[idx] || ''}
                      onChange={(e) => {
                        const newClues = [...editingTeacher.clues] as [string, string, string, string];
                        newClues[idx] = e.target.value;
                        setEditingTeacher({ ...editingTeacher, clues: newClues });
                      }}
                      placeholder={`Nội dung gợi ý manh mối ${idx + 1}...`}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Đáp án chính:</label>
                        <input
                          type="text"
                          value={editingTeacher.clueAnswers?.[idx] || ''}
                          onChange={(e) => {
                            const newAnswers = [...(editingTeacher.clueAnswers || ['', '', '', ''])] as [string, string, string, string];
                            newAnswers[idx] = e.target.value;
                            setEditingTeacher({ ...editingTeacher, clueAnswers: newAnswers });
                          }}
                          placeholder="VD: hoa hoc, 11,12..."
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Các biến thể chấp nhận (phân cách dấu phẩy):</label>
                        <input
                          type="text"
                          value={(editingTeacher.clueAcceptedAnswers?.[idx] || []).join(', ')}
                          onChange={(e) => {
                            const newAccepted = [...(editingTeacher.clueAcceptedAnswers || [[], [], [], []])] as [string[], string[], string[], string[]];
                            newAccepted[idx] = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            setEditingTeacher({ ...editingTeacher, clueAcceptedAnswers: newAccepted });
                          }}
                          placeholder="VD: hoa hoc, hoahoc, mon hoa..."
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Avatar Drag & Drop or File Upload (Kéo thả hoặc thêm tệp, không cần nhập mã) */}
              <div className="pt-2 border-t border-slate-100">
                <ImageUploadDropzone
                  value={editingTeacher.image}
                  onChange={(newImg) => setEditingTeacher({ ...editingTeacher, image: newImg })}
                  label="Avatar Giáo Viên (Kéo Thả Hoặc Thêm Tệp Ảnh)"
                  helperText="Kéo thả ảnh đại diện giáo viên hoặc bấm chọn tệp (JPG, PNG, WebP, SVG). Không cần nhập mã."
                  recommendedPresets={[
                    { name: 'GV01 Thầy Tiến', image: GV01_AVATAR_SVG },
                    { name: 'GV02 Cô Thẩm', image: GV02_AVATAR_SVG },
                    { name: 'GV03 Cô Mai', image: GV03_AVATAR_SVG },
                    { name: 'Chờ Cập Nhật Ảnh Thật', image: DEFAULT_TEACHER_AVATAR_SVG },
                  ]}
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="teacherActiveCheck"
                  checked={editingTeacher.active}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, active: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
                <label htmlFor="teacherActiveCheck" className="font-bold text-slate-700 cursor-pointer">
                  Kích hoạt giáo viên này trong lượt random của Vòng 2 (Active)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Lưu & Áp Dụng Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREVIEW GIÁO VIÊN VÒNG 2                                           */}
      {/* ========================================================================= */}
      {previewTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-indigo-700">
                XEM TRƯỚC HỒ SƠ: {previewTeacher.id}
              </span>
              <button
                type="button"
                onClick={() => setPreviewTeacher(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-36 h-36 rounded-3xl overflow-hidden border-4 border-indigo-200 shadow-md">
                <img
                  src={previewTeacher.image || DEFAULT_TEACHER_AVATAR_SVG}
                  alt={previewTeacher.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">{previewTeacher.name}</h3>
                <p className="text-sm font-bold text-indigo-700">{previewTeacher.displayName}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Môn: {previewTeacher.subject} • Khối {previewTeacher.grades} • CN: {previewTeacher.homeroom || 'Không'}
                </p>
                {previewTeacher.characteristics && (
                  <span className="inline-block mt-2 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full font-mono text-xs font-bold">
                    Đặc điểm: {previewTeacher.characteristics}
                  </span>
                )}
              </div>

              <div className="w-full text-left space-y-2 pt-3 border-t border-slate-100">
                <span className="font-mono font-black text-xs text-slate-800 uppercase block">
                  4 Manh Mối Của Giáo Viên:
                </span>
                {previewTeacher.clues.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="font-mono text-indigo-700">Clue {i + 1}:</strong>
                      <span className="font-mono font-bold text-emerald-700 text-[11px]">
                        Đáp án: {previewTeacher.clueAnswers?.[i] || 'Chưa đặt'}
                      </span>
                    </div>
                    <p className="text-slate-600 italic">"{c}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setPreviewTeacher(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHỈNH SỬA CÂU ĐỐ HÌNH ẢNH VÒNG 3 (KÉO THẢ ẢNH TRỰC TIẾP)          */}
      {/* ========================================================================= */}
      {editingPuzzle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700 uppercase">
                  VÒNG 3: ĐUỔI HÌNH BẮT CHỮ
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Chỉnh Sửa Câu Đố: {editingPuzzle.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPuzzle(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                storageService.savePuzzle(editingPuzzle);
                reloadAllData();
                setEditingPuzzle(null);
                audioManager.playUnlock();
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chủ Đề Khoa Học</label>
                <input
                  type="text"
                  value={editingPuzzle.topic}
                  onChange={(e) => setEditingPuzzle({ ...editingPuzzle, topic: e.target.value })}
                  placeholder="VD: Cấu Trúc Nguyên Tử, Thuyết Tương Đối..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mật Mã Đáp Án Chuẩn</label>
                <input
                  type="text"
                  value={editingPuzzle.correctAnswer}
                  onChange={(e) => setEditingPuzzle({ ...editingPuzzle, correctAnswer: e.target.value.toUpperCase() })}
                  placeholder="VD: LƯỢNG TỬ, QUANG PHỔ..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-black uppercase text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Gợi Ý Thám Mã</label>
                <textarea
                  rows={2}
                  value={editingPuzzle.hint || ''}
                  onChange={(e) => setEditingPuzzle({ ...editingPuzzle, hint: e.target.value })}
                  placeholder="Nội dung gợi ý cho học sinh..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
                />
              </div>

              {/* KÉO THẢ HOẶC CHỌN TỆP ẢNH (KHÔNG NHẬP MÃ) */}
              <div className="pt-2 border-t border-slate-100">
                <ImageUploadDropzone
                  value={editingPuzzle.image || ''}
                  onChange={(newImg) => setEditingPuzzle({ ...editingPuzzle, image: newImg })}
                  label="Hình Ảnh Câu Đố (Kéo Thả Hoặc Thêm Tệp Ảnh)"
                  helperText="Kéo thả ảnh câu đố đuổi hình bắt chữ vào đây hoặc bấm để chọn tệp (PNG, JPG, WebP, SVG). Không cần nhập mã."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPuzzle(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Lưu & Cập Nhật Ảnh Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT MYSTERY CODE (VÒNG 4)                                   */}
      {/* ========================================================================= */}
      {editingCode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  🔑
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isNewCode ? 'Thêm Mật Mã / Từ Khóa Trạm Mới' : `Chỉnh Sửa Mã [${editingCode.code}]`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thiết lập mật mã trạm, đáp án giải mã khoa học và hiệu ứng random may mắn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingCode(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCode} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1 font-mono uppercase">
                  MẬT MÃ / TỪ KHÓA BẺ KHÓA (CODE - VIẾT HOA): *
                </label>
                <input
                  type="text"
                  required
                  value={editingCode.code}
                  onChange={(e) =>
                    setEditingCode({
                      ...editingCode,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="VD: PEK-QUANTUM-2026, LUCKY-GOLD, PEK-GENOME..."
                  className="w-full bg-slate-50 border-2 border-amber-400 rounded-xl px-3 py-2 text-slate-900 font-mono font-black uppercase text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  Học sinh sẽ nhập đúng chuỗi ký tự này trên bàn phím máy tính/điện thoại.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tên Trạm / Tên Rương Kho Báu: *
                </label>
                <input
                  type="text"
                  required
                  value={editingCode.name}
                  onChange={(e) => setEditingCode({ ...editingCode, name: e.target.value })}
                  placeholder="VD: Trạm Lõi Lượng Tử, Rương Hoàng Kim..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-xs"
                />
              </div>

              {/* ĐÁP ÁN GIẢI MÃ KHOA HỌC TRẢ VỀ */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 space-y-1.5">
                <label className="font-bold text-indigo-950 block font-mono uppercase text-[11px]">
                  🔬 ĐÁP ÁN GIẢI MÃ KHOA HỌC TRẢ VỀ CHO HỌC SINH: *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingCode.solutionAnswer || ''}
                  onChange={(e) =>
                    setEditingCode({ ...editingCode, solutionAnswer: e.target.value })
                  }
                  placeholder="Nhập nội dung giải mã khoa học (VD: Hiện tượng cộng hưởng từ hạt nhân và phân rã phóng xạ của đồng vị Carbon-14 giải phóng phong ấn kho báu...)"
                  className="w-full bg-white border border-indigo-300 rounded-xl p-2.5 text-xs text-indigo-950 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <span className="text-[11px] text-indigo-700 font-medium block">
                  Hệ thống web sẽ hiển thị nguyên văn nội dung này ngay sau khi học sinh bẻ khóa thành công!
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 font-mono uppercase">
                  HIỆU ỨNG ĐIỂM THƯỞNG RANDOM MAY MẮN:
                </label>
                <select
                  value={editingCode.effect}
                  onChange={(e) =>
                    setEditingCode({
                      ...editingCode,
                      effect: e.target.value as MysteryBoxEffect,
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-black text-xs"
                >
                  <option value="*2">🌟 Nhân đôi toàn bộ điểm (*2)</option>
                  <option value="+10">💎 Cộng 10 điểm (+10)</option>
                  <option value="+5">✨ Cộng 5 điểm (+5)</option>
                  <option value="-5">⚠️ Trừ 5 điểm (-5)</option>
                  <option value="-10">⚡ Trừ 10 điểm (-10)</option>
                  <option value=":2">🌀 Chia đôi toàn bộ điểm (:2)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Mô Tả / Lời Dẫn Khoa Học:
                </label>
                <textarea
                  rows={2}
                  value={editingCode.description}
                  onChange={(e) =>
                    setEditingCode({ ...editingCode, description: e.target.value })
                  }
                  placeholder="Mô tả bối cảnh hoặc nguồn gốc của trạm bí ẩn..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Gợi Ý Mật Thư (Thực Địa):
                </label>
                <input
                  type="text"
                  value={editingCode.hint || ''}
                  onChange={(e) => setEditingCode({ ...editingCode, hint: e.target.value })}
                  placeholder="Manh mối gợi mở trên thẻ trạm..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="codeActiveCheck"
                  checked={editingCode.active}
                  onChange={(e) =>
                    setEditingCode({ ...editingCode, active: e.target.checked })
                  }
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="codeActiveCheck" className="font-bold text-slate-800 cursor-pointer">
                  Kích hoạt mật mã này cho các đội thi bẻ khóa
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCode(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Lưu Mật Mã & Đáp Án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
