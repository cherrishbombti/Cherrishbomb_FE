import { axiosInstance } from './axiosInstance';
import type { WorkerLoginRequest, WorkerLoginResponse, OAuthLoginResponse, WorkerSignupRequest, WorkerSignupResponse, OrgProfile } from '../types/auth';

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
  return `${base}/api/auth/${provider}`;
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

// 사회복지사 회원가입 (POST /api/org/register)
export async function workerSignup(body: WorkerSignupRequest): Promise<WorkerSignupResponse> {
  const { data } = await axiosInstance.post<WorkerSignupResponse>('/api/org/signup', body);
  return data;
}

// 로그인한 기관 정보 조회 (GET /api/org/me)
export async function getMyOrg(): Promise<OrgProfile> {
  const { data } = await axiosInstance.get<OrgProfile>('/api/org/me');
  return data;
}
