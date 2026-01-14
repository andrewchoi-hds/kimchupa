// Mock data for development
export interface MockUser {
  id: string;
  nickname: string;
  level: number;
  levelName: string;
  xp: number;
  profileImage?: string;
}

export interface MockPost {
  id: string;
  type: "recipe" | "free" | "qna" | "review" | "diary";
  title: string;
  content: string;
  excerpt: string;
  author: MockUser;
  likeCount: number;
  likedBy: string[]; // 좋아요한 사용자 ID 배열
  commentCount: number;
  viewCount: number;
  tags: string[];
  images: string[];
  createdAt: string;
}

export interface MockComment {
  id: string;
  postId: string;
  parentId: string | null; // 답글인 경우 부모 댓글 ID
  content: string;
  author: MockUser;
  likeCount: number;
  createdAt: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: "1", nickname: "김치마스터", level: 6, levelName: "김치 달인", xp: 18500 },
  { id: "2", nickname: "배추사랑", level: 4, levelName: "김치 요리사", xp: 3200 },
  { id: "3", nickname: "초보요리사", level: 2, levelName: "김치 입문자", xp: 250 },
  { id: "4", nickname: "할머니손맛", level: 7, levelName: "김치 명인", xp: 62000 },
  { id: "5", nickname: "김치탐험가", level: 3, levelName: "김치 수습생", xp: 850 },
  { id: "6", nickname: "발효덕후", level: 5, levelName: "김치 장인", xp: 8900 },
];

export const MOCK_POSTS: MockPost[] = [
  {
    id: "1",
    type: "recipe",
    title: "우리 할머니표 묵은지 담그는 비법 공개합니다",
    content: `안녕하세요, 김치마스터입니다.

오늘은 저희 할머니께서 60년간 담가오신 묵은지 비법을 공유하려고 합니다.

## 재료
- 배추 10포기
- 천일염 2kg
- 고춧가루 500g
- 새우젓 200g
- 멸치액젓 200ml
- 마늘 200g
- 생강 50g
- 쪽파 200g

## 핵심 포인트
1. 배추는 반드시 11월 중순 김장철 배추를 사용하세요
2. 절이는 시간은 최소 12시간
3. 양념은 너무 많이 넣지 않는 게 포인트입니다

자세한 레시피는 본문을 확인해주세요!`,
    excerpt: "60년 전통의 묵은지 비법을 공개합니다. 11월 김장철 배추와 천일염을 사용한 정통 레시피...",
    author: MOCK_USERS[0],
    likeCount: 342,
    likedBy: [],
    commentCount: 56,
    viewCount: 4521,
    tags: ["묵은지", "전통레시피", "할머니손맛", "김장"],
    images: [],
    createdAt: "2026-01-10T14:30:00Z",
  },
  {
    id: "2",
    type: "recipe",
    title: "5분만에 만드는 초간단 겉절이",
    content: "바쁜 직장인을 위한 초간단 겉절이 레시피입니다...",
    excerpt: "바쁜 직장인도 5분이면 OK! 초간단 겉절이 레시피를 소개합니다.",
    author: MOCK_USERS[1],
    likeCount: 128,
    likedBy: [],
    commentCount: 23,
    viewCount: 1892,
    tags: ["겉절이", "간단레시피", "직장인"],
    images: [],
    createdAt: "2026-01-11T09:15:00Z",
  },
  {
    id: "3",
    type: "qna",
    title: "김치가 너무 시어졌는데 어떻게 하면 좋을까요?",
    content: "일주일 전에 담근 김치인데 벌써 너무 시어져버렸어요. 버려야 할까요? 아니면 활용할 수 있는 방법이 있을까요?",
    excerpt: "일주일 된 김치가 너무 시어졌는데 활용법이 있을까요?",
    author: MOCK_USERS[2],
    likeCount: 15,
    likedBy: [],
    commentCount: 42,
    viewCount: 856,
    tags: ["질문", "신김치", "활용법"],
    images: [],
    createdAt: "2026-01-12T11:20:00Z",
  },
  {
    id: "4",
    type: "diary",
    title: "배추김치 담근지 3일차 - 발효 시작!",
    content: "드디어 발효가 시작됐어요! 뚜껑을 열어보니 기포가 보이기 시작합니다. 맛을 봤는데 아직은 짠맛이 강하지만 살짝 신맛도 나기 시작했어요.",
    excerpt: "배추김치 발효 3일차, 기포가 생기기 시작했습니다!",
    author: MOCK_USERS[4],
    likeCount: 67,
    likedBy: [],
    commentCount: 12,
    viewCount: 432,
    tags: ["김치일기", "발효", "3일차"],
    images: [],
    createdAt: "2026-01-11T18:45:00Z",
  },
  {
    id: "5",
    type: "review",
    title: "[리뷰] 종가집 맛김치 먹어봤습니다",
    content: "마트에서 종가집 맛김치를 구매해서 먹어봤습니다. 전체적으로 맛있었지만 조금 달다는 느낌이...",
    excerpt: "종가집 맛김치 솔직 후기, 맛은 좋지만 약간 달아요",
    author: MOCK_USERS[5],
    likeCount: 89,
    likedBy: [],
    commentCount: 31,
    viewCount: 1234,
    tags: ["리뷰", "종가집", "시판김치"],
    images: [],
    createdAt: "2026-01-09T20:00:00Z",
  },
  {
    id: "6",
    type: "free",
    title: "김치냉장고 추천 부탁드려요",
    content: "이번에 이사를 하면서 김치냉장고를 새로 사려고 하는데, 어떤 브랜드/모델이 좋을까요? 4인 가족 기준입니다.",
    excerpt: "4인 가족 기준 김치냉장고 추천 부탁드립니다",
    author: MOCK_USERS[2],
    likeCount: 23,
    likedBy: [],
    commentCount: 67,
    viewCount: 2341,
    tags: ["김치냉장고", "추천", "가전"],
    images: [],
    createdAt: "2026-01-08T16:30:00Z",
  },
];

export const MOCK_COMMENTS: MockComment[] = [
  {
    id: "c1",
    postId: "1",
    parentId: null,
    content: "와 정말 자세한 레시피네요! 이번 김장때 꼭 따라해볼게요!",
    author: MOCK_USERS[1],
    likeCount: 12,
    createdAt: "2026-01-10T15:30:00Z",
  },
  {
    id: "c1-1",
    postId: "1",
    parentId: "c1",
    content: "저도 따라해봤는데 정말 맛있었어요!",
    author: MOCK_USERS[2],
    likeCount: 3,
    createdAt: "2026-01-10T16:00:00Z",
  },
  {
    id: "c2",
    postId: "1",
    parentId: null,
    content: "할머니 손맛의 비밀이 여기 있었군요 ㅎㅎ 감사합니다!",
    author: MOCK_USERS[4],
    likeCount: 8,
    createdAt: "2026-01-10T16:45:00Z",
  },
  {
    id: "c2-1",
    postId: "1",
    parentId: "c2",
    content: "맞아요, 저희 할머니도 비슷하게 담그시더라고요~",
    author: MOCK_USERS[0],
    likeCount: 5,
    createdAt: "2026-01-10T17:30:00Z",
  },
  {
    id: "c3",
    postId: "3",
    parentId: null,
    content: "신김치는 김치찌개나 김치볶음밥으로 활용하시면 아주 맛있어요!",
    author: MOCK_USERS[0],
    likeCount: 24,
    createdAt: "2026-01-12T11:45:00Z",
  },
  {
    id: "c3-1",
    postId: "3",
    parentId: "c3",
    content: "오 좋은 팁이네요! 김치전도 괜찮을까요?",
    author: MOCK_USERS[2],
    likeCount: 2,
    createdAt: "2026-01-12T12:00:00Z",
  },
];

// Badge definitions
export interface MockBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: string;
}

export const MOCK_BADGES: MockBadge[] = [
  {
    id: "first-post",
    name: "첫 발자국",
    description: "첫 게시글 작성",
    icon: "✍️",
    rarity: "common",
    condition: "첫 번째 게시글 작성 시",
  },
  {
    id: "recipe-master",
    name: "레시피 장인",
    description: "레시피 10개 등록",
    icon: "👨‍🍳",
    rarity: "rare",
    condition: "레시피 게시글 10개 이상 작성",
  },
  {
    id: "helpful",
    name: "도움의 손길",
    description: "Q&A 답변 50개",
    icon: "🤝",
    rarity: "rare",
    condition: "Q&A 게시판에 답변 50개 이상",
  },
  {
    id: "streak-7",
    name: "일주일 연속 출석",
    description: "7일 연속 출석",
    icon: "🔥",
    rarity: "common",
    condition: "7일 연속 출석 체크",
  },
  {
    id: "streak-30",
    name: "한 달 개근",
    description: "30일 연속 출석",
    icon: "📅",
    rarity: "rare",
    condition: "30일 연속 출석 체크",
  },
  {
    id: "wiki-editor",
    name: "위키 편집자",
    description: "위키 편집 승인 10회",
    icon: "📝",
    rarity: "epic",
    condition: "위키 편집 10회 승인",
  },
  {
    id: "influencer",
    name: "김치 인플루언서",
    description: "팔로워 100명",
    icon: "⭐",
    rarity: "epic",
    condition: "팔로워 100명 달성",
  },
  {
    id: "legend",
    name: "김치 레전드",
    description: "김치 명인 달성",
    icon: "👑",
    rarity: "legendary",
    condition: "레벨 7 달성",
  },
  {
    id: "early-adopter",
    name: "얼리어답터",
    description: "베타 서비스 참여자",
    icon: "🚀",
    rarity: "legendary",
    condition: "베타 서비스 기간 가입",
  },
];

// Current user for demo
export const CURRENT_USER: MockUser = {
  id: "demo",
  nickname: "김치러버",
  level: 3,
  levelName: "김치 수습생",
  xp: 720,
};
