# TODO

김추페 프로젝트 다음 할 일 목록 (우선순위별 정렬)

---

## P0 - 긴급 (다음 세션 필수)

### [ ] 사용자 정보 통합 완료

**설명**: CURRENT_USER 상수 제거, userStore를 Single Source of Truth로 통합

**작업 내용**:
1. `src/mockData.ts`에서 `CURRENT_USER` 상수 제거
2. 모든 컴포넌트에서 `CURRENT_USER` 참조를 `useUserStore()`로 교체
3. 게시글/댓글 작성 시 `userStore.profile` 사용

**관련 파일**:
- `src/mockData.ts`
- `src/stores/userStore.ts`
- `src/app/[locale]/(main)/community/write/page.tsx`

---

## P1 - 높음 (빠른 시일 내)

### [x] i18n 번역 완료 (P1 페이지) ✅ 2026-01-19

**완료**:
- `profile/page.tsx` - 프로필 메인 페이지 i18n
- `community/write/page.tsx` - 글쓰기 페이지 i18n
- `community/edit/[id]/page.tsx` - 글 수정 페이지 i18n

---

### [ ] i18n 번역 품질 검증 및 누락 항목 보완

**설명**: messages/ko.json과 en.json의 번역 키 일치 확인 및 품질 검토

**작업 내용**:
1. 양쪽 언어 파일 키 동기화 검증
2. 영어 번역 자연스러움 검토 (특히 김치 관련 전문 용어)
3. 누락된 번역 키 보완

**관련 파일**:
- `messages/ko.json`
- `messages/en.json`

---

### [ ] 프로필 편집 기능

**설명**: 닉네임, 자기소개, 프로필 이미지 편집 기능 구현

**작업 내용**:
1. ProfileEditModal 컴포넌트 생성
2. userStore 액션 연동
3. 저장 성공 시 toast 알림

**관련 파일**:
- `src/app/[locale]/(main)/profile/page.tsx`
- `src/stores/userStore.ts`

---

### [ ] 팔로우 기능

**설명**: 사용자 간 팔로우/언팔로우 기능

**작업 내용**:
1. `followsStore.ts` 생성 (Zustand + localStorage)
2. 프로필 페이지에 팔로우 버튼 추가
3. `/profile/followers`, `/profile/following` 페이지 생성

---

### [ ] 위키 레시피 페이지

**설명**: `/wiki/[id]/recipe` 경로에 김치 레시피 페이지 생성

**작업 내용**:
1. recipe 페이지 생성
2. mockData에 레시피 데이터 추가
3. 재료/단계별 UI 구현

---

### [ ] 게시글 조회수 중복 방지

**설명**: 같은 사용자의 24시간 내 중복 조회 방지

**작업 내용**:
1. `viewHistoryStore.ts` 생성
2. `postsStore.incrementViewCount()` 수정

---

### [ ] 알림 시스템 (기본)

**설명**: 댓글, 좋아요, 팔로우 시 알림

**작업 내용**:
1. `notificationsStore.ts` 생성
2. Header에 알림 아이콘 추가
3. 알림 드롭다운 구현

---

## P2 - 중간 (여유 있을 때)

### [ ] toastStore 메시지 i18n

**설명**: Toast 알림 메시지들 국제화

**작업 내용**:
1. `messages/ko.json`, `en.json`에 `toasts` 네임스페이스 추가
2. 각 toast 호출처에서 번역된 메시지 전달

### [ ] 태그 자동완성

게시글 작성 시 인기/최근 태그 추천

### [ ] 다크모드 토글

Header에 다크모드 전환 버튼 추가

### [ ] 영어 번역 품질 검토 (High 상향 검토)

**설명**: 번역 일관성, 문법, 어조 검토

**작업 내용**:
1. 김치 관련 전문 용어 (fermentation, pairing 등) 검토
2. 커뮤니티 섹션 친근한 어조 확인
3. UI 텍스트 일관성 검토

---

### [ ] 위키 레시피 페이지 구현

**설명**: `/wiki/[id]/recipe` 경로에 김치 레시피 상세 페이지 생성

**작업 내용**:
1. recipe 페이지 생성
2. mockData에 레시피 데이터 추가 (재료, 단계별 설명, 난이도)
3. 단계별 이미지 포함 UI 구현

**관련 파일**:
- `src/app/[locale]/(main)/wiki/[id]/recipe/page.tsx`
- `src/mockData.ts`

---

### [ ] 게시글 조회수 중복 방지 시스템

**설명**: 같은 사용자의 24시간 내 중복 조회 방지

**작업 내용**:
1. `viewHistoryStore.ts` 생성 (localStorage: { postId: lastViewedAt })
2. `postsStore.incrementViewCount()` 수정
3. 24시간 경과 후 재카운트 허용

---

### [ ] 다크모드 토글 구현

**설명**: Header에 다크모드 전환 버튼 추가

**작업 내용**:
1. `themeStore.ts` 생성 (localStorage persist)
2. Header에 해/달 아이콘 토글 버튼 추가
3. `<html>` 태그에 dark 클래스 토글

**참고**: Tailwind dark: 클래스 이미 적용됨

---

## Phase 3 준비사항

- [ ] localStorage → DB 마이그레이션 전략 수립
- [ ] Prisma 스키마 설계
- [ ] PostgreSQL 로컬 환경 구축 (Docker)

---

## 알려진 이슈

| 이슈 | 영향도 | 해결 방법 |
|------|--------|----------|
| 사용자 정보 3곳 관리 | High | P0 작업으로 해결 |
| 팔로워/팔로잉 0 고정 | Medium | 팔로우 기능 구현 |
| 조회수 중복 카운트 | Medium | viewHistoryStore 생성 |

---

**마지막 업데이트**: 2026-01-19
