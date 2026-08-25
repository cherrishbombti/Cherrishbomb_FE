import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getToken, setToken, clearToken } from '../utils/token';
import type { RefreshTokenResponse } from '../types/auth';

// 배포본은 Cloudflare Pages Function이, 로컬은 vite dev proxy가 /api를 백엔드로 전달하므로
// 항상 상대경로로 호출한다 (같은 오리진이라 httpOnly refresh 쿠키도 자동으로 실린다).
export const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 — JWT 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 이 요청들의 401은 세션 만료가 아닌 다른 의미이므로 재발급을 시도하지 않고 그대로 실패시킨다.
// - 로그인/회원가입: 아이디·비밀번호 오류 (재발급을 시도하면 에러 메시지를 보여줄 수 없음)
// - 로그아웃: access token이 이미 만료된 상태에서도 호출될 수 있고, 실패해도 클라이언트는
//   그대로 로그아웃 처리하므로 재발급 후 재시도가 오히려 화면 이동과 충돌한다 (PR #37 리뷰)
const SKIP_REFRESH_ENDPOINTS = ['/api/org/login', '/api/org/signup', '/api/auth/logout'];
const REFRESH_ENDPOINT = '/api/auth/refresh';
const LOGIN_PATH = '/worker/login';

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

// 이미 로그인 페이지면 다시 이동시키지 않는다 — 그러지 않으면 refresh 401을 반복 호출하며 무한 리로드된다
function redirectToLogin() {
  clearToken();
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.href = LOGIN_PATH;
  }
}

// 응답 인터셉터 — access token 만료(401) 시 재발급 후 원요청 재시도.
// 백엔드가 refresh token을 회전(rotation)하지 않기로 해, 동시에 여러 요청이 401을 맞아도
// 각자 재발급을 호출하는 방식으로 충분하다 (중복 호출 방지 큐 불필요).
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config as RetryableConfig | undefined;
    const url = config?.url ?? '';
    const skipRefresh = SKIP_REFRESH_ENDPOINTS.some((path) => url.includes(path));

    if (error.response?.status !== 401 || skipRefresh) {
      return Promise.reject(error);
    }

    // refresh 요청 자체가 401이면 로그인 안 된 상태 — 앱 부팅 시 AuthBootstrap이 조용히 처리하므로
    // 여기서 리다이렉트하면 로그인 페이지에서 refresh 401 → 리로드 → refresh 401이 반복된다
    if (url.includes(REFRESH_ENDPOINT)) {
      clearToken();
      return Promise.reject(error);
    }

    if (!config || config._retried) {
      redirectToLogin();
      return Promise.reject(error);
    }

    try {
      const { data } = await axiosInstance.post<RefreshTokenResponse>(REFRESH_ENDPOINT);
      setToken(data.token);
      config._retried = true;
      config.headers.Authorization = `Bearer ${data.token}`;
      return axiosInstance(config);
    } catch {
      redirectToLogin();
      return Promise.reject(error);
    }
  },
);
