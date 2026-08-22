import { axiosInstance } from './axiosInstance';
import type {
  TargetsResponse,
  Target,
  TargetDetail,
  AddTargetRequest,
  FallLog,
  FallLogParams,
  PageResponse,
} from '../types/target';
import type { HealthInfo, HealthInfoPatch } from '../types/health';

// [GET] 대시보드 전체 피보호자 및 통계 조회
export const getTargets = async (): Promise<TargetsResponse> => {
  const { data } = await axiosInstance.get<TargetsResponse>('/api/targets');
  return data;
};

// [GET] 피보호자 상세 — 목록에 없는 비상연락망(contacts)을 얻기 위해 사용한다.
// 상태·기기 정보는 폴링되는 목록 쪽 값을 계속 쓰므로 여기서 가져오지 않는다.
export const getTarget = async (targetId: number): Promise<TargetDetail> => {
  const { data } = await axiosInstance.get<TargetDetail>(`/api/targets/${targetId}`);
  return data;
};

export const addTarget = async (requestData: AddTargetRequest): Promise<Target> => {
  const { data } = await axiosInstance.post<Target>('/api/targets', requestData);
  return data;
};
// [DELETE] 피보호자 삭제
export const deleteTarget = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/targets/${id}`);
};

// [GET] 낙상/센서 이력 조회 (페이지네이션 + 기간 필터)
export const getTargetLogs = async (targetId: number, params: FallLogParams = {}): Promise<PageResponse<FallLog>> => {
  const { data } = await axiosInstance.get<PageResponse<FallLog>>(`/api/targets/${targetId}/logs`, { params });
  return data;
};

// [GET] 피보호자 건강 정보 조회 (미등록 시에도 200 + 빈 값)
export const getTargetHealth = async (targetId: number): Promise<HealthInfo> => {
  const { data } = await axiosInstance.get<HealthInfo>(`/api/targets/${targetId}/health`);
  return data;
};

// [PATCH] 건강 정보 부분 수정 — 보내지 않은 필드는 유지, ""는 값 비우기
export const patchTargetHealth = async (targetId: number, body: HealthInfoPatch): Promise<HealthInfo> => {
  const { data } = await axiosInstance.patch<HealthInfo>(`/api/targets/${targetId}/health`, body);
  return data;
};
