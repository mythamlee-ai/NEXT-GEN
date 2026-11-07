import React, { useState } from 'react';
import { Team, ScienceKeyword } from '../../types';
import { keywordService } from '../../services/keywordService';
import { storageService } from '../../services/storageService';
import { audioManager } from '../../services/audioManager';
import { X, Key, Lock, Unlock, Zap, Star, Sparkles, Search, CheckCircle2, AlertCircle } from 'lucide-react';

interface KeywordVaultModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onTeamUpdated?: (updated: Team) => void;
}

export const KeywordVaultModal: React.FC<KeywordVaultModalProps> = ({
  team,
  isOpen,
  onClose,
  onTeamUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 1 | 2 | 3 | 4 | 'secret'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [secretInput, setSecretInput] = useState('');
  const [secretFeedback, setSecretFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const allKeywords = keywordService.getKeywords();
  const unlockedIds = new Set(team?.unlockedKeywordIds || team?.unlockedKeywords || []);
  const teamKwScore = team ? keywordService.calculateKeywordScore(team) : 0;
  const totalScore = team ? keywordService.calculateTotalScore(team) : 0;
  const playerRank = keywordService.getRank(totalScore);

  // Filter keywords by tab & search
  const filteredKeywords = allKeywords.filter((kw) => {
    if (activeTab !== 'all' && kw.round !== activeTab) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const isUnlocked = unlockedIds.has(kw.id);
    if (!isUnlocked && kw.isSecret) return false; // Don't search secrets if locked
    return (
      kw.name.toLowerCase().includes(term) ||
      (kw.categoryLabel && kw.categoryLabel.toLowerCase().includes(term)) ||
      kw.description.toLowerCase().includes(term)
    );
  });

  const handleUnlockSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) {
      setSecretFeedback({ type: 'error', message: 'Vui lòng chọn hoặc điểm danh đội trước khi nhập mã.' });
      return;
    }
    const clean = secretInput.trim().toUpperCase();
    if (!clean) return;

    // Find matching keyword by name or secret code
    const foundKw = allKeywords.find(
      (k) => k.name.toUpperCase() === clean || (k.id && k.id.toUpperCase() === clean)
    );

    if (foundKw) {
      if (unlockedIds.has(foundKw.id)) {
        setSecretFeedback({ type: 'error', message: `Từ khóa "${foundKw.name}" đã được mở khóa trước đó!` });
        return;
      }

      const result = keywordService.unlockKeywordForTeam(team, foundKw.id);
      if (result) {
        storageService.saveTeam(result.updatedTeam);
        if (onTeamUpdated) onTeamUpdated(result.updatedTeam);
        audioManager.playBonusPoints();
        setSecretFeedback({
          type: 'success',
          message: `✨ Chúc mừng! Đã mở khóa thành công từ khóa "${foundKw.name}" (+${foundKw.points} điểm)!`,
        });
        setSecretInput('');
      }
    } else {
      audioManager.playIncorrect();
      setSecretFeedback({
        type: 'error',
        message: `Mật mã bí ẩn "${clean}" chưa chính xác. Hãy tiếp tục giải mã tại trạm!`,
      });
    }
  };

  const unlockedCount = allKeywords.filter((k) => unlockedIds.has(k.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18)_0,rgba(168,85,247,0.18)_45%,transparent_75%)] pointer-events-none" />

      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#090e24] via-[#0d1538] to-[#150f2e] border-2 border-cyan-400/50 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden">
        {/* Top Header */}
        <div className="relative p-4 sm:p-6 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-950/70 via-indigo-950/70 to-purple-950/70">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-fuchsia-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0f24] rounded-2xl flex items-center justify-center">
                  <Key className="w-6 h-6 text-cyan-300 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-400 uppercase tracking-wide">
                    Kho Từ Khóa Khoa Học
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs font-bold">
                    NEXT GEN VAULT
                  </span>
                </div>
                <p className="text-xs text-cyan-200/70 font-sans mt-0.5">
                  Bộ sưu tập 35 từ khóa lượng tử phân loại qua 4 trạm & mật mã bí mật
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-cyan-400/30 text-cyan-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Đóng kho từ khóa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#070b1c]/80 border border-cyan-500/30 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-[10px] text-cyan-300/70 font-mono uppercase">Thu thập</div>
                <div className="text-sm font-bold text-white">
                  <span className="text-cyan-400">{unlockedCount}</span> / {allKeywords.length} Từ khóa
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070b1c]/80 border border-amber-500/30 flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <div className="text-[10px] text-amber-300/70 font-mono uppercase">Điểm từ khóa</div>
                <div className="text-sm font-bold text-amber-300">+{teamKwScore} PTS</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070b1c]/80 border border-fuchsia-500/30 flex items-center gap-2.5">
              <span className="text-lg">{playerRank.badge}</span>
              <div>
                <div className="text-[10px] text-fuchsia-300/70 font-mono uppercase">Hạng danh hiệu</div>
                <div className="text-xs font-black text-fuchsia-300">{playerRank.rank}</div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070b1c]/80 border border-emerald-500/30 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[10px] text-emerald-300/70 font-mono uppercase">Tổng điểm đội</div>
                <div className="text-sm font-bold text-emerald-300">{totalScore} PTS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab & Filter Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-cyan-500/20 bg-[#070b1c]/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-cyan-200 border border-slate-700/50'
              }`}
            >
              Tất cả (35)
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 1
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-cyan-200 border border-slate-700/50'
              }`}
            >
              Vòng 1 (13)
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 2
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-purple-200 border border-slate-700/50'
              }`}
            >
              Vòng 2 (5)
            </button>
            <button
              onClick={() => setActiveTab(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 3
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-amber-200 border border-slate-700/50'
              }`}
            >
              Vòng 3 (6)
            </button>
            <button
              onClick={() => setActiveTab(4)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 4
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-slate-900/60 text-slate-400 hover:text-emerald-200 border border-slate-700/50'
              }`}
            >
              Vòng 4 (7)
            </button>
            <button
              onClick={() => setActiveTab('secret')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'secret'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-amber-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                  : 'bg-slate-900/60 text-fuchsia-400 hover:text-fuchsia-200 border border-fuchsia-800/40'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Từ Khóa Ẩn (4)</span>
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên từ khóa..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#090e24] border border-cyan-500/30 rounded-xl text-cyan-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Secret Code Input Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-cyan-950/40 border-b border-purple-500/20">
          <form onSubmit={handleUnlockSecret} className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-xs font-mono font-bold text-fuchsia-300 flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Giải mã từ khóa ẩn thực địa:</span>
            </span>
            <div className="flex-1 flex w-full sm:w-auto items-center gap-2">
              <input
                type="text"
                value={secretInput}
                onChange={(e) => setSecretInput(e.target.value)}
                placeholder="Nhập từ khóa bí mật (VD: KHOA HỌC, SÁNG TẠO, NEXT GEN...)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#060919] border border-fuchsia-500/40 text-xs font-mono font-bold text-fuchsia-200 uppercase placeholder-slate-500 focus:outline-hidden focus:border-fuchsia-400"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all cursor-pointer whitespace-nowrap"
              >
                Mở Khóa
              </button>
            </div>
          </form>

          {secretFeedback && (
            <div
              className={`mt-2 p-2 rounded-xl text-xs flex items-center gap-2 ${
                secretFeedback.type === 'success'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
              }`}
            >
              {secretFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{secretFeedback.message}</span>
            </div>
          )}
        </div>

        {/* Keyword Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredKeywords.map((kw) => {
              const isUnlocked = unlockedIds.has(kw.id);

              if (kw.isSecret && !isUnlocked) {
                // Secret Locked Card
                return (
                  <div
                    key={kw.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-[#120826]/80 via-[#180d33]/60 to-[#0e071f]/80 border-2 border-dashed border-fuchsia-500/40 shadow-[0_0_20px_rgba(217,70,239,0.15)] flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
                        🔒 TỪ KHÓA BÍ MẬT
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">+{kw.points} PTS</span>
                    </div>

                    <div className="py-4 text-center">
                      <div className="text-2xl font-black text-fuchsia-400/70 tracking-widest font-mono mb-1 animate-pulse">
                        🔒 ? ? ? ?
                      </div>
                      <p className="text-[11px] text-fuchsia-200/60 font-sans italic">
                        {kw.hint || 'Manh mối bí mật ẩn giấu trong các thử thách.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-fuchsia-500/20 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Độ khó:</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: kw.difficulty }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              if (!isUnlocked) {
                // Normal Locked Card
                return (
                  <div
                    key={kw.id}
                    className="p-4 rounded-2xl bg-[#080d24]/60 border border-slate-700/60 flex flex-col justify-between opacity-75 hover:opacity-100 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {kw.categoryLabel || 'Khoa học'} • Vòng {kw.round}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                          <Lock className="w-3 h-3" />
                          <span>+{kw.points} PTS</span>
                        </div>
                      </div>

                      <div className="text-lg font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-slate-500" />
                        <span>{kw.name}</span>
                      </div>

                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {kw.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-cyan-400/80">
                      <span>Gợi ý mở: {kw.hint || `Hoàn thành thử thách Vòng ${kw.round}`}</span>
                      <div className="flex text-amber-400/60">
                        {Array.from({ length: kw.difficulty }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400/60" />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // Unlocked Card
              return (
                <div
                  key={kw.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#0c183b]/90 via-[#101b44]/80 to-[#1b123d]/90 border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-col justify-between relative overflow-hidden group hover:border-cyan-300 transition-all hover:shadow-[0_0_35px_rgba(6,182,212,0.4)]"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-400/20" />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                        {kw.categoryLabel || 'Khoa học'} • {kw.round === 'secret' ? 'Từ khóa ẩn' : `Vòng ${kw.round}`}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold">
                        <Zap className="w-3 h-3 fill-emerald-400" />
                        +{kw.points} PTS
                      </span>
                    </div>

                    <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-300 mb-1.5 flex items-center gap-2">
                      <Unlock className="w-4 h-4 text-cyan-300" />
                      <span>{kw.name}</span>
                    </div>

                    <p className="text-xs text-cyan-100/80 font-sans leading-relaxed">
                      {kw.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-cyan-500/30 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ĐÃ THU THẬP
                    </span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: kw.difficulty }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/30 bg-[#070b1c]/90 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            💡 Gợi ý: Mỗi câu trả lời chính xác tại các vòng chơi sẽ mở khóa từ khóa tương ứng!
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Đóng Kho
          </button>
        </div>
      </div>
    </div>
  );
};
