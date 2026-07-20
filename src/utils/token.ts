// 인증 토큰 저장/조회 — localStorage 키를 한 곳에서 관리
const TOKEN_KEY = 'accessToken';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);
