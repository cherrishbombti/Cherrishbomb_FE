# Cherrishbomb_FE — Copilot 지침

독거노인 낙상감지 시스템의 **사회복지사(기관) 웹**. 낙상 알림을 놓치지 않는 것이 이 화면의 목적이다.
코드리뷰는 반드시 한국어로 작성한다.

## 스택

React 19 · TypeScript · Vite 8 · TanStack Query v5 · React Router v7 · Tailwind CSS v4 · axios · Firebase(FCM 웹 푸시)

## 구조

```
src/
├── apis/         axios 호출 함수 (도메인별 파일)
├── components/
│   ├── common/   도메인 지식이 없는 재사용 컴포넌트
│   └── domain/   이 서비스에만 쓰이는 컴포넌트
├── hooks/queries/ TanStack Query 훅
├── pages/worker/ 사회복지사 화면
├── types/        API 응답 타입
├── utils/        순수 함수
├── lib/          외부 라이브러리 초기화 (firebase 등)
└── constants/
```

- 서버 상태는 **전부 TanStack Query**로 다룬다. `useState`에 API 응답을 복사해두지 않는다 — 폴링이 돌아도 갱신되지 않는 버그가 있었다.
- API 호출은 반드시 `src/apis/`를 거친다. 컴포넌트에서 `axios`를 직접 부르지 않는다.

## 도메인 용어

`target` = 피보호자(돌봄 대상 노인). 서버 엔티티명은 `Member`, 보호자 앱에서는 `ward`다. **웹에서는 `target`으로 통일한다.**

- `manageable: false` = 보호자가 등록한 대상 → **조회만 가능**. 수정·삭제 UI를 노출하지 않는다.
- 권한 판정은 `utils/targetPermission.ts` 한 곳에서만 한다. 컴포넌트에 `target.manageable === true`를 흩뿌리지 않는다.

## 반드시 지킬 규칙

### 1. 없는 데이터를 지어내지 않는다

서버가 안 주는 값을 그럴듯한 상수로 채우지 않는다. **`배터리 92%` 같은 고정값은 사용자를 속인다.** 값이 없으면 `'—'`로 두거나 아예 숨긴다.

### 2. 권한이 없어 막을 때는 이유를 쓴다

버튼만 사라지면 사용자는 버그로 오해한다.

```tsx
// 좋음
<p>보호자가 등록한 대상이라 조회만 가능합니다.</p>
```

### 3. 낙상 알림은 놓치면 안 된다

- 긴급 알림은 자동으로 사라지지 않게 한다.
- 다른 탭을 보고 있어도 인지되도록 처리한다(탭 제목 점멸 등).
- 푸시 수신 시 알림함 쿼리도 함께 `invalidateQueries` 한다. **토스트와 종 배지가 어긋나면 안 된다.**

### 4. 개인정보를 URL에 싣지 않는다

토큰·전화번호 등을 쿼리스트링에 넣지 않는다. 액세스 로그와 브라우저 히스토리에 평문으로 남는다. `DELETE`도 `{ data: { ... } }`로 본문을 쓴다.

### 5. 실패를 조용히 넘기지 않는다

`VITE_FIREBASE_VAPID_KEY`가 비면 푸시가 **에러 없이 그냥 안 온다.** 이런 무증상 실패에는 최소한 `console.warn`을 남긴다.

### 6. 브라우저 권한 요청은 사용자 제스처 안에서 먼저 호출한다

`Notification.requestPermission()` 앞에 `await`가 끼면 Safari에서 제스처 컨텍스트가 끊겨 거부된다. **권한 요청을 가장 먼저** 하고 그다음에 초기화한다.

## 타입

- API 응답 타입은 `src/types/`에 두고 **서버 DTO와 필드명을 정확히 맞춘다.** 손으로 맞추는 구조라 드리프트가 세 번 났다(`updatedByName`, `isRead`, `priority`).
- 서버가 `boolean`을 주는 필드는 이름을 그대로 쓴다. 서버에서 `@JsonProperty("isRead")`면 클라이언트도 `isRead`다.
- 새 필드는 롤아웃 순서를 고려해 옵셔널(`?`)로 시작하되, **권한 관련 필드의 기본값은 "거부"로** 둔다.
- `any`를 쓰지 않는다.

## 코드 스타일

- Prettier(120자, 작은따옴표, 세미콜론). JSX 속성은 큰따옴표. `npm run format`
- 컴포넌트는 함수 선언 + `export default`.
- Tailwind는 **코어 유틸리티 클래스만** 쓴다. 임의 값(`w-[437px]`)은 피한다.
- **주석은 "왜"를 쓰고 한국어로 쓴다.**
  ```tsx
  // priority가 낮을수록 우선 연락 대상 — 서버 정렬을 신뢰하지 않고 화면에서 보장한다
  ```
- 서버 버그를 화면에서 우회할 때는 `// TODO: BE #<이슈> 수정 후 제거`를 붙인다. 안 그러면 우회 코드가 영구히 남는다.

## 커밋 · PR

- 커밋: `feat:` `fix:` `refactor:` `chore:` `style:` + 한국어 요약
- **PR은 파일 10개 / 300줄 이내.** 큰 리팩터링 PR이 리뷰되지 못하고 revert → revert of revert로 이어진 이력이 있다.

## 하지 말 것

- `.env`를 커밋하지 않는다. CI가 검사한다. 새 변수는 `.env.example`에 키만 추가한다.
- `localStorage`에 개인정보를 저장하지 않는다.
- `useEffect` 안에서 `setState`로 파생 상태를 만들지 않는다(렌더 중 계산하거나 `useMemo`).
- 서버 응답을 `useState`에 복사해 스냅샷으로 들고 있지 않는다.
