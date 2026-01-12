# add-session-to-page

페이지 컴포넌트에 NextAuth 세션 정보를 자동으로 추가합니다.

## 사용법

```
/add-session-to-page [파일경로]
```

## 실행 내용

1. 파일 상단에 `"use client"` 확인/추가
2. import 추가:
   ```typescript
   import { useSession } from "next-auth/react";
   import { useTranslations } from "next-intl";
   ```
3. 컴포넌트 내부에 다음 코드 추가:
   ```typescript
   const { data: session } = useSession();
   const levels = useTranslations("levels");

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
4. Header 컴포넌트에 `user={user}` prop 전달 확인

## 예시

Before:
```typescript
export default function MyPage() {
  return (
    <div>
      <Header />
      ...
    </div>
  );
}
```

After:
```typescript
"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function MyPage() {
  const { data: session } = useSession();
  const levels = useTranslations("levels");

  const user = session?.user
    ? {
        nickname: session.user.name || "사용자",
        level: 1,
        levelName: levels("1"),
        xp: 0,
        profileImage: session.user.image || undefined,
      }
    : null;

  return (
    <div>
      <Header user={user} />
      ...
    </div>
  );
}
```
