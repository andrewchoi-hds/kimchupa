# CLAUDE.md — L1 Root

김추페(KimchuPa) 모노레포 루트

## Architecture

Turborepo + pnpm workspace 기반 모노레포

## Packages

| 패키지 | 설명 | 스택 |
|--------|------|------|
| `packages/shared` | Zod 스키마, 공유 타입, 상수, i18n 설정 | Zod, TypeScript |
| `packages/db` | Prisma 스키마, 마이그레이션, 시드, DB 클라이언트 | Prisma 7, Neon PostgreSQL |
| `packages/api` | Service/Repository 비즈니스 로직 레이어 | bcryptjs, Prisma |
| `packages/web` | Next.js 16 프론트엔드 (App Router) | Next.js 16, React 19, TanStack Query, Tailwind 4, Zustand (toast/draft만) |

## Integration Points

- **API 계약 단일 소스**: `packages/shared/src/schemas/` (Zod 스키마)
- **타입 단일 소스**: `packages/shared/src/types/` (Zod infer + 기존 인터페이스)
- **DB 클라이언트**: `packages/db` → `packages/api`에서 사용, `packages/web`에서는 auth adapter만
- **서비스 레이어**: `packages/api` → `packages/web/src/app/api/` (thin controller) 에서 호출

## Change Propagation

```
shared 변경 → db 확인 → api 확인 → web 확인 (이 순서 필수)
```

## Cross-Package Rules

- shared 타입/스키마 변경 시 모든 소비 패키지 빌드 확인
- API 엔드포인트 추가 시: shared 스키마 → api 서비스 → web API route + React Query 훅 동기화
- DB 스키마 변경 시: `pnpm db:generate` 후 api 레이어 업데이트
- 환경 변수는 루트 `.env.local`에서 관리, 각 패키지에서 참조

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

## 개발 명령어

```bash
pnpm dev          # 전체 개발 서버
pnpm build        # 전체 빌드
pnpm lint         # 전체 린트
pnpm db:generate  # Prisma 클라이언트 생성
pnpm db:push      # DB 스키마 푸시
pnpm db:seed      # 시드 데이터
```

## 세션 마무리 (`/wrap`)

트리거: "세션 정리", "마무리해줘", "wrap up"
→ `.claude/commands/wrap.md` 참조

## 참고 자료

- `context.md` — 프로젝트 컨텍스트
- `docs/PRD.md` — 제품 요구사항
- `docs/API.md` — API 문서
- `docs/DATABASE.md` — 데이터베이스 설계

**마지막 업데이트**: 2026-03-17
