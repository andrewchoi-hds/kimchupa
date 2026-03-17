// Re-export from shared package
export { MOCK_BADGES } from "@kimchupa/shared/src/constants/badges";
export type { MockBadge } from "@kimchupa/shared/src/constants/badges";

// Mock types preserved for compatibility
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
  likedBy: string[];
  commentCount: number;
  viewCount: number;
  tags: string[];
  images: string[];
  createdAt: string;
}

export interface MockComment {
  id: string;
  postId: string;
  parentId: string | null;
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

export const MOCK_POSTS: MockPost[] = [];
export const MOCK_COMMENTS: MockComment[] = [];

export const CURRENT_USER: MockUser = {
  id: "demo",
  nickname: "김치러버",
  level: 3,
  levelName: "김치 수습생",
  xp: 720,
};
