import React, { useState } from 'react';
import {
  ShieldAlert,
  Volume2,
  VolumeX,
  Music,
  Maximize,
  Minimize,
  LogOut,
  Users,
  Map as MapIcon,
  Package,
  Atom,
  Key,
  Sparkles,
} from 'lucide-react';
import { Team, ActiveTab } from '../types';
import { audioManager } from '../services/audioManager';
import { storageService } from '../services/storageService';
import { ConfirmModal } from './ConfirmModal';
import { AdminLoginModal } from './AdminLoginModal';

interface NavbarProps {
  currentTeam: Team | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onExitTeam?: () => void;
  onViewMap?: () => void;
  onOpenInventory?: () => void;
  onOpenKeywords?: () => void;
  onBackToLobby?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTeam,
  activeTab,
  setActiveTab,
  onExitTeam,
  onViewMap,
  onOpenInventory,
  onOpenKeywords,
  onBackToLobby,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(audioManager.isEnabled());
  const [bgmOn, setBgmOn] = useState<boolean>(audioManager.isBgmPlaying());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  const handleSwitchToAdmin = () => {
    if (storageService.isAdminAuthenticated()) {
      setActiveTab('admin');
    } else {
      setShowAdminLoginModal(true);
    }
  };

  const handleAdminLogout = () => {
    storageService.logoutAdmin();
    setActiveTab('player');
    audioManager.playPop();
  };

  const toggleSound = () => {
    const next = audioManager.toggleSound();
    setSoundOn(next);
    setBgmOn(audioManager.isBgmPlaying());
  };

  const toggleBgm = () => {
    const next = audioManager.toggleBgm();
    setBgmOn(next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleLogout = () => {
    setShowExitConfirm(true);
  };

  const confirmExitAction = () => {
    storageService.setCurrentTeamId(null);
    if (onExitTeam) onExitTeam();
    setShowExitConfirm(false);
  };

  const keywordCount = currentTeam
    ? (currentTeam.unlockedKeywordIds || currentTeam.unlockedKeywords || []).length
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/30 bg-[#070b1c]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,240,255,0.15)] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand */}
        <div
          onClick={() => {
            if (onBackToLobby) {
              onBackToLobby();
            } else if (onViewMap) {
              onViewMap();
            } else {
              setActiveTab('player');
            }
          }}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-fuchsia-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.9)] transition-all">
            <div className="w-full h-full bg-[#0a0f24] rounded-[14px] flex items-center justify-center">
              <Atom className="w-6 h-6 text-cyan-300 group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-75" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-base sm:text-lg bg-gradient-to-r from-cyan-300 via-white to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                PEK SCIENCE QUEST
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                NEXT GEN
              </span>
            </div>
            <p className="text-[11px] text-cyan-200/70 tracking-wide line-clamp-1 font-mono font-medium">
              Tổ KHTN • Trường Pétrus Ký
            </p>
          </div>
        </div>

        {/* Center: Active Team Mission Badge with Score + Quick Links */}
        {currentTeam && activeTab === 'player' && (
          <div className="hidden lg:flex items-center gap-2.5 bg-[#090f2b]/85 border border-cyan-500/40 rounded-full px-4 py-1.5 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              <span className="font-bold text-sm text-white">
                {currentTeam.teamName}
              </span>
              <span className="text-xs text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded font-mono font-bold border border-cyan-500/40">
                {currentTeam.className}
              </span>
            </div>

            <div className="h-4 w-px bg-cyan-500/30" />

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-cyan-200/80 font-semibold">Vòng {currentTeam.currentRound}/4</span>
              <span className="text-amber-300 font-black bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                {currentTeam.score} pts
              </span>
            </div>

            {/* Keyword Vault Quick Button */}
            {onOpenKeywords && (
              <button
                onClick={onOpenKeywords}
                className="px-2.5 py-1 rounded-full bg-gradient-to-r from-fuchsia-950/80 to-purple-950/80 hover:from-fuchsia-900 hover:to-purple-900 text-fuchsia-300 border border-fuchsia-500/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(217,70,239,0.3)] cursor-pointer"
                title="Mở Kho Từ Khóa Khoa Học (35 từ khóa)"
              >
                <Key className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
                <span>Từ Khóa ({keywordCount})</span>
              </button>
            )}

            {onViewMap && (
              <button
                onClick={onViewMap}
                className="px-2.5 py-1 rounded-full bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Xem Bản Đồ Nhiệm Vụ 3D"
              >
                <MapIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bản Đồ</span>
              </button>
            )}

            {onOpenInventory && (
              <button
                onClick={onOpenInventory}
                className="px-2.5 py-1 rounded-full bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Mở Kho Bảo Vật"
              >
                <Package className="w-3.5 h-3.5 text-purple-400" />
                <span>Bảo Vật</span>
              </button>
            )}
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Keyword Button on Mobile/Tablet */}
          {currentTeam && activeTab === 'player' && onOpenKeywords && (
            <button
              onClick={onOpenKeywords}
              title="Kho Từ Khóa Khoa Học"
              className="lg:hidden p-2 rounded-xl bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-900 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold shadow-[0_0_10px_rgba(217,70,239,0.3)]"
            >
              <Key className="w-4 h-4 text-fuchsia-400" />
              <span>{keywordCount}</span>
            </button>
          )}

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
              soundOn
                ? 'bg-cyan-950/80 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/60 border-slate-700/60 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Ambient BGM Synth Toggle */}
          <button
            onClick={toggleBgm}
            title={bgmOn ? 'Tắt nhạc nền không gian' : 'Bật nhạc nền không gian'}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
              bgmOn
                ? 'bg-purple-950/80 border-purple-400/60 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse'
                : 'bg-slate-900/60 border-slate-700/60 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toàn màn hình máy chiếu"
            className="hidden sm:flex p-2 sm:p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-cyan-200/80 hover:text-white hover:border-cyan-400/50 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Switch Tab: Player <-> Game Master */}
          <div className="flex items-center bg-[#050816] border border-cyan-500/30 rounded-xl p-0.5">
            <button
              onClick={() => setActiveTab('player')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'player'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.6)] font-black'
                  : 'text-slate-400 hover:text-cyan-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Đội Chơi</span>
            </button>
            <button
              onClick={handleSwitchToAdmin}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.6)] font-black'
                  : 'text-slate-400 hover:text-purple-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Game Master</span>
            </button>
          </div>

          {/* Admin Lock / Logout button when in Game Master view */}
          {activeTab === 'admin' && (
            <button
              onClick={handleAdminLogout}
              title="Khóa Game Master (Đăng xuất quản trị)"
              className="p-2 sm:p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-300 hover:bg-purple-900 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Khóa</span>
            </button>
          )}

          {/* Logout active team if player is active */}
          {currentTeam && activeTab === 'player' && (
            <button
              onClick={handleLogout}
              title="Đổi đội chơi / Thoát phiên"
              className="p-2 sm:p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Admin Password Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onSuccess={() => {
          setShowAdminLoginModal(false);
          setActiveTab('admin');
        }}
        onClose={() => setShowAdminLoginModal(false)}
      />

      {/* Exit Team Confirmation Modal */}
      <ConfirmModal
        isOpen={showExitConfirm}
        title="Rời Phiên Chơi Hiện Tại"
        message="Bạn có chắc chắn muốn rời phiên của đội hiện tại? Toàn bộ điểm số và kết quả đã lưu sẽ không bị mất, bạn có thể quay lại bất cứ lúc nào bằng mã đội."
        confirmText="Xác Nhận Rời"
        cancelText="Ở Lại Chơi Tiếp"
        type="warning"
        onConfirm={confirmExitAction}
        onCancel={() => setShowExitConfirm(false)}
      />
    </header>
  );
};
