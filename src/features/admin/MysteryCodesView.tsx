import React, { useState, useEffect } from 'react';
import {
  Gift,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Sparkles,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  X,
  KeyRound,
  Users,
  RotateCcw,
} from 'lucide-react';
import { MysteryTreasureCode, MysteryBoxEffect } from '../../types';
import { storageService } from '../../services/storageService';
import { audioManager } from '../../services/audioManager';

export const MysteryCodesView: React.FC = () => {
  const [codes, setCodes] = useState<MysteryTreasureCode[]>(() => storageService.getMysteryCodes());
  const [editingCode, setEditingCode] = useState<MysteryTreasureCode | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  const reloadData = () => {
    setCodes([...storageService.getMysteryCodes()]);
  };

  useEffect(() => {
    const unsub = storageService.subscribe((event) => {
      if (event.type === 'MYSTERY_CODES_UPDATED' || event.type === 'FACTORY_RESET') {
        reloadData();
      }
    });
    return () => unsub();
  }, []);

  const handleOpenAdd = () => {
    const newCode: MysteryTreasureCode = {
      id: `box-${Date.now()}`,
      code: '',
      name: 'Hộp Quà May Mắn Mới',
      effect: '+10',
      description: 'Phần thưởng kho báu do Ban Tổ chức thiết lập.',
      active: true,
    };
    setEditingCode(newCode);
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCode || !editingCode.code.trim()) return;

    const clean: MysteryTreasureCode = {
      ...editingCode,
      code: editingCode.code.trim().toUpperCase(),
    };

    storageService.saveMysteryCode(clean);
    audioManager.playUnlock();
    setEditingCode(null);
    reloadData();
  };

  const handleDelete = (id: string, codeStr: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mã kho báu [${codeStr}]?`)) {
      storageService.deleteMysteryCode(id);
      audioManager.playPop();
      reloadData();
    }
  };

  const getEffectBadge = (effect: MysteryBoxEffect) => {
    switch (effect) {
      case '*2':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-amber-100 text-amber-900 border border-amber-300">
            🌟 NHÂN ĐÔI (*2)
          </span>
        );
      case '+10':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-emerald-100 text-emerald-900 border border-emerald-300">
            💎 +10 ĐIỂM
          </span>
        );
      case '+5':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-teal-100 text-teal-900 border border-teal-300">
            🎁 +5 ĐIỂM
          </span>
        );
      case '-5':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-rose-100 text-rose-800 border border-rose-300">
            ⚠️ -5 ĐIỂM
          </span>
        );
      case '-10':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-red-100 text-red-900 border border-red-300">
            ⚡ -10 ĐIỂM
          </span>
        );
      case ':2':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-purple-100 text-purple-900 border border-purple-300">
            🌀 CHIA ĐÔI (:2)
          </span>
        );
      default:
        return null;
    }
  };

  const claimedCount = codes.filter((c) => !!c.claimedByTeamId).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-mono text-slate-500 uppercase font-bold block mb-1">
            Tổng Mã Hộp Quà Thiết Lập
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 font-mono">{codes.length}</span>
            <span className="text-xs text-slate-500">mã kho báu</span>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm bg-emerald-50/20">
          <span className="text-[11px] font-mono text-emerald-700 uppercase font-bold block mb-1">
            Số Mã Đã Được Đội Mở
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-800 font-mono">{claimedCount}</span>
            <span className="text-xs text-slate-500">lượt mở rương</span>
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm bg-amber-50/20">
          <span className="text-[11px] font-mono text-amber-700 uppercase font-bold block mb-1">
            Biến Động Điểm Vòng 4
          </span>
          <span className="text-sm font-black text-amber-900 font-mono block">
            +5, +10, -5, -10, :2, *2
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <h3 className="font-black text-slate-900 text-sm">
            Quản Lý Mật Mã Hộp Quà Bí Ẩn Vòng 4 (Trường Pétrus Ký)
          </h3>
          <p className="text-xs text-slate-500">
            Hệ thống lưu trữ từng mã cụ thể và số điểm biến động tương ứng khi học sinh nhập vào.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Mã Hộp Quà Mới</span>
        </button>
      </div>

      {/* Codes Table List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3.5">Mật Mã (Code)</th>
                <th className="p-3.5">Tên Hộp Quà Bí Ẩn</th>
                <th className="p-3.5 text-center">Hiệu Ứng Điểm Số</th>
                <th className="p-3.5">Trạng Thái / Đội Đã Nhập</th>
                <th className="p-3.5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {codes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-black text-slate-900">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {c.code}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{c.name}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{c.description}</span>
                  </td>
                  <td className="p-3.5 text-center">
                    {getEffectBadge(c.effect)}
                  </td>
                  <td className="p-3.5">
                    {c.claimedByTeamId ? (
                      <div className="text-emerald-700 font-bold">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Đã mở bởi: {c.claimedByTeamName || c.claimedByTeamId}</span>
                        </span>
                        {c.pointsDelta !== undefined && (
                          <span className="text-[11px] text-slate-500 font-mono block">
                            Biến động: {c.pointsDelta >= 0 ? `+${c.pointsDelta}` : c.pointsDelta} pts
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Chưa có đội nào nhập</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingCode(c);
                          setIsNew(false);
                        }}
                        className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg cursor-pointer"
                        title="Chỉnh sửa mã"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Xóa mã"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {isNew ? 'Thêm Mật Mã Hộp Quà Mới' : `Chỉnh Sửa Mã [${editingCode.code}]`}
              </h3>
              <button
                onClick={() => setEditingCode(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 font-mono uppercase">
                  MẬT MÃ NHẬN ĐƯỢC (CODE):
                </label>
                <input
                  type="text"
                  required
                  value={editingCode.code}
                  onChange={(e) => setEditingCode({ ...editingCode, code: e.target.value.toUpperCase() })}
                  placeholder="VD: LUCKY-GOLD, NEXTGEN-CHAMPION..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono font-black text-slate-900 uppercase tracking-wider"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Hộp Quà / Vật Phẩm:</label>
                <input
                  type="text"
                  required
                  value={editingCode.name}
                  onChange={(e) => setEditingCode({ ...editingCode, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 font-mono uppercase">
                  HIỆU ỨNG BIẾN ĐỘNG ĐIỂM (TỪ ĐIỂM 3 VÒNG TRƯỚC):
                </label>
                <select
                  value={editingCode.effect}
                  onChange={(e) =>
                    setEditingCode({
                      ...editingCode,
                      effect: e.target.value as MysteryBoxEffect,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-black text-slate-900"
                >
                  <option value="*2">🌟 Nhân đôi điểm số (*2)</option>
                  <option value="+10">💎 Cộng 10 điểm (+10)</option>
                  <option value="+5">🎁 Cộng 5 điểm (+5)</option>
                  <option value="-5">⚠️ Trừ 5 điểm (-5)</option>
                  <option value="-10">⚡ Trừ 10 điểm (-10)</option>
                  <option value=":2">🌀 Chia đôi điểm số (:2)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả / Lời dẫn:</label>
                <textarea
                  rows={2}
                  value={editingCode.description}
                  onChange={(e) => setEditingCode({ ...editingCode, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCode(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md cursor-pointer"
                >
                  Lưu Mã
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
