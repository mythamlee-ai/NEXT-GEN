import React from 'react';
import {
  Compass,
  Zap,
  HelpCircle,
  Image as ImageIcon,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  UserCheck,
  Map as MapIcon,
  Key,
  Gem,
  Atom,
  FlaskConical,
  Dna,
  Trophy,
} from 'lucide-react';
import { Team } from '../../types';
import { audioManager } from '../../services/audioManager';
import { ChibiMascot } from '../../components/ChibiMascot';

interface MissionBriefingProps {
  team: Team;
  onStartRound1: () => void;
  onViewMap?: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({ team, onStartRound1, onViewMap }) => {
  const handleStart = () => {
    audioManager.playUnlock();
    onStartRound1();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 relative z-10 text-white">
      {/* Sci-Fi Hologram Mission Dossier */}
      <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_35px_rgba(6,182,212,0.2)] backdrop-blur-2xl mb-8 relative overflow-hidden">
        {/* Concept Visual Banner Artwork */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] relative h-40 sm:h-56 w-full group">
          <img
            src="/src/assets/images/science_banner_1791188435725.jpg"
            alt="Pétrus Ký Science Quest Concept"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a19]/95 via-[#060a19]/50 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
              TỔ KHOA HỌC TỰ NHIÊN • TRƯỜNG THPT PÉTRUS KÝ
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              PEK SCIENCE QUEST • KHOA HỌC NEXT GEN
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200/90 font-mono mt-1 font-medium">
              “Giải mã tri thức – Chinh phục vũ trụ khoa học!”
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <ChibiMascot
              expression="waving"
              size="lg"
              showSpeechBubble={true}
              speechText={`Chào mừng Đội ${team.teamName}! Cổng dịch chuyển đã sẵn sàng, chúng ta bắt đầu vượt 4 trạm khoa học thôi!`}
              accessory="map"
            />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold tracking-wider mb-2">
                <Atom className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>HỒ SƠ NHIỆM VỤ THÁM HIỂM KHOA HỌC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ĐỘI: {team.teamName.toUpperCase()}
              </h1>
              <div className="text-slate-300 text-xs sm:text-sm flex flex-wrap items-center gap-2 mt-1">
                <span className="font-semibold text-cyan-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-mono">
                  Lớp: {team.className}
                </span>
                <span className="font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40 font-bold">
                  MÃ ĐỘI: {team.teamCode}
                </span>
              </div>
              {team.captainName && (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-purple-300">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span>Đội Trưởng: <strong className="text-white font-bold">{team.captainName}</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all transform hover:scale-102 active:scale-98 cursor-pointer uppercase tracking-wider"
            >
              <span>TIẾN VÀO VÒNG 1</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stations Overview */}
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl font-black text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>4 TRẠM THỬ THÁCH VŨ TRỤ KHOA HỌC</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Station 1 */}
          <div className="bg-[#0c1435]/90 border border-cyan-500/40 rounded-2xl p-5 hover:border-cyan-400 transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 text-cyan-300 flex items-center justify-center border border-cyan-500/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    VÒNG 1 • MẬT MÃ KHOA HỌC
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" /> 45s/câu
                  </span>
                </div>
                <h3 className="text-base font-black text-white mb-1">SCIENCE CODE BREAKER</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                  Bẻ khóa 9 mật thư trắc nghiệm liên môn Vật lý, Hóa học và Sinh học để thu nạp Chìa Khóa Quang Phổ Alpha & Mở khóa 13 Từ Khóa Khoa Học.
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                  <Key className="w-3 h-3 text-cyan-400" />
                  <span>Bảo vật: <strong>Chìa Khóa Quang Phổ Alpha</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Station 2 */}
          <div className="bg-[#0c1435]/90 border border-purple-500/40 rounded-2xl p-5 hover:border-purple-400 transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/80 text-purple-300 flex items-center justify-center border border-purple-500/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                    VÒNG 2 • GIẢI MÃ THẦY CÔ
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" /> 60s/thầy cô
                  </span>
                </div>
                <h3 className="text-base font-black text-white mb-1">AI ĐÂY? • PÉTRUS KÝ</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                  Giải mã 4 tầng gợi ý nhận diện các Thầy Cô Tổ KHTN Pétrus Ký để mở khóa Mảnh Bản Đồ Dẫn Đường & 5 Từ Khóa Công Nghệ.
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
                  <MapIcon className="w-3 h-3 text-purple-400" />
                  <span>Bảo vật: <strong>Mảnh Bản Đồ Cổ Pétrus Ký</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Station 3 */}
          <div className="bg-[#0c1435]/90 border border-amber-500/40 rounded-2xl p-5 hover:border-amber-400 transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(245,158,11,0.15)] backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-950/80 text-amber-300 flex items-center justify-center border border-amber-500/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-7 h-7 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                    VÒNG 3 • ĐUỔI HÌNH BẮT CHỮ
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" /> 60s/câu đố
                  </span>
                </div>
                <h3 className="text-base font-black text-white mb-1">PICTURE PUZZLE</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                  Phân tích hình ảnh rebus khoa học trực quan để giải phóng Viên Đá Quý Thạch Anh & 6 Từ Khóa Suy Luận.
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                  <Gem className="w-3 h-3 text-amber-400" />
                  <span>Bảo vật: <strong>Đá Quý Thạch Anh Thám Mã</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Station 4 */}
          <div className="bg-[#0c1435]/90 border border-emerald-500/40 rounded-2xl p-5 hover:border-emerald-400 transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 text-emerald-300 flex items-center justify-center border border-emerald-500/50 flex-shrink-0 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                    VÒNG 4 • RƯƠNG BÁU CUỐI CÙNG
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" /> 180s
                  </span>
                </div>
                <h3 className="text-base font-black text-white mb-1">THE FINAL MISSION</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                  Nhập mật mã trạm thực địa trên bàn phím, đối soát giải mã khoa học, mở khóa 7 Từ Khóa Tương Lai & 4 Từ Khóa Ẩn!
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  <Compass className="w-3 h-3 text-emerald-400" />
                  <span>Bảo vật: <strong>La Bàn Vàng Tối Thượng Next Gen</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
