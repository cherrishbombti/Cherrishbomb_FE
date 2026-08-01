import { axiosInstance } from './axiosInstance';
import type {
  TargetsResponse,
  Target,
  AddTargetRequest,
  FallLog,
  FallLogParams,
  PageResponse,
} from '../types/target';

// [GET] 대시보드 전체 피보호자 및 통계 조회
export const getTargets = async (): Promise<TargetsResponse> => {
  const { data } = await axiosInstance.get<TargetsResponse>('/api/targets');
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
export const getTargetLogs = async (
  targetId: number,
  params: FallLogParams = {}
): Promise<PageResponse<FallLog>> => {
  const { data } = await axiosInstance.get<PageResponse<FallLog>>(
    `/api/targets/${targetId}/logs`,
    { params }
  );
  return data;
};
