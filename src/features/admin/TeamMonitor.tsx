import React, { useState } from 'react';
import {
  RotateCcw,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Search,
  Users,
  X,
  UserCheck,
} from 'lucide-react';
import { Team, TeamAnswerRecord } from '../../types';
import { ScoringEngine } from '../../services/scoringEngine';
import { storageService } from '../../services/storageService';
import { ConfirmModal } from '../../components/ConfirmModal';
import { audioManager } from '../../services/audioManager';
import { CertificateModal } from '../player/CertificateModal';

interface TeamMonitorProps {
  teams: Team[];
  onRefresh: () => void;
}

export const TeamMonitor: React.FC<TeamMonitorProps> = ({ teams, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [certTeam, setCertTeam] = useState<Team | null>(null);

  // Local state for teams to guarantee instant removal upon deletion
  const [teamList, setTeamList] = useState<Team[]>(teams);

  React.useEffect(() => {
    setTeamList(teams);
  }, [teams]);

  // Confirmation modal state
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

  const handleResetTeam = (teamId: string, teamName: string) => {
    audioManager.playButtonTap();
    setConfirmDialog({
      isOpen: true,
      title: 'Đặt Lại (Reset) Đội Thi',
      message: `Bạn có chắc muốn đặt lại toàn bộ điểm số, thời gian và vòng chơi của đội "${teamName}" về trạng thái ban đầu?`,
      type: 'warning',
      onConfirm: () => {
        const resetResult = storageService.resetTeam(teamId);
        if (resetResult) {
          setTeamList((prev) => prev.map((t) => (t.id === teamId ? resetResult : t)));
        }
        onRefresh();
        audioManager.playUnlock();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    audioManager.playButtonTap();
    setConfirmDialog({
      isOpen: true,
      title: 'Xóa Vĩnh Viễn Đội Thi',
      message: `Bạn có chắc chắn muốn xóa đội "${teamName}" khỏi hệ thống giải đấu? Dữ liệu lịch sử làm bài của đội sẽ bị xóa hoàn toàn.`,
      type: 'danger',
      onConfirm: () => {
        storageService.deleteTeam(teamId);
        setTeamList((prev) => prev.filter((t) => t.id !== teamId));
        onRefresh();
        audioManager.playPop();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const filtered = teamList.filter(
    (t) =>
      t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teamCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.captainName && t.captainName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Lọc theo tên đội, lớp, đội trưởng, mã..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-sky-500 shadow-sm transition-all"
          />
        </div>

        <span className="text-xs font-mono font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          Hiển thị: {filtered.length} / {teamList.length} đội thi
        </span>
      </div>

      {/* Teams Table - Bright & Crisp */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Đội Thi & Đội Trưởng</th>
                <th className="py-3 px-4">Mã Đội</th>
                <th className="py-3 px-4 text-center">Vòng</th>
                <th className="py-3 px-4 text-right">Điểm</th>
                <th className="py-3 px-4 text-right">Thời Gian</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
                    Không có đội thi nào trong danh sách.
                  </td>
                </tr>
              ) : (
                filtered.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-400">
                      {idx + 1}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 block">{t.teamName}</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border border-slate-200 font-semibold">
                          {t.className}
                        </span>
                      </div>
                      {t.captainName && (
                        <p className="text-xs text-indigo-700 mt-0.5 font-medium flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-indigo-500" />
                          <span>Đội trưởng: <strong>{t.captainName}</strong></span>
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-sky-700 font-bold">
                      {t.teamCode}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 font-bold border border-sky-200">
                        Vòng {t.currentRound}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-700">
                      {t.score} pts
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-600">
                      {ScoringEngine.formatTime(t.elapsedTime)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          t.status === 'finished'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : t.status === 'playing'
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.status === 'finished'
                          ? 'Hoàn thành'
                          : t.status === 'playing'
                          ? 'Đang chơi'
                          : 'Sẵn sàng'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View History */}
                        <button
                          onClick={() => setSelectedTeam(t)}
                          title="Xem chi tiết làm bài"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-sky-600 hover:bg-sky-50 transition-all cursor-pointer border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Certificate Button */}
                        <button
                          onClick={() => setCertTeam(t)}
                          title="Xem / Tải Giấy Chứng Nhận Pétrus Ký"
                          className="p-1.5 rounded-lg bg-yellow-50 text-amber-700 hover:text-amber-900 hover:bg-yellow-100 transition-all cursor-pointer border border-amber-300"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>

                        {/* Reset Team */}
                        <button
                          onClick={() => handleResetTeam(t.id, t.teamName)}
                          title="Đặt lại (Reset) đội"
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Team Button */}
                        <button
                          onClick={() => handleDeleteTeam(t.id, t.teamName)}
                          title="Xóa vĩnh viễn đội"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-300 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border-2 border-sky-300 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>Hồ Sơ Đội: {selectedTeam.teamName}</span>
                  <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono border border-sky-300">
                    {selectedTeam.teamCode}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Lớp: <strong>{selectedTeam.className}</strong> • Đội Trưởng:{' '}
                  <strong className="text-indigo-700">{selectedTeam.captainName || (selectedTeam.members && selectedTeam.members[0]) || 'Chưa cập nhật'}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCertTeam(selectedTeam)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Giấy Chứng Nhận</span>
                </button>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Vòng 1</span>
                  <span className="text-sky-700 font-bold text-sm">
                    {selectedTeam.roundScores[1] || 0} pts
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Vòng 2</span>
                  <span className="text-indigo-700 font-bold text-sm">
                    {selectedTeam.roundScores[2] || 0} pts
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Vòng 3</span>
                  <span className="text-purple-700 font-bold text-sm">
                    {selectedTeam.roundScores[3] || 0} pts
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-1">Vòng 4</span>
                  <span className="text-amber-700 font-bold text-sm">
                    {selectedTeam.roundScores[4] || 0} pts
                  </span>
                </div>
              </div>

              <h4 className="text-xs uppercase font-mono font-bold text-slate-700 pt-2">
                Nhật Ký Các Câu Đã Trả Lời:
              </h4>

              {selectedTeam.answersHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  Đội chưa ghi nhận câu trả lời nào.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedTeam.answersHistory.map((ans, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {ans.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-mono text-slate-500">
                            Vòng {ans.round} - ID: {ans.questionId}
                          </span>
                          <p className="text-slate-800">
                            Lựa chọn:{' '}
                            <strong className="text-slate-900 font-mono">{ans.selectedAnswer}</strong>
                            {ans.hintsUsed ? ` (Dùng ${ans.hintsUsed} gợi ý)` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span
                          className={`font-bold ${
                            ans.isCorrect ? 'text-emerald-700' : 'text-slate-400'
                          }`}
                        >
                          +{ans.pointsAwarded} pts
                        </span>
                        <p className="text-[10px] text-slate-400">{ans.timeTaken}s</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Certificate Modal for Admin inspection */}
      {certTeam && (
        <CertificateModal
          team={certTeam}
          rank={
            [...teamList]
              .sort((a, b) => b.score - a.score || a.elapsedTime - b.elapsedTime)
              .findIndex((t) => t.id === certTeam.id) + 1 || 1
          }
          onClose={() => setCertTeam(null)}
        />
      )}
    </div>
  );
};
