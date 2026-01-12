export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  partner: "coupang" | "naver" | "amazon" | "iherb";
  affiliateUrl: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  kimchiType?: string;
  tags: string[];
}

export const AFFILIATE_PARTNERS = {
  coupang: {
    name: "쿠팡",
    logo: "🛒",
    color: "bg-red-500",
    commissionRate: "3-5%",
  },
  naver: {
    name: "네이버 쇼핑",
    logo: "🟢",
    color: "bg-green-500",
    commissionRate: "2-4%",
  },
  amazon: {
    name: "Amazon",
    logo: "📦",
    color: "bg-orange-500",
    commissionRate: "1-10%",
  },
  iherb: {
    name: "iHerb",
    logo: "🌿",
    color: "bg-emerald-500",
    commissionRate: "5-10%",
  },
};

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: "p1",
    name: "종가집 포기김치 1.9kg",
    description: "국내산 배추로 만든 정통 포기김치. 시원하고 깔끔한 맛",
    imageUrl: "/images/products/jongga-kimchi.jpg",
    partner: "coupang",
    affiliateUrl: "https://link.coupang.com/kimchi-1",
    price: 18900,
    originalPrice: 22000,
    currency: "KRW",
    rating: 4.7,
    reviewCount: 3842,
    kimchiType: "baechu",
    tags: ["배추김치", "포기김치", "종가집"],
  },
  {
    id: "p2",
    name: "비비고 썰은김치 1.5kg",
    description: "먹기 좋게 썰어낸 배추김치. 바로 먹기 편한 사이즈",
    imageUrl: "/images/products/bibigo-kimchi.jpg",
    partner: "coupang",
    affiliateUrl: "https://link.coupang.com/kimchi-2",
    price: 15900,
    currency: "KRW",
    rating: 4.5,
    reviewCount: 2156,
    kimchiType: "baechu",
    tags: ["배추김치", "썰은김치", "비비고"],
  },
  {
    id: "p3",
    name: "하선정 총각김치 1.2kg",
    description: "아삭아삭 총각무로 담근 전통 총각김치",
    imageUrl: "/images/products/chonggak.jpg",
    partner: "naver",
    affiliateUrl: "https://smartstore.naver.com/kimchi-3",
    price: 16500,
    originalPrice: 19000,
    currency: "KRW",
    rating: 4.6,
    reviewCount: 892,
    kimchiType: "chonggak",
    tags: ["총각김치", "하선정"],
  },
  {
    id: "p4",
    name: "깍두기 프리미엄 1kg",
    description: "국내산 무로 만든 아삭한 깍두기",
    imageUrl: "/images/products/kkakdugi.jpg",
    partner: "naver",
    affiliateUrl: "https://smartstore.naver.com/kimchi-4",
    price: 12900,
    currency: "KRW",
    rating: 4.4,
    reviewCount: 1245,
    kimchiType: "kkakdugi",
    tags: ["깍두기", "반찬"],
  },
  {
    id: "p5",
    name: "Korean Kimchi Jar 2L",
    description: "Traditional Korean kimchi fermentation container",
    imageUrl: "/images/products/jar.jpg",
    partner: "amazon",
    affiliateUrl: "https://amazon.com/kimchi-jar",
    price: 34.99,
    currency: "USD",
    rating: 4.8,
    reviewCount: 567,
    tags: ["용기", "발효용기", "항아리"],
  },
  {
    id: "p6",
    name: "Gochugaru Korean Red Pepper Flakes 1lb",
    description: "Premium Korean chili flakes for authentic kimchi",
    imageUrl: "/images/products/gochugaru.jpg",
    partner: "amazon",
    affiliateUrl: "https://amazon.com/gochugaru",
    price: 18.99,
    originalPrice: 22.99,
    currency: "USD",
    rating: 4.6,
    reviewCount: 2341,
    tags: ["고춧가루", "재료", "양념"],
  },
  {
    id: "p7",
    name: "Organic Kimchi Starter Kit",
    description: "Everything you need to make kimchi at home",
    imageUrl: "/images/products/starter-kit.jpg",
    partner: "iherb",
    affiliateUrl: "https://iherb.com/kimchi-kit",
    price: 29.99,
    currency: "USD",
    rating: 4.5,
    reviewCount: 189,
    tags: ["스타터킷", "DIY", "유기농"],
  },
  {
    id: "p8",
    name: "김치냉장고 딤채 120L",
    description: "김치 전용 냉장고. 최적의 발효 온도 유지",
    imageUrl: "/images/products/dimchae.jpg",
    partner: "coupang",
    affiliateUrl: "https://link.coupang.com/dimchae",
    price: 599000,
    originalPrice: 699000,
    currency: "KRW",
    rating: 4.9,
    reviewCount: 1892,
    tags: ["김치냉장고", "딤채", "가전"],
  },
];

export function formatPrice(price: number, currency: string): string {
  if (currency === "KRW") {
    return `${price.toLocaleString()}원`;
  }
  return `$${price.toFixed(2)}`;
}

export function getDiscountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}
