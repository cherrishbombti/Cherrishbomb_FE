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

// 응답 인터셉터 — 401 시 로그인 페이지로
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      // 현재 위치 기준으로 역할에 맞는 로그인 페이지로
      const isGuardian = window.location.pathname.startsWith('/guardian');
      window.location.href = isGuardian ? '/guardian/login' : '/worker/login';
    }
    return Promise.reject(error);
  }
);
