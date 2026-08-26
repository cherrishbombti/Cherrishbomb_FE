import { axiosInstance, refreshOnce } from './axiosInstance';
import type {
  WorkerLoginRequest,
  WorkerLoginResponse,
  WorkerSignupRequest,
  WorkerSignupResponse,
  OrgProfile,
  RefreshTokenResponse,
} from '../types/auth';

// 사회복지사 로그인 (POST /api/org/login) — 백엔드가 토큰 문자열 하나만 반환
export async function workerLogin(body: WorkerLoginRequest): Promise<WorkerLoginResponse> {
  const { data } = await axiosInstance.post<WorkerLoginResponse>('/api/org/login', body);
  return data;
}

// 사회복지사 회원가입 (POST /api/org/signup)
export async function workerSignup(body: WorkerSignupRequest): Promise<WorkerSignupResponse> {
  const { data } = await axiosInstance.post<WorkerSignupResponse>('/api/org/signup', body);
  return data;
}

// 로그인한 기관 정보 조회 (GET /api/org/me)
export async function getMyOrg(): Promise<OrgProfile> {
  const { data } = await axiosInstance.get<OrgProfile>('/api/org/me');
  return data;
}

// httpOnly 쿠키의 refresh token으로 새 access token 발급 (POST /api/auth/refresh).
// axiosInstance의 401 재발급 인터셉터와 같은 single-flight 큐(refreshOnce)를 타야,
// 부팅 시 복구 호출과 다른 요청의 401 재발급이 동시에 겹쳐도 refresh가 한 번만 나간다.
export async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const token = await refreshOnce();
  return { token };
}

// 서버에 저장된 refresh token 무효화 (POST /api/auth/logout) — 호출하지 않으면 로그아웃 후에도 재발급이 가능한 상태로 남는다
export async function logout(): Promise<void> {
  await axiosInstance.post('/api/auth/logout');
}
