import React, { useState } from 'react';
import {
  KeyRound,
  Sparkles,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Edit2,
  Check,
  X,
  Lock,
  Unlock,
  Award,
} from 'lucide-react';
import { ScienceKeyword } from '../../types';
import { keywordService } from '../../services/keywordService';
import { storageService } from '../../services/storageService';
import { audioManager } from '../../services/audioManager';

interface KeywordManagementViewProps {
  onRefresh?: () => void;
}

export const KeywordManagementView: React.FC<KeywordManagementViewProps> = ({ onRefresh }) => {
  const [keywords, setKeywords] = useState<ScienceKeyword[]>(keywordService.getAllKeywords());
  const [search, setSearch] = useState('');
  const [filterRound, setFilterRound] = useState<number | 'secret' | 'all'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState<number>(10);
  const [editHint, setEditHint] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Keyword Form
  const [newName, setNewName] = useState('');
  const [newRound, setNewRound] = useState<1 | 2 | 3 | 4 | 'secret'>(1);
  const [newCategory, setNewCategory] = useState<ScienceKeyword['category']>('physics');
  const [newCategoryLabel, setNewCategoryLabel] = useState('Vật Lí');
  const [newPoints, setNewPoints] = useState(15);
  const [newDifficulty, setNewDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [newHint, setNewHint] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsSecret, setNewIsSecret] = useState(false);

  const teams = storageService.getTeams();

  const reload = () => {
    setKeywords(keywordService.getAllKeywords());
    if (onRefresh) onRefresh();
  };

  const handleToggleActive = (id: string, current: boolean) => {
    keywordService.updateKeyword(id, { active: !current });
    audioManager.playPop();
    reload();
  };

  const handleStartEdit = (kw: ScienceKeyword) => {
    setEditingId(kw.id);
    setEditPoints(kw.points);
    setEditHint(kw.hint || '');
  };

  const handleSaveEdit = (id: string) => {
    keywordService.updateKeyword(id, {
      points: Number(editPoints) || 10,
      hint: editHint.trim() || undefined,
    });
    setEditingId(null);
    audioManager.playUnlock();
    reload();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Xác nhận xóa từ khóa "${name}" khỏi kho?`)) {
      keywordService.deleteKeyword(id);
      audioManager.playPop();
      reload();
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục toàn bộ kho 35 từ khóa chuẩn (Vòng 1-4 + Từ khóa Ẩn)? Mọi chỉnh sửa tùy biến sẽ được đưa về mặc định.')) {
      keywordService.resetToDefaults();
      audioManager.playVictory();
      reload();
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    keywordService.addKeyword({
      name: newName.trim(),
      round: newRound,
      category: newCategory,
      categoryLabel: newCategoryLabel,
      points: Number(newPoints) || 10,
      difficulty: newDifficulty,
      description: newDesc.trim() || newName.trim(),
      hint: newHint.trim() || '',
      isSecret: newIsSecret,
      active: true,
    });

    setNewName('');
    setNewHint('');
    setNewDesc('');
    setShowAddModal(false);
    audioManager.playUnlock();
    reload();
  };

  // Filtered
  const filtered = keywords.filter((k) => {
    const matchSearch =
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.category.toLowerCase().includes(search.toLowerCase()) ||
      (k.categoryLabel && k.categoryLabel.toLowerCase().includes(search.toLowerCase())) ||
      (k.hint && k.hint.toLowerCase().includes(search.toLowerCase()));
    const matchRound = filterRound === 'all' || k.round === filterRound;
    return matchSearch && matchRound;
  });

  const totalPoints = keywords.reduce((sum, k) => sum + (k.active ? k.points : 0), 0);
  const secretCount = keywords.filter((k) => k.isSecret).length;

  const getRoundBadgeStyle = (round: number | 'secret') => {
    if (round === 1) return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    if (round === 2) return 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/40';
    if (round === 3) return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
    if (round === 4) return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    return 'bg-purple-950/80 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                QUANTUM KEYWORD VAULT ENGINE
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide flex items-center gap-2.5">
              <KeyRound className="w-7 h-7 text-amber-400 animate-pulse" />
              Quản Trị Kho Từ Khóa Khoa Học (35+ Keywords)
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Quản lý hệ thống từ khóa mật mã, điểm thưởng hologram và giải mã bí mật cho toàn bộ 4 vòng chơi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Từ Khóa Mới</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              title="Khôi phục danh sách chuẩn 35 từ khóa"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Khôi Phục Chuẩn</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-cyan-500/20">
          <div className="bg-[#070b1c]/70 border border-cyan-500/30 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Tổng Từ Khóa</span>
            <span className="text-2xl font-black text-white font-mono">{keywords.length}</span>
          </div>
          <div className="bg-[#070b1c]/70 border border-emerald-500/30 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Đang Kích Hoạt</span>
            <span className="text-2xl font-black text-emerald-300 font-mono">
              {keywords.filter((k) => k.active).length}
            </span>
          </div>
          <div className="bg-[#070b1c]/70 border border-amber-500/30 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">Từ Khóa Ẩn (Secret)</span>
            <span className="text-2xl font-black text-amber-300 font-mono">{secretCount}</span>
          </div>
          <div className="bg-[#070b1c]/70 border border-fuchsia-500/30 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-wider block">Tổng Quỹ Điểm</span>
            <span className="text-2xl font-black text-fuchsia-300 font-mono">+{totalPoints}đ</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0c1435]/80 border border-cyan-500/30 rounded-2xl p-3.5 backdrop-blur-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên từ khóa, chủ đề, gợi ý..."
            className="w-full bg-[#070b1c]/80 border border-cyan-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
          />
        </div>

        {/* Round Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterRound('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterRound === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            Tất Cả ({keywords.length})
          </button>
          {[1, 2, 3, 4].map((r) => {
            const count = keywords.filter((k) => k.round === r).length;
            const colors = [
              '',
              'text-cyan-300 border-cyan-500/40',
              'text-fuchsia-300 border-fuchsia-500/40',
              'text-amber-300 border-amber-500/40',
              'text-emerald-300 border-emerald-500/40',
            ][r];
            return (
              <button
                key={r}
                onClick={() => setFilterRound(r as 1 | 2 | 3 | 4)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  filterRound === r
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] border-cyan-400'
                    : `bg-slate-900/80 ${colors} hover:bg-slate-800`
                }`}
              >
                Vòng {r} ({count})
              </button>
            );
          })}
          <button
            onClick={() => setFilterRound('secret')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap border ${
              filterRound === 'secret'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)] border-amber-300'
                : 'bg-slate-900/80 text-amber-300 border-amber-500/40 hover:bg-slate-800'
            }`}
          >
            Từ Khóa Ẩn ({secretCount})
          </button>
        </div>
      </div>

      {/* Keyword Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((kw) => {
          const isEditing = editingId === kw.id;
          const unlockedCount = teams.filter(
            (t) => t.unlockedKeywordIds && t.unlockedKeywordIds.includes(kw.id)
          ).length;

          const roundBadgeClass = getRoundBadgeStyle(kw.round);

          return (
            <div
              key={kw.id}
              className={`relative rounded-2xl p-4.5 transition-all backdrop-blur-xl border ${
                !kw.active
                  ? 'bg-slate-900/50 border-slate-700/50 opacity-60'
                  : kw.isSecret
                  ? 'bg-gradient-to-b from-amber-950/30 via-[#0c1435]/90 to-fuchsia-950/30 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                  : 'bg-[#0c1435]/90 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black border ${roundBadgeClass}`}
                  >
                    {kw.round === 'secret' ? 'SECRET' : `VÒNG ${kw.round}`}
                  </span>
                  {kw.isSecret && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" />
                      TỪ KHÓA ẨN
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-slate-800/80 border border-slate-700">
                    {kw.categoryLabel}
                  </span>
                </div>

                {/* Active switch */}
                <button
                  onClick={() => handleToggleActive(kw.id, kw.active)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    kw.active
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                  }`}
                  title={kw.active ? 'Đang hoạt động (nhấn để tắt)' : 'Đang tắt (nhấn để kích hoạt)'}
                >
                  {kw.active ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Keyword Name */}
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <h3 className="text-lg font-black text-white tracking-wide font-mono flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
                  {kw.name}
                </h3>
                <span className="text-base font-black text-amber-400 font-mono shrink-0">
                  +{kw.points}đ
                </span>
              </div>

              {/* Hint */}
              {kw.hint && (
                <p className="text-xs text-slate-300 italic mb-3 font-sans line-clamp-2">
                  "{kw.hint}"
                </p>
              )}

              {/* Unlocked by Teams Count */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2.5 mt-2.5 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Award className="w-3.5 h-3.5" />
                  <span>
                    Đã mở bởi: <strong className="text-white">{unlockedCount}</strong>/{teams.length} đội
                  </span>
                </div>

                {/* Edit & Delete actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(kw)}
                    className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/50 cursor-pointer transition-all"
                    title="Chỉnh sửa điểm/gợi ý"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(kw.id, kw.name)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 cursor-pointer transition-all"
                    title="Xóa từ khóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Inline Edit Form */}
              {isEditing && (
                <div className="mt-3 pt-3 border-t border-cyan-500/30 space-y-2 bg-[#070b1c]/90 p-3 rounded-xl">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Số điểm (+):</label>
                    <input
                      type="number"
                      value={editPoints}
                      onChange={(e) => setEditPoints(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-cyan-500/40 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Gợi ý gợi mở:</label>
                    <input
                      type="text"
                      value={editHint}
                      onChange={(e) => setEditHint(e.target.value)}
                      placeholder="Gợi ý thêm..."
                      className="w-full bg-slate-900 border border-cyan-500/40 rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleSaveEdit(kw.id)}
                      className="px-3 py-1 rounded-lg text-[10px] font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-mono cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Lưu
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Keyword Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1233] border-2 border-cyan-500/60 rounded-3xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(6,182,212,0.4)] text-white">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30 mb-4">
              <h3 className="text-lg font-black tracking-wide flex items-center gap-2 text-cyan-300 font-mono">
                <Plus className="w-5 h-5 text-amber-400" />
                THÊM TỪ KHÓA MỚI VÀO KHO
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-cyan-300 uppercase block mb-1">
                  Từ Khóa (Viết in hoa, vd: LỰC HẤP DẪN) *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: CỘNG HƯỞNG TỪ"
                  className="w-full bg-[#070b1c] border border-cyan-500/40 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-cyan-300 uppercase block mb-1">
                    Thuộc Vòng Chơi
                  </label>
                  <select
                    value={newRound}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewRound(val === 'secret' ? 'secret' : (Number(val) as 1 | 2 | 3 | 4));
                    }}
                    className="w-full bg-[#070b1c] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-300 cursor-pointer"
                  >
                    <option value={1}>Vòng 1 - Khoa Học Cơ Bản</option>
                    <option value={2}>Vòng 2 - Con Người & CN</option>
                    <option value={3}>Vòng 3 - Quan Sát & Suy Luận</option>
                    <option value={4}>Vòng 4 - Công Nghệ & Tương Lai</option>
                    <option value="secret">Từ Khóa Ẩn (Secret Code)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-cyan-300 uppercase block mb-1">
                    Điểm Thưởng (+đ)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={200}
                    step={5}
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full bg-[#070b1c] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-cyan-300 uppercase block mb-1">
                    Chủ Đề
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      const cat = e.target.value as ScienceKeyword['category'];
                      setNewCategory(cat);
                      const labels: Record<string, string> = {
                        physics: 'Vật Lí',
                        chemistry: 'Hóa Học',
                        biology: 'Sinh Học',
                        people: 'Con Người',
                        tech: 'Công Nghệ',
                        reasoning: 'Suy Luận',
                        special: 'Chúa Tể',
                      };
                      setNewCategoryLabel(labels[cat] || 'Khoa Học');
                    }}
                    className="w-full bg-[#070b1c] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-300 cursor-pointer"
                  >
                    <option value="physics">Vật Lí (Physics)</option>
                    <option value="chemistry">Hóa Học (Chemistry)</option>
                    <option value="biology">Sinh Học (Biology)</option>
                    <option value="people">Con Người & Thầy Cô (People)</option>
                    <option value="tech">Công Nghệ & AI (Tech)</option>
                    <option value="reasoning">Suy Luận & Logic (Reasoning)</option>
                    <option value="special">Chúa Tể & Đặc Biệt (Special)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-cyan-300 uppercase block mb-1">
                    Loại Từ Khóa
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsSecret}
                      onChange={(e) => setNewIsSecret(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-amber-300 font-bold">
                      Từ khóa ẩn (Secret Code)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-cyan-300 uppercase block mb-1">
                  Gợi Ý / Ý Nghĩa Khoa Học
                </label>
                <textarea
                  rows={2}
                  value={newHint}
                  onChange={(e) => setNewHint(e.target.value)}
                  placeholder="Giải thích ngắn gọn ý nghĩa hoặc cách tìm thấy từ khóa này..."
                  className="w-full bg-[#070b1c] border border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cyan-500/30">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer"
                >
                  Xác Nhận Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
