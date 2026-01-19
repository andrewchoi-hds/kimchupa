# CLAUDE.md

김추페(KimchuPa) 프로젝트의 Claude Code 워크플로우 가이드

## 프로젝트 개요

**프로젝트명**: 김추페 (KimchuPa)
**설명**: 김치 정보 & 커뮤니티 플랫폼
**기술 스택**: Next.js 16, TypeScript, Tailwind CSS, Zustand
**컨텍스트 문서**: `context.md` 참조

---

## 세션 마무리 자동화 (`/wrap`)

### 트리거 단어

**한국어:**
- 세션 정리, 마무리해줘, 오늘 끝, 랩업

**영어:**
- wrap up, end session, done for today

### 실행 프로세스

**Phase 1: 병렬 분석** (4개 에이전트 동시 실행)
1. `doc-updater` - CLAUDE.md/context.md 업데이트 제안
2. `automation-scout` - 반복 패턴 자동화 기회 탐지
3. `learning-extractor` - TIL 추출
4. `followup-suggester` - 다음 할 일 우선순위 제안

**Phase 2: 중복 검증**
- `duplicate-checker` - Phase 1 결과 중복 제거

**Phase 3: 사용자 선택 및 실행**
- 커밋 생성 / 문서 업데이트 / TIL 저장 / TODO 저장

### 설정 파일

- **에이전트**: `.claude/agents/*.md`
- **커맨드**: `.claude/commands/wrap.md`
- **설정**: `.claude/settings.json`

---

## 에이전트 시스템

| 에이전트 | 설명 | 도구 |
|---------|------|------|
| `doc-updater` | 문서 업데이트 제안 | Read, Glob, Grep |
| `automation-scout` | 자동화 기회 탐지 | Read, Glob, Grep |
| `learning-extractor` | TIL 추출 | Read, Glob, Grep |
| `followup-suggester` | 다음 할 일 제안 | Read, Glob, Grep |
| `duplicate-checker` | 중복 검증 | Read, Glob, Grep |

---

## 프로젝트 구조

```
kimchupa/
├── .claude/
│   ├── agents/           # 에이전트 정의
│   ├── commands/         # 커스텀 커맨드
│   └── settings.json     # Claude Code 설정
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 컴포넌트
│   ├── stores/           # Zustand 상태 관리
│   └── i18n/             # next-intl 국제화
├── messages/             # i18n 번역 파일
├── docs/                 # 프로젝트 문서
│   ├── PRD.md
│   ├── API.md
│   ├── DATABASE.md
│   └── ARCHITECTURE.md
├── context.md            # 프로젝트 컨텍스트 (필독)
├── TIL.md                # Today I Learned
├── TODO.md               # 다음 할 일 목록
└── CLAUDE.md             # 이 파일
```

---

## 개발 워크플로우

### 1. 새 세션 시작

```bash
# 현재 상태 확인
git status
cat context.md  # 프로젝트 개요 파악
```

### 2. 작업 진행

- **컨벤션 준수**: context.md > "프로젝트 구조" 참조
- **i18n**: 모든 사용자 대면 텍스트는 `messages/ko.json`, `messages/en.json`에 정의
- **상태 관리**: Zustand + localStorage persist 패턴 사용
- **컴포넌트**: Client/Server 컴포넌트 구분 (`"use client"` 명시)

### 3. 세션 종료

```
사용자: 세션 정리해줘
Claude: [/wrap 커맨드 자동 실행]
```

---

## 주요 패턴

### Zustand + localStorage Persist

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      // state & actions
    }),
    {
      name: "storage-key",
      partialize: (state) => ({ /* 저장할 필드만 */ }),
    }
  )
);
```

**주의사항:**
- 이중 괄호 `()()` 필수 (middleware wrapping)
- `partialize`로 함수 제외, 필요한 상태만 저장

### next-intl 사용법

**클라이언트 컴포넌트:**
```typescript
"use client";

import { useTranslations } from "next-intl";

const t = useTranslations("namespace");
```

**서버 컴포넌트:**
```typescript
import { getTranslations } from "next-intl/server";

const t = await getTranslations("namespace");
```

---

## 환경 설정

### 필수 환경 변수 (`.env.local`)

```bash
AUTH_SECRET=                    # openssl rand -base64 32
GOOGLE_CLIENT_ID=               # Google OAuth (선택)
GOOGLE_CLIENT_SECRET=           # Google OAuth (선택)
```

### 개발 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```

---

## 참고 자료

- **프로젝트 상세**: `context.md`
- **개발 로드맵**: `context.md` > "개발 로드맵"
- **PRD**: `docs/PRD.md`
- **API 문서**: `docs/API.md`
- **데이터베이스**: `docs/DATABASE.md`

---

**마지막 업데이트**: 2026-01-15
