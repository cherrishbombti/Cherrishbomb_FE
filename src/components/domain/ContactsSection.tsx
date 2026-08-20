import { useTargetDetail } from '../../hooks/queries/useTargetDetail';

interface Props {
  targetId: number;
}

/**
 * 비상연락망 — 보호자가 앱에서 등록한 연락처 목록.
 * 기관이 직접 등록한 무연고자는 연락처를 등록할 수단이 없어 보통 비어 있다.
 */
export default function ContactsSection({ targetId }: Props) {
  const { data, isLoading, isError } = useTargetDetail(targetId);

  // priority가 낮을수록 우선 연락 대상 — 서버 정렬을 신뢰하지 않고 화면에서 보장한다
  const contacts = [...(data?.contacts ?? [])].sort((a, b) => a.priority - b.priority);

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-sm font-bold text-gray-700">비상연락망</h3>
        {contacts.length > 0 && <span className="text-xs text-gray-500">{contacts.length}명</span>}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-14 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      ) : isError ? (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4">
          비상연락망을 불러오지 못했습니다.
        </p>
      ) : contacts.length === 0 ? (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-4">
          등록된 비상연락처가 없습니다. 보호자가 앱에서 등록하면 이곳에 표시됩니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {contacts.map((contact, index) => (
            <li
              key={contact.contactId}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
            >
              {/* 연락 순서 — 응급 시 위에서부터 연락하면 되도록 번호로 명시 */}
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{contact.name}</span>
                  {contact.relationship && (
                    <span className="text-gray-500 font-normal"> · {contact.relationship}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{contact.phone}</p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                aria-label={`${contact.name}에게 전화`}
                className="w-8 h-8 rounded-full bg-white hover:bg-indigo-50 flex items-center justify-center shadow-sm transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
