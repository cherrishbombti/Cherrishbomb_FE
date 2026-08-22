# 낙상감지 핫라인 시스템 (Frontend)

독거노인 **낙상 감지·긴급 알림** 시스템의 프론트엔드입니다.
센서로 감지된 낙상·이상 상황을 사회복지사가 실시간으로 관제하고, 긴급 상황에 빠르게 대응할 수 있도록 지원합니다.

> 종합설계 프로젝트 · `Cherrishbomb_FE`

---

## 주요 기능

- **통합 관제 대시보드** — 관리 중인 노인가구를 긴급 / 주의 / 안전 상태로 구분해 실시간 모니터링
- **상태별 시각화** — 상태 색상 카드·강조바로 긴급 상황을 한눈에 식별
- **대상 관리** — 모니터링 대상(가구) 등록·조회·삭제, 디바이스 MAC 연동
- **자동 갱신** — 5초 주기 폴링으로 최신 상태 반영, 낙상 발생 시 알림
- **인증** — 사회복지사 ID/PW 로그인, 보호자 소셜(OAuth) 로그인

---

## 기술 스택

| 구분       | 사용                           |
| ---------- | ------------------------------ |
| 프레임워크 | React 19 + TypeScript          |
| 빌드       | Vite 8                         |
| 스타일     | Tailwind CSS 4                 |
| 라우팅     | React Router 7                 |
| 서버 상태  | TanStack Query (React Query) 5 |
| HTTP       | Axios                          |

---

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 변수

루트에 `.env` 파일을 만들고 API 서버 주소를 지정합니다.

```
VITE_API_BASE_URL=http://localhost:8080
```

> 미설정 시 기본값 `http://localhost:8080` 을 사용합니다.

### 3. 실행

```bash
npm run dev       # 개발 서버 (HMR)
npm run build     # 타입 체크 + 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
npm run lint      # ESLint
```

---

## 프로젝트 구조

```
src/
├── apis/          API 호출 함수 (axios 인스턴스, auth/targets/guardian)
├── components/
│   ├── common/    공용 UI (BaseButton, InputField, BaseModal, Logo)
│   └── domain/    도메인 UI (TargetCard, TargetDetailModal, AddTargetModal ...)
├── constants/     상수 (APP_NAME 등)
├── hooks/         커스텀 훅 (useModalTransition 등)
├── pages/
│   ├── worker/    사회복지사 화면 (로그인·회원가입·대시보드)
│   └── guardian/  보호자 화면 (로그인·홈·피보호자 등록)
├── router/        라우터 정의 + PrivateRoute(인증 가드)
├── types/         타입 정의
└── utils/         순수 유틸 (format, date, validation, token)
```

---

## 라우팅

| 경로                                 | 화면                       | 접근      |
| ------------------------------------ | -------------------------- | --------- |
| `/worker/login` `/worker/signup`     | 사회복지사 로그인·회원가입 | 공개      |
| `/worker/dashboard`                  | 통합 관제 대시보드         | 인증 필요 |
| `/guardian/login` `/guardian/signup` | 보호자 로그인·회원가입     | 공개      |
| `/guardian/home`                     | 보호자 홈                  | 인증 필요 |
| `/oauth/callback`                    | 소셜 로그인 콜백 처리      | 공개      |

---

## 인증 방식

- 로그인 성공 시 서버가 발급한 **JWT를 `localStorage`(`accessToken` 키)에 저장** (`utils/token.ts`에서 일괄 관리)
- Axios 요청 인터셉터가 토큰을 `Authorization: Bearer` 헤더로 자동 첨부
- 응답 인터셉터가 `401` 감지 시 토큰을 제거하고 현재 경로(worker/guardian)에 맞는 로그인 페이지로 이동
- `PrivateRoute`가 토큰 없는 접근을 로그인 페이지로 리다이렉트

---

## 상태값

대상자 상태는 세 가지로 통일되어 있습니다.

| 값        | 의미                |
| --------- | ------------------- |
| `SAFE`    | 안전                |
| `WARNING` | 주의                |
| `DANGER`  | 긴급 (낙상 감지 등) |
