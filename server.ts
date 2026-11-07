import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const HOST = '0.0.0.0';
const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'tournament_state.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ServerState {
  teams: any[];
  config: any;
  mysteryCodes: any[];
  mysteryClaims: any[];
  questionHistory: any[];
  lastUpdated: number;
}

const defaultInitialTeams = [
  {
    id: 'team_alpha_01',
    teamCode: 'PEK-7F29',
    teamName: 'Lượng Tử Alpha',
    className: '12 Lý - THPT Pétrus Ký',
    captainName: 'Nguyễn Minh Triết',
    members: ['Nguyễn Minh Triết (Đội Trưởng)', 'Trần Hoàng Long', 'Lê Bảo Ngọc'],
    createdAt: Date.now() - 3600000,
    currentRound: 1,
    status: 'ready',
    score: 0,
    roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    elapsedTime: 0,
    roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
    answersHistory: [],
    currentQuestionIndex: 0,
    questionSeed: 'PEK_ALPHA_SEED_2026',
    unlockedNextGenCodes: [],
    bonusQRCodes: [],
  },
  {
    id: 'team_beta_02',
    teamCode: 'PEK-3E81',
    teamName: 'Hóa Thạch Titan',
    className: '11 Hóa - THPT Pétrus Ký',
    captainName: 'Phạm Phương Linh',
    members: ['Phạm Phương Linh (Đội Trưởng)', 'Đặng Tuấn Kiệt', 'Võ Thanh Trúc'],
    createdAt: Date.now() - 3500000,
    currentRound: 1,
    status: 'ready',
    score: 0,
    roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    elapsedTime: 0,
    roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
    answersHistory: [],
    currentQuestionIndex: 0,
    questionSeed: 'PEK_BETA_SEED_2026',
    unlockedNextGenCodes: [],
    bonusQRCodes: [],
  },
  {
    id: 'team_gamma_03',
    teamCode: 'PEK-9A14',
    teamName: 'ADN Di Truyền',
    className: '10 Sinh - THPT Pétrus Ký',
    captainName: 'Hoàng Quốc Bảo',
    members: ['Hoàng Quốc Bảo (Đội Trưởng)', 'Đỗ Thảo Vy', 'Bùi Gia Khiêm'],
    createdAt: Date.now() - 3400000,
    currentRound: 1,
    status: 'ready',
    score: 0,
    roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
    elapsedTime: 0,
    roundTimes: { 1: 0, 2: 0, 3: 0, 4: 0 },
    answersHistory: [],
    currentQuestionIndex: 0,
    questionSeed: 'PEK_GAMMA_SEED_2026',
    unlockedNextGenCodes: [],
    bonusQRCodes: [],
  },
];

const initialGameConfig = {
  gameTitle: 'Pétrus Ký Science Quest – The Final Code',
  organization: 'Tổ Khoa học Tự nhiên – Trường Pétrus Ký',
  gameStatus: 'in_progress',
  globalCurrentRound: 1,
  totalRounds: 4,
  allowLateRegistration: true,
  autoAdvanceRound: false,
};

function loadState(): ServerState {
  if (fs.existsSync(STATE_FILE)) {
    try {
      const content = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.teams)) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse state file, using defaults', e);
    }
  }

  const defaultState: ServerState = {
    teams: defaultInitialTeams,
    config: initialGameConfig,
    mysteryCodes: [],
    mysteryClaims: [],
    questionHistory: [],
    lastUpdated: Date.now(),
  };
  saveState(defaultState);
  return defaultState;
}

function saveState(state: ServerState) {
  try {
    state.lastUpdated = Date.now();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save state file', err);
  }
}

let serverState = loadState();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // CORS and Cache Headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: Date.now(), totalTeams: serverState.teams.length });
  });

  // Fast Full Sync Endpoint for Multi-Device & Projector
  app.get('/api/sync', (req: Request, res: Response) => {
    const since = parseInt((req.query.since as string) || '0', 10);
    res.json({
      teams: serverState.teams,
      config: serverState.config,
      mysteryClaims: serverState.mysteryClaims,
      timestamp: serverState.lastUpdated,
      hasUpdates: serverState.lastUpdated > since,
    });
  });

  // Get all teams
  app.get('/api/teams', (_req: Request, res: Response) => {
    res.json(serverState.teams);
  });

  // Save or update team
  app.post('/api/teams', (req: Request, res: Response) => {
    const incomingTeam = req.body;
    if (!incomingTeam || !incomingTeam.id) {
      res.status(400).json({ error: 'Team data requires an id' });
      return;
    }

    const idx = serverState.teams.findIndex((t) => t.id === incomingTeam.id);
    if (idx >= 0) {
      serverState.teams[idx] = { ...serverState.teams[idx], ...incomingTeam };
    } else {
      serverState.teams.push(incomingTeam);
    }

    saveState(serverState);
    res.json({ success: true, team: incomingTeam });
  });

  // Get specific team
  app.get('/api/teams/:id', (req: Request, res: Response) => {
    const team = serverState.teams.find((t) => t.id === req.params.id);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json(team);
  });

  // Delete team
  app.delete('/api/teams/:id', (req: Request, res: Response) => {
    serverState.teams = serverState.teams.filter((t) => t.id !== req.params.id);
    saveState(serverState);
    res.json({ success: true, deletedId: req.params.id });
  });

  // Reset team
  app.post('/api/teams/:id/reset', (req: Request, res: Response) => {
    const team = serverState.teams.find((t) => t.id === req.params.id);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    team.score = 0;
    team.roundScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
    team.elapsedTime = 0;
    team.roundTimes = { 1: 0, 2: 0, 3: 0, 4: 0 };
    team.status = 'ready';
    team.currentRound = 1;
    team.currentQuestionIndex = 0;
    team.answersHistory = [];
    team.assignedQuestionsRound1 = undefined;
    team.assignedTeacherRound2 = undefined;
    team.assignedPuzzleRound3 = undefined;
    team.assignedChallengeRound4 = undefined;
    team.round4MysteryCode = undefined;
    team.round4MysteryEffect = undefined;
    team.round4BaseScore = undefined;
    saveState(serverState);
    res.json({ success: true, team });
  });

  // Game Config
  app.get('/api/config', (_req: Request, res: Response) => {
    res.json(serverState.config);
  });

  app.post('/api/config', (req: Request, res: Response) => {
    serverState.config = { ...serverState.config, ...req.body };
    saveState(serverState);
    res.json({ success: true, config: serverState.config });
  });

  // Mystery Claims (Vòng 4)
  app.post('/api/mystery-claims', (req: Request, res: Response) => {
    const claim = req.body;
    serverState.mysteryClaims.push({ ...claim, claimedAt: Date.now() });
    saveState(serverState);
    res.json({ success: true });
  });

  // Factory Reset
  app.post('/api/factory-reset', (_req: Request, res: Response) => {
    serverState = {
      teams: defaultInitialTeams,
      config: initialGameConfig,
      mysteryCodes: [],
      mysteryClaims: [],
      questionHistory: [],
      lastUpdated: Date.now(),
    };
    saveState(serverState);
    res.json({ success: true });
  });

  // --- VITE MIDDLEWARE (DEV) / STATIC (PROD) ---
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.join(process.cwd(), 'dist'));

  if (isProd) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
