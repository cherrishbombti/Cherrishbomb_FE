import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getToken, setToken, clearToken } from '../utils/token';

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

// 인증 자체를 시도하는 요청 — 여기서의 401은 '로그인 실패'이므로 재발급을 시도하지 않는다
// (재발급을 시도하면 페이지가 리로드되어 에러 메시지를 보여줄 수 없음)
const AUTH_ENDPOINTS = ['/api/org/login', '/api/org/signup'];
const REFRESH_ENDPOINT = '/api/auth/refresh';

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

// 응답 인터셉터 — access token 만료(401) 시 재발급 후 원요청 재시도.
// 백엔드가 refresh token을 회전(rotation)하지 않기로 해, 동시에 여러 요청이 401을 맞아도
// 각자 재발급을 호출하는 방식으로 충분하다 (중복 호출 방지 큐 불필요).
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config as RetryableConfig | undefined;
    const url = config?.url ?? '';
    const isAuthRequest = AUTH_ENDPOINTS.some((path) => url.includes(path));
    const isRefreshRequest = url.includes(REFRESH_ENDPOINT);

    if (error.response?.status !== 401 || isAuthRequest) {
      return Promise.reject(error);
    }

    if (isRefreshRequest || !config || config._retried) {
      clearToken();
      window.location.href = '/worker/login';
      return Promise.reject(error);
    }

    try {
      const { data } = await axiosInstance.post<{ token: string }>(REFRESH_ENDPOINT);
      setToken(data.token);
      config._retried = true;
      config.headers.Authorization = `Bearer ${data.token}`;
      return axiosInstance(config);
    } catch {
      clearToken();
      window.location.href = '/worker/login';
      return Promise.reject(error);
    }
  },
);
