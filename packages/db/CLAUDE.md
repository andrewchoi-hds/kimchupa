# @kimchupa/db — L2

## Stack
- Prisma 7 + PrismaNeon adapter
- Neon PostgreSQL (serverless)
- tsx (seed 실행)

## Structure
```
prisma/
├── schema.prisma   # DB 스키마 정의
├── migrations/     # 마이그레이션 파일
└── seed.ts         # 시드 데이터
src/
├── client.ts       # PrismaClient 싱글톤
└── index.ts        # Barrel export (prisma, PrismaClient, 모든 Prisma 타입)
```

## Domain Rules
- 스키마 변경 후 반드시 `pnpm db:generate` 실행
- 환경변수 `DATABASE_URL` 필수 (Neon 연결 문자열)
- seed.ts는 `@kimchupa/shared` 상수 참조

## Commands
```bash
pnpm db:generate  # Prisma 클라이언트 생성
pnpm db:push      # 스키마를 DB에 푸시
pnpm db:migrate   # 마이그레이션 생성
pnpm db:seed      # 시드 데이터 실행
pnpm db:reset     # DB 리셋 (주의!)
```
