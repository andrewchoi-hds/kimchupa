# @kimchupa/api — L2

## Stack
- TypeScript
- bcryptjs (비밀번호 해싱)
- @kimchupa/db (Prisma 쿼리)
- @kimchupa/shared (타입, 상수)

## Structure
```
src/
├── services/        # 비즈니스 로직 레이어
├── repositories/    # 데이터 접근 레이어 (Prisma 쿼리)
├── utils/           # 유틸리티 (레벨 계산, 페이지네이션)
└── index.ts         # Barrel export
```

## Domain Rules
- Repository: 순수 데이터 접근만 (비즈니스 로직 금지)
- Service: Repository 호출 + 비즈니스 로직 조합
- web의 API Route는 Service만 호출 (thin controller)
- 인증: bcrypt (SALT_ROUNDS = 12)

## Commands
```bash
pnpm build   # tsc --noEmit
```
