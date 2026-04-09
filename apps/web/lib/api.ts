export type User = {
  id: number;
  full_name: string;
  email: string;
  subscription_plan: 'free' | 'pro';
  risk_preference_percent: number;
  trading_style?: string | null;
  timezone: string;
  subscription_status?: string | null;
};

export type Trade = {
  id: number;
  asset: string;
  market_type: string;
  direction: string;
  entry_price: number;
  exit_price: number;
  position_size: number;
  stop_loss?: number | null;
  take_profit?: number | null;
  open_time: string;
  close_time: string;
  session_tag?: string | null;
  setup_tag?: string | null;
  notes?: string | null;
  image_url?: string | null;
  profit_loss?: number | null;
  profit_loss_percent?: number | null;
  risk_amount?: number | null;
  reward_amount?: number | null;
  risk_reward_ratio?: number | null;
  holding_minutes?: number | null;
  outcome?: string | null;
};

export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  type: string;
  read: boolean;
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const ACCESS_KEY = 'tm_token';
const REFRESH_KEY = 'tm_refresh_token';

export function setAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}
export function setToken(token: string) { if (typeof window !== 'undefined') localStorage.setItem(ACCESS_KEY, token); }
export function getToken() { return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null; }
export function getRefreshToken() { return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null; }
export function clearToken() { if (typeof window !== 'undefined') localStorage.removeItem(ACCESS_KEY); }
export function clearAuth() { if (typeof window !== 'undefined') { localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); } }
export function apiBase() { return API_URL; }

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    clearAuth();
    return null;
  }
  const data = await res.json();
  setAuthTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401 && retry && getRefreshToken()) {
    const nextAccess = await refreshAccessToken();
    if (nextAccess) {
      headers.set('Authorization', `Bearer ${nextAccess}`);
      res = await fetch(`${API_URL}${path}`, { ...init, headers });
    }
  }
  if (!res.ok) {
    let message = 'Request failed';
    try { const data = await res.json(); message = data.detail || message; } catch {}
    throw new Error(message);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res as any;
}

export async function uploadTradeImage(file: File) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch<{ url: string; name: string; note: string; provider: string }>('/uploads/trade-image', { method: 'POST', body: form });
}
