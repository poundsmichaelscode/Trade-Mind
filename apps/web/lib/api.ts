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
  session_tag?: number | string | null;
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

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  user: User;
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const ACCESS_KEY = 'tm_token';
const REFRESH_KEY = 'tm_refresh_token';

async function parseResponseError(res: Response, fallback: string) {
  const contentType = res.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return data?.detail || data?.message || data?.error || fallback;
    }

    const text = await res.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}

function validateAuthResponse(data: any, fallback: string): AuthResponse {
  if (!data?.access_token || !data?.refresh_token || !data?.user) {
    throw new Error(fallback);
  }

  return data as AuthResponse;
}

export async function persistSessionCookies(accessToken: string, refreshToken: string) {
  const res = await fetch('/api/auth/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ accessToken, refreshToken }),
  });

  if (!res.ok) {
    throw new Error(await parseResponseError(res, 'Failed to persist session cookies'));
  }
}

export async function clearSessionCookies() {
  try {
    await fetch('/api/auth/clear', {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    if (typeof document !== 'undefined') {
      document.cookie = 'tm_client=; path=/; max-age=0; samesite=lax';
    }
  }
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  document.cookie = `tm_client=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null;
}

export function getRefreshToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null;
}

export function clearAuth() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  document.cookie = 'tm_client=; path=/; max-age=0; samesite=lax';
}

export function apiBase() {
  return API_URL;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  if (!res.ok) {
    throw new Error(await parseResponseError(res, 'Login failed'));
  }

  const data = await res.json();
  return validateAuthResponse(data, 'Login succeeded but auth tokens were missing.');
}

export async function registerUser(
  full_name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  if (!res.ok) {
    throw new Error(await parseResponseError(res, 'Signup failed'));
  }

  const data = await res.json();
  return validateAuthResponse(data, 'Signup succeeded but auth tokens were missing.');
}

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
    await clearSessionCookies();
    return null;
  }

  const raw = await res.json();
  const data = validateAuthResponse(raw, 'Session refresh failed because tokens were missing.');

  setAuthTokens(data.access_token, data.refresh_token);
  await persistSessionCookies(data.access_token, data.refresh_token);

  return data.access_token;
}

export async function apiFetch<T = any>(
  path: string,
  init: RequestInit = {},
  retry = true
): Promise<T> {
  const headers = new Headers(init.headers || {});

  if (
    !headers.has('Content-Type') &&
    !(init.body instanceof FormData) &&
    init.method &&
    init.method !== 'GET'
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (res.status === 401 && retry && getRefreshToken()) {
    const nextAccess = await refreshAccessToken();

    if (nextAccess) {
      headers.set('Authorization', `Bearer ${nextAccess}`);
      res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers,
      });
    }
  }

  if (!res.ok) {
    throw new Error(await parseResponseError(res, 'Request failed'));
  }

  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }

  return res as T;
}

export async function uploadTradeImage(file: File) {
  const form = new FormData();
  form.append('file', file);

  return apiFetch<{ url: string; name: string; note: string; provider: string }>(
    '/uploads/trade-image',
    {
      method: 'POST',
      body: form,
    }
  );
}

export async function downloadProtectedFile(path: string, filename: string) {
  let token = getToken();

  if (!token && getRefreshToken()) {
    token = await refreshAccessToken();
  }

  if (!token) {
    throw new Error('You are not logged in. Please sign in again.');
  }

  let res = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 && getRefreshToken()) {
    const nextAccess = await refreshAccessToken();

    if (!nextAccess) {
      throw new Error('Your session expired. Please sign in again.');
    }

    res = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${nextAccess}`,
      },
    });
  }

  if (!res.ok) {
    throw new Error(await parseResponseError(res, 'Download failed'));
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}

export async function downloadTradesExcel() {
  return downloadProtectedFile('/exports/trades?format=xlsx', 'trademind-trades.xlsx');
}

export async function downloadTradesCsv() {
  return downloadProtectedFile('/exports/trades?format=csv', 'trademind-trades.csv');
}