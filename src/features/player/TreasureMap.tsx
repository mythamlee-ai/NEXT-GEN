import React, { useState } from 'react';
import {
  Compass,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Award,
  Image as ImageIcon,
  Trophy,
  Play,
  RotateCcw,
  Key,
  Bot,
  Atom,
  Search,
  Rocket,
  Star,
} from 'lucide-react';
import { Team, RoundNumber } from '../../types';
import { ChibiMascot } from '../../components/ChibiMascot';
import { audioManager } from '../../services/audioManager';
import { keywordService } from '../../services/keywordService';

interface TreasureMapProps {
  team: Team;
  onEnterRound: (round: RoundNumber) => void;
  onOpenInventory?: () => void;
  onViewFinalChest?: () => void;
  onBackToLobby?: () => void;
}

interface StationData {
  round: RoundNumber;
  code: string;
  name: string;
  vietnameseTitle: string;
  subtitle: string;
  themeColor: 'cyan' | 'purple' | 'amber' | 'emerald';
  badgeIcon: React.ReactNode;
  iconArt: React.ReactNode;
  rewardName: string;
  keyword: string;
  description: string;
}

const STATIONS: StationData[] = [
  {
    round: 1,
    code: 'TRẠM 01',
    name: 'SCIENCE CODE BREAKER',
    vietnameseTitle: 'MẬT MÃ KHOA HỌC CƠ BẢN',
    subtitle: 'Thử thách 9 câu hỏi liên môn Lý – Hóa – Sinh',
    themeColor: 'cyan',
    badgeIcon: <Zap className="w-6 h-6 text-cyan-300" />,
    iconArt: <Atom className="w-8 h-8 text-cyan-300 animate-spin" />,
    rewardName: 'Chìa Khóa Quang Phổ Alpha',
    keyword: 'LƯỢNG TỬ',
    description: 'Bẻ khóa 9 mật mã lượng tử tự nhiên. Thu thập 13 từ khóa khoa học cơ bản (Lực, Năng lượng, Điện, Nguyên tử, ADN...).',
  },
  {
    round: 2,
    code: 'TRẠM 02',
    name: 'AI ĐÂY? PEK',
    vietnameseTitle: 'CON NGƯỜI & CÔNG NGHỆ',
    subtitle: 'Hồ sơ nhận diện 10 Nhà giáo KHTN Pétrus Ký',
    themeColor: 'purple',
    badgeIcon: <Award className="w-6 h-6 text-fuchsia-300" />,
    iconArt: <Bot className="w-8 h-8 text-fuchsia-300 animate-pulse" />,
    rewardName: 'Mảnh Bản Đồ Cổ Pétrus Ký',
    keyword: 'NGUYÊN TỐ',
    description: 'Kho lưu trữ dữ liệu hologram bảo vệ hình ảnh các Thầy Cô giáo. Bẻ khóa gợi ý 4 tầng và thu thập từ khóa AI, Robot, Sáng tạo.',
  },
  {
    round: 3,
    code: 'TRẠM 03',
    name: 'PICTURE PUZZLE',
    vietnameseTitle: 'QUAN SÁT & SUY LUẬN',
    subtitle: 'Đuổi hình bắt chữ & Ghép tranh khoa học',
    themeColor: 'amber',
    badgeIcon: <ImageIcon className="w-6 h-6 text-amber-300" />,
    iconArt: <Search className="w-8 h-8 text-amber-300 animate-bounce" />,
    rewardName: 'Đá Quý Thạch Anh Thám Mã',
    keyword: 'TIẾN HÓA',
    description: 'Hang động quang học với ma trận hình ảnh bí ẩn. Rèn luyện tư duy logic, suy luận sắc bén và giải mã bức tranh.',
  },
  {
    round: 4,
    code: 'TRẠM 04',
    name: 'THE FINAL MISSION',
    vietnameseTitle: 'CÔNG NGHỆ & TƯƠNG LAI',
    subtitle: 'Mã QR thực địa, AI Vision & Rương Báu',
    themeColor: 'emerald',
    badgeIcon: <Trophy className="w-6 h-6 text-emerald-300" />,
    iconArt: <Rocket className="w-8 h-8 text-emerald-300 animate-pulse" />,
    rewardName: 'Rương Báu Next Gen Champion',
    keyword: 'VÔ ĐỊCH NEXT GEN',
    description: 'Cổng không gian mở rương phong ấn tối cao. Quét mã QR, kích hoạt điểm may mắn và mở khóa từ khóa tối thượng!',
  },
];

export const TreasureMap: React.FC<TreasureMapProps> = ({
  team,
  onEnterRound,
  onBackToLobby,
}) => {
  const [hoveredStation, setHoveredStation] = useState<RoundNumber | null>(null);

  const getStationStatus = (r: RoundNumber): 'completed' | 'active' | 'locked' => {
    if (team.status === 'finished') return 'completed';
    if (r < team.currentRound) return 'completed';
    if (r === team.currentRound) return 'active';
    return 'locked';
  };

  const handleSelectStation = (st: StationData) => {
    const status = getStationStatus(st.round);
    if (status === 'locked') {
      audioManager.playWarning();
      return;
    }
    audioManager.playUnlock();
    onEnterRound(st.round);
  };

  const totalScore = keywordService.calculateTotalScore(team);
  const playerRank = keywordService.getRank(totalScore);
  const unlockedIds = new Set(team.unlockedKeywordIds || team.unlockedKeywords || []);

  return (
    <div className="relative min-h-[90vh] py-6 px-3 sm:px-4 max-w-6xl mx-auto flex flex-col justify-between select-none">
      {/* Top HUD: Team Profile & Mission Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-[#09102c]/95 via-[#0e1840]/90 to-[#180f33]/95 border-2 border-cyan-400/50 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-fuchsia-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] border-2 border-cyan-300">
            <Compass className="w-8 h-8 animate-spin text-white" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 font-bold border border-cyan-500/50">
                {team.teamCode}
              </span>
              <span className="text-xs font-mono text-cyan-200/70 font-semibold">Lớp {team.className}</span>
              <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40 text-[11px] font-bold">
                {playerRank.badge} {playerRank.rank}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-300 tracking-wide mt-1">
              {team.teamName}
            </h2>
          </div>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <span className="text-[10px] font-mono text-cyan-300/70 block tracking-widest uppercase font-bold">
              TỔNG ĐIỂM TÍCH LŨY
            </span>
            <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">
              {team.score}{' '}
              <span className="text-sm font-sans text-amber-400 font-bold">điểm</span>
            </div>
          </div>

          {onBackToLobby && (
            <button
              onClick={onBackToLobby}
              className="p-3 rounded-2xl bg-[#070b1c]/80 hover:bg-[#0c1333] text-cyan-300 hover:text-white border-2 border-cyan-500/40 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              title="Về sảnh chính"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Sci-Fi Mission Conduit Grid */}
      <div className="relative my-8 z-10">
        {/* Connecting Hologram Conduit Pipe (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-3 rounded-full bg-[#070b1c] border border-cyan-500/40 z-0 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
            style={{
              width:
                team.status === 'finished'
                  ? '100%'
                  : `${((team.currentRound - 1) / 3) * 100}%`,
            }}
          />
        </div>

        {/* 4 Science Stations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {STATIONS.map((st) => {
            const status = getStationStatus(st.round);
            const roundScore = team.roundScores[st.round] || 0;
            const roundKeywords = keywordService.getKeywordsByRound(st.round);
            const unlockedInThisRound = roundKeywords.filter((k) => unlockedIds.has(k.id)).length;

            const colorStyles = {
              cyan: {
                border: status === 'active'
                  ? 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.6)] ring-2 ring-cyan-300'
                  : 'border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]',
                bg: 'bg-gradient-to-b from-[#081533]/90 via-[#0a1e4a]/80 to-[#0e1633]/90',
                badgeBg: 'bg-cyan-950/80 text-cyan-300 border border-cyan-400/50',
                btn: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black shadow-[0_0_20px_rgba(6,182,212,0.5)]',
              },
              purple: {
                border: status === 'active'
                  ? 'border-fuchsia-400 shadow-[0_0_35px_rgba(217,70,239,0.6)] ring-2 ring-fuchsia-300'
                  : 'border-fuchsia-500/40 hover:border-fuchsia-400 hover:shadow-[0_0_25px_rgba(217,70,239,0.35)]',
                bg: 'bg-gradient-to-b from-[#240a33]/90 via-[#330f47]/80 to-[#190a29]/90',
                badgeBg: 'bg-purple-950/80 text-fuchsia-300 border border-fuchsia-400/50',
                btn: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-black shadow-[0_0_20px_rgba(217,70,239,0.5)]',
              },
              amber: {
                border: status === 'active'
                  ? 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.6)] ring-2 ring-amber-300'
                  : 'border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]',
                bg: 'bg-gradient-to-b from-[#291605]/90 via-[#3d2007]/80 to-[#1a0f05]/90',
                badgeBg: 'bg-amber-950/80 text-amber-300 border border-amber-400/50',
                btn: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)]',
              },
              emerald: {
                border: status === 'active'
                  ? 'border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.6)] ring-2 ring-emerald-300'
                  : 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]',
                bg: 'bg-gradient-to-b from-[#08261c]/90 via-[#0e382b]/80 to-[#071a13]/90',
                badgeBg: 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/50',
                btn: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black shadow-[0_0_20px_rgba(16,185,129,0.5)]',
              },
            }[st.themeColor];

            return (
              <div
                key={st.round}
                onMouseEnter={() => setHoveredStation(st.round)}
                onMouseLeave={() => setHoveredStation(null)}
                onClick={() => handleSelectStation(st)}
                className={`relative group rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  status === 'locked'
                    ? 'bg-[#080d24]/60 border-2 border-slate-700/60 opacity-60 hover:opacity-80'
                    : `${colorStyles.bg} backdrop-blur-xl border-2 ${colorStyles.border} hover:-translate-y-2`
                }`}
              >
                {/* Active Pulsing Halo */}
                {status === 'active' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-mono font-black tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-bounce">
                    TRẠM HIỆN TẠI
                  </div>
                )}

                {status === 'completed' && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-black tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.8)] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ĐÃ VƯỢT QUA
                  </div>
                )}

                {/* Card Header: Station Code & 3D Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-cyan-300/70">
                      {st.code}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-md ${
                        status === 'locked'
                          ? 'bg-slate-900 border border-slate-700 text-slate-500'
                          : colorStyles.badgeBg
                      }`}
                    >
                      {status === 'locked' ? (
                        <Lock className="w-6 h-6 text-slate-500" />
                      ) : (
                        st.badgeIcon
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                    {st.name}
                  </h3>
                  <div className="text-xs font-bold text-cyan-400 mt-0.5">
                    {st.vietnameseTitle}
                  </div>

                  <p className="mt-3 text-xs text-cyan-100/80 leading-relaxed line-clamp-3">
                    {st.description}
                  </p>

                  {/* Keyword Collection Counter Badge */}
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#060a1c]/80 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Thu thập: {unlockedInThisRound} / {roundKeywords.length} từ khóa</span>
                  </div>
                </div>

                {/* Card Footer: Score & Action Button */}
                <div className="mt-6 pt-4 border-t border-cyan-500/20">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-400 font-mono font-medium">Điểm Vòng:</span>
                    <span className="font-bold text-amber-300 font-mono">
                      {status === 'completed' ? `+${roundScore} pts` : status === 'active' ? 'Đang thi đấu' : 'Chưa mở'}
                    </span>
                  </div>

                  <button
                    disabled={status === 'locked'}
                    className={`w-full py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      status === 'locked'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : colorStyles.btn
                    }`}
                  >
                    {status === 'active' ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>TIẾN VÀO TRẠM</span>
                      </>
                    ) : status === 'completed' ? (
                      <>
                        <span>XEM LẠI KẾT QUẢ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>PHONG ẤN</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mascot AI Companion Tip */}
      <div className="relative z-10 mt-4 p-4 rounded-3xl bg-gradient-to-r from-[#09102c]/90 via-[#0e1840]/90 to-[#180f33]/90 border-2 border-cyan-400/50 backdrop-blur-md flex items-center justify-between gap-4 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
        <div className="flex items-center gap-3">
          <ChibiMascot
            type="chibi_scientist"
            expression="excited"
            size="sm"
            showSpeechBubble={false}
          />
          <div>
            <span className="text-xs font-mono font-bold text-cyan-300 block">
              TRỢ LÝ KHOA HỌC ROBO-PEK
            </span>
            <p className="text-xs sm:text-sm text-cyan-100/90 font-medium">
              Chinh phục các câu hỏi tại mỗi trạm để giải phóng kho từ khóa khoa học và mở rương báu Vòng 4!
            </p>
          </div>
        </div>

        {team.status === 'finished' && (
          <button
            onClick={() => onEnterRound(4)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
          >
            🏆 XEM KẾT QUẢ TOÀN GIẢI
          </button>
        )}
      </div>
    </div>
  );
};
