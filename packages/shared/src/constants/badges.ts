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
