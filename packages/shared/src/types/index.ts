// User Types
export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  level: UserLevel;
  xp: number;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLevel {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
  permissions: UserPermissions;
}

export interface UserPermissions {
  canPost: boolean;
  canComment: boolean;
  canEditWiki: boolean;
  canSuggestWikiEdit: boolean;
  canModerate: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// XP Types
export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  action: XPAction;
  description: string;
  createdAt: Date;
}

export type XPAction =
  | "attendance"
  | "post_created"
  | "comment_created"
  | "recipe_shared"
  | "wiki_edit"
  | "wiki_suggestion"
  | "post_liked"
  | "challenge_completed";

// Wiki Types
export interface WikiArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string;
  category: WikiCategory;
  tags: string[];
  images: string[];
  author: User;
  lastEditor: User;
  version: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WikiCategory =
  | "types"
  | "regions"
  | "ingredients"
  | "recipes"
  | "history"
  | "health"
  | "culture";

export interface WikiRevision {
  id: string;
  articleId: string;
  version: number;
  content: string;
  editSummary: string;
  editor: User;
  createdAt: Date;
}

// Community Types
export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  images: string[];
  author: User;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type PostType = "recipe" | "free" | "qna" | "review" | "diary";

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: User;
  likeCount: number;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Affiliate Types
export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  partner: AffiliatePartner;
  affiliateUrl: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
}

export type AffiliatePartner = "coupang" | "naver" | "amazon" | "iherb";

// Recommendation Types
export interface KimchiRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  spicyLevel: number; // 1-5
  fermentationLevel: number; // 1-5
  region: string;
  ingredients: string[];
  matchScore: number;
  affiliateProducts: AffiliateProduct[];
}

export interface RecommendationQuiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  label: string;
  value: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Search Types
export interface SearchResult {
  type: "wiki" | "post" | "user" | "product";
  id: string;
  title: string;
  snippet: string;
  url: string;
  score: number;
}
