# Next.js 15 & FastAPI 연동 주간 Todo 애플리케이션

이 프로젝트는 **FastAPI(백엔드)**와 **Next.js v15 App Router(프론트엔드)**를 연동하여 개발한 주간 스케줄 기반의 Todo(할 일) 관리 웹 애플리케이션입니다. 

로컬 스토리지에 데이터를 격리하는 구조가 아닌, **SQLite 데이터베이스 서버**와 **Next.js Server Actions**를 기반으로 실시간 동기화 및 페이지 캐시 리밸리데이션(`revalidatePath`)이 견고하게 작동하도록 설계되었습니다.

---

## 🛠️ 기술 스택

### 백엔드 (Backend)
- **FastAPI** (v0.111+): 고성능 Python 비동기 웹 프레임워크
- **SQLAlchemy**: ORM을 통한 SQLite 데이터베이스 매핑
- **Pydantic v2**: 스키마 데이터 검증 및 ORM 직렬화
- **SQLite**: 내장 관계형 데이터베이스

### 프론트엔드 (Frontend)
- **Next.js v15** (App Router): React 프레임워크
- **TypeScript**: 정적 타입 시스템
- **Tailwind CSS**: 유틸리티 우선의 깔끔하고 모던한 UI 디자인
- **Server Actions & Route Handlers**: 서버 단 데이터 뮤테이션 및 API 프록시 처리

---

## 📁 프로젝트 구조

```text
kakao-assignment-3/
├── backend/                   # FastAPI 백엔드 관련 파일
│   ├── .env.local             # 백엔드 데이터베이스 환경변수 설정
│   ├── main.py                # 데이터베이스 모델, 스키마 및 CRUD API 엔드포인트
│   └── requirements.txt       # 의존성 패키지 목록
└── frontend/                  # Next.js 프론트엔드 관련 파일
    ├── .env.local             # API URL 환경변수 설정
    ├── app/
    │   ├── api/todos/route.ts # 백엔드 호출 프록시 Route Handler
    │   ├── todos/
    │   │   ├── [todoId]/      # 할 일 수정 서브라우트
    │   │   ├── new/           # 할 일 생성 서브라우트
    │   │   ├── error.tsx      # 에러 핸들링 스크린 (Error Boundary)
    │   │   ├── loading.tsx    # 스켈레톤 로딩 스크린 (Loading Skeleton)
    │   │   ├── page.tsx       # 메인 달력 대시보드 (Server Component)
    │   │   ├── TodoItemClient.tsx # 개별 투두 항목 인터랙션 (Client Component)
    │   │   └── TodoSearchInput.tsx# 디바운스 검색어 입력 창 (Client Component)
    │   ├── actions.ts         # Server Actions (Mutations & Revalidations)
    │   ├── layout.tsx         # 전역 레이아웃
    │   └── page.tsx           # 메인 리다이렉트 (/ -> /todos)
    ├── package.json           # 의존성 정의
    └── tsconfig.json          # 타입스크립트 구성
```

---

## ✨ 핵심 구현 기능

### 1. 주간 캘린더 네비게이션 및 요일별 탭 필터링 (`app/todos/page.tsx`)
- **주간 이동**: `[← 이전 주] [YYYY-Www] [다음 주 →]` 네비게이션을 통해 주차별 일정을 이동하며 관리합니다.
- **요일 탭바**: 월요일부터 일요일까지 7개의 요일 탭이 날짜와 함께 표시됩니다. 특정 요일을 클릭하면 해당 요일에 설정된 할 일 목록만 하단 피드에 노출됩니다.
- **다중 쿼리 동기화**: URL 파라미터(`?week=...&date=...&filter=...&search=...`)를 활용하므로 새로고침해도 현재 상태가 정확히 유지되며, 뒤로 가기/앞으로 가기 히스토리가 정상 호환됩니다.
- **자동 날짜 프리셋**: 특정 요일에서 `+ 할 일 추가`를 선택하면 해당 요일의 날짜가 추가 양식에 기본값으로 자동 매핑되며, 등록 성공 시 이탈 없이 해당 요일 화면으로 복귀합니다.

### 2. 디바운싱(Debouncing) 적용 실시간 서버 검색 (`TodoSearchInput.tsx`)
- 검색어를 입력하면 이번 주 데이터 중 제목(`title`)과 상세 내용(`content`)에 키워드가 포함된 할 일을 DB 레이어에서 필터링해 가져옵니다.
- **검색 결과 일자별 그룹화**: 검색 모드에서는 활성화된 요일 탭에 관계없이, 검색 결과가 존재하는 모든 날짜들을 묶어 일자별 리스트로 한눈에 출력합니다.
- **성능 최적화**: 400ms 디바운스 딜레이를 적용해 키보드 입력이 멈췄을 때만 API 요청을 트리거하여 클라이언트 연산 및 DB 쿼리 리소스를 획기적으로 절약합니다.

### 3. Server Component & Client Component 역할 분리 및 연동
- **Server Component** (`page.tsx` 등): 데이터 페칭을 서버 단에서 직접 수행하여 API 토큰/주소 노출을 방지하고 첫 페이지 렌더링 성능을 극대화합니다.
- **Client Component** (`TodoItemClient.tsx` 등): 체크박스 토글, 삭제 컨펌 등 브라우저 단 인터랙션을 제어하며 `useTransition` 훅을 사용해 Pending 상태에서 불투명도를 제어하는 프리미엄 UI 피드백을 제공합니다.
- **Proxy Route Handler** (`app/api/todos/route.ts`): 백엔드 도메인 우회 통신을 위해 `POST`, `PUT`, `DELETE` 요청을 안전하게 중계하고 완료 시 캐시 새로고침을 트리거합니다.

### 4. 완성도 높은 예외 처리 및 에러 경계 (Error Boundary)
- **빈 상태 처리**: 등록된 투두가 없거나 필터 조건에 부합하는 일정이 없을 경우 `이날 계획된 할 일이 없습니다.` 등의 문구와 일러스트 아이콘으로 깔끔하게 대응합니다.
- **안전한 에러 복구**: 백엔드 통신이 두절되거나 예상치 못한 서버 다운 발생 시 `error.tsx`가 화면 전체 크래시를 방지하고 `다시 시도` 버튼을 노출해 정상화합니다.
- **로딩 스켈레톤**: 네트워크 레이턴시가 발생할 때 `loading.tsx`가 깜빡임 없이 유려한 애니메이션 스켈레톤 카드를 그려줍니다.

---

## ⚙️ 환경변수 설정

### Backend (`backend/.env.local`)
```env
DATABASE_URL=sqlite:///./todos.db
```

### Frontend (`frontend/.env.local`)
```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 실행 및 테스트 방법

### 1. 백엔드(FastAPI) 구동
```bash
cd backend
python -m venv .venv
# 가상환경 활성화 (Windows)
.venv\Scripts\Activate.ps1
# 의존성 설치 및 구동
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- 서버가 켜지면 자동으로 데이터베이스 스키마와 `todos.db` 파일이 생성됩니다.
- *(주의: 이전 버전 테스트로 데이터 구조 충돌 오류가 발생하는 경우 `backend/todos.db` 파일을 삭제한 뒤 백엔드 서버를 재시작하세요.)*

### 2. 프론트엔드(Next.js) 구동
```bash
cd frontend
npm install
npm run dev
```
- 브라우저를 열고 `http://localhost:3000`에 접속하면 자동으로 `/todos` 홈 화면으로 리다이렉트되어 연동이 확인됩니다.
