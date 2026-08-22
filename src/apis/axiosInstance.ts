import axios from 'axios';
import { getToken, clearToken } from '../utils/token';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
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

// 인증 자체를 시도하는 요청 — 여기서의 401은 '로그인 실패'이므로 리다이렉트하지 않는다
// (리다이렉트하면 페이지가 리로드되어 에러 메시지를 보여줄 수 없음)
const AUTH_ENDPOINTS = ['/api/org/login', '/api/org/signup'];

// 응답 인터셉터 — 토큰 만료 시에만 로그인 페이지로
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url ?? '';
    const isAuthRequest = AUTH_ENDPOINTS.some((path) => url.includes(path));

    if (error.response?.status === 401 && !isAuthRequest) {
      clearToken();
      window.location.href = '/worker/login';
    }
    return Promise.reject(error);
  },
);
