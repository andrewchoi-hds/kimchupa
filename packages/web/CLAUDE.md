# @kimchupa/web — L2

## Stack
- Next.js 16 (App Router, React Compiler)
- React 19
- TanStack Query (서버 상태)
- Zustand (클라이언트 전용: toast, draft)
- Tailwind CSS 4
- next-intl (한/영)
- next-auth v5 + PrismaAdapter
- lucide-react (아이콘)
- canvas-confetti (레벨업)

## Structure
```
src/
├── app/
│   ├── [locale]/         # 페이지 (i18n 라우팅)
│   │   ├── (main)/       # wiki, community, profile, shop...
│   │   └── (auth)/       # login, signup
│   └── api/              # API Route (thin controller → @kimchupa/api)
├── components/
│   ├── ui/               # 공통 UI (Button, Card, Modal...)
│   ├── layout/           # Header, Footer, MainLayout
│   └── providers/        # Session, Query, Global
├── hooks/                # React Query 훅 (usePosts, useProfile...)
├── stores/               # toastStore, draftStore만
├── i18n/                 # next-intl 설정
└── auth.ts               # NextAuth + PrismaAdapter
messages/                 # ko.json, en.json
```

## Domain Rules
- 서버 상태는 반드시 React Query 훅 사용 (Zustand 금지)
- 클라이언트 전용 상태만 Zustand (toast, draft)
- `@/*` path alias → `./src/*`
- API Route는 인증 체크 후 `@kimchupa/api` 서비스 호출만
- 모든 사용자 대면 텍스트는 messages/*.json에 정의

## Commands
```bash
pnpm dev      # Next.js 개발 서버
pnpm build    # 프로덕션 빌드
pnpm lint     # ESLint
```
