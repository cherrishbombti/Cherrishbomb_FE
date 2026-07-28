import { axiosInstance } from './axiosInstance';
import type {
  WorkerLoginRequest,
  WorkerLoginResponse,
  WorkerSignupRequest,
  WorkerSignupResponse,
  OrgProfile,
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
