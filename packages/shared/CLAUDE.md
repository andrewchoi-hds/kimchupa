# @kimchupa/shared — L2

## Stack
- Zod (스키마 검증)
- TypeScript

## Structure
```
src/
├── schemas/       # Zod 스키마 (API 계약 단일 소스)
├── types/         # TypeScript 인터페이스 + Zod infer 타입
├── constants/     # 레벨, 뱃지, 김치 데이터, 제휴 상품
└── i18n/          # locale 설정 (ko, en)
```

## Domain Rules
- 모든 API 요청/응답 스키마는 이 패키지에서 정의
- 타입 변경 시 `api`, `web` 패키지 빌드 확인 필수
- constants는 순수 데이터만 (부작용 없음)

## Commands
```bash
pnpm build   # tsc --noEmit
```
