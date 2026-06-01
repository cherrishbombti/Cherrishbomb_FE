import { useState } from 'react';
import { deleteTarget } from '../../apis/targets';
import type { Target } from '../../types/target';

interface Props {
  target: Target | null;
  onClose: () => void;
  onDelete: (id: number) => void; // 삭제 성공 후 목록 갱신
}

const STATUS_LABEL: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  DANGER:  { label: '긴급', bg: 'bg-red-100',    text: 'text-red-600',    dot: 'bg-red-500'    },
  WARNING: { label: '주의', bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
  SAFE:    { label: '안전', bg: 'bg-green-100',  text: 'text-green-600',  dot: 'bg-green-500'  },
};

function timeAgo(iso: string | null | undefined): string {
  if (!iso) return '정보 없음';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '정보 없음';
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 0) return '방금 전';
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

interface SensorRowProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  description: string;
}

function SensorRow({ icon, label, active, description }: SensorRowProps) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border ${active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-green-100' : 'bg-gray-200'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
        {active ? '작동 중' : '비활성'}
      </span>
    </div>
  );
}

export default function TargetDetailModal({ target, onClose, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!target) return null;

  const st = STATUS_LABEL[target.status] ?? STATUS_LABEL.SAFE;

  return (
    /* 오버레이 */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      {/* 모달 패널 */}
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">피보호자 상세 정보</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
          {/* 기본 정보 카드 */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0
              ${target.status === 'DANGER' ? 'bg-red-400' : target.status === 'WARNING' ? 'bg-yellow-400' : 'bg-indigo-400'}`}>
              {target.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-lg">{target.name}</span>
                <span className="text-sm text-gray-400">({target.age}세)</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${target.status === 'DANGER' ? 'animate-pulse' : ''}`} />
                {st.label}
              </div>
            </div>
          </div>

          {/* 주소 / 연락처 */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2.5 text-sm">
            <div className="flex items-start gap-2 text-gray-600">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{target.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
              </svg>
              <span>{target.contact != null ? String(target.contact) : '연락처 없음'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs border-t border-gray-200 pt-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>마지막 업데이트: {timeAgo(target.lastUpdated)}</span>
            </div>
          </div>

          {/* 센서 상태 */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">센서 상태</h3>
            <div className="flex flex-col gap-2.5">
              <SensorRow
                icon={
                  <svg className={`w-5 h-5 ${target.radar ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                }
                label="레이더 센서"
                active={target.radar}
                description="움직임 감지 및 호흡 모니터링"
              />
              <SensorRow
                icon={
                  <svg className={`w-5 h-5 ${target.thermal ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                }
                label="열화상 센서"
                active={target.thermal}
                description="체온 및 열 이상 감지"
              />
              <SensorRow
                icon={
                  <svg className={`w-5 h-5 ${target.vibrator ? 'text-green-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                label="진동 센서"
                active={target.vibrator}
                description="낙상 및 충격 감지"
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-5 pb-5 flex flex-col gap-2">
          {!confirmDelete ? (
            <>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full py-2.5 rounded-xl text-red-400 hover:bg-red-50 text-sm font-semibold transition-colors border border-red-100"
              >
                피보호자 삭제
              </button>
            </>
          ) : (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-sm text-gray-700 font-semibold text-center">
                <span className="text-red-400">{target.name}</span> 님을 정말 삭제할까요?
              </p>
              <p className="text-xs text-gray-400 text-center -mt-1">삭제하면 복구할 수 없습니다.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 text-sm font-semibold transition-colors hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    try {
                      await deleteTarget(target.id);
                      onDelete(target.id);
                      onClose();
                    } catch {
                      setIsDeleting(false);
                      setConfirmDelete(false);
                    }
                  }}
                  className="flex-1 py-2 rounded-lg bg-red-400 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
