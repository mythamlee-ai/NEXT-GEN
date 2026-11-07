import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Key,
  Unlock,
  Lock,
  ArrowRight,
  ShieldCheck,
  Award,
  Box,
  CheckCircle2,
  Compass,
  Map as MapIcon,
  Gem,
  PackageCheck,
} from 'lucide-react';
import { RoundNumber, TreasureItem } from '../types';
import { audioManager } from '../services/audioManager';
import { storageService } from '../services/storageService';
import { ChibiMascot } from './ChibiMascot';

interface TreasureQuestModalProps {
  completedRound: RoundNumber;
  teamName: string;
  roundScore: number;
  onContinue: () => void;
}

export const TreasureQuestModal: React.FC<TreasureQuestModalProps> = ({
  completedRound,
  teamName,
  roundScore,
  onContinue,
}) => {
  // Sequence stages (0 to 6) representing the 14-step narrative flow
  // 0: Initial dim & victory sound
  // 1: Chibi guide celebration & item flying into center
  // 2: Item glowing + Big "VÒNG X HOÀN THÀNH!" header
  // 3: "BẠN ĐÃ NHẬN ĐƯỢC: [...]" revealed + Confetti & Sparkles
  // 4: Typewriter keyword animation
  // 5: Saved to Treasure Inventory badge
  // 6: Next destination path unlocked + Ready to continue
  const [animStage, setAnimStage] = useState<number>(0);
  const [typedKeyword, setTypedKeyword] = useState<string>('');

  // Get corresponding treasure item and lore
  const treasureItems = storageService.getTreasureItems();
  const currentItem = treasureItems.find((it) => it.round === completedRound) || {
    id: `treasure-r${completedRound}`,
    round: completedRound,
    type: completedRound === 1 ? 'key' : completedRound === 2 ? 'map_fragment' : completedRound === 3 ? 'gem' : 'artifact',
    name: completedRound === 1 ? 'Chìa Khóa Quang Phổ Alpha' : completedRound === 2 ? 'Mảnh Bản Đồ Cổ PeK' : completedRound === 3 ? 'Đá Quý Thạch Anh Thám Mã' : 'La Bàn Vàng Tối Thượng Next Gen',
    keyword: completedRound === 1 ? 'LƯỢNG TỬ' : completedRound === 2 ? 'NGUYÊN TỐ' : completedRound === 3 ? 'TIẾN HÓA' : 'VÔ ĐỊCH NEXT GEN',
    description: 'Bảo vật khoa học huyền thoại.',
    icon: completedRound === 1 ? 'key' : completedRound === 2 ? 'map' : completedRound === 3 ? 'gem' : 'compass',
    badgeColor: 'amber',
    unlocked: true,
  };

  const getRoundLores = () => {
    switch (completedRound) {
      case 1:
        return {
          roundTitle: 'VÒNG 1: THE SCIENCE ISLAND',
          landName: 'Đảo Khoa Học',
          rewardTypeLabel: 'CHÌA KHÓA KHO BÁU',
          keyCode: 'GEN-PHYSI',
          narrative: 'Tuyệt vời! Bạn đã vượt qua Đảo Khoa Học. Lăng kính phong ấn đầu tiên đã bị phá vỡ!',
          nextDestination: 'VÙNG ĐẤT BÍ ẨN (THE MYSTERY TEACHER)',
        };
      case 2:
        return {
          roundTitle: 'VÒNG 2: THE MYSTERY TEACHER',
          landName: 'Vùng Đất Bí Ẩn',
          rewardTypeLabel: 'MẢNH BẢN ĐỒ CỔ',
          keyCode: 'GEN-CHEMI',
          narrative: 'Xuất sắc! Bằng óc thám tử nhạy bén, các bạn đã nhận diện thành công các Thầy Cô KHTN và lật mở Bản Đồ Cổ!',
          nextDestination: 'ĐUỔI HÌNH BẮT CHỮ (CA DAO TỤC NGỮ)',
        };
      case 3:
        return {
          roundTitle: 'VÒNG 3: ĐUỔI HÌNH BẮT CHỮ',
          landName: 'Vũ Đài Đuổi Hình Bắt Chữ',
          rewardTypeLabel: 'ĐÁ QUÝ THÁCH ĐỐ',
          keyCode: 'GEN-BIO',
          narrative: 'Thần kỳ! 5 câu ca dao tục ngữ Việt Nam đã được giải mã thần tốc. Mật mã bí mật số 3 (CHINH PHỤC) đã sẵn sàng kích hoạt Kho Khóa Lượng Tử!',
          nextDestination: 'AI LAB: GIẢI MÃ TỐI MẬT (THE FINAL MISSION)',
        };
      case 4:
      default:
        return {
          roundTitle: 'VÒNG 4: THE FINAL TREASURE',
          landName: 'Kho Báu Cuối Cùng',
          rewardTypeLabel: 'BẢO VẬT TỐI THƯỢNG',
          keyCode: 'NEXTGEN-CHAMPION-2026',
          narrative: 'Hợp nhất tối thượng! Toàn bộ 4 mật mã và chìa khóa đã hội tụ, Rương Kho Báu Next Gen đã chính thức mở bung!',
          nextDestination: 'RƯƠNG KHO BÁU & BẢNG VINH DANH QUÁN QUÂN',
        };
    }
  };

  const lore = getRoundLores();

  // 14-Step Sequence Timeline Execution
  useEffect(() => {
    // Step 1: Backdrop dims & Step 2: Victory fanfare sound
    audioManager.playVictory();

    // Step 3 & 4: Chibi guide appears celebrating + Step 5: Item flies into center
    const t1 = setTimeout(() => {
      setAnimStage(1);
      audioManager.playPop();
    }, 400);

    // Step 6: Item glows + Step 7: Big "VÒNG X HOÀN THÀNH!" header
    const t2 = setTimeout(() => {
      setAnimStage(2);
      audioManager.playUnlock();
    }, 1100);

    // Step 8: Reward title & Step 9: Confetti & Sparkles
    const t3 = setTimeout(() => {
      setAnimStage(3);
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#f59e0b', '#0284c7', '#8b5cf6', '#10b981', '#ec4899'],
        });
      } catch {
        // Ignored
      }
    }, 1800);

    // Step 10: Typewriter animation for the keyword
    const t4 = setTimeout(() => {
      setAnimStage(4);
      let charIndex = 0;
      const fullWord = currentItem.keyword;
      const typeInterval = setInterval(() => {
        if (charIndex <= fullWord.length) {
          setTypedKeyword(fullWord.slice(0, charIndex));
          charIndex++;
          audioManager.playButtonTap();
        } else {
          clearInterval(typeInterval);
        }
      }, 70);
    }, 2500);

    // Step 11: Saved to Treasure Inventory badge
    const t5 = setTimeout(() => {
      setAnimStage(5);
      audioManager.playBonusPoints();
    }, 3800);

    // Step 12 & 13: Map path unlocks & Next destination glows + Step 14: "TIẾP TỤC HÀNH TRÌNH" button
    const t6 = setTimeout(() => {
      setAnimStage(6);
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [completedRound, currentItem.keyword]);

  const renderItemVisual = () => {
    switch (currentItem.icon) {
      case 'key':
        return <Key className="w-16 h-16 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />;
      case 'map':
        return <MapIcon className="w-16 h-16 text-indigo-500 animate-pulse" />;
      case 'gem':
        return <Gem className="w-16 h-16 text-purple-500 animate-bounce" />;
      case 'compass':
      default:
        return <Compass className="w-16 h-16 text-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white border-2 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 text-center select-none">
        {/* Soft Radiant Light Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200/50 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Chibi Guide Speaking Header */}
        <div className="relative z-10 flex flex-col items-center mb-3">
          <div className="flex items-center justify-center gap-3">
            <ChibiMascot
              expression="celebrating"
              variant="chibi_scientist"
              size="md"
              accessory="map"
              showSpeechBubble={true}
              speechText={`Chúc mừng Đội ${teamName}! Một báu vật huyền thoại đã được mở khóa!`}
            />
          </div>
        </div>

        {/* Big Header: VÒNG X HOÀN THÀNH! */}
        <div className="relative z-10 mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold tracking-wider mb-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{lore.roundTitle}</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-black text-slate-900 tracking-tight transition-all duration-500 transform ${
              animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            VÒNG {completedRound} HOÀN THÀNH!
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
            Điểm đạt được:{' '}
            <span className="text-amber-600 font-mono font-black text-base">+{roundScore} pts</span>
          </p>
        </div>

        {/* Central Glowing Treasure Item (Flying in & Radiant Scale) */}
        <div className="relative z-10 my-4 flex flex-col items-center justify-center">
          <div
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-3 bg-gradient-to-tr from-amber-200 via-yellow-100 to-amber-300 border-2 border-amber-400 shadow-xl flex items-center justify-center transition-all duration-700 transform ${
              animStage >= 1 ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-12'
            } ${animStage >= 2 ? 'ring-8 ring-amber-300/40 shadow-amber-300/60' : ''}`}
          >
            {renderItemVisual()}

            <span className="absolute -top-2.5 -right-2.5 px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full shadow-md font-mono border border-white">
              #{completedRound}
            </span>
          </div>

          {/* Reward Label & Item Name */}
          <div
            className={`mt-3 transition-all duration-500 ${
              animStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              BẠN ĐÃ NHẬN ĐƯỢC: {lore.rewardTypeLabel}
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {currentItem.name}
            </h3>
          </div>
        </div>

        {/* Typewriter Keyword Card */}
        <div
          className={`relative z-10 bg-slate-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 mb-4 text-center transition-all duration-500 ${
            animStage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            <Unlock className="w-4 h-4 text-amber-600" />
            <span>TỪ KHÓA BÍ MẬT THU THẬP ĐƯỢC:</span>
          </div>

          {/* Glowing Typewriter Box */}
          <div className="inline-block px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-mono font-black text-xl sm:text-2xl tracking-widest shadow-md shadow-amber-500/25">
            {typedKeyword || '...'}
            <span className="inline-block w-2 h-5 bg-slate-950 ml-1 animate-pulse align-middle" />
          </div>

          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed mt-2 italic">
            "{lore.narrative}"
          </p>

          {/* Inventory Notification Badge */}
          {animStage >= 5 && (
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu vào [🎒 Kho Đồ Thám Hiểm] ({completedRound}/4 Mảnh)</span>
            </div>
          )}
        </div>

        {/* Unlocked Route Lore & Continue Action */}
        <div className="relative z-10 space-y-2">
          {animStage >= 6 && (
            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 font-semibold animate-in slide-in-from-bottom-2">
              🧭 <strong>Hải trình tiếp theo đã mở:</strong> {lore.nextDestination}
            </div>
          )}

          <button
            onClick={() => {
              audioManager.playUnlock();
              onContinue();
            }}
            disabled={animStage < 3}
            className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all transform cursor-pointer ${
              animStage >= 6
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/30 hover:scale-102 active:scale-98 animate-pulse'
                : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 opacity-90'
            }`}
          >
            <span>TIẾP TỤC HÀNH TRÌNH</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
