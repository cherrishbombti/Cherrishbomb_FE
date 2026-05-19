import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getWardSummary, getWardSensors, getWardContacts, updateContactPriority } from '../../apis/guardian';
import type { Contact, SafetyStatus } from '../../types/guardian';
import AddContactModal from '../../components/domain/AddContactModal';

// ── 안전 상태별 스타일 ────────────────────────────────────────
const STATUS_CONFIG: Record<SafetyStatus, {
  bg: string; border: string; iconBg: string; iconColor: string;
  label: string; icon: React.ReactNode;
}> = {
  SAFE: {
    bg: 'bg-green-50', border: 'border-green-200',
    iconBg: 'bg-green-500', iconColor: 'text-white',
    label: '안전',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  WARNING: {
    bg: 'bg-yellow-50', border: 'border-yellow-300',
    iconBg: 'bg-yellow-400', iconColor: 'text-white',
    label: '주의',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
      </svg>
    ),
  },
  EMERGENCY: {
    bg: 'bg-red-50', border: 'border-red-300',
    iconBg: 'bg-red-500', iconColor: 'text-white',
    label: '긴급',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
      </svg>
    ),
  },
};

// ── 신호 강도 아이콘 ──────────────────────────────────────────
function SignalIcon({ strength }: { strength: 'strong' | 'medium' | 'weak' }) {
  const bars = strength === 'strong' ? 4 : strength === 'medium' ? 2 : 1;
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 4].map((b) => (
        <div
          key={b}
          className={`w-1 rounded-sm ${b <= bars ? 'bg-indigo-500' : 'bg-gray-200'}`}
          style={{ height: `${b * 25}%` }}
        />
      ))}
    </div>
  );
}

// ── 스켈레톤 ─────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-100 rounded animate-pulse ${className}`} />;
}

export default function GuardianHomePage() {
  const navigate = useNavigate();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const dragIndexRef = useRef<number | null>(null);

  // 3개 API 병렬 호출
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['wardSummary'],
    queryFn: getWardSummary,
    refetchInterval: 1000 * 30,
  });

  const { data: sensors, isLoading: loadingSensors } = useQuery({
    queryKey: ['wardSensors'],
    queryFn: getWardSensors,
  });

  useQuery({
    queryKey: ['wardContacts'],
    queryFn: getWardContacts,
    onSuccess: (data: Contact[]) => {
      if (!contactsLoaded) {
        setContacts(data);
        setContactsLoaded(true);
      }
    },
  } as any);

  const sensor = sensors?.[0];
  const status = summary?.status ?? 'SAFE';
  const cfg = STATUS_CONFIG[status];

  // ── 활동 시간 포맷 ──
  const formatActivity = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}분`;
    if (m === 0) return `${h}시간`;
    return `${h}.${Math.round(m / 6)}시간`;
  };

  // ── 드래그 앤 드롭 (HTML5 내장) ──────────────────────────────
  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    const next = [...contacts];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    dragIndexRef.current = index;
    setContacts(next.map((c, i) => ({ ...c, priority: i + 1 })));
  };

  const handleDragEnd = () => {
    updateContactPriority(contacts); // 서버에 순서 저장
    dragIndexRef.current = null;
  };

  const handleAddContact = (newContact: Contact) => {
    setContacts((prev) => [...prev, { ...newContact, priority: prev.length + 1 }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-700 text-sm">보호자 모드</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { localStorage.removeItem('accessToken'); navigate('/guardian/login'); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            aria-label="로그아웃"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">홍</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 flex flex-col gap-4 max-w-lg mx-auto w-full">

        {/* 페이지 타이틀 */}
        <div>
          <h1 className="text-lg font-bold text-gray-800">현재 안전 상태 요약</h1>
          <p className="text-sm text-gray-400 mt-0.5">실시간으로 확인되는 어르신의 안전 상태입니다</p>
        </div>

        {/* ── 안전 상태 카드 ── */}
        {loadingSummary ? (
          <div className="bg-gray-100 rounded-2xl h-36 animate-pulse" />
        ) : (
          <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-5`}>
            <div className="flex items-center gap-4 mb-4">
              {/* 상태 아이콘 */}
              <div className={`w-14 h-14 rounded-full ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center flex-shrink-0`}>
                {cfg.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{cfg.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {summary?.relationship} ({summary?.wardName})
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  마지막 업데이트: {summary?.lastActivityMinutes}분 전
                </p>
              </div>
            </div>
            {/* 전화 걸기 버튼 */}
            <a
              href={`tel:${summary?.phone}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
              </svg>
              전화 걸기
            </a>
          </div>
        )}

        {/* ── 활동 통계 2개 ── */}
        <div className="grid grid-cols-2 gap-3">
          {loadingSummary ? (
            <><Skeleton className="h-24" /><Skeleton className="h-24" /></>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {formatActivity(summary?.totalActivityMinutes ?? 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">활동 시간</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {summary?.lastActivityMinutes}분 전
                </p>
                <p className="text-xs text-gray-400 mt-1">마지막 활동</p>
              </div>
            </>
          )}
        </div>

        {/* ── 낙상 감지 센서 카드 ── */}
        {loadingSensors ? (
          <Skeleton className="h-24" />
        ) : sensor ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* 센서 아이콘 */}
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{sensor.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${sensor.isConnected ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className={`text-xs ${sensor.isConnected ? 'text-green-600' : 'text-red-500'}`}>
                      {sensor.isConnected ? '연결됨' : '연결 끊김'}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
                상세 설정
              </button>
            </div>
            {/* 센서 상세 정보 */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex flex-col items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="7" width="18" height="10" rx="2" /><path strokeLinecap="round" d="M22 11v2" />
                </svg>
                <span>배터리</span>
                <span className={`font-medium ${sensor.battery <= 20 ? 'text-red-500' : 'text-gray-700'}`}>{sensor.battery}%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <SignalIcon strength={sensor.signalStrength} />
                <span>신호</span>
                <span className="font-medium text-gray-700">
                  {sensor.signalStrength === 'strong' ? '강함' : sensor.signalStrength === 'medium' ? '보통' : '약함'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>업데이트</span>
                <span className="font-medium text-gray-700">{sensor.lastUpdatedMinutes}분 전</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>위치</span>
                <span className="font-medium text-gray-700 text-center">{sensor.location}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── 비상 연락망 ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          {/* 연락망 헤더 */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-gray-800">비상 연락망</h2>
            <button
              onClick={() => setIsAddContactOpen(true)}
              className="text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              연락처 추가
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">드래그하여 우선순위를 변경할 수 있습니다</p>

          {/* 연락처 목록 */}
          <div className="flex flex-col gap-2">
            {contacts.map((contact, index) => (
              <div
                key={contact.contactId}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-grab active:cursor-grabbing active:shadow-md active:bg-white transition-all"
              >
                {/* 드래그 핸들 */}
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-16a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {/* 아바타 */}
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {/* 이름 + 전화번호 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {contact.name} <span className="text-gray-400 font-normal">({contact.relationship})</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                    </svg>
                    {contact.phone}
                  </p>
                </div>
                {/* 우선순위 뱃지 */}
                <span className="text-xs text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full font-medium flex-shrink-0">
                  우선순위 {contact.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      <AddContactModal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onSuccess={handleAddContact}
      />
    </div>
  );
}
