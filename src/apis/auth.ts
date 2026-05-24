import { axiosInstance } from './axiosInstance';
import type { WorkerLoginRequest, WorkerLoginResponse, OAuthLoginResponse } from '../types/auth';

const USE_MOCK = false;

function mockDelay<T>(data: T, ms = 800): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// 사회복지사 로그인 (POST /api/org/login)
export async function workerLogin(body: WorkerLoginRequest): Promise<WorkerLoginResponse> {

  // 백엔드가 토큰 문자열 하나만 반환
  const { data } = await axiosInstance.post<WorkerLoginResponse>('/api/org/login', body);
  return data;
}

export function getSocialLoginUrl(provider: 'google' | 'kakao'): string {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${base}/api/login/oauth2/${provider}`;
}

export async function exchangeOAuthCode(
  provider: string,
  code: string
): Promise<OAuthLoginResponse> {
  if (USE_MOCK) {
    return mockDelay({ accessToken: 'mock-guardian-jwt-token', tokenType: 'Bearer', isNewUser: false });
  }
  const { data } = await axiosInstance.post<OAuthLoginResponse>('/api/auth/login', { provider, code });
  return data;
}
