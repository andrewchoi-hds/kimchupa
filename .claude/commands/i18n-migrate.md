# i18n-migrate

React 컴포넌트의 하드코딩된 텍스트를 next-intl로 변환합니다.

## 사용법

```
/i18n-migrate [파일경로]
```

## 실행 내용

1. 파일 상단에 `"use client"` 확인/추가
2. import 추가:
   ```typescript
   import { useTranslations } from "next-intl";
   ```
3. 하드코딩된 한국어/영어 텍스트 찾기
4. 적절한 네임스페이스와 키 생성
5. 텍스트를 `{t("key")}` 형식으로 교체
6. `messages/ko.json`, `messages/en.json`에 번역 키 추가

## 네임스페이스 규칙

| 컨텍스트 | 네임스페이스 | 예시 |
|---------|------------|------|
| 공통 UI | common | common.save, common.cancel |
| 네비게이션 | nav | nav.home, nav.wiki |
| 히어로 섹션 | hero | hero.title, hero.subtitle |
| 기능 소개 | features | features.recommendation.title |
| 인증 | auth | auth.login.title |
| 프로필 | profile | profile.stats.posts |
| 푸터 | footer | footer.copyright |

## 예시

Before:
```tsx
<h1>김추페에 오신 것을 환영합니다</h1>
<button>로그인</button>
```

After:
```tsx
const t = useTranslations("auth");
const nav = useTranslations("nav");

<h1>{t("login.subtitle")}</h1>
<button>{nav("login")}</button>
```

messages/ko.json:
```json
{
  "auth": {
    "login": {
      "subtitle": "김추페에 오신 것을 환영합니다"
    }
  },
  "nav": {
    "login": "로그인"
  }
}
```

messages/en.json:
```json
{
  "auth": {
    "login": {
      "subtitle": "Welcome to KimchuPa"
    }
  },
  "nav": {
    "login": "Login"
  }
}
```
