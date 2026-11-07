/**
 * Comprehensive Backend Step 1 Test Suite
 * Tests SSE, Admin Auth, Atomic Persistence, Idempotency, and Concurrent Multi-Team Updates
 */

const BASE_URL = 'http://localhost:3000';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runBackendTests() {
  console.log('====================================================');
  console.log('BẮT ĐẦU KIỂM THỬ BƯỚC 1: NÂNG CẤP BACKEND SERVER.TS');
  console.log('====================================================\n');

  // --- TEST 1: Health & Server State ---
  console.log('--- TEST 1: Health Endpoint & Versioning ---');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert(healthRes.status === 200, 'Health endpoint returns 200');
  const healthData = await healthRes.json();
  assert(healthData.status === 'ok', 'Health status is ok');
  assert(typeof healthData.version === 'number', `Health reports state version: ${healthData.version}`);
  console.log(`Current server version: ${healthData.version}, total teams: ${healthData.totalTeams}`);

  // --- TEST 2: Security & Protection of Admin APIs ---
  console.log('\n--- TEST 2: Security & Admin Authentication ---');
  // Attempt unauthorized factory reset
  const unauthReset = await fetch(`${BASE_URL}/api/factory-reset`, { method: 'POST' });
  assert(unauthReset.status === 401, `Unauthorized factory-reset blocked with 401 (got ${unauthReset.status})`);

  // Attempt unauthorized config change
  const unauthConfig = await fetch(`${BASE_URL}/api/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameTitle: 'Hacked' }),
  });
  assert(unauthConfig.status === 401, `Unauthorized config change blocked with 401 (got ${unauthConfig.status})`);

  // Attempt unauthorized score adjustment
  const unauthAdjust = await fetch(`${BASE_URL}/api/teams/team_alpha_01/adjust-score`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delta: 50 }),
  });
  assert(unauthAdjust.status === 401, `Unauthorized score adjustment blocked with 401 (got ${unauthAdjust.status})`);

  // Login with invalid PIN
  const wrongLogin = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: 'WRONG_PIN' }),
  });
  assert(wrongLogin.status === 401, `Login with invalid PIN rejected (got ${wrongLogin.status})`);

  // Login with valid PIN (PEK2026)
  const validLogin = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: 'PEK2026' }),
  });
  assert(validLogin.status === 200, 'Login with valid PIN succeeds (200 OK)');
  const loginData = await validLogin.json();
  assert(!!loginData.token, 'Received admin session bearer token');
  const adminToken = loginData.token;
  console.log(`Generated Admin Token: ${adminToken.slice(0, 18)}...`);

  // Verify Admin Token
  const verifyRes = await fetch(`${BASE_URL}/api/admin/verify`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(verifyRes.status === 200, 'Admin verification endpoint validates token (200 OK)');

  // Verify direct header PIN support (x-admin-pin)
  const verifyPinRes = await fetch(`${BASE_URL}/api/admin/verify`, {
    headers: { 'x-admin-pin': 'PEK2026' },
  });
  assert(verifyPinRes.status === 200, 'Admin verification validates x-admin-pin header (200 OK)');

  // --- TEST 3: Authoritative Admin Score Adjustment (Cộng & Trừ điểm) ---
  console.log('\n--- TEST 3: Authoritative Score Adjustment (Trừ & Cộng Điểm) ---');
  // First ensure team_alpha_01 has a baseline score (e.g. 50)
  await fetch(`${BASE_URL}/api/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'team_alpha_01', score: 50, roundScores: { 1: 50, 2: 0, 3: 0, 4: 0 } }),
  });

  // Admin deducts 15 points
  const deductRes = await fetch(`${BASE_URL}/api/teams/team_alpha_01/adjust-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ delta: -15, reason: 'Phạt trừ điểm vi phạm thời gian Vòng 1', round: 1 }),
  });
  assert(deductRes.status === 200, 'Admin deduct score succeeded');
  const deductData = await deductRes.json();
  assert(deductData.previousScore === 50, `Previous score was 50, got ${deductData.previousScore}`);
  assert(deductData.newScore === 35, `New score successfully reduced to 35, got ${deductData.newScore}`);
  assert(deductData.team.scoreAdjustments.length > 0, 'Score adjustment audit log created');

  // Admin adds 25 points
  const addRes = await fetch(`${BASE_URL}/api/teams/team_alpha_01/adjust-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ delta: 25, reason: 'Thưởng trả lời xuất sắc', round: 1 }),
  });
  const addData = await addRes.json();
  assert(addData.newScore === 60, `New score successfully increased to 60, got ${addData.newScore}`);

  // --- TEST 4: Idempotency (Transaction Deduplication) ---
  console.log('\n--- TEST 4: Transaction Deduplication (Anti-Spam / Idempotency) ---');
  const txId = `tx-test-${Date.now()}`;
  const firstTxRes = await fetch(`${BASE_URL}/api/teams/team_alpha_01/adjust-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ delta: 10, reason: 'Idempotency test', transactionId: txId }),
  });
  const firstTxData = await firstTxRes.json();
  assert(firstTxData.newScore === 70, `First execution score is 70, got ${firstTxData.newScore}`);

  // Send duplicate request with exact same transactionId
  const dupTxRes = await fetch(`${BASE_URL}/api/teams/team_alpha_01/adjust-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ delta: 10, reason: 'Idempotency test', transactionId: txId }),
  });
  const dupTxData = await dupTxRes.json();
  assert(dupTxData.newScore === 70, `Duplicate request rejected double addition, returned cached score 70!`);

  // --- TEST 5: Concurrent Multi-Team Updates (3 Teams Simultaneously) ---
  console.log('\n--- TEST 5: Concurrent Updates from 3 Teams Simultaneously ---');
  const t1Promise = fetch(`${BASE_URL}/api/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'team_alpha_01',
      score: 110,
      roundScores: { 1: 110 },
      answersHistory: [{ q: 'q1', ans: 'A', timestamp: Date.now() }],
    }),
  });

  const t2Promise = fetch(`${BASE_URL}/api/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'team_beta_02',
      score: 120,
      roundScores: { 1: 120 },
      answersHistory: [{ q: 'q2', ans: 'B', timestamp: Date.now() }],
    }),
  });

  const t3Promise = fetch(`${BASE_URL}/api/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'team_gamma_03',
      score: 130,
      roundScores: { 1: 130 },
      answersHistory: [{ q: 'q3', ans: 'C', timestamp: Date.now() }],
    }),
  });

  const [t1Res, t2Res, t3Res] = await Promise.all([t1Promise, t2Promise, t3Promise]);
  assert(t1Res.status === 200 && t2Res.status === 200 && t3Res.status === 200, 'All 3 concurrent team updates succeeded');

  // Verify all 3 teams preserved their own updates without cross-overwrites
  const allTeamsRes = await fetch(`${BASE_URL}/api/teams`);
  const allTeams = await allTeamsRes.json();
  const team1 = allTeams.find((t: any) => t.id === 'team_alpha_01');
  const team2 = allTeams.find((t: any) => t.id === 'team_beta_02');
  const team3 = allTeams.find((t: any) => t.id === 'team_gamma_03');

  assert(team1.score === 110, `Team Alpha score is 110, got ${team1.score}`);
  assert(team2.score === 120, `Team Beta score is 120, got ${team2.score}`);
  assert(team3.score === 130, `Team Gamma score is 130, got ${team3.score}`);
  assert(team1.answersHistory[0]?.q === 'q1', 'Team Alpha answers preserved');
  assert(team2.answersHistory[0]?.q === 'q2', 'Team Beta answers preserved');
  assert(team3.answersHistory[0]?.q === 'q3', 'Team Gamma answers preserved');

  // --- TEST 6: Server-Sent Events (SSE) Stream ---
  console.log('\n--- TEST 6: Server-Sent Events (SSE) Real-Time Stream ---');
  let sseReceivedConnected = false;
  let sseReceivedUpdate = false;

  const controller = new AbortController();
  const sseResponse = await fetch(`${BASE_URL}/api/events?role=student`, {
    signal: controller.signal,
  });
  assert(sseResponse.status === 200, 'SSE connection established (200 OK)');
  assert(sseResponse.headers.get('content-type')?.includes('text/event-stream') || false, 'SSE returns text/event-stream');

  const reader = sseResponse.body?.getReader();
  const decoder = new TextDecoder();

  // Read the initial connected event
  const readPromise = (async () => {
    try {
      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;
        const text = decoder.decode(value);
        if (text.includes('event: connected')) {
          sseReceivedConnected = true;
        }
        if (text.includes('event: TEAM_UPDATED') || text.includes('event: TEAMS_UPDATED')) {
          sseReceivedUpdate = true;
          break; // Got the update event, test passed!
        }
      }
    } catch {
      // Stream aborted at end of test
    }
  })();

  // Wait 100ms for SSE stream handshake
  await new Promise((r) => setTimeout(r, 100));

  // Trigger a team update while the SSE client is listening
  await fetch(`${BASE_URL}/api/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'team_alpha_01', score: 115 }),
  });

  // Wait up to 1500ms for event to arrive
  await new Promise((r) => setTimeout(r, 800));
  controller.abort();
  await readPromise;

  assert(sseReceivedConnected, 'Received initial SSE "connected" handshake');
  assert(sseReceivedUpdate, 'Received real-time SSE "TEAM_UPDATED / TEAMS_UPDATED" event!');

  // --- TEST 7: Atomic File Persistence ---
  console.log('\n--- TEST 7: Atomic File Persistence Check ---');
  const fs = await import('fs');
  const path = await import('path');
  const statePath = path.join(process.cwd(), 'data', 'tournament_state.json');
  assert(fs.existsSync(statePath), 'data/tournament_state.json exists on disk');
  const rawFile = fs.readFileSync(statePath, 'utf-8');
  const parsedFile = JSON.parse(rawFile);
  assert(typeof parsedFile.version === 'number', `File version persisted: ${parsedFile.version}`);
  assert(parsedFile.teams.length >= 3, `Teams persisted in file: ${parsedFile.teams.length}`);

  console.log('\n====================================================');
  console.log('🎉 TOÀN BỘ 7/7 KIỂM THỬ BACKEND BƯỚC 1 ĐẠT 100%!');
  console.log('====================================================');
}

runBackendTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
