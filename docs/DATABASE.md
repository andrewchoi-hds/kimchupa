# 김추페 (KimchuPa) - 데이터베이스 설계

## 1. 데이터베이스 구성

### 1.1 데이터베이스 종류별 용도

| DB | 용도 | 서비스 |
|----|------|--------|
| PostgreSQL | 사용자, 게이미피케이션, 제휴 | Auth, User, Gamification, Affiliate |
| MongoDB | 위키, 커뮤니티 (유연한 스키마) | Wiki, Community |
| Redis | 캐싱, 세션, 랭킹 | 전체 서비스 |
| Elasticsearch | 검색 엔진 | Wiki, Community 검색 |

---

## 2. PostgreSQL 스키마

### 2.1 Users (사용자)

```sql
-- 사용자 기본 정보
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    bio TEXT,
    profile_image_url TEXT,
    role VARCHAR(20) DEFAULT 'user', -- user, moderator, admin
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
    email_verified BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'ko', -- ko, en, ja, zh-CN, zh-TW, es
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);

-- 소셜 로그인 연동
CREATE TABLE user_social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL, -- google, kakao, apple
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_user_social_user_id ON user_social_accounts(user_id);

-- 사용자 취향 프로필 (추천용)
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    spicy_level INTEGER CHECK (spicy_level BETWEEN 1 AND 5), -- 매운맛 선호도
    fermentation_level INTEGER CHECK (fermentation_level BETWEEN 1 AND 3), -- 발효 선호도
    preferred_ingredients TEXT[], -- 선호 재료
    disliked_ingredients TEXT[], -- 비선호 재료
    dietary_restrictions TEXT[], -- 식이 제한 (vegan, halal 등)
    preferred_categories TEXT[], -- 선호 카테고리
    quiz_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 알림 설정
CREATE TABLE user_notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_marketing BOOLEAN DEFAULT FALSE,
    email_community BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    push_likes BOOLEAN DEFAULT TRUE,
    push_comments BOOLEAN DEFAULT TRUE,
    push_follows BOOLEAN DEFAULT TRUE,
    push_level_up BOOLEAN DEFAULT TRUE,
    push_badge BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.2 Gamification (레벨/경험치/뱃지)

```sql
-- 레벨 정의
CREATE TABLE levels (
    level INTEGER PRIMARY KEY,
    name_ko VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    required_xp INTEGER NOT NULL,
    icon_url TEXT,
    description TEXT
);

-- 기본 레벨 데이터
INSERT INTO levels (level, name_ko, name_en, required_xp) VALUES
(1, '김치 새싹', 'Kimchi Sprout', 0),
(2, '김치 입문자', 'Kimchi Beginner', 100),
(3, '김치 애호가', 'Kimchi Lover', 500),
(4, '김치 마니아', 'Kimchi Enthusiast', 2000),
(5, '김치 달인', 'Kimchi Expert', 5000),
(6, '김치 장인', 'Kimchi Master', 15000),
(7, '김치 명인', 'Kimchi Legend', 50000);

-- 사용자 경험치
CREATE TABLE user_xp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1 REFERENCES levels(level),
    xp_to_next_level INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_xp_user_id ON user_xp(user_id);
CREATE INDEX idx_user_xp_total_xp ON user_xp(total_xp DESC);

-- 경험치 트랜잭션 (이력)
CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- 양수: 획득, 음수: 차감
    balance_after INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    -- attendance, post_create, comment_create, like_received,
    -- recipe_create, wiki_edit, diary_create, best_post, quiz_complete,
    -- affiliate_click, badge_earned
    reference_type VARCHAR(30), -- post, comment, wiki, etc.
    reference_id VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX idx_xp_transactions_created_at ON xp_transactions(created_at);

-- 뱃지 정의
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name_ko VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description_ko TEXT,
    description_en TEXT,
    icon_url TEXT,
    category VARCHAR(30) NOT NULL, -- activity, expertise, event, special
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
    condition_type VARCHAR(50), -- count_based, streak_based, one_time, manual
    condition_value JSONB, -- {"action": "post_create", "count": 100}
    xp_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자 뱃지
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_displayed BOOLEAN DEFAULT TRUE, -- 프로필에 표시 여부
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- 출석 체크
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    check_date DATE NOT NULL,
    streak_count INTEGER DEFAULT 1, -- 연속 출석 일수
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, check_date)
);

CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_check_date ON attendance(check_date);

-- 사용자 활동 통계 (뱃지 조건 확인용)
CREATE TABLE user_activity_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    post_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    like_given_count INTEGER DEFAULT 0,
    like_received_count INTEGER DEFAULT 0,
    recipe_count INTEGER DEFAULT 0,
    diary_count INTEGER DEFAULT 0,
    wiki_edit_count INTEGER DEFAULT 0,
    best_post_count INTEGER DEFAULT 0,
    max_attendance_streak INTEGER DEFAULT 0,
    affiliate_click_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.3 Affiliate (제휴 링크)

```sql
-- 제휴사 정보
CREATE TABLE affiliate_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL, -- coupang, naver, amazon, iherb
    name VARCHAR(100) NOT NULL,
    base_url TEXT NOT NULL,
    commission_rate DECIMAL(5, 2), -- 기본 수수료율
    api_key_encrypted TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 제휴 상품
CREATE TABLE affiliate_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES affiliate_partners(id),
    external_product_id VARCHAR(255) NOT NULL, -- 외부 쇼핑몰 상품 ID

    -- 상품 정보
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'KRW',
    original_url TEXT NOT NULL,

    -- 김치 속성 (매핑용)
    kimchi_type VARCHAR(100), -- 연결된 김치 종류
    spicy_level INTEGER,
    fermentation_level INTEGER,

    -- 상태
    is_available BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(partner_id, external_product_id)
);

CREATE INDEX idx_affiliate_products_partner_id ON affiliate_products(partner_id);
CREATE INDEX idx_affiliate_products_kimchi_type ON affiliate_products(kimchi_type);

-- 제휴 링크 클릭 로그
CREATE TABLE affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id), -- NULL if anonymous
    product_id UUID REFERENCES affiliate_products(id),
    partner_id UUID REFERENCES affiliate_partners(id),

    -- 추적 정보
    tracking_code VARCHAR(100) NOT NULL,
    source_page VARCHAR(100), -- wiki, recommendation, search
    source_id VARCHAR(100), -- 위키 페이지 ID 등

    -- 클라이언트 정보
    ip_address INET,
    user_agent TEXT,
    referer TEXT,

    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX idx_affiliate_clicks_product_id ON affiliate_clicks(product_id);
CREATE INDEX idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);
CREATE INDEX idx_affiliate_clicks_tracking_code ON affiliate_clicks(tracking_code);

-- 제휴 전환 (구매 완료)
CREATE TABLE affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    click_id UUID REFERENCES affiliate_clicks(id),
    partner_id UUID REFERENCES affiliate_partners(id),

    -- 전환 정보
    order_id VARCHAR(255), -- 제휴사 주문 ID
    order_amount DECIMAL(12, 2),
    commission_amount DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'KRW',

    -- 상태
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled

    converted_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_affiliate_conversions_click_id ON affiliate_conversions(click_id);
CREATE INDEX idx_affiliate_conversions_status ON affiliate_conversions(status);

-- 월별 제휴 수익 요약
CREATE TABLE affiliate_revenue_monthly (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID REFERENCES affiliate_partners(id),
    year_month VARCHAR(7) NOT NULL, -- '2024-01'
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    total_commission DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(partner_id, year_month)
);
```

### 2.4 Follow (팔로우)

```sql
-- 팔로우 관계
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- 팔로워/팔로잉 카운트 (캐싱용)
CREATE TABLE user_follow_counts (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.5 Reports (신고)

```sql
-- 신고
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id),

    -- 신고 대상
    target_type VARCHAR(30) NOT NULL, -- user, post, comment, wiki_edit
    target_id VARCHAR(100) NOT NULL,

    -- 신고 내용
    reason VARCHAR(50) NOT NULL, -- spam, harassment, inappropriate, misinformation, other
    description TEXT,

    -- 처리
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolution_note TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);
```

---

## 3. MongoDB 스키마

### 3.1 Wiki (김치 위키)

```javascript
// wiki_articles collection - 김치 종류
{
  _id: ObjectId,
  slug: "baechu-kimchi", // URL용 슬러그
  type: "kimchi_type", // kimchi_type, recipe, culture, guide

  // 다국어 콘텐츠
  content: {
    ko: {
      name: "배추김치",
      description: "가장 대표적인 한국 김치...",
      body: "## 개요\n배추김치는...", // Markdown
      summary: "대한민국을 대표하는 김치"
    },
    en: {
      name: "Napa Cabbage Kimchi",
      description: "The most iconic Korean kimchi...",
      body: "## Overview\nBaechu kimchi is...",
      summary: "Korea's signature kimchi"
    }
    // ja, zh-CN, zh-TW, es...
  },

  // 김치 속성 (kimchi_type일 때)
  attributes: {
    spicyLevel: 3,
    fermentationLevel: 2,
    mainIngredients: ["배추", "고춧가루", "마늘", "젓갈"],
    subIngredients: ["파", "생강", "찹쌀풀"],
    allergens: ["새우", "멸치"],
    storageMethod: "refrigerated",
    shelfLifeDays: { min: 14, max: 90 },
    originRegion: "전국",
    seasonalAvailability: ["all"], // all, spring, summer, fall, winter
    bestFor: ["밥반찬", "김치찌개", "김치볶음밥"],
    nutrition: {
      servingSize: "100g",
      calories: 15,
      sodium: 670,
      fiber: 2.4,
      vitaminC: 14
    }
  },

  // 미디어
  images: [
    { url: "https://...", caption: "배추김치", isPrimary: true }
  ],
  videos: [
    { url: "https://youtube.com/...", title: "배추김치 담그는 법" }
  ],

  // 연관 콘텐츠
  relatedArticles: [ObjectId, ObjectId], // 관련 위키 문서
  relatedRecipes: [ObjectId, ObjectId], // 관련 레시피

  // 제휴 상품 연결
  affiliateProductIds: ["prod-uuid-1", "prod-uuid-2"],

  // 메타데이터
  status: "published", // draft, published, archived
  viewCount: 15234,

  // 편집 정보
  createdBy: "user-uuid",
  lastEditedBy: "user-uuid",
  createdAt: ISODate,
  updatedAt: ISODate,
  publishedAt: ISODate
}

// wiki_revisions collection - 편집 히스토리
{
  _id: ObjectId,
  articleId: ObjectId,
  version: 15,

  // 변경 내용
  changes: {
    field: "content.ko.body",
    before: "이전 내용...",
    after: "새로운 내용..."
  },
  summary: "오타 수정",

  // 편집자 정보
  editorId: "user-uuid",
  editorLevel: 5,

  // 승인 (레벨 4 편집 제안)
  status: "approved", // pending, approved, rejected
  reviewedBy: "admin-uuid",
  reviewedAt: ISODate,

  createdAt: ISODate
}

// wiki_edit_suggestions collection - 편집 제안 (레벨 4 미만)
{
  _id: ObjectId,
  articleId: ObjectId,

  suggestedChanges: {
    field: "content.ko.body",
    newValue: "제안하는 내용..."
  },
  reason: "더 정확한 정보로 업데이트",

  suggesterId: "user-uuid",
  status: "pending", // pending, approved, rejected

  reviewedBy: "editor-uuid",
  reviewNote: "좋은 제안입니다!",

  createdAt: ISODate,
  reviewedAt: ISODate
}

// 인덱스
db.wiki_articles.createIndex({ slug: 1 }, { unique: true })
db.wiki_articles.createIndex({ type: 1, status: 1 })
db.wiki_articles.createIndex({ "content.ko.name": "text", "content.en.name": "text" })
db.wiki_articles.createIndex({ "attributes.spicyLevel": 1 })
db.wiki_articles.createIndex({ "attributes.mainIngredients": 1 })
```

### 3.2 Community (커뮤니티)

```javascript
// posts collection
{
  _id: ObjectId,
  type: "recipe" | "free" | "qna" | "review" | "diary",

  author: {
    id: "user-uuid",
    username: "kimchilover",
    profileImage: "https://...",
    level: 4,
    badges: ["recipe_expert", "early_member"]
  },

  // 기본 내용
  title: "묵은지 김치찌개 황금 레시피",
  content: "## 재료\n- 묵은지 300g\n...", // Markdown
  summary: "깊은 맛이 나는 묵은지 김치찌개...",

  // 레시피 전용 필드
  recipe: {
    servings: 2,
    prepTime: 10, // 분
    cookTime: 30,
    difficulty: "easy", // easy, medium, hard
    ingredients: [
      { name: "묵은지", amount: "300", unit: "g", isMain: true }
    ],
    steps: [
      { order: 1, description: "묵은지를 먹기 좋게 썹니다", imageUrl: "..." }
    ],
    tips: ["돼지고기 대신 참치를 넣어도 맛있어요"],
    relatedKimchi: "muk-eun-ji" // 위키 슬러그
  },

  // 리뷰 전용 필드
  review: {
    productId: "affiliate-product-uuid",
    productName: "종가집 배추김치 1kg",
    rating: 4.5,
    purchaseSource: "coupang",
    purchaseDate: ISODate,
    pros: ["맛있다", "신선하다"],
    cons: ["가격이 비싸다"]
  },

  // 김치 일기 전용 필드
  diary: {
    kimchiType: "baechu-kimchi",
    startDate: ISODate,
    currentDay: 5,
    entries: [
      {
        day: 1,
        date: ISODate,
        note: "김장을 시작했습니다",
        temperature: 4,
        imageUrls: ["https://..."]
      }
    ]
  },

  // 미디어
  images: [{ url: "https://...", caption: "완성된 김치찌개" }],

  // 태그 및 분류
  tags: ["김치찌개", "묵은지", "간단요리"],
  category: "korean_food",
  language: "ko",

  // 통계
  viewCount: 5678,
  likeCount: 234,
  commentCount: 45,
  bookmarkCount: 89,
  shareCount: 12,

  // 상태
  status: "published", // draft, published, hidden, deleted
  isPinned: false,
  isFeatured: false,
  isBest: false, // 베스트 게시글 선정

  // 시간
  createdAt: ISODate,
  updatedAt: ISODate,
  publishedAt: ISODate
}

// comments collection
{
  _id: ObjectId,
  postId: ObjectId,
  parentId: ObjectId, // 대댓글인 경우

  author: {
    id: "user-uuid",
    username: "kimchifan",
    profileImage: "https://...",
    level: 3
  },

  content: "정말 맛있어 보여요!",

  likeCount: 15,
  replyCount: 3, // 대댓글 수

  status: "visible", // visible, hidden, deleted

  createdAt: ISODate,
  updatedAt: ISODate
}

// interactions collection (좋아요, 북마크)
{
  _id: ObjectId,
  userId: "user-uuid",
  targetType: "post" | "comment",
  targetId: ObjectId,
  type: "like" | "bookmark",
  createdAt: ISODate
}

// challenges collection (챌린지/이벤트)
{
  _id: ObjectId,

  title: {
    ko: "2024 봄 김장 챌린지",
    en: "2024 Spring Kimchi Challenge"
  },
  description: {
    ko: "봄배추로 김치를 담가보세요!",
    en: "Make kimchi with spring cabbage!"
  },

  type: "kimchi_making", // kimchi_making, recipe, diary, quiz

  // 기간
  startDate: ISODate,
  endDate: ISODate,

  // 참여 조건
  requirements: {
    minLevel: 2,
    postType: "diary",
    requiredTags: ["봄김장챌린지"]
  },

  // 보상
  rewards: {
    participationXp: 50,
    winnerXp: 500,
    badges: ["spring_kimchi_2024"]
  },

  // 참여자
  participantCount: 234,

  status: "active", // upcoming, active, ended

  createdAt: ISODate
}

// challenge_participants collection
{
  _id: ObjectId,
  challengeId: ObjectId,
  userId: "user-uuid",
  postId: ObjectId, // 참여 게시글

  status: "participated", // participated, winner, runner_up
  rank: null, // 순위 (종료 후)

  joinedAt: ISODate
}

// 인덱스
db.posts.createIndex({ type: 1, status: 1, createdAt: -1 })
db.posts.createIndex({ "author.id": 1 })
db.posts.createIndex({ tags: 1 })
db.posts.createIndex({ title: "text", content: "text" })
db.comments.createIndex({ postId: 1, createdAt: 1 })
db.interactions.createIndex({ userId: 1, targetType: 1, targetId: 1, type: 1 }, { unique: true })
```

---

## 4. Redis 데이터 구조

### 4.1 세션 / 인증

```
# 사용자 세션
session:{sessionId} -> JSON { userId, role, level, expiresAt }
TTL: 24시간

# Refresh Token
refresh_token:{userId}:{tokenId} -> tokenHash
TTL: 7일

# 이메일 인증 코드
email_verify:{email} -> code
TTL: 10분
```

### 4.2 캐싱

```
# 위키 문서 캐시
wiki:{slug}:{lang} -> JSON { ... }
TTL: 1시간

# 사용자 프로필 캐시
user_profile:{userId} -> JSON { id, username, level, badges }
TTL: 10분

# 추천 결과
recommendations:{userId} -> JSON [kimchiSlugs]
TTL: 6시간

# 인기 게시글
popular_posts:{type}:{period} -> LIST [postIds]
period: daily, weekly, monthly
TTL: 1시간
```

### 4.3 랭킹

```
# 레벨/경험치 랭킹
ranking:xp:all -> ZSET { userId: totalXp }
ranking:xp:monthly:{year-month} -> ZSET { userId: monthlyXp }

# 활동 랭킹
ranking:posts:weekly -> ZSET { userId: postCount }
ranking:recipes:all -> ZSET { userId: recipeCount }
```

### 4.4 Rate Limiting

```
# API Rate Limit
rate_limit:{userId}:{endpoint} -> count
TTL: 1분

# 게시글 작성 제한 (레벨별)
post_limit:{userId}:daily -> count
TTL: 24시간
```

### 4.5 실시간

```
# 온라인 사용자
online_users -> SET { userId1, userId2, ... }

# 알림 큐
notifications:{userId} -> LIST [notificationJson, ...]
```

---

## 5. Elasticsearch 인덱스

### 5.1 위키 검색 인덱스

```json
{
  "mappings": {
    "properties": {
      "slug": { "type": "keyword" },
      "type": { "type": "keyword" },

      "name_ko": {
        "type": "text",
        "analyzer": "korean"
      },
      "name_en": {
        "type": "text",
        "analyzer": "english"
      },
      "description_ko": {
        "type": "text",
        "analyzer": "korean"
      },
      "description_en": {
        "type": "text",
        "analyzer": "english"
      },
      "body_ko": {
        "type": "text",
        "analyzer": "korean"
      },

      "spicyLevel": { "type": "integer" },
      "fermentationLevel": { "type": "integer" },
      "mainIngredients": { "type": "keyword" },
      "bestFor": { "type": "keyword" },
      "tags": { "type": "keyword" },

      "viewCount": { "type": "integer" },
      "status": { "type": "keyword" },

      "updatedAt": { "type": "date" }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "korean": {
          "type": "custom",
          "tokenizer": "nori_tokenizer",
          "filter": ["lowercase", "nori_part_of_speech"]
        }
      }
    }
  }
}
```

### 5.2 커뮤니티 검색 인덱스

```json
{
  "mappings": {
    "properties": {
      "postId": { "type": "keyword" },
      "type": { "type": "keyword" },

      "title": {
        "type": "text",
        "analyzer": "korean",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "content": {
        "type": "text",
        "analyzer": "korean"
      },

      "authorId": { "type": "keyword" },
      "authorUsername": { "type": "keyword" },

      "tags": { "type": "keyword" },
      "category": { "type": "keyword" },

      "likeCount": { "type": "integer" },
      "commentCount": { "type": "integer" },
      "viewCount": { "type": "integer" },

      "isBest": { "type": "boolean" },
      "status": { "type": "keyword" },

      "createdAt": { "type": "date" }
    }
  }
}
```

---

## 6. 데이터 마이그레이션 전략

### 6.1 버전 관리
- PostgreSQL: Prisma Migrate
- MongoDB: 자체 마이그레이션 스크립트
- 모든 스키마 변경은 마이그레이션 파일로 관리

### 6.2 무중단 마이그레이션 원칙
1. 컬럼 추가 시: nullable로 추가 → 데이터 채움 → NOT NULL 변경
2. 컬럼 삭제 시: 사용 중지 → 일정 기간 대기 → 삭제
3. 인덱스 추가: CONCURRENTLY 옵션 사용

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2026-01-12 | - | 최초 작성 |
| 2.0 | 2026-01-12 | - | 어필리에이트, Gamification, Wiki 스키마 반영 (커머스 제거) |
