# 김추페 (KimchuPa) - 기술 아키텍처

## 1. 시스템 개요

### 1.1 아키텍처 원칙
- **마이크로서비스**: 도메인별 독립 서비스로 분리
- **API-First**: 모든 기능은 API를 통해 제공
- **Cloud-Native**: 클라우드 환경에 최적화된 설계
- **Event-Driven**: 서비스 간 비동기 통신
- **SEO-Friendly**: 검색엔진 최적화 (위키 콘텐츠)

### 1.2 기술 스택 요약

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js 14+, TypeScript, Tailwind CSS |
| Mobile | React Native (Phase 4) |
| Backend | Node.js (NestJS) / Python (FastAPI for ML) |
| Database | PostgreSQL, Redis, MongoDB |
| Search | Elasticsearch (위키/커뮤니티 검색) |
| Message Queue | RabbitMQ / AWS SQS |
| Storage | AWS S3 / CloudFront |
| Infrastructure | AWS / Kubernetes |
| CI/CD | GitHub Actions, ArgoCD |
| Monitoring | Prometheus, Grafana, Sentry |

---

## 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                    │
├─────────────────────────────┬─────────────────────────────┬─────────────────┤
│        Web App              │       Mobile App            │  Admin Dashboard │
│       (Next.js)             │     (React Native)          │    (Next.js)     │
│   - SSR for SEO (Wiki)      │                             │                  │
└────────────┬────────────────┴──────────────┬──────────────┴────────┬────────┘
             │                               │                       │
             └───────────────────────────────┴───────────────────────┘
                                    │
                           ┌───────┴───────┐
                           │   CDN / WAF   │
                           │  (CloudFront) │
                           └───────┬───────┘
                                   │
                           ┌───────┴───────┐
                           │  API Gateway  │
                           │   (Kong)      │
                           └───────┬───────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auth Service   │    │  User Service   │    │  Wiki Service   │
│   (NestJS)      │    │   (NestJS)      │    │   (NestJS)      │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Community Svc   │    │ Gamification    │    │ Affiliate Svc   │
│   (NestJS)      │    │   (NestJS)      │    │   (NestJS)      │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Notification    │    │ Recommendation  │    │  Search Svc     │
│   (NestJS)      │    │ (FastAPI/ML)    │    │ (Elasticsearch) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │    Message Broker     │
                    │     (RabbitMQ)        │
                    └───────────┬───────────┘
                                │
    ┌───────────────────────────┼───────────────────────────┐
    │                           │                           │
    ▼                           ▼                           ▼
┌──────────┐            ┌──────────────┐            ┌──────────────┐
│PostgreSQL│            │    Redis     │            │  MongoDB     │
│ (Main DB)│            │   (Cache)    │            │(Community/   │
│          │            │              │            │    Wiki)     │
└──────────┘            └──────────────┘            └──────────────┘
                                │
                    ┌───────────┴───────────┐
                    │    Elasticsearch      │
                    │   (Search Engine)     │
                    └───────────────────────┘
```

---

## 3. 마이크로서비스 상세

### 3.1 Auth Service
**책임**: 인증, 인가, 세션 관리

| 기능 | 설명 |
|------|------|
| 회원가입 | 이메일, 소셜 로그인 (Google, Kakao, Apple) |
| 로그인 | JWT 토큰 발급, Refresh Token |
| OAuth | 소셜 로그인 연동 |
| 권한 관리 | RBAC (Role-Based Access Control) |

**기술**: NestJS, Passport.js, JWT

---

### 3.2 User Service
**책임**: 사용자 프로필, 설정, 알림

| 기능 | 설명 |
|------|------|
| 프로필 관리 | 개인정보, 프로필 이미지 |
| 알림 설정 | 푸시, 이메일 알림 설정 |
| 취향 프로필 | 김치 취향 데이터 (추천용) |
| 레벨/뱃지 조회 | 현재 레벨, 보유 뱃지 조회 |

**기술**: NestJS, PostgreSQL

---

### 3.3 Wiki Service (KimchiPedia)
**책임**: 김치 위키 콘텐츠 관리

| 기능 | 설명 |
|------|------|
| 김치 종류 DB | 김치 기본 정보, 특성, 영양 정보 |
| 레시피 DB | 김치 담그기 레시피 |
| 문화/역사 | 김치 문화, 역사 콘텐츠 |
| 버전 관리 | 위키 편집 히스토리 |
| 편집 권한 | 레벨 기반 편집 권한 관리 |
| 다국어 | 언어별 위키 콘텐츠 |

**기술**: NestJS, MongoDB (유연한 스키마), Elasticsearch

---

### 3.4 Community Service
**책임**: 게시판, 소셜 기능

| 기능 | 설명 |
|------|------|
| 게시판 | 레시피, 자유, Q&A, 리뷰, 김치일기 |
| 댓글/좋아요 | 소셜 인터랙션 |
| 팔로우 | 사용자 간 팔로우 |
| 신고/차단 | 부적절 콘텐츠 관리 |
| 챌린지 | 이벤트/챌린지 관리 |

**기술**: NestJS, MongoDB, S3 (미디어)

---

### 3.5 Gamification Service
**책임**: 레벨, 경험치, 뱃지 시스템

| 기능 | 설명 |
|------|------|
| 경험치 관리 | 활동별 경험치 부여/차감 |
| 레벨 계산 | 경험치 기반 레벨 계산 |
| 뱃지 발급 | 조건 충족 시 뱃지 발급 |
| 랭킹 | 레벨/경험치 기반 랭킹 |
| 출석 체크 | 일일 출석 체크 |
| 권한 연동 | 레벨에 따른 기능 잠금 해제 |

**기술**: NestJS, PostgreSQL, Redis (실시간 랭킹)

---

### 3.6 Affiliate Service
**책임**: 제휴 링크 관리, 수수료 추적

| 기능 | 설명 |
|------|------|
| 상품 DB | 외부 쇼핑몰 상품 정보 수집 |
| 링크 생성 | 제휴 링크 생성 (추적 코드 포함) |
| 클릭 추적 | 링크 클릭 로깅 |
| 전환 추적 | 제휴사 콜백 처리 |
| 가격 비교 | 여러 쇼핑몰 가격 비교 |
| 정산 관리 | 제휴사별 수수료 정산 |

**기술**: NestJS, PostgreSQL, 외부 API 연동 (쿠팡, 네이버, 아마존)

---

### 3.7 Recommendation Service
**책임**: AI 기반 김치 추천

| 기능 | 설명 |
|------|------|
| 취향 분석 | 사용자 취향 프로필 분석 |
| 퀴즈 추천 | 퀴즈 답변 기반 추천 |
| 협업 필터링 | 유사 사용자 기반 추천 |
| 콘텐츠 필터링 | 김치 속성 기반 추천 |
| 시즌 추천 | 계절/명절 추천 |

**기술**: Python (FastAPI), scikit-learn, Redis

---

### 3.8 Search Service
**책임**: 통합 검색

| 기능 | 설명 |
|------|------|
| 위키 검색 | 김치 종류, 레시피 검색 |
| 커뮤니티 검색 | 게시글, 댓글 검색 |
| 상품 검색 | 제휴 상품 검색 |
| 자동완성 | 검색어 자동완성 |
| 인기 검색어 | 실시간 인기 검색어 |

**기술**: Elasticsearch, Redis

---

### 3.9 Notification Service
**책임**: 알림 발송

| 기능 | 설명 |
|------|------|
| 푸시 알림 | FCM, APNs |
| 이메일 | 환영, 뱃지 획득, 마케팅 |
| 인앱 알림 | 실시간 알림 |

**기술**: NestJS, AWS SES, Firebase

---

## 4. 데이터 흐름

### 4.1 경험치/레벨업 프로세스
```
[사용자 활동] → [각 서비스에서 이벤트 발생]
    ↓
[RabbitMQ] → user.action (게시글 작성, 댓글, 좋아요 등)
    ↓
[Gamification Service]
    ↓
┌───────────────────────────────────────┐
│ 1. 활동 유형에 따른 경험치 계산        │
│ 2. 사용자 경험치 업데이트              │
│ 3. 레벨업 조건 확인                   │
│ 4. 레벨업 시 새로운 권한 부여          │
│ 5. 뱃지 조건 확인 및 발급             │
└───────────────────────────────────────┘
    ↓
[Notification Service] → 레벨업/뱃지 알림
    ↓
[User Service] → 프로필 업데이트
```

### 4.2 제휴 링크 클릭 프로세스
```
[사용자] → [위키/추천에서 상품 클릭]
    ↓
[Affiliate Service]
    ↓
┌───────────────────────────────────────┐
│ 1. 클릭 로깅 (사용자, 상품, 시간)      │
│ 2. 제휴 링크 생성 (추적 코드 포함)     │
│ 3. 경험치 이벤트 발행                 │
└───────────────────────────────────────┘
    ↓
[리다이렉트] → 외부 쇼핑몰 (쿠팡, 아마존 등)
    ↓
[제휴사 콜백] → 구매 전환 시 수수료 기록
```

### 4.3 위키 편집 프로세스
```
[사용자] → [위키 편집 요청]
    ↓
[Wiki Service]
    ↓
┌───────────────────────────────────────┐
│ 1. 사용자 레벨/권한 확인              │
│    - 레벨 4: 편집 제안만 가능         │
│    - 레벨 5+: 직접 편집 가능          │
│ 2. 편집 내용 저장 (버전 관리)         │
│ 3. 관리자 승인 대기 (레벨 4)          │
│    또는 즉시 반영 (레벨 5+)           │
└───────────────────────────────────────┘
    ↓
[승인 시] → 경험치 부여 이벤트
    ↓
[Search Service] → Elasticsearch 인덱스 업데이트
```

---

## 5. 인프라 아키텍처

### 5.1 AWS 구성
```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    VPC                               │    │
│  │  ┌──────────────┐  ┌──────────────┐                 │    │
│  │  │ Public Subnet│  │ Public Subnet│   (Multi-AZ)   │    │
│  │  │   (AZ-a)     │  │   (AZ-b)     │                 │    │
│  │  │  ┌────────┐  │  │  ┌────────┐  │                 │    │
│  │  │  │  ALB   │  │  │  │  ALB   │  │                 │    │
│  │  │  └────────┘  │  │  └────────┘  │                 │    │
│  │  └──────────────┘  └──────────────┘                 │    │
│  │                                                      │    │
│  │  ┌──────────────┐  ┌──────────────┐                 │    │
│  │  │Private Subnet│  │Private Subnet│                 │    │
│  │  │   (AZ-a)     │  │   (AZ-b)     │                 │    │
│  │  │ ┌──────────┐ │  │ ┌──────────┐ │                 │    │
│  │  │ │   EKS    │ │  │ │   EKS    │ │                 │    │
│  │  │ │ Cluster  │ │  │ │ Cluster  │ │                 │    │
│  │  │ └──────────┘ │  │ └──────────┘ │                 │    │
│  │  │ ┌──────────┐ │  │ ┌──────────┐ │                 │    │
│  │  │ │   RDS    │ │  │ │   RDS    │ │                 │    │
│  │  │ │(Primary) │ │  │ │(Standby) │ │                 │    │
│  │  │ └──────────┘ │  │ └──────────┘ │                 │    │
│  │  └──────────────┘  └──────────────┘                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   S3     │ │CloudFront│ │ ElastiC  │ │  SQS     │       │
│  │(Storage) │ │  (CDN)   │ │  Cache   │ │(Message) │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Kubernetes 구성
```yaml
# 네임스페이스
- kimchupa-prod      # 프로덕션 환경
- kimchupa-staging   # 스테이징 환경
- kimchupa-dev       # 개발 환경

# 서비스별 리소스
- Deployment: 각 마이크로서비스
- Service: ClusterIP (내부), LoadBalancer (외부)
- Ingress: nginx-ingress-controller
- ConfigMap: 환경 설정
- Secret: 민감 정보 (AWS Secrets Manager 연동)
- HPA: 오토스케일링
```

---

## 6. 보안 아키텍처

### 6.1 인증/인가 흐름
```
[Client] → [API Gateway]
              ↓
        JWT 검증 (Kong JWT Plugin)
              ↓
        Rate Limiting
              ↓
        [Auth Service] → 토큰 검증
              ↓
        [Gamification Service] → 레벨 기반 권한 확인
              ↓
        [각 서비스] → 기능 실행
```

### 6.2 레벨 기반 권한
| 기능 | 필요 레벨 |
|------|----------|
| 위키 열람 | 0 (비회원) |
| 댓글 작성 | 2 |
| 게시글 작성 | 3 |
| 레시피 등록 | 4 |
| 위키 편집 제안 | 4 |
| 위키 직접 편집 | 5 |
| DM 전송 | 4 |

### 6.3 보안 레이어
| 레이어 | 보안 조치 |
|--------|----------|
| Network | VPC, Security Groups, WAF |
| Transport | TLS 1.3, HTTPS |
| Application | JWT, Level-Based Access, Input Validation |
| Data | 암호화 (AES-256), 마스킹 |
| Anti-Spam | 레벨 기반 활동 제한, CAPTCHA |

---

## 7. 모니터링 & 로깅

### 7.1 모니터링 스택
```
[Application Metrics] → [Prometheus] → [Grafana Dashboard]
[Application Logs] → [Fluentd] → [Elasticsearch] → [Kibana]
[Error Tracking] → [Sentry]
```

### 7.2 주요 메트릭
- **서비스 헬스**: 응답 시간, 에러율, 처리량
- **비즈니스 메트릭**: 제휴 클릭, 회원가입, 레벨업
- **커뮤니티 메트릭**: 게시글, 댓글, DAU/MAU
- **인프라 메트릭**: CPU, 메모리, 네트워크

### 7.3 알림 정책
| 조건 | 심각도 | 알림 채널 |
|------|--------|----------|
| Error Rate > 1% | Critical | Slack, PagerDuty |
| Response Time > 3s | Warning | Slack |
| CPU > 80% | Warning | Slack |
| Disk > 90% | Critical | Slack, PagerDuty |

---

## 8. SEO 최적화 (위키)

### 8.1 SSR/SSG 전략
- **위키 페이지**: Static Site Generation (SSG)
- **커뮤니티**: Server-Side Rendering (SSR)
- **동적 콘텐츠**: Client-Side Rendering (CSR)

### 8.2 SEO 구성
```
[Next.js]
  ↓
├── /wiki/[kimchi-type]     → SSG (빌드 시 생성)
├── /wiki/recipe/[id]       → SSG
├── /community/[post-id]    → SSR (실시간)
└── /user/[profile]         → CSR (검색엔진 제외)
```

### 8.3 구조화된 데이터
- **JSON-LD**: Recipe, Article 스키마
- **Open Graph**: 소셜 공유 최적화
- **Sitemap**: 자동 생성

---

## 9. CI/CD 파이프라인

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Push   │ → │  Build  │ → │  Test   │ → │ Deploy  │
│ (GitHub)│    │(Actions)│    │(Actions)│    │(ArgoCD) │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                    │              │              │
                    ▼              ▼              ▼
              Docker Build    Unit Test      Staging
              Push to ECR    Integration    Production
                             E2E Test       (Manual Approval)
```

### 9.1 브랜치 전략
- `main`: 프로덕션 배포
- `develop`: 개발 통합
- `feature/*`: 기능 개발
- `hotfix/*`: 긴급 수정

---

## 10. 확장 계획

### 10.1 Phase별 인프라 확장
| Phase | 예상 트래픽 | 인프라 |
|-------|------------|--------|
| MVP | 1,000 DAU | EKS 2노드, RDS db.t3.medium |
| Phase 2 | 5,000 DAU | EKS 4노드, RDS db.r5.large |
| Phase 3 | 20,000 DAU | EKS 6노드, RDS Multi-AZ |
| Phase 4 | 100,000 DAU | Multi-Region 고려 |

### 10.2 서비스 우선순위
1. **MVP**: Auth, User, Wiki (기본), Community (기본), Gamification, Affiliate
2. **Phase 2**: Gamification 고도화, Community 확장
3. **Phase 3**: Wiki 확장, Recommendation
4. **Phase 4**: 모바일 앱, 글로벌 확장

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|----------|
| 1.0 | 2026-01-12 | - | 최초 작성 |
| 2.0 | 2026-01-12 | - | 어필리에이트 모델, Gamification, Wiki 서비스 반영 |
