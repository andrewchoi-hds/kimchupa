# 김추페 (KimchuPa) - API 명세서

## 1. API 개요

### 1.1 Base URL
- Production: `https://api.kimchupa.com/v1`
- Staging: `https://api.staging.kimchupa.com/v1`
- Development: `http://localhost:3000/v1`

### 1.2 공통 헤더
```http
Content-Type: application/json
Accept: application/json
Accept-Language: ko | en | ja | zh-CN | zh-TW | es
Authorization: Bearer {access_token}
X-Request-ID: {uuid}
```

### 1.3 응답 형식

**성공 응답**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**에러 응답**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### 1.4 에러 코드
| HTTP Status | Code | 설명 |
|-------------|------|------|
| 400 | VALIDATION_ERROR | 입력값 검증 실패 |
| 401 | UNAUTHORIZED | 인증 필요 |
| 403 | FORBIDDEN | 권한 없음 (레벨 부족 등) |
| 404 | NOT_FOUND | 리소스 없음 |
| 409 | CONFLICT | 리소스 충돌 |
| 429 | RATE_LIMITED | 요청 제한 초과 |
| 500 | INTERNAL_ERROR | 서버 에러 |

### 1.5 레벨 기반 권한
| 기능 | 필요 레벨 |
|------|----------|
| 위키 열람 | 0 (비회원) |
| 댓글 작성 | 2 |
| 게시글 작성 | 3 |
| 레시피 등록 | 4 |
| 위키 편집 제안 | 4 |
| 위키 직접 편집 | 5 |
| DM 전송 | 4 |

---

## 2. Auth API (인증)

### 2.1 회원가입

**POST** `/auth/signup`

```json
// Request
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "username": "kimchilover",
  "name": "홍길동",
  "language": "ko",
  "agreeTerms": true,
  "agreeMarketing": false
}

// Response 201
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "kimchilover",
      "emailVerified": false
    },
    "message": "Verification email sent"
  }
}
```

### 2.2 로그인

**POST** `/auth/login`

```json
// Request
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "kimchilover",
      "level": 3,
      "levelName": "김치 애호가",
      "totalXp": 650
    }
  }
}
```

### 2.3 소셜 로그인

**POST** `/auth/social/{provider}`

provider: `google` | `kakao` | `apple`

```json
// Request
{
  "idToken": "provider_id_token_here"
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "isNewUser": false,
    "user": { ... }
  }
}
```

### 2.4 토큰 갱신

**POST** `/auth/refresh`

```json
// Request
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// Response 200
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "expiresIn": 3600
  }
}
```

---

## 3. Users API (사용자)

### 3.1 내 정보 조회

**GET** `/users/me`

```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "kimchilover",
    "name": "홍길동",
    "bio": "김치를 사랑하는 사람입니다",
    "profileImageUrl": "https://...",
    "language": "ko",
    "level": 3,
    "levelName": "김치 애호가",
    "totalXp": 650,
    "xpToNextLevel": 350,
    "badges": [
      { "code": "early_member", "name": "초기 멤버", "iconUrl": "..." }
    ],
    "stats": {
      "postCount": 15,
      "recipeCount": 3,
      "followerCount": 42,
      "followingCount": 28
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.2 내 정보 수정

**PATCH** `/users/me`

```json
// Request
{
  "name": "홍길순",
  "bio": "김치 마니아입니다",
  "language": "en"
}

// Response 200
{
  "success": true,
  "data": { ... }
}
```

### 3.3 프로필 이미지 업로드

**POST** `/users/me/profile-image`

```http
Content-Type: multipart/form-data
image: (binary)
```

### 3.4 사용자 프로필 조회 (타인)

**GET** `/users/{username}`

```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "kimchimaster",
    "name": "김치달인",
    "bio": "...",
    "profileImageUrl": "...",
    "level": 5,
    "levelName": "김치 달인",
    "badges": [...],
    "stats": {
      "postCount": 150,
      "recipeCount": 45,
      "followerCount": 1200,
      "followingCount": 50
    },
    "isFollowing": false,
    "createdAt": "2023-06-01T00:00:00Z"
  }
}
```

### 3.5 취향 프로필 조회/수정

**GET** `/users/me/preferences`
**PUT** `/users/me/preferences`

```json
// Request (PUT)
{
  "spicyLevel": 3,
  "fermentationLevel": 2,
  "preferredIngredients": ["배추", "무"],
  "dislikedIngredients": ["젓갈"],
  "dietaryRestrictions": ["vegan"],
  "preferredCategories": ["traditional"]
}
```

---

## 4. Gamification API (레벨/뱃지)

### 4.1 내 레벨 정보

**GET** `/gamification/me`

```json
// Response 200
{
  "success": true,
  "data": {
    "level": 4,
    "levelName": "김치 마니아",
    "totalXp": 2350,
    "currentLevelXp": 350,
    "xpToNextLevel": 1650,
    "nextLevelName": "김치 달인",
    "permissions": {
      "canComment": true,
      "canPost": true,
      "canCreateRecipe": true,
      "canSuggestWikiEdit": true,
      "canEditWiki": false,
      "canSendDM": true
    },
    "rank": 156
  }
}
```

### 4.2 경험치 이력

**GET** `/gamification/me/xp-history`

```json
// Query: ?page=1&limit=20

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 20,
      "balanceAfter": 2350,
      "actionType": "post_create",
      "description": "게시글 작성",
      "referenceType": "post",
      "referenceId": "post-uuid",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": { ... }
}
```

### 4.3 내 뱃지 목록

**GET** `/gamification/me/badges`

```json
// Response 200
{
  "success": true,
  "data": {
    "earned": [
      {
        "code": "early_member",
        "name": "초기 멤버",
        "description": "서비스 초기 가입자",
        "iconUrl": "...",
        "category": "special",
        "rarity": "rare",
        "earnedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "available": [
      {
        "code": "recipe_expert",
        "name": "레시피 전문가",
        "description": "레시피 50개 등록",
        "progress": 12,
        "target": 50,
        "iconUrl": "..."
      }
    ]
  }
}
```

### 4.4 출석 체크

**POST** `/gamification/attendance`

```json
// Response 200
{
  "success": true,
  "data": {
    "xpEarned": 5,
    "streakCount": 7,
    "bonusXp": 10,
    "message": "7일 연속 출석! 보너스 경험치 10 획득"
  }
}

// Response 400 (이미 출석)
{
  "success": false,
  "error": {
    "code": "ALREADY_CHECKED",
    "message": "Already checked in today"
  }
}
```

### 4.5 랭킹 조회

**GET** `/gamification/rankings`

```json
// Query: ?type=xp&period=all&page=1&limit=20
// type: xp, posts, recipes
// period: all, monthly, weekly

// Response 200
{
  "success": true,
  "data": {
    "rankings": [
      {
        "rank": 1,
        "user": {
          "id": "uuid",
          "username": "kimchiking",
          "profileImageUrl": "...",
          "level": 7
        },
        "value": 85000
      }
    ],
    "myRank": {
      "rank": 156,
      "value": 2350
    }
  }
}
```

---

## 5. Wiki API (김치 위키)

### 5.1 위키 문서 목록

**GET** `/wiki`

```json
// Query: ?type=kimchi_type&lang=ko&page=1&limit=20

// Response 200
{
  "success": true,
  "data": [
    {
      "slug": "baechu-kimchi",
      "type": "kimchi_type",
      "name": "배추김치",
      "summary": "대한민국을 대표하는 김치",
      "thumbnailUrl": "...",
      "spicyLevel": 3,
      "fermentationLevel": 2,
      "viewCount": 15234
    }
  ],
  "meta": { ... }
}
```

### 5.2 위키 문서 상세

**GET** `/wiki/{slug}`

```json
// Query: ?lang=ko

// Response 200
{
  "success": true,
  "data": {
    "slug": "baechu-kimchi",
    "type": "kimchi_type",
    "content": {
      "name": "배추김치",
      "description": "가장 대표적인 한국 김치...",
      "body": "## 개요\n배추김치는...",
      "summary": "대한민국을 대표하는 김치"
    },
    "attributes": {
      "spicyLevel": 3,
      "fermentationLevel": 2,
      "mainIngredients": ["배추", "고춧가루", "마늘", "젓갈"],
      "subIngredients": ["파", "생강"],
      "allergens": ["새우", "멸치"],
      "storageMethod": "refrigerated",
      "shelfLifeDays": { "min": 14, "max": 90 },
      "originRegion": "전국",
      "bestFor": ["밥반찬", "김치찌개", "김치볶음밥"],
      "nutrition": {
        "servingSize": "100g",
        "calories": 15,
        "sodium": 670
      }
    },
    "images": [
      { "url": "...", "caption": "배추김치", "isPrimary": true }
    ],
    "videos": [
      { "url": "https://youtube.com/...", "title": "배추김치 담그는 법" }
    ],
    "relatedArticles": [
      { "slug": "kkakdugi", "name": "깍두기" }
    ],
    "affiliateProducts": [
      {
        "id": "prod-uuid",
        "name": "종가집 배추김치 1kg",
        "price": 15000,
        "imageUrl": "...",
        "partner": "coupang"
      }
    ],
    "viewCount": 15234,
    "lastEditedAt": "2024-01-10T00:00:00Z",
    "lastEditedBy": "kimchimaster"
  }
}
```

### 5.3 위키 검색

**GET** `/wiki/search`

```json
// Query: ?q=배추&spicyLevel=3&lang=ko

// Response 200
{
  "success": true,
  "data": {
    "results": [...],
    "suggestions": ["배추김치", "배추겉절이"],
    "total": 15
  }
}
```

### 5.4 위키 편집 제안 (레벨 4)

**POST** `/wiki/{slug}/suggestions`

```json
// Request
{
  "field": "content.ko.body",
  "newValue": "## 개요\n수정된 내용...",
  "reason": "더 정확한 정보로 업데이트"
}

// Response 201
{
  "success": true,
  "data": {
    "suggestionId": "uuid",
    "status": "pending",
    "message": "편집 제안이 제출되었습니다"
  }
}
```

### 5.5 위키 직접 편집 (레벨 5+)

**PATCH** `/wiki/{slug}`

```json
// Request
{
  "field": "content.ko.body",
  "value": "## 개요\n수정된 내용...",
  "summary": "오타 수정"
}

// Response 200
{
  "success": true,
  "data": {
    "version": 16,
    "xpEarned": 30,
    "message": "편집이 완료되었습니다"
  }
}
```

### 5.6 위키 편집 히스토리

**GET** `/wiki/{slug}/history`

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "version": 15,
      "editor": { "username": "kimchimaster", "level": 6 },
      "summary": "영양 정보 업데이트",
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

---

## 6. Community API (커뮤니티)

### 6.1 게시글 목록

**GET** `/community/posts`

```json
// Query: ?type=recipe&sort=latest&page=1&limit=20
// type: recipe, free, qna, review, diary
// sort: latest, popular, trending

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "post-uuid",
      "type": "recipe",
      "author": {
        "id": "user-uuid",
        "username": "kimchilover",
        "profileImageUrl": "...",
        "level": 4,
        "badges": ["recipe_expert"]
      },
      "title": "묵은지 김치찌개 황금 레시피",
      "summary": "깊은 맛이 나는 묵은지 김치찌개...",
      "thumbnailUrl": "...",
      "likeCount": 234,
      "commentCount": 45,
      "viewCount": 5678,
      "isBest": true,
      "createdAt": "2024-01-10T00:00:00Z"
    }
  ]
}
```

### 6.2 게시글 상세

**GET** `/community/posts/{postId}`

```json
// Response 200
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "type": "recipe",
    "author": { ... },
    "title": "묵은지 김치찌개 황금 레시피",
    "content": "## 재료\n- 묵은지 300g\n...",
    "recipe": {
      "servings": 2,
      "prepTime": 10,
      "cookTime": 30,
      "difficulty": "easy",
      "ingredients": [
        { "name": "묵은지", "amount": "300", "unit": "g", "isMain": true }
      ],
      "steps": [
        { "order": 1, "description": "묵은지를 먹기 좋게 썹니다", "imageUrl": "..." }
      ],
      "tips": ["돼지고기 대신 참치를 넣어도 맛있어요"],
      "relatedKimchi": {
        "slug": "muk-eun-ji",
        "name": "묵은지"
      }
    },
    "images": [...],
    "tags": ["김치찌개", "묵은지", "간단요리"],
    "likeCount": 234,
    "commentCount": 45,
    "viewCount": 5679,
    "bookmarkCount": 89,
    "isLiked": false,
    "isBookmarked": true,
    "isBest": true,
    "createdAt": "2024-01-10T00:00:00Z"
  }
}
```

### 6.3 게시글 작성 (레벨 3+)

**POST** `/community/posts`

```json
// Request
{
  "type": "recipe",
  "title": "나만의 김치볶음밥",
  "content": "## 재료\n...",
  "recipe": {
    "servings": 2,
    "prepTime": 5,
    "cookTime": 10,
    "difficulty": "easy",
    "ingredients": [...],
    "steps": [...]
  },
  "tags": ["김치볶음밥", "간단요리"],
  "images": ["https://..."]
}

// Response 201
{
  "success": true,
  "data": {
    "id": "post-uuid",
    "xpEarned": 20,
    "message": "게시글이 등록되었습니다"
  }
}
```

### 6.4 게시글 수정/삭제

**PATCH** `/community/posts/{postId}`
**DELETE** `/community/posts/{postId}`

### 6.5 좋아요 / 북마크

**POST** `/community/posts/{postId}/like`
**DELETE** `/community/posts/{postId}/like`
**POST** `/community/posts/{postId}/bookmark`
**DELETE** `/community/posts/{postId}/bookmark`

```json
// Response 200
{
  "success": true,
  "data": {
    "likeCount": 235
  }
}
```

### 6.6 댓글 목록

**GET** `/community/posts/{postId}/comments`

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "comment-uuid",
      "author": { ... },
      "content": "정말 맛있어 보여요!",
      "likeCount": 15,
      "replyCount": 3,
      "isLiked": false,
      "createdAt": "2024-01-11T00:00:00Z",
      "replies": [
        {
          "id": "reply-uuid",
          "author": { ... },
          "content": "감사합니다!",
          "likeCount": 2,
          "createdAt": "2024-01-11T01:00:00Z"
        }
      ]
    }
  ]
}
```

### 6.7 댓글 작성 (레벨 2+)

**POST** `/community/posts/{postId}/comments`

```json
// Request
{
  "content": "정말 맛있어 보여요!",
  "parentId": null  // 대댓글인 경우 부모 댓글 ID
}

// Response 201
{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "xpEarned": 5
  }
}
```

### 6.8 김치 일기 작성

**POST** `/community/posts` (type: "diary")

```json
// Request
{
  "type": "diary",
  "title": "2024년 봄 김장 일기",
  "content": "올해 처음으로 김치를 담가봅니다",
  "diary": {
    "kimchiType": "baechu-kimchi",
    "startDate": "2024-01-10",
    "entries": [
      {
        "day": 1,
        "note": "김장을 시작했습니다",
        "temperature": 4,
        "imageUrls": ["https://..."]
      }
    ]
  }
}
```

### 6.9 김치 일기 엔트리 추가

**POST** `/community/posts/{postId}/diary-entries`

```json
// Request
{
  "note": "2일차, 발효가 시작되는 것 같습니다",
  "temperature": 5,
  "imageUrls": ["https://..."]
}

// Response 200
{
  "success": true,
  "data": {
    "day": 2,
    "xpEarned": 15
  }
}
```

---

## 7. Affiliate API (제휴 링크)

### 7.1 상품 목록

**GET** `/affiliate/products`

```json
// Query: ?kimchiType=baechu-kimchi&partner=coupang&page=1

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "prod-uuid",
      "name": "종가집 배추김치 1kg",
      "description": "...",
      "imageUrl": "...",
      "price": 15000,
      "currency": "KRW",
      "partner": {
        "code": "coupang",
        "name": "쿠팡"
      },
      "kimchiType": "baechu-kimchi",
      "spicyLevel": 3,
      "isAvailable": true
    }
  ]
}
```

### 7.2 상품 상세 & 구매 링크

**GET** `/affiliate/products/{productId}`

```json
// Response 200
{
  "success": true,
  "data": {
    "id": "prod-uuid",
    "name": "종가집 배추김치 1kg",
    "description": "...",
    "imageUrl": "...",
    "price": 15000,
    "currency": "KRW",
    "partner": {
      "code": "coupang",
      "name": "쿠팡",
      "logoUrl": "..."
    },
    "affiliateUrl": "https://link.coupang.com/...",
    "relatedWiki": {
      "slug": "baechu-kimchi",
      "name": "배추김치"
    },
    "reviews": {
      "count": 45,
      "averageRating": 4.5
    }
  }
}
```

### 7.3 제휴 링크 클릭 추적

**POST** `/affiliate/click`

```json
// Request
{
  "productId": "prod-uuid",
  "sourcePage": "wiki",
  "sourceId": "baechu-kimchi"
}

// Response 200
{
  "success": true,
  "data": {
    "redirectUrl": "https://link.coupang.com/...",
    "xpEarned": 1
  }
}
```

### 7.4 가격 비교

**GET** `/affiliate/products/{productId}/compare`

```json
// Response 200
{
  "success": true,
  "data": {
    "productName": "배추김치 1kg",
    "prices": [
      {
        "partner": "coupang",
        "price": 15000,
        "isAvailable": true,
        "affiliateUrl": "..."
      },
      {
        "partner": "naver",
        "price": 14500,
        "isAvailable": true,
        "affiliateUrl": "..."
      }
    ]
  }
}
```

---

## 8. Recommendations API (추천)

### 8.1 개인화 추천

**GET** `/recommendations/personalized`

```json
// Response 200
{
  "success": true,
  "data": {
    "forYou": [
      {
        "slug": "baechu-kimchi",
        "name": "배추김치",
        "reason": "매운맛 3단계 선호 기반",
        "thumbnailUrl": "...",
        "spicyLevel": 3
      }
    ],
    "trending": [...],
    "seasonal": [...]
  }
}
```

### 8.2 퀴즈 기반 추천

**POST** `/recommendations/quiz`

```json
// Request
{
  "spicyPreference": 3,
  "fermentationPreference": 2,
  "usage": "밥반찬",
  "dietaryRestrictions": []
}

// Response 200
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "kimchi": {
          "slug": "baechu-kimchi",
          "name": "배추김치",
          "thumbnailUrl": "..."
        },
        "matchScore": 95,
        "matchReasons": [
          "매운맛 레벨이 딱 맞아요",
          "밥반찬으로 최고예요"
        ],
        "affiliateProducts": [...]
      }
    ],
    "xpEarned": 10
  }
}
```

---

## 9. Social API (소셜)

### 9.1 팔로우

**POST** `/users/{userId}/follow`
**DELETE** `/users/{userId}/follow`

```json
// Response 200
{
  "success": true,
  "data": {
    "isFollowing": true,
    "followerCount": 43
  }
}
```

### 9.2 팔로워/팔로잉 목록

**GET** `/users/{userId}/followers`
**GET** `/users/{userId}/following`

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "user-uuid",
      "username": "kimchifan",
      "profileImageUrl": "...",
      "level": 3,
      "isFollowing": true
    }
  ]
}
```

### 9.3 신고

**POST** `/reports`

```json
// Request
{
  "targetType": "post",
  "targetId": "post-uuid",
  "reason": "spam",
  "description": "광고성 게시글입니다"
}

// Response 201
{
  "success": true,
  "data": {
    "reportId": "uuid",
    "message": "신고가 접수되었습니다"
  }
}
```

---

## 10. Challenges API (챌린지)

### 10.1 챌린지 목록

**GET** `/challenges`

```json
// Query: ?status=active

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "challenge-uuid",
      "title": "2024 봄 김장 챌린지",
      "description": "봄배추로 김치를 담가보세요!",
      "type": "kimchi_making",
      "startDate": "2024-03-01",
      "endDate": "2024-03-31",
      "participantCount": 234,
      "rewards": {
        "participationXp": 50,
        "winnerXp": 500
      },
      "isParticipating": false,
      "status": "active"
    }
  ]
}
```

### 10.2 챌린지 참여

**POST** `/challenges/{challengeId}/participate`

```json
// Request
{
  "postId": "diary-post-uuid"
}

// Response 200
{
  "success": true,
  "data": {
    "xpEarned": 50,
    "message": "챌린지에 참여하셨습니다!"
  }
}
```

---

## 11. Search API (검색)

### 11.1 통합 검색

**GET** `/search`

```json
// Query: ?q=배추김치&type=all

// Response 200
{
  "success": true,
  "data": {
    "wiki": [
      { "slug": "baechu-kimchi", "name": "배추김치", "type": "kimchi_type" }
    ],
    "posts": [
      { "id": "post-uuid", "title": "배추김치 담그는 법", "type": "recipe" }
    ],
    "products": [
      { "id": "prod-uuid", "name": "종가집 배추김치", "partner": "coupang" }
    ],
    "suggestions": ["배추김치 담그기", "배추겉절이"]
  }
}
```

### 11.2 인기 검색어

**GET** `/search/trending`

```json
// Response 200
{
  "success": true,
  "data": [
    { "keyword": "김장", "count": 1500 },
    { "keyword": "묵은지", "count": 1200 }
  ]
}
```

---

## 12. Notifications API (알림)

### 12.1 알림 목록

**GET** `/notifications`

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "notif-uuid",
      "type": "level_up",
      "title": "레벨업!",
      "message": "김치 마니아가 되셨습니다!",
      "data": { "newLevel": 4 },
      "isRead": false,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "unreadCount": 5
  }
}
```

### 12.2 알림 읽음 처리

**PATCH** `/notifications/{notificationId}/read`
**POST** `/notifications/read-all`

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2026-01-12 | - | 최초 작성 |
| 2.0 | 2026-01-12 | - | 어필리에이트, Gamification, Wiki API 반영 (커머스 제거) |
