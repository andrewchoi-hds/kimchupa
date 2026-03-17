// Schemas
export * from "./schemas/common.schema";
export * from "./schemas/auth.schema";
export * from "./schemas/user.schema";
export * from "./schemas/post.schema";

// Types (core interfaces)
export * from "./types";

// Zod-inferred API types (explicit to avoid conflicts with core types)
export type {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  PostTypeEnum,
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  PaginationQuery,
} from "./types/api";

// Constants - explicit exports to avoid name clashes
export {
  USER_LEVELS,
  XP_REWARDS,
  LEVEL_EMOJIS,
  getLevelByXp,
  getXpProgress,
} from "./constants/levels";

export {
  MOCK_BADGES,
} from "./constants/badges";
export type { MockBadge } from "./constants/badges";

export {
  AFFILIATE_PARTNERS,
  AFFILIATE_PRODUCTS,
  formatPrice,
  getDiscountPercent,
} from "./constants/affiliateProducts";
// Note: AffiliateProduct interface available via direct import from constants/affiliateProducts

// i18n
export { locales, defaultLocale, localeNames, type Locale } from "./i18n/config";
