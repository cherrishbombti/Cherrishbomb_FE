// import { axiosInstance } from './axiosInstance';
// import type { TargetsResponse, AddTargetRequest, Target } from '../types/target';

// const USE_MOCK = true;

// function mockDelay<T>(data: T, ms = 600): Promise<T> {
//   return new Promise((res) => setTimeout(() => res(data), ms));
// }

// function minsAgo(m: number) {
//   return new Date(Date.now() - 1000 * 60 * m).toISOString();
// }

// // ── Mock 데이터 ──────────────────────────────────────────────
// const MOCK_TARGETS: Target[] = [
//   // 긴급 2명
//   {
//     targetId: 1, name: '김철수', age: 78,
//     address: '서울시 강남구 대치동 123',
//     phone: '010-1111-2222',
//     status: 'EMERGENCY', statusReason: '낙상 감지!',
//     battery: 78, isActive: true, lastUpdatedAt: minsAgo(2),
//   },
//   {
//     targetId: 2, name: '정미자', age: 77,
//     address: '서울시 송파구 운정동 666',
//     phone: '010-2222-3333',
//     status: 'EMERGENCY', statusReason: '센서 연결 끊김!',
//     battery: 55, isActive: true, lastUpdatedAt: minsAgo(0),
//   },
//   // 주의 2명
//   {
//     targetId: 3, name: '이영희', age: 82,
//     address: '서울시 서초구 반포동 456',
//     phone: '010-3333-4444',
//     status: 'WARNING', statusReason: '활동 부재 3시간',
//     battery: 45, isActive: true, lastUpdatedAt: minsAgo(15),
//   },
//   {
//     targetId: 4, name: '박순자', age: 75,
//     address: '서울시 송파구 잠실동 789',
//     phone: '010-4444-5555',
//     status: 'WARNING', statusReason: '배터리 부족',
//     battery: 18, isActive: true, lastUpdatedAt: minsAgo(60),
//   },
//   // 안전 6명
//   {
//     targetId: 5, name: '김영희', age: 80,
//     address: '서울시 강남구 역삼동 111',
//     phone: '010-5555-6666',
//     status: 'SAFE', statusReason: '정상',
//     battery: 92, isActive: true, lastUpdatedAt: minsAgo(5),
//   },
//   {
//     targetId: 6, name: '이순신', age: 76,
//     address: '서울시 서초구 서초동 222',
//     phone: '010-6666-7777',
//     status: 'SAFE', statusReason: '정상',
//     battery: 85, isActive: true, lastUpdatedAt: minsAgo(10),
//   },
//   {
//     targetId: 7, name: '정약용', age: 83,
//     address: '서울시 송파구 방이동 333',
//     phone: '010-7777-8888',
//     status: 'SAFE', statusReason: '정상',
//     battery: 67, isActive: true, lastUpdatedAt: minsAgo(3),
//   },
//   {
//     targetId: 8, name: '홍길동', age: 79,
//     address: '서울시 강남구 삼성동 444',
//     phone: '010-8888-9999',
//     status: 'SAFE', statusReason: '정상',
//     battery: 73, isActive: true, lastUpdatedAt: minsAgo(7),
//   },
//   {
//     targetId: 9, name: '최민수', age: 80,
//     address: '서울시 서초구 방배동 555',
//     phone: '010-9999-0000',
//     status: 'SAFE', statusReason: '정상',
//     battery: 88, isActive: true, lastUpdatedAt: minsAgo(12),
//   },
//   {
//     targetId: 10, name: '강감찬', age: 81,
//     address: '서울시 강남구 대치동 777',
//     phone: '010-0000-1111',
//     status: 'SAFE', statusReason: '정상',
//     battery: 91, isActive: true, lastUpdatedAt: minsAgo(8),
//   },
// ];

// // GET /api/targets
// export async function getTargets(): Promise<TargetsResponse> {
//   if (USE_MOCK) {
//     const targets = [...MOCK_TARGETS];
//     return mockDelay({
//       summary: {
//         total: targets.length,
//         safe: targets.filter((t) => t.status === 'SAFE').length,
//         warning: targets.filter((t) => t.status === 'WARNING').length,
//         emergency: targets.filter((t) => t.status === 'EMERGENCY').length,
//       },
//       targets,
//     });
//   }
//   const { data } = await axiosInstance.get<TargetsResponse>('/api/targets');
//   return data;
// }

// // POST /api/targets
// export async function addTarget(body: AddTargetRequest): Promise<Target> {
//   if (USE_MOCK) {
//     const newTarget: Target = {
//       targetId: Date.now(),
//       ...body,
//       status: 'SAFE',
//       statusReason: '정상',
//       battery: 100,
//       isActive: false,
//       lastUpdatedAt: new Date().toISOString(),
//     };
//     MOCK_TARGETS.push(newTarget);
//     return mockDelay(newTarget);
//   }
//   const { data } = await axiosInstance.post<Target>('/api/targets', body);
//   return data;
// }


import { axiosInstance } from './axiosInstance';
import type { TargetsResponse, Target, AddTargetRequest } from '../types/target';

// [GET] 대시보드 전체 피보호자 및 통계 조회
export const getTargets = async (): Promise<TargetsResponse> => {
  const { data } = await axiosInstance.get<TargetsResponse>('/api/targets');
  return data;
};

export const addTarget = async (requestData: AddTargetRequest): Promise<Target> => {
  const { data } = await axiosInstance.post<Target>('/api/targets', requestData);
  return data;
};