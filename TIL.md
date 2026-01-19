# TIL (Today I Learned)

김추페 프로젝트 개발 중 배운 것들을 정리합니다.

---

## 2026-01-15

### 1. Web Crypto API를 활용한 클라이언트 사이드 비밀번호 해싱

브라우저 내장 `crypto.subtle.digest` API로 SHA-256 해싱 구현:

```typescript
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
```

- 외부 라이브러리 없이 브라우저 네이티브 API 활용
- `padStart(2, "0")`로 16진수 형식 유지
- **주의**: 클라이언트 해싱은 전송 보안용, DB 저장 시 서버에서 재해싱 필요

---

### 2. Next.js App Router의 Suspense + useSearchParams 패턴

`useSearchParams`를 서버 컴포넌트에서 직접 사용하면 에러 발생. Suspense로 래핑 필요:

```typescript
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams(); // 안전하게 사용
  const page = Number(searchParams.get("page")) || 1;
}
```

- Suspense를 사용하면 Next.js가 동적 렌더링으로 전환
- 로딩 상태를 명시적으로 제어 가능

---

### 3. 비밀번호 강도 실시간 검증 UI

정규식 기반 4단계 검증 + 진행 바:

```typescript
const getPasswordStrength = () => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-zA-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
  return strength;
};

const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
```

- 색상 코딩으로 직관적 피드백 제공
- 진행 바 너비를 `strength * 25%`로 동적 조정

---

### 4. 임시저장(Draft) 복구 시 타이밍 이슈

Zustand persist는 비동기로 localStorage 읽기. 즉시 체크하면 초기값 반환:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    if (hasDraft() && !hasShownRestoreModal) {
      setShowRestoreModal(true);
    }
  }, 100); // 100ms 지연으로 안정적 체크

  return () => clearTimeout(timer);
}, []);
```

---

### 5. 페이지네이션 마지막 페이지 버그

20개 단위 페이지네이션에서 정확히 20배수일 때 빈 페이지 생성 방지:

```typescript
const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
const safePage = Math.min(currentPage, totalPages || 1);
```

- URL 파라미터 직접 입력 시 마지막 페이지로 리다이렉트
- 0 이하 페이지는 1로 처리

---

### 6. 댓글 답글 중첩 시 무한 루프 방지

depth 제한 (2단계만 허용):

```typescript
addComment: (postId, content, author, parentId) => {
  if (parentId) {
    const parentComment = comments.find(c => c.id === parentId);
    if (parentComment?.parentId) {
      throw new Error("답글의 답글은 작성할 수 없습니다.");
    }
  }
}
```

UI에서도 1단계 댓글에만 답글 버튼 표시.

---

### 7. Next-intl 네임스페이스 분리 전략

페이지별로 네임스페이스를 분리하면 번역 관리 용이:

```json
{
  "common": { "confirm": "확인", "cancel": "취소" },
  "auth": { "login": "로그인", "signup": "회원가입" },
  "community": { "write": "글쓰기", "filter": "필터" }
}
```

```typescript
const t = useTranslations("community");
t("write"); // "글쓰기"
```

---

### 8. NextAuth 5.0 Beta의 Credentials Provider

`authorize` 함수에서 객체 반환 패턴:

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const result = await authenticateUser(
          credentials.email as string,
          credentials.password as string
        );

        if (result.success && result.user) {
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.nickname,
          };
        }
        return null;
      }
    })
  ]
});
```

---

### 9. 이미지 경로 혼동 (public vs uploads)

Next.js는 `public/` 하위를 `/`로 서빙:
- 저장: `public/uploads/image.jpg`
- 참조: `/uploads/image.jpg` (O)
- 참조: `public/uploads/image.jpg` (X)

```typescript
return NextResponse.json({
  url: `/uploads/${filename}`, // 상대 경로
});
```

---

### 10. 낙관적 UI 업데이트 (Optimistic Update)

좋아요 버튼 클릭 시 즉시 UI 반영:

```typescript
const handleLike = () => {
  // 1. 낙관적 UI 업데이트
  setIsLiked(!isLiked);
  setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

  // 2. Store 업데이트
  toggleLike(postId, userId);
};
```

- localStorage 기반이라 충돌 가능성 낮음
- 서버 연동 시 실패 케이스 처리(rollback) 필요

---

### 11. Validation 계층 분리

```
UI Layer (실시간 피드백)
  ↓
Validation Layer (authStore.validatePassword)
  ↓
Business Logic (authStore.registerUser)
```

UI에서 실시간 힌트, Submit에서 최종 검증으로 이중 방어.

---

## 2026-01-16

### 12. next-intl 변수 보간 (Interpolation)

번역 메시지에 동적 값을 삽입하는 패턴:

```json
// messages/ko.json
{
  "wiki": {
    "totalTypes": "총 {count}개의 김치",
    "pagination": "총 {total}개 중 {start}-{end}개 표시"
  }
}
```

```typescript
const t = useTranslations("wiki");

// 단일 변수
t("totalTypes", { count: 45 });  // "총 45개의 김치"

// 복수 변수
t("pagination", { total: 100, start: 1, end: 20 });
// "총 100개 중 1-20개 표시"
```

- 중괄호 `{variable}` 형식으로 변수 선언
- 객체로 변수값 전달
- 숫자, 문자열 모두 지원
- **주의**: 변수명 오타 시 그대로 출력됨 (에러 없음)

---

## 2026-01-19

### 13. next-intl 클라이언트/서버 컴포넌트 분리 패턴

next-intl을 사용할 때 컴포넌트 타입에 따라 다른 함수 사용:

```typescript
// 클라이언트 컴포넌트
"use client";
import { useTranslations } from "next-intl";
const t = useTranslations("community");

// 서버 컴포넌트
import { getTranslations } from "next-intl/server";
const t = await getTranslations("community");
```

- SSR/CSR 최적화와 연계되어 번들 사이즈 감소
- 서버 컴포넌트에서는 반드시 `await` 사용

---

### 14. i18n 메시지 네임스페이스 구조화

대규모 번역 파일 관리 패턴:

```json
{
  "community": {
    "title": "커뮤니티",
    "form": {
      "title": "제목",
      "content": "내용"
    },
    "toast": {
      "loginRequired": "로그인 필요"
    },
    "breadcrumb": {
      "home": "홈",
      "edit": "수정"
    }
  }
}
```

- 네임스페이스별 분리로 유지보수 용이
- 번역 키 충돌 방지
- 필요한 네임스페이스만 로드 가능

---

### 15. React 19 use() 훅으로 Promise params 처리

Next.js 16 (React 19 기반)에서 동적 라우트 params 처리:

```typescript
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params); // Promise unwrap
}
```

- Next.js 15 이전: `params: { id: string }` 직접 접근
- Next.js 16+: `params: Promise<{ id: string }>` → `use()` 필수

---

### 16. Breadcrumb 네비게이션 i18n 패턴

```typescript
<nav>
  <Link href="/">{t("breadcrumb.home")}</Link>
  <span>/</span>
  <Link href="/community">{t("title")}</Link>
  <span>/</span>
  <span>{t("breadcrumb.edit")}</span>
</nav>
```

- 각 레벨별 번역 키 분리
- 동적 경로는 URL 파라미터 유지 + 번역된 텍스트 표시

---

### 17. 게시글 수정 권한 검증 3단계 패턴

```typescript
// 1. 로그인 여부
if (status === "unauthenticated") {
  toast.error(t("toast.loginRequired"));
  router.push("/login");
}

// 2. 작성자 본인 확인
if (post.author.id !== profile.id) {
  toast.error(t("toast.noPermission"));
  router.push(`/community/${id}`);
}

// 3. 로딩 중 보호
if (status === "loading" || !post) {
  return <Loading />;
}
```

- 보안 + UX 동시 고려
- 각 단계별 적절한 에러 메시지 표시

---

### 18. 폼 자동저장 타이머 클린업 패턴

```typescript
const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (autoSaveTimerRef.current) {
    clearInterval(autoSaveTimerRef.current);
  }

  autoSaveTimerRef.current = setInterval(() => {
    performAutoSave();
  }, 30000);

  return () => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
  };
}, [performAutoSave]);
```

- `useRef`로 타이머 ID 저장 (리렌더링 방지)
- cleanup 함수로 메모리 누수 방지
- 의존성 변경 시 기존 타이머 제거 후 재시작

---

### 19. 게시판별 레벨 제한 UI/UX 패턴

```typescript
const postTypes = [
  { id: "free", minLevel: 1 },
  { id: "recipe", minLevel: 2 },
];

const isAvailable = profile.level >= type.minLevel;

<button
  disabled={!isAvailable}
  className={isAvailable ? "bg-purple-600" : "opacity-50 cursor-not-allowed"}
>
  {type.label}
  {!isAvailable && <span>Lv.{type.minLevel}+</span>}
</button>
```

- 접근 불가 시 disable + 레벨 요구사항 표시
- Submit 시 재검증으로 이중 방어

---

### 20. i18n 번역 누락 시 폴백 동작

next-intl에서 번역 키가 없을 때:
- `t('community.editPost')` 호출
- `messages/ko.json`에 해당 키가 없음
- 화면에 `community.editPost` 그대로 출력 (에러 없음)

**예방책:**
1. TypeScript 타입 안전성 활용 (next-intl-plugin)
2. 번역 키 추가 시 ko/en.json 함께 업데이트
3. CI/CD에서 번역 누락 검증 스크립트 실행

---

### 21. 프로필 이미지 폴백 이모지 패턴

```typescript
<ProfileImageUpload
  currentImage={profile.profileImage ?? undefined}
  fallbackEmoji={LEVEL_EMOJIS[profile.level]}
  onImageChange={setProfileImage}
/>

// LEVEL_EMOJIS 매핑
export const LEVEL_EMOJIS = [
  "🌱", // Lv.1 김치 새싹
  "🥬", // Lv.2 김치 입문자
  // ...
];
```

- 기본 상태에서도 시각적 피드백 제공
- 레벨 시스템과 연계하여 성장 동기 부여
- 서버 저장공간 절약

---

## 참고: context.md의 기존 TIL

context.md에 추가로 6개의 TIL 항목이 있습니다:
1. Zustand + localStorage Persist 패턴
2. Toast 시스템 - Provider 없이 전역 알림
3. Next.js App Router 파일 업로드
4. 드래그앤드롭 이벤트
5. 연속 출석 스트릭 계산
6. Styled JSX로 커스텀 애니메이션
