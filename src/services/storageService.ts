import { Team, Question, Teacher, PicturePuzzle, Challenge, GameConfig, TreasureItem, TeamQuestionHistory, MysteryTreasureCode, MysteryBoxEffect } from '../types';
import {
  initialGameConfig,
  defaultQuestions,
  defaultTeachers,
  defaultPuzzles,
  defaultChallenges,
  defaultInitialTeams,
  defaultTreasureItems,
  defaultMysteryCodes,
} from '../data/defaultData';
import { DEFAULT_SCIENCE_KEYWORDS } from './keywordService';

const KEYS = {
  CURRENT_TEAM_ID: 'pek_current_team_id',
  TEAMS: 'pek_teams_db',
  QUESTIONS: 'pek_questions_db',
  QUESTION_HISTORY: 'pek_question_history_db',
  TEACHERS: 'pek_teachers_db',
  PUZZLES: 'pek_puzzles_db',
  CHALLENGES: 'pek_challenges_db',
  TREASURE_ITEMS: 'pek_treasure_items_db',
  GAME_CONFIG: 'pek_game_config',
  ADMIN_PASSWORD: 'pek_admin_password',
  ADMIN_AUTH_SESSION: 'pek_admin_auth_session',
  ADMIN_TOKEN: 'pek_admin_server_token',
  MYSTERY_CODES: 'pek_mystery_codes_db',
  KEYWORDS: 'pek_science_keywords_db',
};

type StorageListener = (event: { type: string; payload?: unknown }) => void;

class StorageService {
  private listeners: Set<StorageListener> = new Set();
  private channel: BroadcastChannel | null = null;
  private lastSyncTimestamp: number = 0;
  private eventSource: EventSource | null = null;
  private isSSEConnected: boolean = false;
  private fallbackPollingInterval: any = null;
  private sseReconnectTimeout: any = null;
  private sseReconnectAttempts: number = 0;

  constructor() {
    this.initDefaultsIfEmpty();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('PEK_SCIENCE_QUEST_SYNC');
      this.channel.onmessage = (event) => {
        // Only sync shared data (TEAMS_UPDATED, CONFIG_UPDATED), not CURRENT_TEAM_CHANGED to prevent tabs colliding
        if (event.data?.type !== 'CURRENT_TEAM_CHANGED') {
          this.notifyLocalListeners(event.data);
        }
      };
    }
    this.initSSE();
    this.startFallbackPolling();
  }

  // -------------------------------------------------------------
  // SSE REAL-TIME CONNECTION (GET /api/events)
  // -------------------------------------------------------------
  public initSSE() {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') {
      return;
    }

    // Singleton check: avoid creating duplicate EventSource instances
    if (this.eventSource && this.eventSource.readyState !== EventSource.CLOSED) {
      return;
    }

    try {
      this.eventSource = new EventSource('/api/events');

      this.eventSource.onopen = () => {
        this.isSSEConnected = true;
        this.sseReconnectAttempts = 0;
        if (this.sseReconnectTimeout) {
          clearTimeout(this.sseReconnectTimeout);
          this.sseReconnectTimeout = null;
        }
        // Immediately fetch snapshot upon connect/reconnect to catch up on any missed updates
        this.syncWithServer();
      };

      // Handle custom events pushed by server.ts
      this.eventSource.addEventListener('connected', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          this.lastSyncTimestamp = data.timestamp || Date.now();
        } catch {
          // ignore
        }
      });

      this.eventSource.addEventListener('TEAM_UPDATED', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.payload) {
            this.mergeRemoteTeam(data.payload);
          }
        } catch {
          // ignore
        }
      });

      this.eventSource.addEventListener('TEAMS_UPDATED', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data && Array.isArray(data.payload)) {
            this.mergeRemoteTeams(data.payload);
          }
        } catch {
          // ignore
        }
      });

      this.eventSource.addEventListener('TEAM_SCORE_ADJUSTED', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.payload && data.payload.team) {
            this.mergeRemoteTeam(data.payload.team);
            this.notifyLocalListeners({ type: 'TEAM_SCORE_ADJUSTED', payload: data.payload });
          }
        } catch {
          // ignore
        }
      });

      this.eventSource.addEventListener('CONFIG_UPDATED', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.payload) {
            localStorage.setItem(KEYS.GAME_CONFIG, JSON.stringify(data.payload));
            this.notifyLocalListeners({ type: 'CONFIG_UPDATED', payload: data.payload });
          }
        } catch {
          // ignore
        }
      });

      this.eventSource.addEventListener('MYSTERY_CLAIMED', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyLocalListeners({ type: 'MYSTERY_CLAIMED', payload: data?.payload });
        } catch {
          // ignore
        }
      });

      this.eventSource.addEventListener('FACTORY_RESET', () => {
        localStorage.setItem(KEYS.TEAMS, JSON.stringify(defaultInitialTeams));
        this.setCurrentTeamId(null);
        this.broadcast('FACTORY_RESET', { timestamp: Date.now() });
        this.broadcast('TEAMS_UPDATED', defaultInitialTeams);
      });

      this.eventSource.onerror = () => {
        this.isSSEConnected = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        // Schedule reconnect with exponential backoff (min 2.5s, max 15s)
        this.sseReconnectAttempts++;
        const delay = Math.min(15000, 2500 * Math.pow(1.5, Math.min(this.sseReconnectAttempts, 4)));
        if (!this.sseReconnectTimeout) {
          this.sseReconnectTimeout = setTimeout(() => {
            this.sseReconnectTimeout = null;
            this.initSSE();
          }, delay);
        }
      };
    } catch (err) {
      this.isSSEConnected = false;
    }
  }

  public closeSSE() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.isSSEConnected = false;
    }
    if (this.sseReconnectTimeout) {
      clearTimeout(this.sseReconnectTimeout);
      this.sseReconnectTimeout = null;
    }
  }

  // -------------------------------------------------------------
  // FALLBACK POLLING (RUNS WHEN SSE IS DISCONNECTED / INACTIVE)
  // -------------------------------------------------------------
  private startFallbackPolling() {
    if (typeof window === 'undefined') return;
    if (this.fallbackPollingInterval) return;

    // Fast initial sync after 250ms
    setTimeout(() => this.syncWithServer(), 250);

    // Fallback polling interval: every 3s
    this.fallbackPollingInterval = setInterval(() => {
      // If SSE is connected and healthy, skip aggressive polling to save network bandwidth!
      if (this.isSSEConnected) {
        return;
      }
      this.syncWithServer();
    }, 3000);
  }

  public async syncWithServer(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch(`/api/sync?since=${this.lastSyncTimestamp}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.teams)) {
          this.mergeRemoteTeams(data.teams);
          if (data.config) {
            const localCfg = localStorage.getItem(KEYS.GAME_CONFIG);
            if (localCfg !== JSON.stringify(data.config)) {
              localStorage.setItem(KEYS.GAME_CONFIG, JSON.stringify(data.config));
              this.notifyLocalListeners({ type: 'CONFIG_UPDATED', payload: data.config });
            }
          }
          this.lastSyncTimestamp = data.timestamp || Date.now();
        }
      }
    } catch {
      // Fallback silently if server offline or standalone preview
    }
  }

  // -------------------------------------------------------------
  // SMART MERGING LOGIC (VERSION & TIMESTAMP BASED)
  // -------------------------------------------------------------
  private isRemoteTeamNewer(local: Team, remote: Team): boolean {
    // 1. If remote has a higher version, remote is authoritatively newer
    if ((remote.version || 0) > (local.version || 0)) return true;
    if ((local.version || 0) > (remote.version || 0)) return false;

    // 2. If versions are equal, compare updatedAt timestamps
    if ((remote.updatedAt || 0) > (local.updatedAt || 0)) return true;
    if ((local.updatedAt || 0) > (remote.updatedAt || 0)) return false;

    // 3. Structural checks (Score differences, answer count, status, round)
    // Accept ANY score change from remote (both increases AND teacher point deductions!)
    if (remote.score !== local.score) return true;

    const remoteAns = remote.answersHistory ? remote.answersHistory.length : 0;
    const localAns = local.answersHistory ? local.answersHistory.length : 0;
    if (remoteAns !== localAns) return remoteAns > localAns;

    if ((remote.currentRound || 1) !== (local.currentRound || 1)) {
      return (remote.currentRound || 1) > (local.currentRound || 1);
    }

    // 4. Compare Round 4 state deeply (AI Detective answers count, keyword attempts, backup)
    if (remote.round4State && !local.round4State) return true;
    if (remote.round4State && local.round4State) {
      const remoteAttempts = remote.round4State.keywordAttempts || 0;
      const localAttempts = local.round4State.keywordAttempts || 0;
      if (remoteAttempts !== localAttempts) return remoteAttempts > localAttempts;

      const remoteAiAnsCount = Object.keys(remote.round4State.aiDetectiveAnswers || {}).length;
      const localAiAnsCount = Object.keys(local.round4State.aiDetectiveAnswers || {}).length;
      if (remoteAiAnsCount !== localAiAnsCount) return remoteAiAnsCount > localAiAnsCount;

      const remoteMatched = remote.round4State.backupPairsMatched?.length || 0;
      const localMatched = local.round4State.backupPairsMatched?.length || 0;
      if (remoteMatched !== localMatched) return remoteMatched > localMatched;

      if (remote.round4State.keywordSolved && !local.round4State.keywordSolved) return true;
      if (remote.round4State.backupCompleted && !local.round4State.backupCompleted) return true;
    }

    return false;
  }

  public mergeRemoteTeam(remote: Team) {
    if (!remote || !remote.id) return;
    const localTeams = this.getTeams();
    const idx = localTeams.findIndex((t) => t.id === remote.id);

    if (idx === -1) {
      const updated = [...localTeams, remote];
      localStorage.setItem(KEYS.TEAMS, JSON.stringify(updated));
      this.notifyLocalListeners({ type: 'TEAMS_UPDATED', payload: updated });
      return;
    }

    const local = localTeams[idx];
    if (this.isRemoteTeamNewer(local, remote)) {
      const updated = [...localTeams];
      updated[idx] = { ...local, ...remote };
      localStorage.setItem(KEYS.TEAMS, JSON.stringify(updated));
      this.notifyLocalListeners({ type: 'TEAMS_UPDATED', payload: updated });
    }
  }

  public mergeRemoteTeams(remoteTeams: Team[]) {
    if (typeof window === 'undefined' || !Array.isArray(remoteTeams)) return;
    const localTeams = this.getTeams();
    let changed = false;

    const teamMap = new Map<string, Team>();
    localTeams.forEach((t) => teamMap.set(t.id, t));

    remoteTeams.forEach((remote) => {
      const local = teamMap.get(remote.id);
      if (!local) {
        teamMap.set(remote.id, remote);
        changed = true;
      } else {
        if (this.isRemoteTeamNewer(local, remote)) {
          teamMap.set(remote.id, { ...local, ...remote });
          changed = true;
        }
      }
    });

    if (changed) {
      const merged = Array.from(teamMap.values());
      localStorage.setItem(KEYS.TEAMS, JSON.stringify(merged));
      this.notifyLocalListeners({ type: 'TEAMS_UPDATED', payload: merged });
    }
  }

  private initDefaultsIfEmpty() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.GAME_CONFIG)) {
      localStorage.setItem(KEYS.GAME_CONFIG, JSON.stringify(initialGameConfig));
    }

    // Ensure 90 questions bank is loaded and not outdated 18-question cache
    const existingQ = localStorage.getItem(KEYS.QUESTIONS);
    if (!existingQ) {
      localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(defaultQuestions));
    } else {
      try {
        const parsed = JSON.parse(existingQ);
        if (!Array.isArray(parsed) || parsed.length < 90 || !parsed.some((q: Question) => q.id === 'P01')) {
          localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(defaultQuestions));
        }
      } catch {
        localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(defaultQuestions));
      }
    }

    // Purge old demo teachers (tc-01, tc-02, tc-03, tc-04) if present and ensure all 10 official teachers GV01 -> GV10
    const existingTeachersRaw = localStorage.getItem(KEYS.TEACHERS);
    if (!existingTeachersRaw) {
      localStorage.setItem(KEYS.TEACHERS, JSON.stringify(defaultTeachers));
    } else {
      try {
        const parsed: Teacher[] = JSON.parse(existingTeachersRaw);
        const hasOld = Array.isArray(parsed) && parsed.some((t) => t.id && t.id.startsWith('tc-'));
        const hasAll10 = Array.isArray(parsed) && parsed.some((t) => t.id === 'GV01') && parsed.some((t) => t.id === 'GV10');
        const gv4 = Array.isArray(parsed) ? parsed.find((t) => t.id === 'GV04') : null;
        const isOfficialGv4 = gv4 && (gv4.name.includes('TUYỀN') || gv4.name.includes('TUYEN'));

        if (hasOld || !hasAll10 || !isOfficialGv4) {
          // Keep custom teachers if any added by Game Master, but update official GV01-GV10 from defaultTeachers
          const customTeachers = Array.isArray(parsed)
            ? parsed.filter((t) => !t.id.startsWith('tc-') && !defaultTeachers.some((dt) => dt.id === t.id))
            : [];
          // Preserve custom uploaded images on official teachers if Game Master uploaded real photo
          const updatedOfficial = defaultTeachers.map((defT) => {
            const existing = Array.isArray(parsed) ? parsed.find((t) => t.id === defT.id) : null;
            if (existing && existing.image && existing.image.startsWith('data:image/') && !existing.image.includes('svg')) {
              return { ...defT, image: existing.image, active: existing.active ?? defT.active };
            }
            return defT;
          });
          const mergedTeachers = [...updatedOfficial, ...customTeachers];
          localStorage.setItem(KEYS.TEACHERS, JSON.stringify(mergedTeachers));
        }
      } catch {
        localStorage.setItem(KEYS.TEACHERS, JSON.stringify(defaultTeachers));
      }
    }
    const existingPuzzlesRaw = localStorage.getItem(KEYS.PUZZLES);
    if (!existingPuzzlesRaw) {
      localStorage.setItem(KEYS.PUZZLES, JSON.stringify(defaultPuzzles));
    } else {
      try {
        const parsedPuz = JSON.parse(existingPuzzlesRaw);
        const has40Proverbs =
          Array.isArray(parsedPuz) &&
          parsedPuz.length >= 40 &&
          parsedPuz.some((p: PicturePuzzle) => p.visualClues && p.visualClues.length > 0);
        if (!has40Proverbs) {
          const customPuz = Array.isArray(parsedPuz)
            ? parsedPuz.filter((p: PicturePuzzle) => !defaultPuzzles.some((dp) => dp.id === p.id))
            : [];
          localStorage.setItem(KEYS.PUZZLES, JSON.stringify([...defaultPuzzles, ...customPuz]));
        }
      } catch {
        localStorage.setItem(KEYS.PUZZLES, JSON.stringify(defaultPuzzles));
      }
    }
    if (!localStorage.getItem(KEYS.CHALLENGES)) {
      localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(defaultChallenges));
    }
    if (!localStorage.getItem(KEYS.TREASURE_ITEMS)) {
      localStorage.setItem(KEYS.TREASURE_ITEMS, JSON.stringify(defaultTreasureItems));
    }
    if (!localStorage.getItem(KEYS.TEAMS)) {
      localStorage.setItem(KEYS.TEAMS, JSON.stringify(defaultInitialTeams));
    }
    if (!localStorage.getItem(KEYS.ADMIN_PASSWORD)) {
      localStorage.setItem(KEYS.ADMIN_PASSWORD, 'PEK2026');
    }
    if (!localStorage.getItem(KEYS.MYSTERY_CODES)) {
      localStorage.setItem(KEYS.MYSTERY_CODES, JSON.stringify(defaultMysteryCodes));
    }
  }

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private broadcast(type: string, payload?: unknown) {
    const data = { type, payload, timestamp: Date.now() };
    this.notifyLocalListeners(data);
    if (this.channel) {
      try {
        this.channel.postMessage(data);
      } catch {
        // Fallback
      }
    }
  }

  private notifyLocalListeners(data: { type: string; payload?: unknown }) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    });
  }

  // --- CURRENT TEAM SESSION (INDEPENDENT PER DEVICE / TAB) ---
  public getCurrentTeamId(): string | null {
    if (typeof window === 'undefined') return null;
    // Prefer sessionStorage so multiple tabs/windows can each control a different team
    const sessionTeam = sessionStorage.getItem(KEYS.CURRENT_TEAM_ID);
    if (sessionTeam) return sessionTeam;
    return localStorage.getItem(KEYS.CURRENT_TEAM_ID);
  }

  public setCurrentTeamId(teamId: string | null) {
    if (typeof window === 'undefined') return;
    if (teamId) {
      sessionStorage.setItem(KEYS.CURRENT_TEAM_ID, teamId);
      localStorage.setItem(KEYS.CURRENT_TEAM_ID, teamId);
    } else {
      sessionStorage.removeItem(KEYS.CURRENT_TEAM_ID);
      localStorage.removeItem(KEYS.CURRENT_TEAM_ID);
    }
    this.notifyLocalListeners({ type: 'CURRENT_TEAM_CHANGED', payload: teamId });
  }

  public getCurrentTeam(): Team | null {
    const id = this.getCurrentTeamId();
    if (!id) return null;
    const teams = this.getTeams();
    return teams.find((t) => t.id === id) || null;
  }

  public getTeamById(id: string): Team | null {
    const teams = this.getTeams();
    return teams.find((t) => t.id === id) || null;
  }

  // --- TEAMS CRUD ---
  public getTeams(): Team[] {
    if (typeof window === 'undefined') return defaultInitialTeams;
    try {
      const data = localStorage.getItem(KEYS.TEAMS);
      return data ? JSON.parse(data) : defaultInitialTeams;
    } catch {
      return defaultInitialTeams;
    }
  }

  public saveTeam(team: Team) {
    const teams = this.getTeams();
    const idx = teams.findIndex((t) => t.id === team.id);
    const now = Date.now();
    const teamToSave: Team = {
      ...team,
      updatedAt: team.updatedAt || now,
    };

    let updated: Team[];
    if (idx >= 0) {
      updated = [...teams];
      updated[idx] = teamToSave;
    } else {
      updated = [...teams, teamToSave];
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.TEAMS, JSON.stringify(updated));
    }
    this.broadcast('TEAMS_UPDATED', updated);

    // Sync to backend server asynchronously for multi-device visibility
    if (typeof window !== 'undefined') {
      const transactionId = `tx_${team.id}_${now}_${Math.random().toString(36).slice(2, 7)}`;
      fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-transaction-id': transactionId,
        },
        body: JSON.stringify(teamToSave),
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data && data.team) {
              this.mergeRemoteTeam(data.team);
            }
          }
        })
        .catch(() => {
          // Silently catch network errors
        });
    }
  }

  public deleteTeam(teamId: string) {
    const teams = this.getTeams();
    const updated = teams.filter((t) => t.id !== teamId);
    localStorage.setItem(KEYS.TEAMS, JSON.stringify(updated));

    if (this.getCurrentTeamId() === teamId) {
      this.setCurrentTeamId(null);
    }
    this.clearTeamQuestionHistory(teamId);
    this.broadcast('TEAMS_UPDATED', updated);

    // Sync deletion to server with admin authorization
    if (typeof window !== 'undefined') {
      fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: this.getAdminHeaders(),
      }).catch(() => {});
    }
  }

  public resetTeam(teamId: string): Team | null {
    const teams = this.getTeams();
    const team = teams.find((t) => t.id === teamId);
    if (!team) return null;

    const resetTeam: Team = {
      ...team,
      currentRound: 1,
      status: 'ready',
      score: 0,
      roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
      elapsedTime: 0,
      roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
      answersHistory: [],
      currentQuestionIndex: 0,
      assignedQuestionsRound1: undefined,
      assignedTeachersRound2: undefined,
      assignedPuzzlesRound3: undefined,
      assignedChallengeRound4: undefined,
      round4MysteryCode: undefined,
      round4MysteryEffect: undefined,
      round4BaseScore: undefined,
      round4State: undefined,
      updatedAt: Date.now(),
    };

    this.saveTeam(resetTeam);

    if (typeof window !== 'undefined') {
      fetch(`/api/teams/${teamId}/reset`, {
        method: 'POST',
        headers: this.getAdminHeaders(),
      }).catch(() => {});
    }

    return resetTeam;
  }

  public clearAllTeams() {
    localStorage.setItem(KEYS.TEAMS, JSON.stringify([]));
    localStorage.removeItem(KEYS.QUESTION_HISTORY);
    this.setCurrentTeamId(null);
    this.broadcast('TEAMS_UPDATED', []);
  }

  // --- TEAM QUESTION HISTORY (ANTI-REPEAT ACROSS SESSIONS) ---
  public getAllQuestionHistory(): TeamQuestionHistory[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(KEYS.QUESTION_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getTeamQuestionHistory(teamId: string): TeamQuestionHistory[] {
    const all = this.getAllQuestionHistory();
    return all.filter((h) => h.teamId === teamId);
  }

  public recordTeamQuestionHistory(records: TeamQuestionHistory[]) {
    if (typeof window === 'undefined' || records.length === 0) return;
    try {
      const all = this.getAllQuestionHistory();
      all.push(...records);
      localStorage.setItem(KEYS.QUESTION_HISTORY, JSON.stringify(all));
    } catch {
      // Ignored
    }
  }

  public clearTeamQuestionHistory(teamId: string, subject?: string) {
    if (typeof window === 'undefined') return;
    try {
      const data = localStorage.getItem(KEYS.QUESTION_HISTORY);
      if (!data) return;
      let all: TeamQuestionHistory[] = JSON.parse(data);
      if (subject) {
        const questions = this.getQuestions();
        const subjectQIds = new Set(
          questions
            .filter((q) => q.subject.toUpperCase() === subject.toUpperCase())
            .map((q) => q.id)
        );
        all = all.filter((h) => !(h.teamId === teamId && subjectQIds.has(h.questionId)));
      } else {
        all = all.filter((h) => h.teamId !== teamId);
      }
      localStorage.setItem(KEYS.QUESTION_HISTORY, JSON.stringify(all));
    } catch {
      // Ignored
    }
  }

  /**
   * Thống kê câu hỏi Vòng 1 cho Game Master:
   * - Số lần mỗi câu được sử dụng
   * - Tỉ lệ trả lời đúng (%)
   * - Tỉ lệ trả lời sai (%)
   * - Thời gian trả lời trung bình (giây)
   */
  public getQuestionStats(questionId: string) {
    const teams = this.getTeams();
    const history = this.getAllQuestionHistory();

    // 1. Số lần câu hỏi được gán/sử dụng
    const historyCount = history.filter((h) => h.questionId === questionId).length;
    let assignedCount = 0;
    teams.forEach((t) => {
      if (t.assignedQuestionsRound1 && t.assignedQuestionsRound1.includes(questionId)) {
        assignedCount++;
      }
    });
    const timesUsed = Math.max(historyCount, assignedCount);

    // 2. Thống kê câu trả lời thực tế từ các đội
    const answers: { isCorrect: boolean; timeTaken: number }[] = [];
    teams.forEach((t) => {
      (t.answersHistory || []).forEach((ans) => {
        if (ans.questionId === questionId) {
          answers.push({ isCorrect: ans.isCorrect, timeTaken: ans.timeTaken || 0 });
        }
      });
    });

    const totalAnswers = answers.length;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const incorrectCount = totalAnswers - correctCount;

    const correctRate = totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;
    const incorrectRate = totalAnswers > 0 ? Math.round((incorrectCount / totalAnswers) * 100) : 0;
    const totalTime = answers.reduce((sum, a) => sum + a.timeTaken, 0);
    const avgTime = totalAnswers > 0 ? Math.round((totalTime / totalAnswers) * 10) / 10 : 0;

    return {
      timesUsed,
      totalAnswers,
      correctCount,
      incorrectCount,
      correctRate,
      incorrectRate,
      avgTime,
    };
  }

  // --- QUESTIONS (ROUND 1) ---
  public getQuestions(): Question[] {
    if (typeof window === 'undefined') return defaultQuestions;
    try {
      const data = localStorage.getItem(KEYS.QUESTIONS);
      return data ? JSON.parse(data) : defaultQuestions;
    } catch {
      return defaultQuestions;
    }
  }

  public saveQuestion(question: Question) {
    const list = this.getQuestions();
    const idx = list.findIndex((q) => q.id === question.id);
    let updated: Question[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = question;
    } else {
      updated = [...list, question];
    }
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(updated));
    this.broadcast('QUESTIONS_UPDATED', updated);
  }

  public deleteQuestion(id: string) {
    const list = this.getQuestions();
    const updated = list.filter((q) => q.id !== id);
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(updated));
    this.broadcast('QUESTIONS_UPDATED', updated);
  }

  // --- TEACHERS (ROUND 2) ---
  public getTeachers(): Teacher[] {
    if (typeof window === 'undefined') return defaultTeachers;
    try {
      const data = localStorage.getItem(KEYS.TEACHERS);
      if (!data) return defaultTeachers;
      const parsed: Teacher[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Strip out legacy demo teachers (tc-01 -> tc-04)
        const clean = parsed.filter((t) => !t.id || !t.id.startsWith('tc-'));
        if (clean.length > 0) {
          // If official teachers GV01 - GV10 are partially missing or outdated, merge with defaultTeachers
          const hasAll10 = clean.some((t) => t.id === 'GV01') && clean.some((t) => t.id === 'GV10');
          const gv4 = clean.find((t) => t.id === 'GV04');
          const isOfficialGv4 = gv4 && (gv4.name.includes('TUYỀN') || gv4.name.includes('TUYEN'));

          if (!hasAll10 || !isOfficialGv4) {
            const custom = clean.filter((t) => !defaultTeachers.some((dt) => dt.id === t.id));
            const updatedOfficial = defaultTeachers.map((defT) => {
              const existing = clean.find((t) => t.id === defT.id);
              if (existing && existing.image && existing.image.startsWith('data:image/') && !existing.image.includes('svg')) {
                return { ...defT, image: existing.image, active: existing.active ?? defT.active };
              }
              return defT;
            });
            const merged = [...updatedOfficial, ...custom];
            try {
              localStorage.setItem(KEYS.TEACHERS, JSON.stringify(merged));
            } catch {
              // Ignore quota errors
            }
            return merged;
          }
          return clean;
        }
      }
      return defaultTeachers;
    } catch {
      return defaultTeachers;
    }
  }

  public saveTeacher(teacher: Teacher) {
    const list = this.getTeachers();
    const idx = list.findIndex((t) => t.id === teacher.id);
    let updated: Teacher[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = teacher;
    } else {
      updated = [...list, teacher];
    }
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(updated));
    this.broadcast('TEACHERS_UPDATED', updated);
  }

  public deleteTeacher(id: string) {
    const list = this.getTeachers();
    const updated = list.filter((t) => t.id !== id);
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(updated));
    this.broadcast('TEACHERS_UPDATED', updated);
  }

  // --- PUZZLES (ROUND 3) ---
  public getPuzzles(): PicturePuzzle[] {
    if (typeof window === 'undefined') return defaultPuzzles;
    try {
      const data = localStorage.getItem(KEYS.PUZZLES);
      if (!data) return defaultPuzzles;
      const parsed: PicturePuzzle[] = JSON.parse(data);
      if (
        Array.isArray(parsed) &&
        parsed.length >= 40 &&
        parsed.some((p) => p.visualClues && p.visualClues.length > 0)
      ) {
        return parsed;
      }
      // Auto-migrate to 40 proverbs bank while preserving custom
      const custom = Array.isArray(parsed)
        ? parsed.filter((p) => !defaultPuzzles.some((dp) => dp.id === p.id))
        : [];
      const migrated = [...defaultPuzzles, ...custom];
      try {
        localStorage.setItem(KEYS.PUZZLES, JSON.stringify(migrated));
      } catch (e) {
        console.warn('Could not cache migrated puzzles:', e);
      }
      return migrated;
    } catch {
      return defaultPuzzles;
    }
  }

  public savePuzzles(puzzles: PicturePuzzle[]) {
    localStorage.setItem(KEYS.PUZZLES, JSON.stringify(puzzles));
    this.broadcast('PUZZLES_UPDATED', puzzles);
  }

  public savePuzzle(puzzle: PicturePuzzle) {
    const list = this.getPuzzles();
    const idx = list.findIndex((p) => p.id === puzzle.id);
    let updated: PicturePuzzle[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = puzzle;
    } else {
      updated = [...list, puzzle];
    }
    localStorage.setItem(KEYS.PUZZLES, JSON.stringify(updated));
    this.broadcast('PUZZLES_UPDATED', updated);
  }

  public deletePuzzle(id: string) {
    const list = this.getPuzzles();
    const updated = list.filter((p) => p.id !== id);
    localStorage.setItem(KEYS.PUZZLES, JSON.stringify(updated));
    this.broadcast('PUZZLES_UPDATED', updated);
  }

  // --- CHALLENGES (ROUND 4) ---
  public getChallenges(): Challenge[] {
    if (typeof window === 'undefined') return defaultChallenges;
    try {
      const data = localStorage.getItem(KEYS.CHALLENGES);
      return data ? JSON.parse(data) : defaultChallenges;
    } catch {
      return defaultChallenges;
    }
  }

  public saveChallenge(challenge: Challenge) {
    const list = this.getChallenges();
    const idx = list.findIndex((c) => c.id === challenge.id);
    let updated: Challenge[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = challenge;
    } else {
      updated = [...list, challenge];
    }
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(updated));
    this.broadcast('CHALLENGES_UPDATED', updated);
  }

  // --- TREASURE ITEMS ---
  public getTreasureItems(): TreasureItem[] {
    if (typeof window === 'undefined') return defaultTreasureItems;
    try {
      const data = localStorage.getItem(KEYS.TREASURE_ITEMS);
      return data ? JSON.parse(data) : defaultTreasureItems;
    } catch {
      return defaultTreasureItems;
    }
  }

  public saveTreasureItem(item: TreasureItem) {
    const list = this.getTreasureItems();
    const idx = list.findIndex((t) => t.id === item.id);
    let updated: TreasureItem[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = item;
    } else {
      updated = [...list, item];
    }
    localStorage.setItem(KEYS.TREASURE_ITEMS, JSON.stringify(updated));
    this.broadcast('TREASURES_UPDATED', updated);
  }

  // --- GAME CONFIG ---
  public getGameConfig(): GameConfig {
    if (typeof window === 'undefined') return initialGameConfig;
    try {
      const data = localStorage.getItem(KEYS.GAME_CONFIG);
      return data ? JSON.parse(data) : initialGameConfig;
    } catch {
      return initialGameConfig;
    }
  }

  public saveGameConfig(config: GameConfig) {
    localStorage.setItem(KEYS.GAME_CONFIG, JSON.stringify(config));
    this.broadcast('CONFIG_UPDATED', config);
  }

  // --- GAME MASTER AUTHENTICATION (BẢO VỆ MẬT KHẨU) ---
  public getAdminPassword(): string {
    if (typeof window === 'undefined') return 'PEK2026';
    return localStorage.getItem(KEYS.ADMIN_PASSWORD) || 'PEK2026';
  }

  public setAdminPassword(newPass: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.ADMIN_PASSWORD, newPass);
    this.broadcast('ADMIN_PASSWORD_CHANGED');
  }

  public verifyAdminPassword(input: string): boolean {
    const current = this.getAdminPassword();
    return input.trim() === current.trim();
  }

  public isAdminAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(KEYS.ADMIN_AUTH_SESSION) === 'true';
  }

  public setAdminAuthenticated(auth: boolean) {
    if (typeof window === 'undefined') return;
    if (auth) {
      sessionStorage.setItem(KEYS.ADMIN_AUTH_SESSION, 'true');
    } else {
      sessionStorage.removeItem(KEYS.ADMIN_AUTH_SESSION);
    }
    this.broadcast('ADMIN_AUTH_CHANGED', auth);
  }

  public logoutAdmin() {
    this.setAdminAuthenticated(false);
  }

  // --- ROUND 4 MYSTERY CODES (VÒNG MAY MẮN HỘP QUÀ KHO BÁU) ---
  public getMysteryCodes(): MysteryTreasureCode[] {
    if (typeof window === 'undefined') return defaultMysteryCodes;
    try {
      const data = localStorage.getItem(KEYS.MYSTERY_CODES);
      return data ? JSON.parse(data) : defaultMysteryCodes;
    } catch {
      return defaultMysteryCodes;
    }
  }

  public getMysteryCodeByCode(code: string): MysteryTreasureCode | undefined {
    const list = this.getMysteryCodes();
    const clean = code.trim().toUpperCase();
    return list.find((c) => c.code.trim().toUpperCase() === clean);
  }

  public saveMysteryCode(codeItem: MysteryTreasureCode) {
    const list = this.getMysteryCodes();
    const idx = list.findIndex(
      (c) => c.id === codeItem.id || c.code.trim().toUpperCase() === codeItem.code.trim().toUpperCase()
    );
    let updated: MysteryTreasureCode[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = codeItem;
    } else {
      updated = [...list, codeItem];
    }
    localStorage.setItem(KEYS.MYSTERY_CODES, JSON.stringify(updated));
    this.broadcast('MYSTERY_CODES_UPDATED', updated);
  }

  public deleteMysteryCode(id: string) {
    const list = this.getMysteryCodes();
    const updated = list.filter((c) => c.id !== id);
    localStorage.setItem(KEYS.MYSTERY_CODES, JSON.stringify(updated));
    this.broadcast('MYSTERY_CODES_UPDATED', updated);
  }

  public recordMysteryCodeClaim(
    code: string,
    teamId: string,
    teamName: string,
    pointsDelta: number,
    effect: MysteryBoxEffect
  ) {
    const list = this.getMysteryCodes();
    const clean = code.trim().toUpperCase();
    const idx = list.findIndex((c) => c.code.trim().toUpperCase() === clean);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        claimedByTeamId: teamId,
        claimedByTeamName: teamName,
        claimedAt: Date.now(),
        pointsDelta,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(KEYS.MYSTERY_CODES, JSON.stringify(list));
      }
      this.broadcast('MYSTERY_CODES_UPDATED', list);
    } else {
      // Dynamic claim recording for custom codes entered
      const newCustom: MysteryTreasureCode = {
        id: `box-custom-${Date.now()}`,
        code: clean,
        name: 'Hộp Quà Mật Khẩu Tùy Chọn',
        effect,
        description: `Mật mã thực địa do đội chơi giải mã được.`,
        claimedByTeamId: teamId,
        claimedByTeamName: teamName,
        claimedAt: Date.now(),
        pointsDelta,
        active: true,
      };
      const updated = [...list, newCustom];
      if (typeof window !== 'undefined') {
        localStorage.setItem(KEYS.MYSTERY_CODES, JSON.stringify(updated));
      }
      this.broadcast('MYSTERY_CODES_UPDATED', updated);
    }
  }

  public resetMysteryCodes() {
    localStorage.setItem(KEYS.MYSTERY_CODES, JSON.stringify(defaultMysteryCodes));
    this.broadcast('MYSTERY_CODES_UPDATED', defaultMysteryCodes);
  }

  // --- RESTORE FACTORY DEFAULTS ---
  public factoryReset() {
    this.resetToFactoryDefaults();
  }

  public resetToFactoryDefaults() {
    localStorage.setItem(KEYS.GAME_CONFIG, JSON.stringify(initialGameConfig));
    localStorage.setItem(KEYS.QUESTIONS, JSON.stringify(defaultQuestions));
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(defaultTeachers));
    localStorage.setItem(KEYS.PUZZLES, JSON.stringify(defaultPuzzles));
    localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(defaultChallenges));
    localStorage.setItem(KEYS.MYSTERY_CODES, JSON.stringify(defaultMysteryCodes));
    localStorage.setItem(KEYS.TREASURE_ITEMS, JSON.stringify(defaultTreasureItems));
    localStorage.setItem(KEYS.KEYWORDS, JSON.stringify(DEFAULT_SCIENCE_KEYWORDS));
    localStorage.setItem(KEYS.TEAMS, JSON.stringify(defaultInitialTeams));
    localStorage.removeItem(KEYS.QUESTION_HISTORY);
    this.broadcast('FACTORY_RESET');
  }
}

export const storageService = new StorageService();
