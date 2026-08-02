import axios from 'axios';

// 백엔드 공통 에러 응답: { status, code, message }
interface ApiErrorBody {
  status?: number;
  code?: string;
  message?: string;
}

// 에러 코드 → 사용자에게 보여줄 문구 (백엔드 원문 메시지를 그대로 노출하지 않음)
const CODE_MESSAGE: Record<string, string> = {
  A001: '아이디 또는 비밀번호를 확인해주세요.',
  O001: '기관 정보를 찾을 수 없습니다.',
  O002: '이미 사용 중인 아이디입니다.',
  M001: '존재하지 않는 대상입니다.',
  M002: '대상 정보를 처리하지 못했습니다.',
  M003: '이미 등록된 기기입니다. MAC 주소를 확인해주세요.',
  C001: '입력 형식을 다시 확인해주세요.',
  C003: '조회 기간을 다시 확인해주세요.',
  D001: '등록되지 않은 기기입니다.',
  D002: '기기에서 잘못된 데이터가 전송되었습니다.',
};

const STATUS_MESSAGE: Record<number, string> = {
  400: '입력값을 다시 확인해주세요.',
  401: '아이디 또는 비밀번호를 확인해주세요.',
  403: '접근 권한이 없습니다.',
  404: '요청한 정보를 찾을 수 없습니다.',
  409: '이미 존재하는 정보입니다.',
  500: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

/** API 에러를 사용자용 문구로 변환 */
export function getErrorMessage(error: unknown, fallback = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'): string {
  if (!axios.isAxiosError(error)) return fallback;

  // 네트워크 단절 · 타임아웃
  if (!error.response) return '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';

  const body = error.response.data as ApiErrorBody | undefined;
  if (body?.code && CODE_MESSAGE[body.code]) return CODE_MESSAGE[body.code];

  return STATUS_MESSAGE[error.response.status] ?? fallback;
}
