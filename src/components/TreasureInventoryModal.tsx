import React from 'react';
import {
  Key,
  Map as MapIcon,
  Gem,
  Compass,
  Lock,
  CheckCircle2,
  Sparkles,
  X,
  ShieldAlert,
} from 'lucide-react';
import { Team, TreasureItem } from '../types';
import { storageService } from '../services/storageService';
import { ChibiMascot } from './ChibiMascot';

interface TreasureInventoryModalProps {
  team: Team;
  onClose: () => void;
}

export const TreasureInventoryModal: React.FC<TreasureInventoryModalProps> = ({
  team,
  onClose,
}) => {
  const allItems = storageService.getTreasureItems();

  const isItemUnlocked = (item: TreasureItem) => {
    if (team.collectedTreasures && team.collectedTreasures.includes(item.id)) return true;
    if (team.status === 'finished') return true;
    // Check if team has completed the round
    return team.currentRound > item.round;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'key':
        return <Key className="w-6 h-6 text-amber-500" />;
      case 'map':
        return <MapIcon className="w-6 h-6 text-indigo-500" />;
      case 'gem':
        return <Gem className="w-6 h-6 text-purple-500" />;
      case 'compass':
      default:
        return <Compass className="w-6 h-6 text-emerald-500" />;
    }
  };

  const unlockedCount = allItems.filter(isItemUnlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Decorative soft glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-100 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-sm">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">
                  KHO ĐỒ THÁM HIỂM PEK
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {unlockedCount} / 4 Vật Phẩm
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Đội: <strong className="text-slate-800">{team.teamName}</strong> • Đội Trưởng: <strong className="text-indigo-700">{team.captainName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chibi Guide Advice */}
        <div className="relative z-10 flex items-center gap-3 p-3.5 bg-sky-50 border border-sky-200 rounded-2xl mb-6">
          <ChibiMascot expression="pointing" size="sm" accessory="map" />
          <div className="text-xs text-sky-900">
            <span className="font-bold block">Chỉ dẫn của Nhà thám hiểm PeK:</span>
            <span>
              Hãy thu thập đủ 4 vật phẩm và từ khóa bí mật để kích hoạt cơ chế mở khóa RƯƠNG KHO BÁU CUỐI CÙNG!
            </span>
          </div>
        </div>

        {/* 4 Treasure Items Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {allItems.map((item) => {
            const unlocked = isItemUnlocked(item);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                  unlocked
                    ? 'bg-gradient-to-br from-amber-50/60 to-white border-amber-300 shadow-md'
                    : 'bg-slate-50/90 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      unlocked
                        ? 'bg-white shadow-sm border border-amber-200'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {unlocked ? getIcon(item.icon) : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        VÒNG {item.round} • {item.type.toUpperCase()}
                      </span>
                      {unlocked && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>

                    <h4
                      className={`text-sm font-bold leading-tight ${
                        unlocked ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {item.name}
                    </h4>

                    {unlocked ? (
                      <div className="mt-2 space-y-1">
                        <div className="inline-block px-2.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-mono font-black tracking-wider">
                          MẬT TỪ: {item.keyword}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic mt-2">
                        [Chưa mở khóa – Hoàn thành Vòng {item.round} để nhận vật phẩm]
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Close Action */}
        <div className="relative z-10 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-600">
            Tiến trình: <strong>{unlockedCount}/4 chìa khóa & mật mã</strong>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Đóng Kho Đồ
          </button>
        </div>
      </div>
    </div>
  );
};
