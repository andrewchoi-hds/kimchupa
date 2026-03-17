# 김추페 (KimchuPa) - 프로젝트 컨텍스트

## 프로젝트 개요

**김추페**는 한국의 전통 발효 음식인 김치의 모든 것을 담은 종합 플랫폼입니다.
AI 기반 김치 추천, 김치백과, 커뮤니티, 구매 가이드를 제공합니다.

## 기술 스택

### 핵심 프레임워크
- **Next.js 16** (App Router, React Compiler)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4** (CSS 변수 기반 디자인 토큰)

### 모노레포
- **Turborepo** + **pnpm workspace**
- 4개 패키지: `@kimchupa/shared`, `@kimchupa/db`, `@kimchupa/api`, `@kimchupa/web`

### 주요 라이브러리
- **@tanstack/react-query 5**: 서버 상태 관리
- **next-intl 4.7**: 국제화 (한국어/영어)
- **next-auth 5.0.0-beta**: 인증 (Google OAuth, Credentials + bcrypt)
- **@auth/prisma-adapter**: NextAuth + Prisma 연동
- **Prisma 7** + **Neon PostgreSQL**: 데이터베이스
- **Zod**: API 스키마 검증
- **bcryptjs**: 서버 비밀번호 해싱
- **Zustand**: 클라이언트 전용 상태 (toast, draft만)
- **lucide-react**: 아이콘
- **canvas-confetti**: 레벨업 이펙트

### 폰트
- **Pretendard Variable** (한국어, CDN)
- **Inter** (영어, Google Fonts)

## 프로젝트 구조

```
kimchupa/
├── package.json              # Root: pnpm workspace + Turborepo
├── pnpm-workspace.yaml
├── turbo.json
├── vercel.json               # Vercel 모노레포 배포 설정
├── CLAUDE.md                 # L1: 아키텍처, 패키지 간 규칙
├── context.md                # 이 파일
│
├── packages/
│   ├── shared/               # @kimchupa/shared
│   │   └── src/
│   │       ├── schemas/      # Zod 스키마 (API 계약)
│   │       ├── types/        # TypeScript 인터페이스
│   │       ├── constants/    # 레벨, 뱃지, 김치 데이터
│   │       └── i18n/         # locale 설정
│   │
│   ├── db/                   # @kimchupa/db
│   │   ├── prisma/
│   │   │   ├── schema.prisma # DB 스키마 (User+password, Post, Kimchi 등)
│   │   │   └── seed.ts       # 시드 데이터
│   │   └── src/
│   │       └── client.ts     # PrismaClient + Neon adapter
│   │
│   ├── api/                  # @kimchupa/api
│   │   └── src/
│   │       ├── repositories/ # 데이터 접근 (Prisma 쿼리)
│   │       ├── services/     # 비즈니스 로직 (auth, post, xp 등)
│   │       └── utils/        # 레벨 계산, 페이지네이션
│   │
│   └── web/                  # @kimchupa/web
│       ├── src/
│       │   ├── app/
│       │   │   ├── [locale]/         # 페이지 라우트
│       │   │   │   ├── (main)/       # wiki, community, profile, shop
│       │   │   │   └── (auth)/       # login, signup
│       │   │   └── api/              # 16개 API Route (thin controller)
│       │   ├── components/
│       │   │   ├── ui/               # 26개 UI 컴포넌트
│       │   │   ├── layout/           # Header(모듈화), Footer, NavLinks, UserMenu, MobileDrawer
│       │   │   └── providers/        # Session, Query, Global
│       │   ├── hooks/                # React Query 훅 8개 + useTheme, useLevelUp
│       │   ├── stores/               # toastStore, draftStore만
│       │   └── auth.ts               # NextAuth + PrismaAdapter + bcrypt
│       └── messages/                 # ko.json, en.json
│
└── docs/
    ├── PRD.md
    ├── API.md
    └── DATABASE.md
```

## 의존성 그래프

```
shared (의존 없음)
  ↑
  db (shared)
  ↑
  api (db + shared)
  ↑
  web (api + shared, db는 auth adapter만)
```

**변경 전파**: shared → db → api → web (이 순서 필수)

## 상태 관리

### 서버 상태 → React Query (TanStack Query)
모든 서버 데이터는 React Query 훅으로 관리:

| 훅 | 용도 |
|----|------|
| `usePosts()` | 게시글 목록 (페이지네이션, 필터) |
| `usePost(id)` | 게시글 상세 |
| `useCreatePost()` | 게시글 작성 |
| `useProfile()` | 사용자 프로필 |
| `useAttendance()` | 출석 체크 |
| `useBadges()` | 뱃지 목록 |
| `useBookmarks()` | 북마크 |
| `useXpHistory()` | XP 이력 |
| `useKimchiDex()` | 김치 도감 |

### 클라이언트 전용 → Zustand (2개만)
- `toastStore`: 일시적 UI 알림
- `draftStore`: 글쓰기 자동저장 (localStorage)

## 인증

- **설정**: `packages/web/src/auth.ts`
- **PrismaAdapter**: DB 기반 세션/계정 관리
- **bcryptjs**: 서버 비밀번호 해싱 (SALT_ROUNDS=12)
- **데모 계정**: `demo@kimchupa.com` / `demo1234`
- **API**: `/api/auth/[...nextauth]`, `/api/auth/register`

## 디자인 시스템

### 디자인 토큰 (CSS 변수)
- **Primary**: Kimchi Red `hsl(8, 80%, 52%)`
- **Secondary**: Earthy Green `hsl(142, 40%, 40%)`
- **Accent**: Fermented Gold `hsl(38, 85%, 55%)`
- **다크 모드**: `[data-theme="dark"]` + `prefers-color-scheme` 자동 감지

### UI 컴포넌트
Button, Card, Tag, Avatar, Modal, Skeleton, ProgressBar, StatCard, EmptyState, PageHero, PostCard, KimchiCard, FilterBar, Pagination

### 애니메이션
CSS `@keyframes`: fade-in, slide-up, scale-in, shimmer
스크롤 reveal: `IntersectionObserver`
레벨업: `canvas-confetti`

## 개발 명령어

```bash
pnpm dev          # 전체 개발 서버
pnpm build        # 전체 빌드
pnpm lint         # 전체 린트
pnpm db:generate  # Prisma 클라이언트 생성
pnpm db:push      # DB 스키마 푸시
pnpm db:seed      # 시드 데이터
```

## 환경 변수

```bash
# .env.local (루트)
DATABASE_URL=               # Neon PostgreSQL 연결 문자열
AUTH_SECRET=                # openssl rand -base64 32
GOOGLE_CLIENT_ID=           # Google OAuth (선택)
GOOGLE_CLIENT_SECRET=       # Google OAuth (선택)
```

## 국제화 (i18n)

- **지원 언어**: 한국어 (ko), 영어 (en)
- **기본 언어**: 한국어 (ko)
- **라우팅**: `localePrefix: 'as-needed'`
- **번역 파일**: `packages/web/messages/{ko,en}.json`

---

**마지막 업데이트**: 2026-03-17
