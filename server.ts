import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';
const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'tournament_state.json');

// Admin secret from environment variable (defaults to PEK2026 if not configured)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'PEK2026';

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface TeamData {
  id: string;
  teamCode: string;
  teamName: string;
  className: string;
  captainName?: string;
  members: string[];
  createdAt: number;
  currentRound: number;
  status: string;
  score: number;
  roundScores: Record<string | number, number>;
  elapsedTime: number;
  roundTimes: Record<string | number, number>;
  answersHistory: any[];
  currentQuestionIndex: number;
  questionSeed: string;
  unlockedNextGenCodes?: string[];
  bonusQRCodes?: string[];
  round4State?: any;
  updatedAt?: number;
  version?: number;
  scoreAdjustments?: Array<{
    delta: number;
    reason: string;
    timestamp: number;
    previousScore: number;
    newScore: number;
  }>;
  [key: string]: any;
}

export interface ServerState {
  version: number;
  teams: TeamData[];
  config: any;
  mysteryCodes: any[];
  mysteryClaims: any[];
  questionHistory: any[];
  lastUpdated: number;
}

const defaultInitialTeams: TeamData[] = [
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
    updatedAt: Date.now() - 3600000,
    version: 1,
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
    updatedAt: Date.now() - 3500000,
    version: 1,
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
    updatedAt: Date.now() - 3400000,
    version: 1,
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

// -------------------------------------------------------------
// STATE INITIALIZATION & ATOMIC PERSISTENCE QUEUE
// -------------------------------------------------------------
function loadState(): ServerState {
  if (fs.existsSync(STATE_FILE)) {
    try {
      const content = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.teams)) {
        return {
          version: typeof parsed.version === 'number' ? parsed.version : 1,
          teams: parsed.teams,
          config: parsed.config || initialGameConfig,
          mysteryCodes: parsed.mysteryCodes || [],
          mysteryClaims: parsed.mysteryClaims || [],
          questionHistory: parsed.questionHistory || [],
          lastUpdated: parsed.lastUpdated || Date.now(),
        };
      }
    } catch (e) {
      console.warn('[SERVER] Failed to parse state file, using defaults', e);
    }
  }

  const defaultState: ServerState = {
    version: 1,
    teams: defaultInitialTeams,
    config: initialGameConfig,
    mysteryCodes: [],
    mysteryClaims: [],
    questionHistory: [],
    lastUpdated: Date.now(),
  };
  saveStateDirect(defaultState);
  return defaultState;
}

function saveStateDirect(state: ServerState) {
  try {
    state.lastUpdated = Date.now();
    const tempFile = `${STATE_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), 'utf-8');
    fs.renameSync(tempFile, STATE_FILE);
  } catch (err) {
    console.error('[SERVER] Failed to save state file directly:', err);
  }
}

let serverState: ServerState = loadState();

// Sequential write queue to serialize concurrent writes safely
let isWriting = false;
let writeQueue: Array<{ resolve: () => void; reject: (err: any) => void }> = [];

function safePersistState(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    writeQueue.push({ resolve, reject });
    processWriteQueue();
  });
}

function processWriteQueue() {
  if (isWriting || writeQueue.length === 0) return;
  isWriting = true;
  const currentBatch = [...writeQueue];
  writeQueue = [];

  try {
    serverState.lastUpdated = Date.now();
    serverState.version = (serverState.version || 0) + 1;
    const tempFile = `${STATE_FILE}.tmp.${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    fs.writeFileSync(tempFile, JSON.stringify(serverState, null, 2), 'utf-8');
    fs.renameSync(tempFile, STATE_FILE);
    currentBatch.forEach((b) => b.resolve());
  } catch (err) {
    console.error('[SERVER] Error persisting tournament state:', err);
    currentBatch.forEach((b) => b.reject(err));
  } finally {
    isWriting = false;
    if (writeQueue.length > 0) {
      setImmediate(processWriteQueue);
    }
  }
}

// -------------------------------------------------------------
// SSE (SERVER-SENT EVENTS) CONNECTION MANAGER
// -------------------------------------------------------------
interface SSEClient {
  id: string;
  res: Response;
  ip: string;
  connectedAt: number;
  role: 'student' | 'admin' | 'public';
}

const sseClients = new Set<SSEClient>();

function broadcastSSE(eventType: string, payload: any, targetRole?: 'admin' | 'all') {
  const data = JSON.stringify({
    type: eventType,
    payload,
    version: serverState.version,
    timestamp: serverState.lastUpdated,
  });
  const message = `event: ${eventType}\ndata: ${data}\n\n`;

  for (const client of sseClients) {
    if (targetRole === 'admin' && client.role !== 'admin') continue;
    try {
      client.res.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Heartbeat ping every 15s to keep connections alive through Cloud Run / Proxies
const heartbeatInterval = setInterval(() => {
  const heartbeatMsg = `: heartbeat ${Date.now()}\n\n`;
  for (const client of sseClients) {
    try {
      client.res.write(heartbeatMsg);
    } catch {
      sseClients.delete(client);
    }
  }
}, 15000);

// Unref heartbeat interval so it doesn't prevent graceful server shutdown in tests
if (heartbeatInterval.unref) {
  heartbeatInterval.unref();
}

// -------------------------------------------------------------
// SECURITY & ADMIN SESSIONS
// -------------------------------------------------------------
interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}

const adminSessions = new Map<string, AdminSession>();

function generateAdminToken(): string {
  const token = `adm_${crypto.randomUUID()}_${Date.now()}`;
  adminSessions.set(token, {
    token,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours validity
  });
  return token;
}

function verifyAdminRequest(req: Request): boolean {
  const authHeader = req.headers['authorization'];
  const pinHeader = req.headers['x-admin-pin'] as string;
  const tokenHeader = req.headers['x-admin-token'] as string;

  // 1. Direct PIN validation via header (not exposed in query string)
  if (pinHeader && pinHeader.trim() === ADMIN_SECRET.trim()) {
    return true;
  }

  // 2. Token validation
  const token = tokenHeader || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);
  if (token && adminSessions.has(token)) {
    const session = adminSessions.get(token)!;
    if (session.expiresAt > Date.now()) {
      return true;
    } else {
      adminSessions.delete(token);
    }
  }

  return false;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (verifyAdminRequest(req)) {
    return next();
  }
  res.status(401).json({
    success: false,
    error: 'Unauthorized: Quyền quản trị Game Master yêu cầu mã xác thực hợp lệ.',
  });
}

// -------------------------------------------------------------
// TRANSACTION ID DEDUPLICATION CACHE
// -------------------------------------------------------------
const processedTransactions = new Map<string, { timestamp: number; result: any }>();

const transactionCleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [txId, tx] of processedTransactions.entries()) {
    if (now - tx.timestamp > 30 * 60 * 1000) {
      processedTransactions.delete(txId);
    }
  }
}, 5 * 60 * 1000);

if (transactionCleanupInterval.unref) {
  transactionCleanupInterval.unref();
}

// -------------------------------------------------------------
// EXPRESS APP FACTORY
// -------------------------------------------------------------
export async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // CORS and Cache Headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-pin, x-admin-token, x-transaction-id');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // ===========================================================
  // 1. SYSTEM & HEALTH CHECK
  // ===========================================================
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      version: serverState.version,
      timestamp: Date.now(),
      totalTeams: serverState.teams.length,
      activeSSEConnections: sseClients.size,
    });
  });

  // ===========================================================
  // 2. SSE REAL-TIME EVENT STREAM (GET /api/events)
  // ===========================================================
  app.get('/api/events', (req: Request, res: Response) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering on Nginx/Cloud Run proxies
    });

    const clientId = `client_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const isAdmin = verifyAdminRequest(req);
    const role: 'student' | 'admin' = isAdmin ? 'admin' : 'student';

    const client: SSEClient = {
      id: clientId,
      res,
      ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown',
      connectedAt: Date.now(),
      role,
    };

    sseClients.add(client);

    // Initial handshake message with current state metadata
    res.write(
      `event: connected\ndata: ${JSON.stringify({
        clientId,
        version: serverState.version,
        timestamp: serverState.lastUpdated,
        totalTeams: serverState.teams.length,
        role,
      })}\n\n`
    );

    // Handle client disconnect gracefully
    req.on('close', () => {
      sseClients.delete(client);
    });
  });

  // ===========================================================
  // 3. ADMIN AUTHENTICATION ENDPOINTS
  // ===========================================================
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { pin } = req.body;
    if (!pin || pin.trim() !== ADMIN_SECRET.trim()) {
      res.status(401).json({
        success: false,
        error: 'Mã PIN Game Master không chính xác.',
      });
      return;
    }

    const token = generateAdminToken();
    res.json({
      success: true,
      token,
      expiresIn: 86400, // 24 hours
      message: 'Xác thực Game Master thành công.',
    });
  });

  app.get('/api/admin/verify', (req: Request, res: Response) => {
    if (verifyAdminRequest(req)) {
      res.json({ success: true, authenticated: true });
    } else {
      res.status(401).json({ success: false, authenticated: false });
    }
  });

  // ===========================================================
  // 4. DATA SYNC (COMPATIBLE WITH EXISTING storageService.ts)
  // ===========================================================
  app.get('/api/sync', (req: Request, res: Response) => {
    const since = parseInt((req.query.since as string) || '0', 10);
    res.json({
      version: serverState.version,
      teams: serverState.teams,
      config: serverState.config,
      mysteryClaims: serverState.mysteryClaims,
      timestamp: serverState.lastUpdated,
      hasUpdates: serverState.lastUpdated > since,
    });
  });

  // ===========================================================
  // 5. TEAMS CRUD & AUTHORITATIVE UPDATES
  // ===========================================================
  app.get('/api/teams', (_req: Request, res: Response) => {
    res.json(serverState.teams);
  });

  // Non-destructive update for a specific team (Supports concurrent updates from 3 teams)
  app.post('/api/teams', async (req: Request, res: Response) => {
    const incomingTeam = req.body;
    if (!incomingTeam || !incomingTeam.id) {
      res.status(400).json({ error: 'Team data requires an id' });
      return;
    }

    // Deduplication check via transactionId header or body
    const transactionId = (req.headers['x-transaction-id'] as string) || req.body.transactionId;
    if (transactionId && processedTransactions.has(transactionId)) {
      res.json(processedTransactions.get(transactionId)!.result);
      return;
    }

    const now = Date.now();
    const idx = serverState.teams.findIndex((t) => t.id === incomingTeam.id);

    if (idx >= 0) {
      const existing = serverState.teams[idx];
      // Merge updates for ONLY this team, never mutating or erasing other teams
      serverState.teams[idx] = {
        ...existing,
        ...incomingTeam,
        id: existing.id, // Preserve immutable ID
        teamCode: existing.teamCode || incomingTeam.teamCode,
        updatedAt: now,
        version: (existing.version || 0) + 1,
      };
    } else {
      serverState.teams.push({
        ...incomingTeam,
        updatedAt: now,
        version: 1,
      });
    }

    await safePersistState();

    const updatedTeam = serverState.teams.find((t) => t.id === incomingTeam.id);
    const result = {
      success: true,
      team: updatedTeam,
      version: serverState.version,
      timestamp: now,
    };

    if (transactionId) {
      processedTransactions.set(transactionId, { timestamp: now, result });
    }

    // Broadcast SSE update immediately to all connected devices (<50ms)
    broadcastSSE('TEAM_UPDATED', updatedTeam);
    broadcastSSE('TEAMS_UPDATED', serverState.teams);

    res.json(result);
  });

  app.get('/api/teams/:id', (req: Request, res: Response) => {
    const team = serverState.teams.find((t) => t.id === req.params.id);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json(team);
  });

  // AUTHORITATIVE ADMIN SCORE ADJUSTMENT (Both + and - points)
  app.post('/api/teams/:id/adjust-score', requireAdmin, async (req: Request, res: Response) => {
    const teamId = req.params.id;
    const { delta, reason, round = 4, transactionId } = req.body;

    if (typeof delta !== 'number' || isNaN(delta)) {
      res.status(400).json({ error: 'Delta score value must be a valid number' });
      return;
    }

    if (transactionId && processedTransactions.has(transactionId)) {
      res.json(processedTransactions.get(transactionId)!.result);
      return;
    }

    const team = serverState.teams.find((t) => t.id === teamId);
    if (!team) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    const previousScore = team.score || 0;
    // Score can increase or decrease, but floor at 0
    team.score = Math.max(0, previousScore + delta);
    if (!team.roundScores) team.roundScores = { 1: 0, 2: 0, 3: 0, 4: 0 };
    team.roundScores[round] = Math.max(0, (team.roundScores[round] || 0) + delta);
    team.updatedAt = Date.now();
    team.version = (team.version || 0) + 1;

    if (!team.scoreAdjustments) team.scoreAdjustments = [];
    team.scoreAdjustments.push({
      delta,
      reason: reason || 'Điều chỉnh điểm từ Game Master',
      timestamp: Date.now(),
      previousScore,
      newScore: team.score,
    });

    await safePersistState();

    const result = {
      success: true,
      teamId,
      previousScore,
      newScore: team.score,
      delta,
      reason: reason || 'Game Master adjustment',
      team,
      version: serverState.version,
    };

    if (transactionId) {
      processedTransactions.set(transactionId, { timestamp: Date.now(), result });
    }

    broadcastSSE('TEAM_SCORE_ADJUSTED', { teamId, delta, newScore: team.score, team });
    broadcastSSE('TEAMS_UPDATED', serverState.teams);

    res.json(result);
  });

  // PROTECTED: Delete team
  app.delete('/api/teams/:id', requireAdmin, async (req: Request, res: Response) => {
    serverState.teams = serverState.teams.filter((t) => t.id !== req.params.id);
    await safePersistState();
    broadcastSSE('TEAMS_UPDATED', serverState.teams);
    res.json({ success: true, deletedId: req.params.id });
  });

  // PROTECTED: Reset team
  app.post('/api/teams/:id/reset', requireAdmin, async (req: Request, res: Response) => {
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
    team.round4State = undefined;
    team.updatedAt = Date.now();
    team.version = (team.version || 0) + 1;

    await safePersistState();
    broadcastSSE('TEAM_UPDATED', team);
    broadcastSSE('TEAMS_UPDATED', serverState.teams);
    res.json({ success: true, team });
  });

  // ===========================================================
  // 6. GAME CONFIG
  // ===========================================================
  app.get('/api/config', (_req: Request, res: Response) => {
    res.json(serverState.config);
  });

  // PROTECTED: Update game config
  app.post('/api/config', requireAdmin, async (req: Request, res: Response) => {
    serverState.config = { ...serverState.config, ...req.body };
    await safePersistState();
    broadcastSSE('CONFIG_UPDATED', serverState.config);
    res.json({ success: true, config: serverState.config });
  });

  // Mystery Claims
  app.post('/api/mystery-claims', async (req: Request, res: Response) => {
    const claim = req.body;
    serverState.mysteryClaims.push({ ...claim, claimedAt: Date.now() });
    await safePersistState();
    broadcastSSE('MYSTERY_CLAIMED', claim);
    res.json({ success: true });
  });

  // PROTECTED: Factory Reset
  app.post('/api/factory-reset', requireAdmin, async (_req: Request, res: Response) => {
    serverState = {
      version: (serverState.version || 0) + 1,
      teams: defaultInitialTeams.map((t) => ({ ...t, updatedAt: Date.now() })),
      config: initialGameConfig,
      mysteryCodes: [],
      mysteryClaims: [],
      questionHistory: [],
      lastUpdated: Date.now(),
    };
    await safePersistState();
    broadcastSSE('FACTORY_RESET', { timestamp: Date.now() });
    broadcastSSE('TEAMS_UPDATED', serverState.teams);
    res.json({ success: true });
  });

  // ===========================================================
  // 7. VITE MIDDLEWARE (DEV) / STATIC HOSTING (PROD)
  // ===========================================================
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

  const server = app.listen(PORT, HOST, () => {
    console.log(`[SERVER] PEK Science Quest running on http://${HOST}:${PORT}`);
  });

  return { app, server };
}

// Auto-start server when executed directly
startServer().catch((err) => {
  console.error('[SERVER] Failed to start server:', err);
  process.exit(1);
});
