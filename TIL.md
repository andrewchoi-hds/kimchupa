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

## 참고: context.md의 기존 TIL

context.md에 추가로 6개의 TIL 항목이 있습니다:
1. Zustand + localStorage Persist 패턴
2. Toast 시스템 - Provider 없이 전역 알림
3. Next.js App Router 파일 업로드
4. 드래그앤드롭 이벤트
5. 연속 출석 스트릭 계산
6. Styled JSX로 커스텀 애니메이션
