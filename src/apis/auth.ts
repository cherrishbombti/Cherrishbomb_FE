import { axiosInstance } from './axiosInstance';
import type { WorkerLoginRequest, WorkerLoginResponse, OAuthLoginResponse } from '../types/auth';

// ─── Mock 플래그 ─────────────────────────────────────────────
const USE_MOCK = true;

// ─── Mock Helper ──────────────────────────────────────────────
function mockDelay<T>(data: T, ms = 800): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ─── 사회복지사 자체 로그인 (POST /api/member/login) ──────────
export async function workerLogin(body: WorkerLoginRequest): Promise<WorkerLoginResponse> {
  if (USE_MOCK) {
    // Mock: admin/1234 만 성공
    if (body.loginId === 'admin' && body.password === '1234') {
      return mockDelay({ accessToken: 'mock-worker-jwt-token', tokenType: 'Bearer' });
    }
    return Promise.reject({
      response: { status: 401, data: { message: '아이디 또는 비밀번호가 일치하지 않습니다.' } },
    });
  }
  const { data } = await axiosInstance.post<WorkerLoginResponse>('/api/member/login', body);
  return data;
}

// ─── 소셜 로그인 리다이렉트 URL ────────────────────────────────
export function getSocialLoginUrl(provider: 'google' | 'kakao'): string {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${base}/api/login/oauth2/${provider}`;
}

// ─── OAuth 인가코드 → JWT 교환 (POST /api/auth/login) ─────────
export async function exchangeOAuthCode(
  provider: string,
  code: string
): Promise<OAuthLoginResponse> {
  if (USE_MOCK) {
    return mockDelay({
      accessToken: 'mock-guardian-jwt-token',
      tokenType: 'Bearer',
      isNewUser: false,
    });
  }
  const { data } = await axiosInstance.post<OAuthLoginResponse>('/api/auth/login', {
    provider,
    code,
  });
  return data;
}
