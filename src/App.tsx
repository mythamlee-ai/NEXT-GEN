/**
 * PEK SCIENCE QUEST - THE FINAL CODE
 * Full-Stack MVP Interactive Science Escape Room Game
 * Organized by Tổ Khoa học Tự nhiên – Trường PeK
 */

import React, { useState, useEffect } from 'react';
import { Team, ActiveTab } from './types';
import { storageService } from './services/storageService';
import { GameEngine } from './services/gameEngine';
import { ParticleBackground } from './components/ParticleBackground';
import { Navbar } from './components/Navbar';
import { Download } from 'lucide-react';

// Player Features
import { CinematicLobby } from './features/player/CinematicLobby';
import { TreasureMap } from './features/player/TreasureMap';
import { CheckIn } from './features/player/CheckIn';
import { MissionBriefing } from './features/player/MissionBriefing';
import { Round1View } from './features/player/Round1View';
import { Round2View } from './features/player/Round2View';
import { Round3View } from './features/player/Round3View';
import { Round4View } from './features/player/Round4View';
import { ResultsView } from './features/player/ResultsView';

// Leaderboard & Admin Features
import { LeaderboardView } from './features/leaderboard/LeaderboardView';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { TreasureQuestModal } from './components/TreasureQuestModal';
import { KeywordVaultModal } from './features/player/KeywordVaultModal';
import { KeywordUnlockModal } from './components/KeywordUnlockModal';
import { ScienceKeyword } from './types';

export default function App() {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('player');
  const [playerSubView, setPlayerSubView] = useState<'lobby' | 'game' | 'map' | 'leaderboard'>('lobby');
  const [questTransition, setQuestTransition] = useState<{
    isOpen: boolean;
    completedRound: 1 | 2 | 3 | 4;
    roundScore: number;
  } | null>(null);
  const [isKeywordVaultOpen, setIsKeywordVaultOpen] = useState<boolean>(false);
  const [unlockedKeywordAlert, setUnlockedKeywordAlert] = useState<ScienceKeyword | null>(null);

  // Load and subscribe to team session
  const refreshTeam = () => {
    const team = storageService.getCurrentTeam();
    setCurrentTeam(team ? { ...team } : null);
  };

  useEffect(() => {
    // 1. Check URL parameters for direct multi-device team link (e.g. ?team=PEK-7F29 or ?code=PEK-7F29)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryCode =
        urlParams.get('code') ||
        urlParams.get('team') ||
        urlParams.get('teamCode') ||
        urlParams.get('teamId');

      if (queryCode) {
        const clean = queryCode.trim().toUpperCase();
        const teams = storageService.getTeams();
        const found = teams.find(
          (t) => t.teamCode.toUpperCase() === clean || t.id.toUpperCase() === clean
        );
        if (found) {
          storageService.setCurrentTeamId(found.id);
          setCurrentTeam(found);
        } else {
          refreshTeam();
        }
      } else {
        refreshTeam();
      }
    } else {
      refreshTeam();
    }

    const unsub = storageService.subscribe((event) => {
      if (
        event.type === 'CURRENT_TEAM_CHANGED' ||
        event.type === 'TEAMS_UPDATED' ||
        event.type === 'FACTORY_RESET'
      ) {
        refreshTeam();
      }
    });

    const handleKeywordAlert = (e: Event) => {
      const customEvent = e as CustomEvent<ScienceKeyword>;
      if (customEvent.detail) {
        setUnlockedKeywordAlert(customEvent.detail);
      }
    };
    window.addEventListener('PEK_KEYWORD_UNLOCKED', handleKeywordAlert);

    return () => {
      unsub();
      window.removeEventListener('PEK_KEYWORD_UNLOCKED', handleKeywordAlert);
    };
  }, []);

  // Handlers for Round transitions with Treasure Quest Cutscenes
  const handleCheckInSuccess = (team: Team) => {
    setCurrentTeam(team);
    setPlayerSubView('map');
  };

  const handleStartRound1 = () => {
    if (!currentTeam) return;
    const updated: Team = {
      ...currentTeam,
      status: 'playing',
      currentRound: 1,
    };
    storageService.saveTeam(updated);
    setCurrentTeam(updated);
    setPlayerSubView('game');
  };

  const handleRound1Complete = () => {
    if (!currentTeam) return;
    setQuestTransition({
      isOpen: true,
      completedRound: 1,
      roundScore: currentTeam.roundScores[1] || 0,
    });
  };

  const handleRound2Complete = () => {
    if (!currentTeam) return;
    setQuestTransition({
      isOpen: true,
      completedRound: 2,
      roundScore: currentTeam.roundScores[2] || 0,
    });
  };

  const handleRound3Complete = () => {
    if (!currentTeam) return;
    setQuestTransition({
      isOpen: true,
      completedRound: 3,
      roundScore: currentTeam.roundScores[3] || 0,
    });
  };

  const handleFinishGame = () => {
    if (!currentTeam) return;
    setQuestTransition({
      isOpen: true,
      completedRound: 4,
      roundScore: currentTeam.roundScores[4] || 0,
    });
  };

  const handleContinueAfterQuest = () => {
    if (!currentTeam || !questTransition) return;
    const updated = GameEngine.advanceRound(currentTeam);
    setCurrentTeam(updated);
    setQuestTransition(null);
    setPlayerSubView('map');
  };

  const handleExitTeam = () => {
    storageService.setCurrentTeamId(null);
    setCurrentTeam(null);
    setPlayerSubView('lobby');
    setQuestTransition(null);
  };

  const handleStartFromLobby = () => {
    if (!currentTeam) {
      setPlayerSubView('game'); // Will render CheckIn
    } else if (currentTeam.status === 'ready') {
      setPlayerSubView('game'); // Will render MissionBriefing
    } else if (currentTeam.status === 'finished') {
      setPlayerSubView('game'); // Will render ResultsView
    } else {
      setPlayerSubView('map'); // Will render 3D Mission Map
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060a19] via-[#0b1233] to-[#140a2b] text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      {/* Sci-fi Particle Starfield Background */}
      <ParticleBackground />

      {/* Main Top Navigation */}
      <Navbar
        currentTeam={currentTeam}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitTeam={handleExitTeam}
        onViewMap={() => setPlayerSubView('map')}
        onOpenKeywords={() => setIsKeywordVaultOpen(true)}
        onBackToLobby={() => setPlayerSubView('lobby')}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {activeTab === 'admin' ? (
          /* ==================== GAME MASTER / ADMIN VIEW ==================== */
          <AdminDashboard />
        ) : (
          /* ==================== PLAYER VIEW ==================== */
          <div className="w-full">
            {playerSubView === 'lobby' ? (
              /* Screen 1: Cinematic 3D Lobby */
              <CinematicLobby
                onStartJourney={handleStartFromLobby}
                onViewLeaderboard={() => setPlayerSubView('leaderboard')}
                onViewMap={() => {
                  if (currentTeam) {
                    setPlayerSubView('map');
                  } else {
                    setPlayerSubView('game');
                  }
                }}
                hasActiveSession={!!currentTeam}
              />
            ) : playerSubView === 'leaderboard' ? (
              /* Screen 2: Leaderboard */
              <div className="py-4">
                <div className="max-w-5xl mx-auto px-4 mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setPlayerSubView(currentTeam ? 'map' : 'lobby')}
                    className="px-4 py-2 rounded-xl bg-[#09112e]/80 border border-cyan-400/50 text-xs font-bold text-cyan-300 hover:text-white hover:bg-cyan-950/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <span>← Quay Lại {currentTeam ? 'Bản Đồ' : 'Sảnh Chính'}</span>
                  </button>

                  <button
                    onClick={() => setPlayerSubView('lobby')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
                  >
                    Về Sảnh Chính
                  </button>
                </div>
                <LeaderboardView highlightTeamId={currentTeam?.id} />
              </div>
            ) : playerSubView === 'map' && currentTeam ? (
              /* Screen 3: 3D Mission Map */
              <div className="py-4">
                <TreasureMap
                  team={currentTeam}
                  onEnterRound={(round) => {
                    setPlayerSubView('game');
                  }}
                  onViewFinalChest={() => {
                    setPlayerSubView('game');
                  }}
                  onBackToLobby={() => setPlayerSubView('lobby')}
                />
              </div>
            ) : !currentTeam ? (
              /* Step 1: Check-in / Resume session */
              <div className="py-4">
                <div className="max-w-4xl mx-auto px-4 mb-3">
                  <button
                    onClick={() => setPlayerSubView('lobby')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 cursor-pointer transition-colors font-bold"
                  >
                    <span>← Về Sảnh Chính</span>
                  </button>
                </div>
                <CheckIn onCheckInSuccess={handleCheckInSuccess} />
              </div>
            ) : currentTeam.status === 'ready' ? (
              /* Step 2: Mission Briefing */
              <MissionBriefing team={currentTeam} onStartRound1={handleStartRound1} />
            ) : currentTeam.status === 'finished' ? (
              /* Step 4: Finished -> Results & Honors */
              <ResultsView
                team={currentTeam}
                onViewLeaderboard={() => setPlayerSubView('leaderboard')}
                onPlayAgain={handleExitTeam}
                onViewMap={() => setPlayerSubView('map')}
              />
            ) : (
              /* Step 3: Game Rounds 1 to 4 */
              <div className="relative">
                <div className="max-w-6xl mx-auto px-4 pt-3 flex items-center justify-between">
                  <button
                    onClick={() => setPlayerSubView('map')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#09112e]/80 border border-cyan-400/50 text-xs font-mono font-bold text-cyan-300 hover:text-white hover:bg-cyan-950/80 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <span>🧭 Xem Bản Đồ Nhiệm Vụ 3D</span>
                  </button>

                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    Trạm {currentTeam.currentRound}/4 • {currentTeam.teamName}
                  </span>
                </div>

                {currentTeam.currentRound === 1 && (
                  <Round1View team={currentTeam} onRoundComplete={handleRound1Complete} />
                )}
                {currentTeam.currentRound === 2 && (
                  <Round2View team={currentTeam} onRoundComplete={handleRound2Complete} />
                )}
                {currentTeam.currentRound === 3 && (
                  <Round3View team={currentTeam} onRoundComplete={handleRound3Complete} />
                )}
                {currentTeam.currentRound === 4 && (
                  <Round4View team={currentTeam} onFinishGame={handleFinishGame} />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Science Keyword Vault Modal */}
      <KeywordVaultModal
        team={currentTeam}
        isOpen={isKeywordVaultOpen}
        onClose={() => setIsKeywordVaultOpen(false)}
        onTeamUpdated={(upd) => setCurrentTeam(upd)}
      />

      {/* Keyword Unlock Celebration Hologram */}
      <KeywordUnlockModal
        keyword={unlockedKeywordAlert}
        onClose={() => setUnlockedKeywordAlert(null)}
      />

      {/* Treasure Quest Cutscene Transition Modal */}
      {questTransition && questTransition.isOpen && currentTeam && (
        <TreasureQuestModal
          completedRound={questTransition.completedRound}
          teamName={currentTeam.teamName}
          roundScore={questTransition.roundScore}
          onContinue={handleContinueAfterQuest}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 bg-[#060a19]/90 py-4 text-center text-xs text-cyan-200/60 font-mono relative z-10 backdrop-blur-md">
        <p>
          PEK SCIENCE QUEST • THE FINAL CODE © {new Date().getFullYear()} Tổ Khoa học Tự nhiên Trường Pétrus Ký
        </p>
        <div className="mt-2.5 flex items-center justify-center gap-3">
          <a
            href="/pek-science-quest.html"
            download="pek-science-quest.html"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-300 font-sans font-medium text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
            title="Tải 1 file HTML duy nhất để chơi offline trên máy tính không cần mạng"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tải 1 file HTML hoàn thiện (.html)</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
