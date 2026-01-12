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
│   │       └── affiliate/track/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # 공유 헤더 (i18n, 세션)
│   │   │   └── Footer.tsx            # 공유 푸터 (i18n)
│   │   ├── providers/
│   │   │   └── SessionProvider.tsx
│   │   └── ui/
│   │       └── LanguageSwitcher.tsx
│   ├── i18n/
│   │   ├── config.ts                 # 로케일 설정
│   │   └── request.ts                # next-intl 요청 설정
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

- [ ] 데이터베이스 연동 (현재 mock data)
- [ ] Google OAuth 환경변수 설정
- [ ] 커뮤니티 글쓰기 기능
- [ ] 이미지 업로드
- [ ] 출석 체크 기능
