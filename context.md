# 김추페 (KimchuPa) - 프로젝트 컨텍스트

## 프로젝트 개요

**김추페**는 한국의 전통 발효 음식인 김치의 모든 것을 담은 종합 플랫폼입니다.
AI 기반 김치 추천, 김치백과, 커뮤니티, 구매 가이드를 제공합니다.

## 기술 스택

### 핵심 프레임워크
- **Next.js 16.1.1** (App Router, React Compiler)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**

### 주요 라이브러리
- **next-intl 4.7**: 국제화 (i18n)
- **next-auth 5.0.0-beta**: 인증 (Google OAuth, Credentials)
- **zustand**: 클라이언트 상태 관리 (localStorage persist)

## 프로젝트 구조

```
kimchupa/
├── src/
│   ├── app/
│   │   ├── [locale]/                 # 로케일 기반 라우팅
│   │   │   ├── layout.tsx            # i18n + SessionProvider
│   │   │   ├── page.tsx              # 메인 페이지
│   │   │   ├── (main)/               # 메인 레이아웃 그룹
│   │   │   │   ├── about/
│   │   │   │   ├── terms/
│   │   │   │   ├── privacy/
│   │   │   │   ├── wiki/
│   │   │   │   ├── community/
│   │   │   │   ├── shop/
│   │   │   │   └── profile/
│   │   │   └── (auth)/               # 인증 레이아웃 그룹
│   │   │       ├── login/
│   │   │       └── signup/
│   │   └── api/
│   │       ├── auth/[...nextauth]/
│   │       ├── affiliate/track/
│   │       └── upload/               # 이미지 업로드 API
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # 공유 헤더 (i18n, 세션)
│   │   │   └── Footer.tsx            # 공유 푸터 (i18n)
│   │   ├── providers/
│   │   │   ├── SessionProvider.tsx
│   │   │   └── GlobalProvider.tsx    # Toast 컨테이너 포함
│   │   └── ui/
│   │       ├── LanguageSwitcher.tsx
│   │       ├── Toast.tsx             # Toast 알림 컴포넌트
│   │       ├── AttendanceCalendar.tsx # 출석 달력
│   │       ├── ImageUpload.tsx       # 이미지 업로드 (게시글)
│   │       └── ProfileImageUpload.tsx # 프로필 이미지 업로드
│   ├── i18n/
│   │   ├── config.ts                 # 로케일 설정
│   │   └── request.ts                # next-intl 요청 설정
│   ├── stores/
│   │   ├── postsStore.ts             # Zustand 게시글 상태 관리
│   │   ├── attendanceStore.ts        # Zustand 출석 체크 상태 관리
│   │   ├── userStore.ts              # Zustand 유저 프로필 상태 관리
│   │   └── toastStore.ts             # 전역 Toast 알림 관리
│   ├── auth.ts                       # NextAuth 설정
│   └── middleware.ts                 # next-intl 미들웨어
├── messages/
│   ├── ko.json                       # 한국어 번역
│   └── en.json                       # 영어 번역
└── docs/
    ├── PRD.md
    ├── API.md
    └── DATABASE.md
```

## 국제화 (i18n) 구현

### 설정
- **지원 언어**: 한국어 (ko), 영어 (en)
- **기본 언어**: 한국어 (ko)
- **라우팅**: `localePrefix: 'as-needed'`

### 클라이언트 컴포넌트 사용법
```typescript
"use client";
import { useTranslations } from "next-intl";

const t = useTranslations("namespace");
// t("key") 또는 t("nested.key")
```

### 번역 파일 구조
네임스페이스: `common`, `nav`, `hero`, `features`, `auth`, `profile`, `footer`, `levels`

## 인증 (NextAuth) 구현

### 설정 위치
- 설정: `/src/auth.ts`
- API: `/src/app/api/auth/[...nextauth]/route.ts`

### 인증 제공자
1. **Google OAuth** (환경변수 필요)
2. **Credentials** - 데모 계정: `demo@kimchupa.com` / `demo1234`

### 클라이언트 사용 패턴
```typescript
"use client";
import { useSession, signOut } from "next-auth/react";

const { data: session } = useSession();

// 세션에서 유저 정보 추출
const user = session?.user
  ? {
      nickname: session.user.name || "사용자",
      level: 1,
      levelName: levels("1"),
      xp: 0,
      profileImage: session.user.image || undefined,
    }
  : null;
```

## 레이아웃 패턴

### Header 컴포넌트
- **위치**: `/src/components/layout/Header.tsx`
- **Props**: `user` (세션 정보, nullable)
- **기능**: GNB 중앙 정렬, 언어 전환, 로그인 상태별 UI

### GNB Flexbox 3분할 레이아웃
```tsx
<nav className="flex items-center h-16">
  {/* 좌측: 로고 (고정) */}
  <Link className="shrink-0">...</Link>

  {/* 중앙: 메뉴 (확장 + 중앙정렬) */}
  <div className="flex-1 flex justify-center">...</div>

  {/* 우측: 사용자 (고정) */}
  <div className="shrink-0">...</div>
</nav>
```

## 환경 변수

```bash
# .env.local
AUTH_SECRET=                    # openssl rand -base64 32
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 개발 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
```

## 커밋 히스토리

- `22f5acb` - 김추페 MVP 초기 구현
- `fb2f6c8` - i18n 및 UX 개선 적용

## TODO

- [ ] 데이터베이스 연동 (현재 mock data + localStorage)
- [ ] Google OAuth 환경변수 설정
- [x] 커뮤니티 글쓰기 기능 (Zustand + localStorage)
- [x] 이미지 업로드 (로컬 파일 시스템)
- [x] 출석 체크 기능 (Zustand + localStorage)
- [x] Toast 알림 시스템 (전역 알림)
- [x] 메인 페이지 리뉴얼 (애니메이션, 통계, 인기 게시글)

## 상태 관리 (Zustand)

### Posts Store
- **위치**: `/src/stores/postsStore.ts`
- **persist**: localStorage (`kimchupa-posts`)

```typescript
import { usePostsStore } from "@/stores/postsStore";

// Actions
const { addPost, updatePost, deletePost, toggleLike, incrementViewCount } = usePostsStore();
const { addComment, deleteComment, toggleCommentLike } = usePostsStore();

// Getters
const posts = usePostsStore((state) => state.posts);
const { getPostById, getCommentsByPostId } = usePostsStore();
```

### Attendance Store
- **위치**: `/src/stores/attendanceStore.ts`
- **persist**: localStorage (`kimchupa-attendance`)

```typescript
import { useAttendanceStore } from "@/stores/attendanceStore";

// Actions
const { checkIn, canCheckInToday, getMonthAttendance } = useAttendanceStore();

// State
const { currentStreak, longestStreak, attendedDates, totalXpEarned } = useAttendanceStore();

// Check-in returns: { success, xpEarned, bonusInfo, newStreak }
```

**연속 출석 보너스:**
- 7일 연속: +10 XP
- 14일 연속: +20 XP
- 30일 연속: +50 XP

### User Store
- **위치**: `/src/stores/userStore.ts`
- **persist**: localStorage (`kimchupa-user`)

```typescript
import { useUserStore } from "@/stores/userStore";

const { profile, setProfileImage, updateNickname, updateBio, addXp } = useUserStore();
```

## 이미지 업로드

### API
- **엔드포인트**: `POST /api/upload` (단일), `PUT /api/upload` (다중)
- **저장 위치**: `public/uploads/`
- **지원 형식**: JPG, PNG, GIF, WebP
- **최대 크기**: 5MB (게시글), 2MB (프로필)

### 컴포넌트
- `ImageUpload`: 게시글용 다중 이미지 업로드 (드래그앤드롭)
- `ProfileImageUpload`: 프로필 이미지 업로드

## Toast 알림 시스템

### Toast Store
- **위치**: `/src/stores/toastStore.ts`

```typescript
import { toast } from "@/stores/toastStore";

// 사용법
toast.success("제목", "설명");
toast.error("제목", "설명");
toast.xp(20, "게시글 작성");  // +20 XP (게시글 작성)
toast.levelUp(5, "김치 고수");  // 레벨 업 알림
```

### 컴포넌트
- **Toast.tsx**: `/src/components/ui/Toast.tsx`
- **GlobalProvider**: `/src/components/providers/GlobalProvider.tsx`

### 적용된 페이지
- 로그인: 성공/실패 알림
- 글쓰기: 등록 완료 + XP 획득
- 출석 체크: 체크 완료 + XP 획득 + 보너스 알림

## 메인 페이지 구성

### Hero 섹션
- 김치 이모지 플로팅 애니메이션 (🥬, 🌶️, 🧄, 🫙, 🥢, 🍜)
- 그라디언트 배경 + 블러 효과

### 통계 섹션
- 레시피 수, 회원 수, 게시글 수, 위키 항목 수 표시

### 기능 카드
- AI 추천 (빨강 그라디언트)
- 김치피디아 (주황 그라디언트)
- 커뮤니티 (초록 그라디언트)
- 호버 애니메이션 + 클릭 가능

### 인기 게시글 섹션
- `postsStore`에서 좋아요 순 상위 4개 표시
- 게시판 배지 + 통계 (좋아요, 댓글, 조회수)
