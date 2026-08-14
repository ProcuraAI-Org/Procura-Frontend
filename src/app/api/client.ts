/**
 * Backend API client – Procura-Backend (Agent Logic, etc.)
 */
const getBaseUrl = (): string => {
  const env = (import.meta as unknown as { env?: Record<string, string> }).env;
  return env?.VITE_API_URL ?? "http://localhost:4000";
};

const AUTH_TOKEN_KEY = "procura_auth_token";

/** Get stored JWT (from Settings login). Used when backend has REQUIRE_AUTH=true. */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/** Headers to add to requests when token is present (for protected routes). */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface AgentRunPayload {
  taskId?: string;
  description?: string;
  totalBudget: number;
  maxPerTool?: number;
  allowlist?: string[];
  denylist?: string[];
  requireHumanApproval?: boolean;
  encryptionEnabled?: boolean;
}

export interface AgentDecision {
  selectedTool: string;
  rejectedTools: { name: string; reason: string }[];
  reason: string;
  confidenceScore: number;
  estimatedCost: number;
}

export interface AgentRunResponse {
  intent: {
    taskId: string;
    description: string;
    totalBudget: number;
    maxPerTool: number;
    allowlist: string[];
    denylist: string[];
    requireHumanApproval: boolean;
    encryptionEnabled: boolean;
  };
  decision: AgentDecision;
  state: "DECIDED" | "POLICY_BLOCKED";
  /** Present when state is DECIDED; used for x402 payment. */
  selectedToolEndpoint?: string;
  /** Network/chain for this payment (from API). */
  selectedToolNetwork?: string;
}

export interface PaymentExecutePayload {
  taskId: string;
  intentId?: string;
  toolName: string;
  endpoint: string;
  amount: number;
  maxPerTool: number;
  remainingBudget: number;
  allowlist?: string[];
  denylist?: string[];
}

export interface PaymentResult {
  success: boolean;
  tool: string;
  amount: number;
  txHash?: string;
  data?: unknown;
  llmReport?: string;
  error?: string;
}

// --- Dashboard ---

export interface DashboardOverviewResponse {
  userId: string;
  stats: {
    totalSpendToday: number;
    activeJobs: number;
    pendingAuthorizations: number;
    dailyBudgetCap: number;
    budgetRemaining: number;
  };
  spendByTool: Array<{ tool: string; amount: number }>;
  policy: { dailySpendPct: number; anyHumanApprovalRequired: boolean };
  currentTask: null | {
    taskId: string;
    state: string;
    title: string;
    estimatedCost: number;
    totalBudget: number;
    updatedAt: string;
  };
  recentActivity: Array<{
    type: "payment" | "event";
    taskId: string | null;
    title: string;
    detail: string;
    createdAt: string;
    json: Record<string, unknown>;
  }>;
}

export async function getDashboardOverview(): Promise<DashboardOverviewResponse> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/dashboard/overview`, { headers: { ...getAuthHeaders() } });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Dashboard overview failed");
  return data as DashboardOverviewResponse;
}

export interface DashboardPayment {
  id: string;
  taskId: string | null;
  tool: string;
  amount: number;
  success: boolean;
  error?: string;
  txHash?: string;
  createdAt: string;
}

export async function getDashboardPayments(limit?: number): Promise<DashboardPayment[]> {
  const base = getBaseUrl();
  const url = limit != null ? `${base}/api/dashboard/payments?limit=${limit}` : `${base}/api/dashboard/payments`;
  const res = await fetch(url, { headers: { ...getAuthHeaders() } });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "List payments failed");
  return data as DashboardPayment[];
}

export interface DashboardEvent {
  id: string;
  taskId: string | null;
  event: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export async function getDashboardEvents(limit?: number): Promise<DashboardEvent[]> {
  const base = getBaseUrl();
  const url = limit != null ? `${base}/api/dashboard/events?limit=${limit}` : `${base}/api/dashboard/events`;
  const res = await fetch(url, { headers: { ...getAuthHeaders() } });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "List events failed");
  return data as DashboardEvent[];
}

export interface AgentApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export async function runAgent(payload: AgentRunPayload): Promise<AgentRunResponse> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/agent/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Object.assign(new Error((data as AgentApiError).message ?? "Agent request failed"), {
      code: (data as AgentApiError).code,
      details: (data as AgentApiError).details,
    });
  }
  return data as AgentRunResponse;
}

export async function executePayment(payload: PaymentExecutePayload): Promise<PaymentResult> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/payment/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Object.assign(new Error((data as { error?: string }).error ?? "Payment failed"), {
      ...data,
    });
  }
  return data as PaymentResult;
}

// --- Faucet (USDC) ---

export interface FaucetStatusResponse {
  success: boolean;
  address: string;
  token: string;
  balance: string;
  canMint: boolean;
  nextAvailableAt: string | null;
}

export interface FaucetMintResponse {
  success: boolean;
  to: string;
  token: string;
  amount: string;
  txHash: string;
  nextAvailableAt: string;
  error?: string;
}

export async function getUsdcFaucetStatus(address: string): Promise<FaucetStatusResponse> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/faucet/usdc/status?address=${encodeURIComponent(address)}`);
  const data = await res.json();
  if (!res.ok) {
    throw Object.assign(new Error((data as { error?: string }).error ?? "Faucet status failed"), data);
  }
  return data as FaucetStatusResponse;
}

export async function mintUsdcFromFaucet(address: string): Promise<FaucetMintResponse> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/faucet/usdc/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Object.assign(new Error((data as { error?: string }).error ?? "Faucet mint failed"), data);
  }
  return data as FaucetMintResponse;
}

// --- AP2 Authorization + Settlement ---

export interface AP2Intent {
  intentId: string;
  taskId: string;
  userId: string;
  tool: string;
  amount: number;
  totalBudget: number;
  perToolCap: number;
  allowlist: string[];
  denylist: string[];
  requireHumanApproval: boolean;
  encryptionEnabled: boolean;
  createdAt: string;
  status: string;
}

export interface AuthorizationRecord {
  authorizationId: string;
  intentId: string;
  policyChecks: { rule: string; passed: boolean; message: string }[];
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export interface SettlementReceipt {
  receiptId: string;
  intentId: string;
  authorizationId: string;
  settlementId: string;
  tool: string;
  amount: number;
  conditionResult: boolean;
  txHash?: string;
  timestamp: string;
}

export async function createAp2Intent(payload: {
  taskId: string;
  userId?: string;
  tool: string;
  amount: number;
  totalBudget: number;
  perToolCap: number;
  allowlist?: string[];
  denylist?: string[];
  requireHumanApproval?: boolean;
  encryptionEnabled?: boolean;
}): Promise<AP2Intent> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/ap2/intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskId: payload.taskId,
      userId: payload.userId ?? "frontend",
      tool: payload.tool,
      amount: payload.amount,
      totalBudget: payload.totalBudget,
      perToolCap: payload.perToolCap,
      allowlist: payload.allowlist ?? [],
      denylist: payload.denylist ?? [],
      requireHumanApproval: payload.requireHumanApproval ?? false,
      encryptionEnabled: payload.encryptionEnabled ?? false,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "AP2 intent failed");
  return data as AP2Intent;
}

export async function authorizeAp2Intent(intentId: string): Promise<AuthorizationRecord> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/ap2/authorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intentId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "AP2 authorize failed");
  return data as AuthorizationRecord;
}

export async function verifyAp2Condition(intentId: string, outputData: unknown): Promise<{ result: boolean }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/ap2/verify-condition`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intentId, outputData }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "AP2 verify-condition failed");
  return data as { result: boolean };
}

export async function settleAp2Intent(intentId: string): Promise<{ settlementId: string; txHash?: string; success: boolean; error?: string }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/ap2/settle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intentId }),
  });
  const data = await res.json();
  if (!res.ok) return data as { success: false; error: string };
  return data as { settlementId: string; txHash?: string; success: boolean };
}

export async function getAp2Receipt(intentId: string): Promise<SettlementReceipt> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/ap2/receipt/${encodeURIComponent(intentId)}`);
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "AP2 receipt failed");
  return data as SettlementReceipt;
}

// --- BITE Conditional Encryption ---

export async function biteEncrypt(intentId: string, payload: Record<string, unknown>): Promise<{ intentId: string; encrypted: true; createdAt: string }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/bite/encrypt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intentId, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "BITE encrypt failed");
  return data as { intentId: string; encrypted: true; createdAt: string };
}

export async function biteDecrypt(intentId: string): Promise<{ intentId: string; decrypted: Record<string, unknown>; conditionMet: true }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/bite/decrypt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intentId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "BITE decrypt failed");
  return data as { intentId: string; decrypted: Record<string, unknown>; conditionMet: true };
}

// --- Orchestrator (Backend Orchestration Engine) ---

export interface OrchestratorTask {
  taskId: string;
  userId: string;
  state: string;
  description?: string;
  totalBudget?: number;
  maxPerTool?: number;
  allowlist?: string[];
  denylist?: string[];
  requireHumanApproval?: boolean;
  encryptionEnabled?: boolean;
  intent?: AgentRunResponse["intent"];
  decision?: AgentDecision;
  selectedToolEndpoint?: string;
  selectedToolNetwork?: string;
  intentId?: string;
  authorizationId?: string;
  settlementId?: string;
  receiptId?: string;
  paymentResult?: PaymentResult;
  retries: number;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrchestratorTaskStatus {
  taskId: string;
  state: string;
  stepProgress: string;
  intentId?: string;
  selectedTool?: string;
  error?: string;
  updatedAt: string;
}

const TERMINAL_STATES = ["COMPLETED", "POLICY_BLOCKED", "PAYMENT_FAILED", "CONDITION_FAILED", "SETTLEMENT_FAILED"];

export function isOrchestratorTerminalState(state: string): boolean {
  return TERMINAL_STATES.includes(state);
}

export async function createOrchestratorTask(payload: {
  userId?: string;
  description?: string;
  totalBudget: number;
  maxPerTool?: number;
  allowlist?: string[];
  denylist?: string[];
  requireHumanApproval?: boolean;
  encryptionEnabled?: boolean;
}): Promise<OrchestratorTask> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Create task failed");
  return data as OrchestratorTask;
}

export async function executeOrchestratorStep(taskId: string): Promise<OrchestratorTask> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/tasks/${encodeURIComponent(taskId)}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Execute step failed");
  return data as OrchestratorTask;
}

export async function getOrchestratorTask(taskId: string): Promise<OrchestratorTask> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/tasks/${encodeURIComponent(taskId)}`, { headers: { ...getAuthHeaders() } });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Get task failed");
  return data as OrchestratorTask;
}

export async function getOrchestratorTaskStatus(taskId: string): Promise<OrchestratorTaskStatus> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/tasks/${encodeURIComponent(taskId)}/status`);
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Get status failed");
  return data as OrchestratorTaskStatus;
}

/** List tasks. Pass "frontend" (default) to match create; pass "system" or empty to get all (backend returns all when userId is system). */
export async function listOrchestratorTasks(userId?: string): Promise<{ tasks: OrchestratorTask[] }> {
  const base = getBaseUrl();
  const uid = userId ?? "frontend";
  const qs = uid === "" ? "" : `?userId=${encodeURIComponent(uid)}`;
  const res = await fetch(`${base}/api/tasks${qs}`, { headers: { ...getAuthHeaders() } });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "List tasks failed");
  return data as { tasks: OrchestratorTask[] };
}

// --- Auth (JWT) ---

export async function authLogin(payload: {
  email: string;
  password: string;
}): Promise<{ token: string; userId: string; expiresIn: number }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: payload.email.trim(), password: payload.password }),
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Login failed");
  return data as { token: string; userId: string; expiresIn: number };
}

export async function authSignup(payload: {
  email: string;
  password: string;
  fullName?: string;
}): Promise<{ token: string; userId: string; expiresIn: number }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password,
      fullName: payload.fullName ?? "",
    }),
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Signup failed");
  return data as { token: string; userId: string; expiresIn: number };
}

export async function authGoogle(idToken: string): Promise<{ token: string; userId: string; expiresIn: number }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) throw new Error(data.error ?? "Google sign-in failed");
  return data as { token: string; userId: string; expiresIn: number };
}

export async function authMe(): Promise<{ userId: string }> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/auth/me`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Not authenticated");
  return data as { userId: string };
}

// --- Backend Wallet (x402 signing) ---

export interface WalletStatusResponse {
  configured: boolean;
  address?: string;
  message: string;
}

export async function getWalletStatus(): Promise<WalletStatusResponse> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/wallet/status`, { headers: getAuthHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Wallet status failed");
  return data as WalletStatusResponse;
}
