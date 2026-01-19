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
네임스페이스: `common`, `nav`, `hero`, `features`, `auth`, `wiki`, `community`, `profile`, `profile.kimchiDex`, `shop`, `footer`, `levels`

### i18n 적용 현황

**적용 완료:**
- [x] Header, Footer, LanguageSwitcher 컴포넌트
- [x] wiki/page.tsx - 카테고리, 정렬, 검색
- [x] wiki/[id]/page.tsx - 상세 페이지
- [x] community/page.tsx - 게시판, 페이지네이션
- [x] profile/kimchi-dex/page.tsx - 김치 도감
- [x] KimchiDexButton.tsx - 도감 위젯
- [x] profile/page.tsx - 프로필 페이지 ✅ 2026-01-19
- [x] community/write/page.tsx - 글쓰기 페이지 ✅ 2026-01-19
- [x] community/edit/[id]/page.tsx - 글 수정 페이지 ✅ 2026-01-19

**향후 (P2-P3):**
- [ ] toastStore 메시지
- [ ] 영어 번역 품질 검토

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

## 개발 로드맵 (하이브리드 방식)

### Phase 1: 핵심 UX 수정 (localStorage 기반)

#### Sprint 1-1: 사용자 인증 정상화
- [x] **회원가입 구현**: localStorage 기반 사용자 생성
  - `authStore.ts` 생성 (SHA-256 해싱)
  - 폼 검증 (이메일 중복, 비밀번호 강도, 실시간 유효성)
  - 성공 시 자동 로그인 + 온보딩 토스트
  - 비밀번호 강도 인디케이터 (4단계 시각화)
- [ ] **사용자 정보 통합**: CURRENT_USER 상수 제거 (진행 중)
  - 세션 유저와 userStore 동기화
  - 게시글/댓글 작성 시 실제 로그인 유저 사용
- [x] **비밀번호 찾기 페이지**: `/forgot-password` 생성 (UI만)

#### Sprint 1-2: 끊어진 링크 수정
- [x] **프로필 하위 페이지 생성**
  - `/profile/badges` - 뱃지 상세 (획득/미획득)
  - `/profile/bookmarks` - 북마크한 글 목록
  - `/profile/xp-history` - XP 획득 히스토리
- [x] **북마크 기능 완성**
  - `bookmarksStore` 생성 (localStorage persist)
  - 게시글 상세에서 북마크 토글 연동
  - 프로필에서 북마크 목록 표시

#### Sprint 1-3: 게시글 UX 완성
- [x] **좋아요 상태 영속화**
  - `likedBy: string[]` 필드 추가
  - 사용자별 좋아요/취소 로직 (`toggleLike`, `isLikedByUser`)
- [x] **페이지네이션 구현**
  - 커뮤니티: 20개/페이지
  - URL 쿼리 파라미터 (`?page=2`)
  - Suspense 래퍼 적용
- [x] **게시글 수정/삭제**
  - 본인 글만 수정/삭제 가능
  - `/community/edit/[id]` 수정 페이지
  - 삭제 확인 모달
- [x] **이전/다음 글 네비게이션**
  - `getAdjacentPosts()` 메서드

### Phase 2: 기능 확장 (localStorage 기반)

#### Sprint 2-1: 게이미피케이션 완성
- [x] **레벨업 알림**: `addXp` 시 레벨 변경 감지
  - `toast.levelUp()` 헬퍼 함수
  - 새 기능 해금 알림 (순차적 표시)
- [x] **뱃지 자동 획득**: 조건 달성 시 뱃지 부여
  - `badgesStore.checkAndAwardBadges()` 자동 체크
  - 8종 뱃지: 첫 글, 7/30일 연속, 레시피 10개, Q&A 50개 등
- [x] **프로필 실제 통계**: 게시글/댓글 수 실시간 계산
  - `getUserPosts()`, `getUserComments()`, `getUserStats()`

#### Sprint 2-2: 소셜 기능
- [x] **댓글 답글**: `parentId` 필드, 2단계 중첩
  - `addComment(postId, content, author, parentId)` 지원
  - `getReplies(commentId)` 메서드
- [x] **공유 기능**: 클립보드 복사, Web Share API
  - `navigator.clipboard.writeText()` 링크 복사
  - `navigator.share()` 네이티브 공유 (모바일)
- [x] **검색 기능**: 게시글/위키 통합 검색
  - `SearchModal.tsx` 컴포넌트
  - Header에 검색 버튼 추가

#### Sprint 2-3: 기타 UX
- [x] **임시저장**: 글쓰기 중 자동 저장
  - `draftStore` 생성 (30초 자동저장)
  - 복구 모달, 수동 저장 버튼
- [x] **게시글 이미지 갤러리**: Lightbox 모달
  - `ImageLightbox.tsx` 컴포넌트
  - 좌/우 키보드 네비게이션, ESC 닫기
- [x] **인기 태그 동적 계산**
  - `postsStore.getPopularTags(limit)` 메서드
- [x] **위키 정렬 기능**
  - 이름순, 인기순, 매운맛순, 발효도순

### Phase 3: 데이터베이스 연동 (점진적)

#### Sprint 3-1: 기반 구축
- [ ] Prisma + PostgreSQL (또는 MongoDB) 설정
- [ ] User 모델 마이그레이션
- [ ] NextAuth에 DB adapter 연결

#### Sprint 3-2: 핵심 데이터 이관
- [ ] Posts/Comments API 라우트
- [ ] Zustand → API 호출로 전환
- [ ] localStorage fallback 유지

#### Sprint 3-3: 완전 이관
- [ ] 모든 데이터 DB 저장
- [ ] 실시간 알림 (선택)
- [ ] 관리자 대시보드 (선택)

---

## 현재 이슈 상세

### 존재하지 않는 페이지 (404)
| 경로 | 링크 위치 | 우선순위 | 상태 |
|------|----------|---------|------|
| `/profile/badges` | 프로필 드롭다운 | P1 | ✅ 완료 |
| `/profile/bookmarks` | 프로필 드롭다운 | P1 | ✅ 완료 |
| `/profile/xp-history` | 프로필 페이지 | P2 | ✅ 완료 |
| `/forgot-password` | 로그인 페이지 | P1 | ✅ 완료 |
| `/wiki/[id]/recipe` | 위키 상세 | P2 | ⏳ 대기 |
| `/community/challenge` | 커뮤니티 사이드바 | P3 | ⏳ 대기 |

### 동작하지 않는 버튼
| 버튼 | 위치 | 수정 방법 | 상태 |
|------|------|----------|------|
| 페이지네이션 | /community | state + slice 로직 | ✅ 완료 |
| 이전/다음 글 | /community/[id] | posts 배열에서 인덱스 | ✅ 완료 |
| 임시저장 | /community/write | draftStore 생성 | ✅ 완료 |
| 복사/공유 | /community/[id] | navigator.clipboard, SDK | ✅ 완료 |
| 북마크 | /community/[id] | bookmarksStore 연동 | ✅ 완료 |
| 프로필 편집 | /profile | 편집 모달/페이지 | ⏳ 대기 |
| 위키 정렬 | /wiki | sort 로직 추가 | ✅ 완료 |

### 데이터 불일치
```
문제: 3곳에서 사용자 정보 관리
- NextAuth session.user
- userStore.profile
- CURRENT_USER 상수 (mockData.ts)

해결: userStore를 Single Source of Truth로
- 로그인 시 session → userStore 동기화
- CURRENT_USER 참조 모두 제거
- 게시글 작성 시 userStore.profile 사용
```

## TIL (Today I Learned)

### 1. Zustand + localStorage Persist 패턴
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create<State>()(
  persist(
    (set, get) => ({ /* state & actions */ }),
    {
      name: "storage-key",
      partialize: (state) => ({ /* 저장할 필드만 선택 */ }),
    }
  )
);
```
- `partialize`로 함수 제외, 필요한 상태만 저장
- 이중 괄호 `()()` 필수 (middleware wrapping)

### 2. Toast 시스템 - Provider 없이 전역 알림
```typescript
// Store에서 helper 객체 export
export const toast = {
  success: (msg, desc) => useToastStore.getState().addToast({ type: "success", ... }),
  xp: (amount, reason) => { ... }
};

// 어디서든 호출 가능 (React 컴포넌트 외부에서도)
toast.success("저장 완료!");
```

### 3. Next.js App Router 파일 업로드
```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path, buffer);
}
```
- `FormData` 전송 시 Content-Type 헤더 설정하지 말 것 (브라우저가 자동 설정)

### 4. 드래그앤드롭 이벤트
```typescript
const handleDragOver = (e) => {
  e.preventDefault();  // 필수! 없으면 브라우저가 파일 열어버림
  e.stopPropagation();
};
```

### 5. 연속 출석 스트릭 계산
- ISO 날짜 문자열(`YYYY-MM-DD`)로 저장 → 문자열 정렬 가능
- 역순 정렬 후 하루씩 비교, 끊김 발견 시 break

### 6. Styled JSX로 커스텀 애니메이션
```typescript
<style jsx>{`
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
`}</style>
```
- Tailwind에 없는 애니메이션은 styled-jsx로 해결
- 컴포넌트 스코프로 격리됨
