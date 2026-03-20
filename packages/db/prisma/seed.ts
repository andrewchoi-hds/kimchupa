import { PrismaClient, PostType, KimchiDexStatus } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { KIMCHI_DATA } from "@kimchupa/shared/src/constants/kimchi";
import { KIMCHI_DETAILS_BATCH2 } from "./seed-details-batch2";
import "dotenv/config";

// Create Prisma client with Neon adapter for seed
const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// ============ Inline Mock Data ============

interface MockUser {
  id: string;
  nickname: string;
  level: number;
  levelName: string;
  xp: number;
  profileImage?: string;
}

interface MockPost {
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

interface MockComment {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  author: MockUser;
  likeCount: number;
  createdAt: string;
}

const MOCK_USERS: MockUser[] = [
  { id: "1", nickname: "김치마스터", level: 6, levelName: "김치 달인", xp: 18500 },
  { id: "2", nickname: "배추사랑", level: 4, levelName: "김치 요리사", xp: 3200 },
  { id: "3", nickname: "초보요리사", level: 2, levelName: "김치 입문자", xp: 250 },
  { id: "4", nickname: "할머니손맛", level: 7, levelName: "김치 명인", xp: 62000 },
  { id: "5", nickname: "김치탐험가", level: 3, levelName: "김치 수습생", xp: 850 },
  { id: "6", nickname: "발효덕후", level: 5, levelName: "김치 장인", xp: 8900 },
];

const MOCK_POSTS: MockPost[] = [
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

const MOCK_COMMENTS: MockComment[] = [
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

// ============ Extended Kimchi Details ============

const KIMCHI_DETAILS: Record<string, {
  history?: string;
  makingProcess?: string;
  storageMethod?: string;
  nutritionInfo?: object;
  variations?: string;
  descriptionEn?: string;
}> = {
  baechu: {
    history: `배추김치는 한국 김치의 대표격으로, 조선시대 이후 고춧가루가 전래되면서 현재의 형태를 갖추게 되었습니다. 특히 19세기에 결구 배추(통배추)가 재배되기 시작하면서 오늘날 우리가 아는 배추김치가 탄생했습니다. 김장 문화와 함께 발전하여 2013년 유네스코 인류무형문화유산으로 등재되었습니다.`,
    makingProcess: `1. 배추를 4등분하여 소금물에 절입니다 (8-12시간)
2. 절인 배추를 깨끗이 씻어 물기를 뺍니다
3. 양념(고춧가루, 젓갈, 마늘, 생강, 파 등)을 준비합니다
4. 배추 잎 사이사이에 양념소를 골고루 넣습니다
5. 김치통에 차곡차곡 담아 밀봉합니다
6. 실온에서 1-2일 익힌 후 냉장 보관합니다`,
    storageMethod: `김치냉장고: -1~0°C에서 최대 3개월
일반냉장고: 4°C에서 2-3주
밀폐용기 사용 필수, 누름돌로 김칫국물에 잠기게 보관`,
    nutritionInfo: {
      calories: 15,
      carbohydrates: 2.4,
      protein: 1.1,
      fat: 0.3,
      fiber: 1.6,
      vitaminC: 18,
      vitaminA: 492,
      calcium: 28,
      iron: 0.5,
      probiotics: "10^8 CFU/g"
    },
    variations: `- 서울식: 젓갈을 적게 쓰고 담백함
- 전라도식: 젓갈과 양념이 풍부, 감칠맛 강함
- 경상도식: 멸치젓 위주, 국물이 적음
- 강원도식: 생태/명태 등 생선 사용
- 충청도식: 중간 정도의 간, 균형잡힌 맛`,
    descriptionEn: "The most representative Korean kimchi. Napa cabbage is salted and fermented with seasonings including red pepper powder, fish sauce, garlic, and ginger. It's a staple of Korean cuisine and UNESCO Intangible Cultural Heritage."
  },
  kkakdugi: {
    history: `깍두기는 조선시대 후기에 등장한 것으로 추정되며, '깍뚝깍뚝' 썰었다 하여 깍두기라는 이름이 붙었습니다. 왕실에서 시작되어 민간으로 퍼졌다는 설과, 서민들이 무를 효율적으로 활용하기 위해 만들었다는 설이 있습니다.`,
    makingProcess: `1. 무를 2-3cm 크기로 깍둑썰기합니다
2. 소금과 설탕으로 절입니다 (30분-1시간)
3. 절인 무에서 나온 물기를 적당히 빼줍니다
4. 고춧가루, 젓갈, 마늘, 생강, 파를 넣어 버무립니다
5. 통에 담아 1-2일 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-3주
아삭한 식감을 위해 빨리 소비 권장
발효가 진행될수록 물러지므로 주의`,
    nutritionInfo: {
      calories: 18,
      carbohydrates: 3.8,
      protein: 0.7,
      fat: 0.1,
      fiber: 1.2,
      vitaminC: 14,
      calcium: 24,
      potassium: 230
    },
    descriptionEn: "Cubed radish kimchi with a wonderfully crunchy texture. The radish is cut into cubes and seasoned with red pepper powder. A perfect accompaniment to soups like seolleongtang and gomtang."
  },
  dongchimi: {
    history: `동치미는 '동(冬)'과 '치미(沈)', 즉 '겨울에 담그는 김치'라는 뜻입니다. 삼국시대부터 존재했던 것으로 추정되며, 고춧가루가 들어오기 전의 원형 김치에 가깝습니다. 조선시대 문헌에도 '동침이'로 기록되어 있습니다.`,
    makingProcess: `1. 무를 깨끗이 씻어 통째로 또는 큼직하게 자릅니다
2. 소금물에 무를 절입니다 (하루 정도)
3. 배, 대파, 생강, 마늘을 준비합니다
4. 항아리에 무와 재료들을 넣고 소금물을 부어줍니다
5. 서늘한 곳에서 2-3주 발효시킵니다`,
    storageMethod: `냉장 보관: 2-3개월
국물이 시원해지면 완성
무가 국물에 잠기도록 유지`,
    nutritionInfo: {
      calories: 8,
      carbohydrates: 1.5,
      protein: 0.4,
      fat: 0.1,
      vitaminC: 10,
      calcium: 15
    },
    descriptionEn: "A refreshing winter water kimchi made by fermenting whole radishes in salted water. The tangy, effervescent broth is traditionally used as a base for cold noodle soup (naengmyeon)."
  },
  chonggak: {
    history: `총각김치는 총각무(알타리무)로 담그는 김치로, 이름의 유래는 총각무의 긴 무청이 조선시대 미혼 남성(총각)의 댕기머리를 닮았다 하여 붙여졌습니다. 조선 후기부터 널리 담가 먹기 시작했으며, 배추김치와 함께 한국의 대표적인 김치로 자리잡았습니다. 특히 가을 김장철에 배추김치와 함께 담그는 것이 전통입니다.`,
    makingProcess: `1. 총각무를 깨끗이 씻어 무청을 다듬습니다
2. 굵은소금으로 1-2시간 절입니다
3. 절인 총각무를 씻어 물기를 빼줍니다
4. 고춧가루, 멸치액젓, 새우젓, 마늘, 생강, 파를 섞어 양념을 만듭니다
5. 총각무에 양념을 골고루 버무립니다
6. 밀폐용기에 담아 실온에서 하루 숙성 후 냉장 보관합니다`,
    storageMethod: `김치냉장고: -1~0°C에서 최대 2개월
일반냉장고: 4°C에서 2-3주
무가 물러지기 전에 소비 권장, 밀폐용기 필수`,
    nutritionInfo: {
      calories: 19,
      carbohydrates: 3.5,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.8,
      vitaminC: 16
    },
    descriptionEn: "A popular Korean kimchi made with ponytail radishes (chonggak-mu). Named after the topknot hairstyle of unmarried men in the Joseon dynasty, it features a crunchy texture and spicy, pungent flavor."
  },
  pa: {
    history: `파김치는 쪽파(또는 실파)를 통째로 양념에 버무려 담그는 전통 김치입니다. 삼국시대부터 파를 이용한 절임 음식이 있었던 것으로 추정되며, 조선시대 궁중 음식에도 등장합니다. 파의 매운맛과 달콤한 맛이 조화를 이루며, 특히 봄철 쪽파가 연하고 맛있을 때 담그면 최고의 맛을 냅니다.`,
    makingProcess: `1. 쪽파를 깨끗이 다듬어 씻습니다
2. 소금물에 30분 정도 살짝 절입니다
3. 고춧가루, 멸치액젓, 새우젓, 마늘, 생강을 섞어 양념을 만듭니다
4. 찹쌀풀을 쒀서 양념에 섞어줍니다
5. 절인 쪽파에 양념을 골고루 묻혀 가지런히 정리합니다
6. 용기에 담아 실온에서 반나절 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주
파가 쉽게 물러지므로 빨리 소비 권장
국물이 생기지 않도록 눌러서 보관`,
    nutritionInfo: {
      calories: 22,
      carbohydrates: 3.8,
      protein: 1.2,
      fat: 0.4,
      fiber: 1.5,
      vitaminC: 12
    },
    descriptionEn: "A traditional Korean kimchi made with whole green onions (scallions) seasoned with red pepper, fish sauce, and garlic. Its distinctive pungent flavor pairs excellently with grilled meats like samgyeopsal."
  },
  oisobagi: {
    history: `오이소박이는 여름철 대표 김치로, '소박이'란 속을 채워 넣는다는 뜻입니다. 조선시대 여름철 별미로 기록에 등장하며, 오이의 시원한 수분감과 부추 양념소의 매콤한 맛이 조화를 이루는 계절 김치입니다. 더운 여름 입맛이 없을 때 식욕을 돋우는 역할을 했습니다.`,
    makingProcess: `1. 오이를 소금으로 문질러 씻은 뒤 5-6cm 길이로 자릅니다
2. 양끝을 남기고 십자로 칼집을 넣습니다
3. 소금물에 30분간 절입니다
4. 부추, 당근, 고춧가루, 멸치액젓, 마늘, 생강으로 양념소를 만듭니다
5. 칼집 사이에 양념소를 꽉 채워 넣습니다
6. 용기에 담고 남은 양념국물을 부어 냉장 보관합니다`,
    storageMethod: `냉장 보관: 3-5일 (빨리 소비 권장)
오이가 물러지기 쉬우므로 소량씩 담그는 것이 좋음
양념이 빠지지 않도록 조심히 보관`,
    nutritionInfo: {
      calories: 12,
      carbohydrates: 2.1,
      protein: 0.8,
      fat: 0.1,
      fiber: 0.9,
      vitaminC: 8
    },
    descriptionEn: "A refreshing summer kimchi made by stuffing scored cucumbers with a spicy filling of chives, red pepper, and seasonings. Its cool, crunchy texture makes it a perfect side dish for hot weather."
  },
  nabak: {
    history: `나박김치는 무와 배추를 납작하게 썰어 맑은 국물에 담근 물김치의 한 종류입니다. '나박'이란 얇게 썬다는 뜻으로, 조선시대부터 봄·여름철 시원한 반찬으로 즐겨 먹었습니다. 고춧가루를 소량만 사용해 분홍빛을 띠며, 국물이 시원하고 개운한 것이 특징입니다.`,
    makingProcess: `1. 무와 배추를 나박하게(얇고 납작하게) 썹니다
2. 무에 소금을 뿌려 살짝 절입니다
3. 미나리, 쪽파, 홍고추를 준비합니다
4. 고춧가루를 거즈에 싸서 물에 우려 색을 냅니다
5. 용기에 채소를 담고 소금과 마늘, 생강을 넣은 국물을 부어줍니다
6. 실온에서 하루 발효시킨 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주
국물이 탁해지기 전에 소비 권장
서늘한 곳에서 천천히 발효시키면 국물이 더 시원해짐`,
    nutritionInfo: {
      calories: 10,
      carbohydrates: 1.8,
      protein: 0.5,
      fat: 0.1,
      fiber: 0.7,
      vitaminC: 9
    },
    descriptionEn: "A mild water kimchi made with thinly sliced radish and napa cabbage in a light, refreshing broth with a hint of red pepper. Often served as a palate cleanser alongside rich Korean meals."
  },
  yeolmu: {
    history: `열무김치는 어린 무(열무)의 줄기와 잎을 이용해 담그는 여름철 대표 김치입니다. '열무'는 '어린 무'라는 뜻으로, 부드러운 식감과 산뜻한 맛이 특징입니다. 조선시대부터 여름 별미로 사랑받았으며, 특히 열무비빔국수와 열무냉면의 재료로 유명합니다.`,
    makingProcess: `1. 열무를 5-6cm 길이로 잘라 깨끗이 씻습니다
2. 소금에 30분간 살짝 절여 숨을 죽입니다
3. 고춧가루, 멸치액젓, 마늘, 생강을 섞어 양념을 만듭니다
4. 찹쌀풀을 쒀서 양념에 섞어줍니다
5. 절인 열무에 양념을 살살 버무립니다 (줄기가 부러지지 않게)
6. 실온에서 반나절 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주
여름철에는 빨리 시어지므로 소량씩 담가 빨리 소비
국물이 많으면 비빔국수에 활용 가능`,
    nutritionInfo: {
      calories: 14,
      carbohydrates: 2.3,
      protein: 0.7,
      fat: 0.2,
      fiber: 1.3,
      vitaminC: 15
    },
    descriptionEn: "A light and refreshing summer kimchi made from young radish greens. Popular as a base for bibim-guksu (spicy mixed noodles) and a staple of Korean summer cuisine with its tangy, slightly sour flavor."
  },
  gat: {
    history: `갓김치는 전라남도 여수·순천 지역의 대표적인 향토 김치로, 갓 특유의 알싸하고 톡 쏘는 매운맛이 특징입니다. 고려시대부터 갓을 재배한 기록이 있으며, 특히 여수 돌산갓김치가 전국적으로 유명합니다. 2006년 돌산갓김치는 지리적 표시 단체표장으로 등록되었습니다.`,
    makingProcess: `1. 갓을 깨끗이 다듬어 씻습니다
2. 소금에 2-3시간 절입니다 (줄기가 굵으면 더 오래)
3. 찹쌀풀에 고춧가루, 멸치액젓, 새우젓, 마늘, 생강을 섞어 양념을 만듭니다
4. 절인 갓에 양념을 골고루 묻혀줍니다
5. 가지런히 정리하여 용기에 담습니다
6. 실온에서 1-2일 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-3주
발효가 진행될수록 톡 쏘는 맛이 강해짐
밀폐 보관 필수 (냄새가 강함)`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 3.2,
      protein: 1.5,
      fat: 0.3,
      fiber: 2.0,
      vitaminC: 22
    },
    descriptionEn: "A pungent and spicy kimchi made from mustard leaves, a specialty of Jeollanam-do province. Known for its distinctive sharp, wasabi-like kick and deep flavor that intensifies with fermentation."
  },
  bossam: {
    history: `보쌈김치는 조선시대 궁중에서 유래한 고급 김치로, 개성 지방의 대표적인 김치이기도 합니다. 배추잎에 해산물, 밤, 대추, 배 등 다양한 귀한 재료를 싸서 담그기 때문에 '보쌈(싸다)'이라는 이름이 붙었습니다. 왕실과 양반가에서 명절이나 특별한 날에 담가 먹던 최고급 김치입니다.`,
    makingProcess: `1. 배추를 절여서 잎을 한 장씩 떼어놓습니다
2. 굴, 낙지, 전복 등 해산물을 손질합니다
3. 밤, 대추, 배, 잣, 석이버섯 등 고명을 준비합니다
4. 양념(고춧가루, 젓갈, 마늘, 생강)을 만듭니다
5. 배추잎 위에 해산물, 과일, 견과류, 양념을 올려 보자기처럼 싸줍니다
6. 용기에 차곡차곡 담아 1-2일 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주
해산물이 들어가므로 장기 보관 불가
밀폐용기에 보관하고 빨리 소비 권장`,
    nutritionInfo: {
      calories: 32,
      carbohydrates: 4.1,
      protein: 2.8,
      fat: 0.5,
      fiber: 1.4,
      vitaminC: 14
    },
    descriptionEn: "An elaborate royal court kimchi where napa cabbage leaves are wrapped around premium fillings including seafood (oysters, octopus), chestnuts, jujubes, and pine nuts. Considered the most luxurious type of kimchi."
  },
  baek: {
    history: `백김치는 고춧가루를 사용하지 않고 담그는 하얀 김치로, 고추가 한반도에 전래되기 이전의 김치 원형에 가깝습니다. 조선시대에는 매운 것을 먹지 못하는 어린이, 노인, 환자를 위해 담갔으며, 궁중에서도 즐겨 담갔습니다. 담백하고 시원한 국물 맛이 특징입니다.`,
    makingProcess: `1. 배추를 소금에 절여 씻은 후 물기를 뺍니다
2. 무채, 배채, 밤, 대추, 잣을 준비합니다
3. 마늘, 생강, 실고추를 준비합니다 (고춧가루 사용 안 함)
4. 배추 잎 사이에 준비한 속재료를 넣습니다
5. 소금물을 만들어 부어줍니다
6. 실온에서 1-2일 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-4주
국물이 맑게 유지되도록 깨끗한 도구 사용
배추가 국물에 잠기도록 보관`,
    nutritionInfo: {
      calories: 11,
      carbohydrates: 1.9,
      protein: 0.6,
      fat: 0.1,
      fiber: 1.0,
      vitaminC: 15
    },
    descriptionEn: "A non-spicy white kimchi made without red pepper powder. Features a clean, mild flavor with subtle sweetness from pear and jujube. Perfect for children, elderly, or anyone who prefers gentle flavors."
  },
  buchu: {
    history: `부추김치는 부추를 양념에 버무려 담그는 김치로, 삼국시대부터 부추가 약용 및 식용으로 사용된 기록이 있습니다. 부추는 예로부터 '양기를 돋우는 채소'로 알려져 건강식으로 즐겨 먹었습니다. 경상도 지역에서는 '정구지김치'라고도 부르며, 만들기 쉬워 가정에서 널리 담가 먹는 김치입니다.`,
    makingProcess: `1. 부추를 깨끗이 씻어 4-5cm 길이로 자릅니다
2. 소금에 살짝 절여 10-15분간 숨을 죽입니다
3. 고춧가루, 멸치액젓, 마늘, 생강, 설탕을 섞어 양념을 만듭니다
4. 절인 부추에 양념을 골고루 가볍게 버무립니다 (부추가 부러지지 않게)
5. 통깨를 뿌려 마무리합니다
6. 바로 먹거나 냉장 보관합니다`,
    storageMethod: `냉장 보관: 3-5일
부추가 쉽게 물러지므로 소량씩 담가 빨리 소비
밀폐용기에 보관, 숙성시키지 않고 신선하게 먹는 것이 좋음`,
    nutritionInfo: {
      calories: 17,
      carbohydrates: 2.6,
      protein: 1.3,
      fat: 0.3,
      fiber: 1.5,
      vitaminC: 13
    },
    descriptionEn: "A quick and easy kimchi made with garlic chives, seasoned with red pepper and fish sauce. Known for its distinctive aroma and health benefits, it's a beloved everyday side dish in Korean homes."
  },
  kkaennip: {
    history: `깻잎김치는 들깻잎을 양념장에 켜켜이 재워 담그는 장아찌 형태의 김치입니다. 들깨는 한반도에서 오래전부터 재배되었으며, 깻잎의 독특한 향은 한국인이 특히 좋아하는 향미입니다. 밥도둑이라 불릴 만큼 밥과의 궁합이 뛰어나며, 고기를 쌀 때 함께 먹으면 느끼함을 잡아줍니다.`,
    makingProcess: `1. 깻잎을 한 장씩 깨끗이 씻어 물기를 뺍니다
2. 간장, 고춧가루, 마늘, 파, 멸치액젓, 통깨를 섞어 양념장을 만듭니다
3. 깻잎 한 장마다 양념장을 골고루 발라 켜켜이 쌓습니다
4. 5-10장씩 묶어 밀폐용기에 차곡차곡 담습니다
5. 실온에서 반나절 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-3주
양념장에 잠기도록 보관
시간이 지날수록 양념이 잘 배어 맛이 깊어짐`,
    nutritionInfo: {
      calories: 25,
      carbohydrates: 3.0,
      protein: 1.8,
      fat: 0.6,
      fiber: 2.2,
      vitaminC: 10
    },
    descriptionEn: "Perilla leaves layered with a savory soy sauce-based seasoning. Known as a 'rice thief' for its irresistible flavor, the aromatic perilla leaves also pair perfectly with grilled meats."
  },
  altari: {
    history: `알타리김치는 총각무(알타리무)로 담그는 김치의 별칭으로, '알타리'는 작고 둥근 무의 모양에서 유래했습니다. 총각김치와 같은 재료를 쓰지만, 지역에 따라 양념 비율이나 숙성 방법에 차이가 있어 별도로 구분하기도 합니다. 특히 충청도와 전라도 지역에서 '알타리'라는 이름으로 더 많이 불립니다.`,
    makingProcess: `1. 알타리무를 깨끗이 씻어 무청을 다듬습니다
2. 굵은소금으로 1-2시간 절여 숨을 죽입니다
3. 절인 무를 씻어 물기를 빼줍니다
4. 고춧가루, 멸치액젓, 새우젓, 마늘, 생강, 쪽파를 섞어 양념을 만듭니다
5. 알타리무에 양념을 골고루 버무립니다
6. 밀폐용기에 담아 실온에서 하루 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-3주. 아삭한 식감을 즐기려면 일찍 소비하는 것이 좋으며, 김치냉장고에서는 최대 2개월까지 보관 가능합니다.`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 3.6,
      protein: 0.8,
      fat: 0.2,
      fiber: 1.7,
      vitaminC: 15
    },
    descriptionEn: "A variant name for ponytail radish kimchi, featuring small, round radishes with a crispy bite and spicy seasoning. Popular in Chungcheong and Jeolla provinces."
  },
  andong: {
    history: `안동김치는 경상북도 안동 지방에서 전해 내려오는 전통 김치로, 안동은 유교 문화의 중심지로서 반가(양반가) 음식 문화가 발달했습니다. 안동김치는 간이 세지 않고 담백하면서도 깊은 맛이 특징이며, 고춧가루보다 고춧잎이나 고추씨를 활용하는 독특한 방식이 전해집니다. 안동 간고등어와 함께 먹으면 궁합이 뛰어납니다.`,
    makingProcess: `1. 배추를 소금에 절여 8-10시간 둡니다
2. 절인 배추를 깨끗이 헹궈 물기를 뺍니다
3. 무채, 미나리, 대파, 마늘, 생강을 준비합니다
4. 고춧가루와 멸치젓을 중심으로 양념을 만듭니다
5. 배추 잎 사이사이에 양념소를 꼼꼼히 넣습니다
6. 항아리나 밀폐용기에 담아 서늘한 곳에서 숙성시킵니다`,
    storageMethod: `서늘한 곳에서 천천히 발효시키는 것이 핵심이며, 냉장 보관 시 2-3주 정도 최상의 맛을 유지합니다.`,
    nutritionInfo: {
      calories: 16,
      carbohydrates: 2.5,
      protein: 1.0,
      fat: 0.3,
      fiber: 1.5,
      vitaminC: 17
    },
    descriptionEn: "A traditional kimchi from Andong, Gyeongsangbuk-do, known for its mild yet deeply savory flavor rooted in the region's Confucian noble cuisine traditions."
  },
  changnan: {
    history: `창난젓김치는 명태의 창자(창난)를 소금에 절여 만든 창난젓을 양념과 함께 무쳐 만드는 독특한 김치입니다. 함경도와 강원도 해안 지역에서 유래했으며, 명태가 풍부했던 시절 부산물을 활용한 지혜로운 음식입니다. 쫄깃한 식감과 강렬한 감칠맛이 특징입니다.`,
    makingProcess: `1. 창난젓을 적당한 크기로 잘라 준비합니다
2. 무를 채 썰어 준비합니다
3. 고춧가루, 마늘, 생강, 파, 참기름을 섞어 양념을 만듭니다
4. 창난젓과 무채를 양념에 골고루 버무립니다
5. 통깨를 뿌려 마무리합니다
6. 밀폐용기에 담아 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-4주. 젓갈 특성상 오래 보관할 수 있으나, 시간이 지나면 짠맛이 강해질 수 있으므로 적당한 시기에 소비합니다.`,
    nutritionInfo: {
      calories: 28,
      carbohydrates: 2.0,
      protein: 3.5,
      fat: 0.8,
      fiber: 0.5,
      vitaminC: 5
    },
    descriptionEn: "A unique kimchi made with salted pollock intestines (changnan-jeot), offering a chewy texture and intense umami flavor. Originated from coastal regions where pollock was abundant."
  },
  dalrae: {
    history: `달래김치는 봄철 산과 들에서 자생하는 달래를 활용한 계절 김치입니다. 달래는 한국에서 오래전부터 봄나물로 사랑받았으며, 특유의 알싸한 향과 매콤한 맛이 특징입니다. 봄기운을 느낄 수 있는 제철 김치로, 주로 3-4월에 담가 먹으며 입맛을 돋우는 역할을 합니다.`,
    makingProcess: `1. 달래를 뿌리째 캐어 깨끗이 씻습니다
2. 뿌리 부분을 다듬어 정리합니다
3. 고춧가루, 멸치액젓, 마늘, 식초, 설탕을 섞어 양념을 만듭니다
4. 달래에 양념을 살살 버무립니다 (줄기가 상하지 않게)
5. 통깨를 뿌려 마무리합니다
6. 바로 먹거나 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-3일. 달래는 금방 시들기 때문에 소량씩 담가 바로 먹는 것이 가장 좋습니다.`,
    nutritionInfo: {
      calories: 18,
      carbohydrates: 2.8,
      protein: 1.1,
      fat: 0.3,
      fiber: 1.4,
      vitaminC: 20
    },
    descriptionEn: "A seasonal spring kimchi made with wild chives (dalrae), featuring a distinctive sharp aroma and peppery kick. Best enjoyed fresh in March and April."
  },
  doraji: {
    history: `도라지김치는 도라지(길경)를 주재료로 한 김치로, 도라지는 예로부터 약용 식물로 귀히 여겨졌습니다. 조선시대 의서에도 도라지가 기관지와 폐에 좋다고 기록되어 있으며, 이를 김치로 담가 건강식으로 즐겼습니다. 특유의 쌉싸름한 맛과 아삭한 식감이 매력적입니다.`,
    makingProcess: `1. 도라지를 껍질을 벗기고 소금물에 담가 쓴맛을 제거합니다 (2-3시간)
2. 손으로 주물러 씻어 쓴물을 빼줍니다
3. 적당한 크기로 찢거나 잘라 준비합니다
4. 고춧가루, 멸치액젓, 마늘, 생강, 파를 섞어 양념을 만듭니다
5. 도라지에 양념을 골고루 버무립니다
6. 밀폐용기에 담아 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주. 시간이 지나면 도라지가 물러질 수 있으므로 적정 기간 내 소비를 권장합니다.`,
    nutritionInfo: {
      calories: 22,
      carbohydrates: 4.2,
      protein: 1.0,
      fat: 0.2,
      fiber: 2.0,
      vitaminC: 12
    },
    descriptionEn: "A kimchi made with bellflower root (doraji), prized for its slightly bitter flavor and crunchy texture. Traditionally valued for its respiratory health benefits."
  },
  gaji: {
    history: `가지김치는 여름철 제철 채소인 가지를 활용한 계절 김치입니다. 가지는 삼국시대에 중국에서 전래되어 한반도에서 널리 재배되었으며, 여름 더위에 몸의 열을 내려주는 효능이 있다고 알려져 있습니다. 통가지를 쪼개어 양념을 넣는 소박이 형태가 일반적입니다.`,
    makingProcess: `1. 가지를 깨끗이 씻어 5-6cm 길이로 자릅니다
2. 가운데를 갈라 칼집을 넣되 끝은 붙여둡니다
3. 소금물에 10-15분 절여 숨을 죽입니다
4. 부추, 고춧가루, 멸치액젓, 마늘, 생강으로 양념소를 만듭니다
5. 가지 칼집 사이에 양념소를 채워 넣습니다
6. 용기에 담아 냉장 보관합니다`,
    storageMethod: `냉장 보관: 3-5일. 가지는 쉽게 물러지므로 소량씩 담가 빨리 소비하는 것이 좋습니다.`,
    nutritionInfo: {
      calories: 14,
      carbohydrates: 2.5,
      protein: 0.7,
      fat: 0.1,
      fiber: 1.8,
      vitaminC: 6
    },
    descriptionEn: "A summer kimchi made with eggplant, stuffed with a spicy chive filling. The soft, silky texture of eggplant combined with pungent seasoning makes it a refreshing warm-weather dish."
  },
  geoje: {
    history: `거제김치는 경상남도 거제도에서 전해 내려오는 향토 김치로, 섬 지역 특성상 해산물이 풍부하게 사용됩니다. 거제도는 한려해상국립공원에 위치한 섬으로, 신선한 멸치와 해산물 젓갈이 풍부하여 이를 김치에 적극 활용했습니다. 바다의 감칠맛이 깃든 독특한 풍미가 특징입니다.`,
    makingProcess: `1. 배추를 소금에 절여 8-10시간 둡니다
2. 절인 배추를 씻어 물기를 뺍니다
3. 신선한 멸치액젓과 해산물(멸치, 꽃게 등)을 준비합니다
4. 고춧가루, 마늘, 생강, 파와 함께 양념을 만듭니다
5. 배추에 양념을 넣어 버무립니다
6. 항아리나 밀폐용기에 담아 서늘한 곳에서 숙성시킵니다`,
    storageMethod: `냉장 보관: 2-3주. 해산물이 포함되어 있어 일반 배추김치보다 숙성이 빠를 수 있으므로 상태를 확인하며 소비합니다.`,
    nutritionInfo: {
      calories: 19,
      carbohydrates: 2.3,
      protein: 1.5,
      fat: 0.4,
      fiber: 1.4,
      vitaminC: 16
    },
    descriptionEn: "A regional kimchi from Geoje Island featuring abundant local seafood and anchovy sauce. The maritime influence gives it a distinctive deep umami character."
  },
  ggwarigochu: {
    history: `꽈리고추김치는 꽈리고추를 통째로 양념에 버무려 담그는 김치입니다. 꽈리고추는 표면이 쭈글쭈글한 것이 특징으로, 일반 풋고추보다 매운맛이 덜하고 달콤합니다. 여름철 밑반찬으로 인기가 높으며, 간장 베이스와 고춧가루 베이스 두 가지 방식으로 담글 수 있습니다.`,
    makingProcess: `1. 꽈리고추를 깨끗이 씻어 꼭지를 따줍니다
2. 이쑤시개로 구멍을 몇 개 뚫어 양념이 배도록 합니다
3. 고춧가루, 멸치액젓, 마늘, 통깨를 섞어 양념을 만듭니다
4. 꽈리고추에 양념을 골고루 버무립니다
5. 밀폐용기에 담아 실온에서 반나절 숙성합니다
6. 냉장 보관하며 먹습니다`,
    storageMethod: `냉장 보관: 1-2주. 아삭한 식감을 유지하려면 빨리 소비하는 것이 좋으며, 오래두면 고추가 물러집니다.`,
    nutritionInfo: {
      calories: 16,
      carbohydrates: 2.9,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.6,
      vitaminC: 45
    },
    descriptionEn: "A kimchi made with shishito-like wrinkled peppers, milder and slightly sweeter than regular chili peppers. A popular summer side dish with a satisfying crunch."
  },
  gochu: {
    history: `고추김치(고추소박이)는 풋고추에 양념소를 채워 담그는 김치입니다. 고추가 한반도에 전래된 이후 다양한 고추 요리가 발전했으며, 고추소박이도 그중 하나입니다. 매콤한 고추와 짭조름한 양념소의 조화가 일품이며, 여름철 밥도둑으로 사랑받는 김치입니다.`,
    makingProcess: `1. 풋고추를 깨끗이 씻어 꼭지 쪽에 칼집을 넣습니다
2. 소금물에 살짝 절여 숨을 죽입니다
3. 무채, 부추, 고춧가루, 멸치액젓, 마늘로 양념소를 만듭니다
4. 칼집 사이로 양념소를 꼼꼼히 채워 넣습니다
5. 용기에 차곡차곡 담습니다
6. 실온에서 하루 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주. 고추가 물러지기 전에 소비하는 것이 좋으며, 매운맛은 숙성될수록 약간 줄어듭니다.`,
    nutritionInfo: {
      calories: 18,
      carbohydrates: 3.0,
      protein: 0.8,
      fat: 0.2,
      fiber: 1.5,
      vitaminC: 80
    },
    descriptionEn: "A stuffed green chili pepper kimchi filled with radish and chive seasoning. Delivers a satisfying spicy punch and is considered a quintessential summer rice companion."
  },
  godeulppaegi: {
    history: `고들빼기김치는 고들빼기라는 야생 나물로 담그는 김치입니다. 고들빼기는 씀바귀과의 식물로, 봄과 가을에 채취하며 특유의 쌉싸름한 맛이 특징입니다. 전라도 지역에서 특히 사랑받으며, 입맛 없을 때 밥 반찬으로 최고라는 평가를 받습니다. 예로부터 소화를 돕고 위장에 좋다고 알려져 있습니다.`,
    makingProcess: `1. 고들빼기를 소금물에 2-3일 담가 쓴맛을 제거합니다
2. 매일 물을 갈아주며 쓴물을 빼줍니다
3. 고춧가루, 멸치액젓, 마늘, 생강, 파를 섞어 양념을 만듭니다
4. 찹쌀풀을 쒀서 양념에 섞어줍니다
5. 물기를 뺀 고들빼기에 양념을 골고루 버무립니다
6. 밀폐용기에 담아 실온에서 1-2일 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-4주. 쓴맛 제거 과정이 충분히 되었다면 오래 두고 먹을 수 있으며, 숙성될수록 맛이 깊어집니다.`,
    nutritionInfo: {
      calories: 21,
      carbohydrates: 3.3,
      protein: 1.2,
      fat: 0.3,
      fiber: 2.1,
      vitaminC: 14
    },
    descriptionEn: "A distinctive kimchi made from hawkweed (godeulppaegi), a wild herb with a pleasantly bitter taste. Highly prized in Jeolla-do as a gourmet side dish that stimulates appetite."
  },
  goguma: {
    history: `고구마줄기김치는 고구마의 줄기(고구마순)를 활용한 여름·가을철 김치입니다. 고구마가 조선시대 후기에 전래된 이후, 알뿐 아니라 줄기까지 활용하는 알뜰한 식문화가 발전했습니다. 고구마줄기의 아삭한 식감과 고유의 단맛이 양념과 어우러져 독특한 맛을 냅니다.`,
    makingProcess: `1. 고구마줄기의 껍질을 벗겨 5-6cm 길이로 자릅니다
2. 소금물에 30분간 절여 숨을 죽입니다
3. 절인 줄기를 씻어 물기를 뺍니다
4. 고춧가루, 멸치액젓, 마늘, 생강, 통깨를 섞어 양념을 만듭니다
5. 고구마줄기에 양념을 골고루 버무립니다
6. 밀폐용기에 담아 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주. 줄기가 물러지기 전에 소비하는 것이 좋으며, 담근 직후 바로 먹어도 맛있습니다.`,
    nutritionInfo: {
      calories: 15,
      carbohydrates: 2.7,
      protein: 0.6,
      fat: 0.1,
      fiber: 1.9,
      vitaminC: 8
    },
    descriptionEn: "A kimchi made from sweet potato stems, offering a unique crunchy texture and subtle natural sweetness. A resourceful dish that makes full use of the sweet potato plant."
  },
  gulkimchi: {
    history: `굴김치는 신선한 생굴을 넣어 담그는 김치로, 서해안과 남해안 지역에서 겨울철 굴이 제철일 때 담가 먹던 별미 김치입니다. 특히 충남 서산, 전남 여수, 경남 통영 등 굴 산지에서 즐겨 만들었습니다. 굴의 바다 향과 감칠맛이 김치에 풍미를 더해주어 최고의 겨울 김치로 손꼽힙니다.`,
    makingProcess: `1. 배추를 소금에 절여 8-10시간 둡니다
2. 절인 배추를 씻어 물기를 빼줍니다
3. 신선한 굴을 소금물에 씻어 불순물을 제거합니다
4. 고춧가루, 젓갈, 마늘, 생강, 파로 양념을 만듭니다
5. 양념에 굴을 넣고, 배추 잎 사이에 함께 넣습니다
6. 밀폐용기에 담아 실온에서 하루 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주. 굴이 상하기 쉬우므로 반드시 신선한 상태에서 빨리 소비해야 합니다. 장기 보관 시 굴은 건져내는 것이 좋습니다.`,
    nutritionInfo: {
      calories: 25,
      carbohydrates: 2.2,
      protein: 2.5,
      fat: 0.6,
      fiber: 1.3,
      vitaminC: 16
    },
    descriptionEn: "A premium winter kimchi enriched with fresh raw oysters, adding briny ocean flavor and rich umami. A seasonal delicacy from Korea's coastal oyster-producing regions."
  },
  hobak: {
    history: `호박김치는 애호박(또는 늙은 호박)을 주재료로 한 여름철 김치입니다. 호박은 임진왜란 이후 한반도에 전래된 것으로 추정되며, 이후 다양한 요리에 활용되었습니다. 호박김치는 호박 특유의 달콤한 맛과 부드러운 식감이 매력적이며, 여름철 입맛을 돋우는 반찬으로 사랑받습니다.`,
    makingProcess: `1. 애호박을 반으로 갈라 반달 모양으로 썹니다
2. 소금에 살짝 절여 10-15분 둡니다
3. 물기를 가볍게 빼줍니다
4. 고춧가루, 멸치액젓, 마늘, 파, 새우젓을 섞어 양념을 만듭니다
5. 호박에 양념을 골고루 버무립니다
6. 밀폐용기에 담아 냉장 보관합니다`,
    storageMethod: `냉장 보관: 3-5일. 호박은 수분이 많아 빨리 물러지므로 소량씩 담가 신선하게 먹는 것이 좋습니다.`,
    nutritionInfo: {
      calories: 13,
      carbohydrates: 2.4,
      protein: 0.6,
      fat: 0.1,
      fiber: 0.8,
      vitaminC: 10
    },
    descriptionEn: "A light summer kimchi made with Korean zucchini (aehobak), featuring a gentle sweetness and tender texture that makes it an easy-to-enjoy seasonal side dish."
  },
  jangkimchi: {
    history: `장김치는 간장을 베이스로 담그는 김치로, 고춧가루를 사용하지 않거나 소량만 쓰는 것이 특징입니다. 조선시대 궁중과 양반가에서 즐겨 담갔으며, 간장의 감칠맛과 깊은 풍미가 돋보입니다. 백김치와 유사하지만 간장 특유의 갈색빛과 깊은 맛이 차별점이며, 고급스러운 맛으로 잔칫상에 올랐습니다.`,
    makingProcess: `1. 배추나 무를 적당한 크기로 썹니다
2. 소금에 살짝 절여 숨을 죽입니다
3. 간장, 마늘, 생강, 대추, 배를 섞어 양념 국물을 만듭니다
4. 절인 채소를 용기에 담습니다
5. 양념 국물을 부어줍니다
6. 서늘한 곳에서 2-3일 숙성 후 냉장 보관합니다`,
    storageMethod: `냉장 보관: 2-4주. 간장 베이스라 일반 김치보다 보존성이 좋으며, 국물이 채소를 덮도록 유지합니다.`,
    nutritionInfo: {
      calories: 14,
      carbohydrates: 2.0,
      protein: 0.8,
      fat: 0.1,
      fiber: 0.9,
      vitaminC: 11
    },
    descriptionEn: "A soy sauce-based kimchi with a refined, non-spicy flavor profile. Historically served in royal courts and noble households, it offers a deep umami richness from aged soy sauce."
  },
  jeju: {
    history: `제주김치는 제주도 특유의 식재료와 기후를 반영한 향토 김치입니다. 제주도는 해산물이 풍부하여 전복, 톳, 성게 등을 김치에 활용하는 독특한 전통이 있습니다. 또한 육지보다 따뜻한 기후 때문에 발효가 빨라, 간을 세게 하거나 빨리 소비하는 방식으로 발전했습니다.`,
    makingProcess: `1. 배추를 소금에 절여 6-8시간 둡니다
2. 절인 배추를 씻어 물기를 빼줍니다
3. 전복, 톳 등 해산물을 손질하여 준비합니다
4. 고춧가루, 마늘, 생강, 멸치젓, 해산물을 섞어 양념을 만듭니다
5. 배추에 양념을 넣어 버무립니다
6. 밀폐용기에 담아 서늘한 곳에서 숙성시킵니다`,
    storageMethod: `냉장 보관: 1-2주. 해산물이 포함되어 있어 숙성이 빠르므로, 상태를 자주 확인하며 빨리 소비합니다.`,
    nutritionInfo: {
      calories: 22,
      carbohydrates: 2.1,
      protein: 2.0,
      fat: 0.4,
      fiber: 1.2,
      vitaminC: 15
    },
    descriptionEn: "A distinctive kimchi from Jeju Island incorporating local seafood such as abalone and sea mustard. Reflects the island's warm climate and abundant marine resources."
  },
  jeotgal: {
    history: `젓갈김치는 다양한 젓갈(새우젓, 멸치젓, 조기젓 등)을 풍부하게 넣어 담그는 김치입니다. 전라도 지역에서 특히 발달했으며, 젓갈의 깊은 감칠맛이 김치의 풍미를 한층 끌어올립니다. 젓갈은 김치 발효의 핵심 촉매 역할을 하며, 사용하는 젓갈의 종류에 따라 맛이 크게 달라집니다.`,
    makingProcess: `1. 배추를 소금에 절여 8-10시간 둡니다
2. 절인 배추를 씻어 물기를 빼줍니다
3. 새우젓, 멸치젓, 조기젓 등 여러 종류의 젓갈을 준비합니다
4. 고춧가루, 마늘, 생강, 파, 젓갈을 넉넉히 넣어 양념을 만듭니다
5. 배추에 양념을 꼼꼼히 넣어 버무립니다
6. 밀폐용기에 담아 서늘한 곳에서 천천히 숙성시킵니다`,
    storageMethod: `냉장 보관: 2-4주. 젓갈이 풍부하여 감칠맛이 깊으며, 숙성 기간이 길수록 맛이 깊어집니다.`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 2.3,
      protein: 1.8,
      fat: 0.4,
      fiber: 1.5,
      vitaminC: 16
    },
    descriptionEn: "A kimchi generously seasoned with various fermented seafood pastes (jeotgal), delivering an exceptionally deep and complex umami flavor. A specialty of Jeolla-do province."
  },
  jinju: {
    history: `진주김치는 경상남도 진주 지방의 전통 김치로, 진주는 예로부터 남강 유역의 풍요로운 식재료와 교방 음식 문화가 발달한 지역입니다. 진주김치는 담백하면서도 깔끔한 맛이 특징이며, 진주비빔밥과 함께 유명한 향토 음식입니다. 멸치젓을 주로 사용하며, 경상도식 특유의 간결한 맛이 돋보입니다.`,
    makingProcess: `1. 배추를 소금에 절여 8시간 둡니다
2. 절인 배추를 깨끗이 씻어 물기를 빼줍니다
3. 무채, 미나리, 대파를 준비합니다
4. 고춧가루, 멸치젓, 마늘, 생강을 섞어 양념을 만듭니다
5. 배추에 양념소를 넣어 버무립니다
6. 항아리에 담아 서늘한 곳에서 숙성시킵니다`,
    storageMethod: `냉장 보관: 2-3주. 경상도식답게 국물이 적고 담백하므로, 밀폐용기에 꼭꼭 눌러 보관합니다.`,
    nutritionInfo: {
      calories: 16,
      carbohydrates: 2.4,
      protein: 1.0,
      fat: 0.3,
      fiber: 1.4,
      vitaminC: 17
    },
    descriptionEn: "A traditional kimchi from Jinju, Gyeongsangnam-do, known for its clean and understated flavor. Often paired with Jinju bibimbap as a representative regional cuisine."
  },
  jogaejeotgal: {
    history: `조개젓갈김치는 조개를 소금에 절여 만든 젓갈로 담그는 김치입니다. 서해안 지역에서 조개가 풍부하게 잡히던 시절, 조개젓을 김치 양념으로 활용하면서 발전했습니다. 조개젓 특유의 시원한 감칠맛이 김치에 깊은 풍미를 더해주며, 일반 젓갈김치와는 다른 독특한 맛을 선사합니다.`,
    makingProcess: `1. 배추를 소금에 절여 8-10시간 둡니다
2. 절인 배추를 씻어 물기를 빼줍니다
3. 조개젓을 곱게 다져 준비합니다
4. 고춧가루, 조개젓, 마늘, 생강, 파를 섞어 양념을 만듭니다
5. 배추에 양념을 골고루 넣어 버무립니다
6. 밀폐용기에 담아 서늘한 곳에서 숙성시킵니다`,
    storageMethod: `냉장 보관: 2-3주. 조개젓의 풍미가 잘 배어들도록 충분히 숙성시키되, 해산물 특성상 너무 오래 보관하지 않습니다.`,
    nutritionInfo: {
      calories: 19,
      carbohydrates: 2.2,
      protein: 1.6,
      fat: 0.3,
      fiber: 1.3,
      vitaminC: 15
    },
    descriptionEn: "A kimchi made with fermented clam paste (jogae-jeotgal), imparting a clean oceanic umami that distinguishes it from other jeotgal-based kimchi varieties."
  },
  jokbal: {
    history: `족발김치는 족발(돼지 족발 요리)과 곁들여 먹기 위해 특화된 무김치의 변형입니다. 족발은 조선시대부터 서민들이 즐기던 보양식이었으며, 느끼한 족발의 기름기를 잡아주는 시원하고 새콤한 무김치가 자연스럽게 발전했습니다. 무를 얇게 썰어 새콤달콤하게 담가, 족발의 쫄깃한 식감과 완벽한 조화를 이룹니다.`,
    makingProcess: `1. 무를 얇게 나박 썰기 합니다
2. 소금과 설탕에 30분간 절입니다
3. 식초, 고춧가루(소량), 마늘, 생강을 섞어 양념을 만듭니다
4. 절인 무에 양념을 버무립니다
5. 새콤달콤한 맛이 나도록 식초와 설탕 비율을 조절합니다
6. 냉장고에서 반나절 이상 차갑게 숙성합니다`,
    storageMethod: `냉장 보관: 1-2주. 시원하게 먹어야 족발과 궁합이 좋으므로, 항상 냉장 상태를 유지합니다.`,
    nutritionInfo: {
      calories: 12,
      carbohydrates: 2.6,
      protein: 0.4,
      fat: 0.1,
      fiber: 0.8,
      vitaminC: 10
    },
    descriptionEn: "A tangy, sweet-and-sour radish kimchi specially designed to accompany jokbal (braised pig's feet). Its refreshing acidity cuts through the richness of the pork."
  },
  jukkumi: {
    history: `주꾸미김치는 봄철 제철 해산물인 주꾸미를 넣어 담그는 특색 있는 김치입니다. 주꾸미는 3-5월이 제철로, 이 시기에 알이 꽉 차 가장 맛있습니다. 서해안 어촌 지역에서 풍성한 주꾸미를 김치에 활용하면서 시작된 향토 음식으로, 주꾸미의 쫄깃한 식감과 김치의 매콤한 맛이 어우러집니다.`,
    makingProcess: `1. 주꾸미를 밀가루로 주물러 깨끗이 씻습니다
2. 끓는 물에 살짝 데쳐 적당한 크기로 자릅니다
3. 배추를 소금에 절여 준비합니다
4. 고춧가루, 멸치액젓, 마늘, 생강, 파를 섞어 양념을 만듭니다
5. 양념에 데친 주꾸미를 넣고 배추와 함께 버무립니다
6. 밀폐용기에 담아 냉장 보관합니다`,
    storageMethod: `냉장 보관: 3-5일. 해산물이 포함되어 있어 빨리 상할 수 있으므로 반드시 소량씩 담가 빨리 소비합니다.`,
    nutritionInfo: {
      calories: 26,
      carbohydrates: 2.0,
      protein: 3.2,
      fat: 0.5,
      fiber: 1.0,
      vitaminC: 12
    },
    descriptionEn: "A specialty kimchi featuring baby octopus (jukkumi), a prized spring delicacy. The chewy octopus pairs wonderfully with the spicy, tangy kimchi flavors."
  },
  kodari: {
    history: `코다리김치는 반건조 명태(코다리)를 넣어 담그는 별미 김치입니다. 코다리는 명태를 반쯤 말린 것으로, 강원도와 함경도 지역에서 발달한 명태 가공 문화의 산물입니다. 코다리의 쫄깃하고 담백한 맛이 김치 양념과 어우러져 독특한 풍미를 만들어내며, 겨울철 별미로 즐겨 먹습니다.`,
    makingProcess: `1. 코다리를 물에 30분간 불려 적당한 크기로 자릅니다
2. 무를 나박하게 썰어 준비합니다
3. 고춧가루, 멸치액젓, 마늘, 생강, 파, 설탕을 섞어 양념을 만듭니다
4. 코다리와 무에 양념을 골고루 버무립니다
5. 양념이 잘 배도록 조물조물 무쳐줍니다
6. 밀폐용기에 담아 냉장 보관합니다`,
    storageMethod: `냉장 보관: 1-2주. 반건조 생선이 들어 있어 너무 오래 두면 비린내가 날 수 있으므로, 적정 기간 내 소비를 권장합니다.`,
    nutritionInfo: {
      calories: 30,
      carbohydrates: 2.5,
      protein: 4.0,
      fat: 0.6,
      fiber: 0.7,
      vitaminC: 8
    },
    descriptionEn: "A hearty kimchi made with semi-dried pollock (kodari), combining the chewy, savory fish with spicy kimchi seasoning. A winter specialty from Korea's northeastern coastal regions."
  }
};

// Badge definitions
const BADGES = [
  {
    slug: "first_post",
    name: "첫 게시글",
    nameEn: "First Post",
    description: "첫 번째 게시글을 작성했습니다",
    descriptionEn: "Wrote your first post",
    icon: "📝",
    category: "community",
    requirement: JSON.stringify({ type: "post_count", value: 1 }),
    xpReward: 50
  },
  {
    slug: "active_writer",
    name: "활발한 작성자",
    nameEn: "Active Writer",
    description: "게시글 10개를 작성했습니다",
    descriptionEn: "Wrote 10 posts",
    icon: "✍️",
    category: "community",
    requirement: JSON.stringify({ type: "post_count", value: 10 }),
    xpReward: 200
  },
  {
    slug: "7_day_streak",
    name: "일주일 연속 출석",
    nameEn: "7 Day Streak",
    description: "7일 연속 출석 체크를 달성했습니다",
    descriptionEn: "Checked in for 7 consecutive days",
    icon: "🔥",
    category: "activity",
    requirement: JSON.stringify({ type: "attendance_streak", value: 7 }),
    xpReward: 100
  },
  {
    slug: "30_day_streak",
    name: "한달 연속 출석",
    nameEn: "30 Day Streak",
    description: "30일 연속 출석 체크를 달성했습니다",
    descriptionEn: "Checked in for 30 consecutive days",
    icon: "🏆",
    category: "activity",
    requirement: JSON.stringify({ type: "attendance_streak", value: 30 }),
    xpReward: 500
  },
  {
    slug: "kimchi_explorer",
    name: "김치 탐험가",
    nameEn: "Kimchi Explorer",
    description: "10가지 김치를 도감에 등록했습니다",
    descriptionEn: "Added 10 kimchi types to your dex",
    icon: "🗺️",
    category: "kimchi",
    requirement: JSON.stringify({ type: "dex_count", value: 10 }),
    xpReward: 150
  },
  {
    slug: "kimchi_master",
    name: "김치 마스터",
    nameEn: "Kimchi Master",
    description: "30가지 김치를 도감에 등록했습니다",
    descriptionEn: "Added 30 kimchi types to your dex",
    icon: "👑",
    category: "kimchi",
    requirement: JSON.stringify({ type: "dex_count", value: 30 }),
    xpReward: 500
  },
  {
    slug: "recipe_master",
    name: "레시피 달인",
    nameEn: "Recipe Master",
    description: "레시피 게시글 5개를 작성했습니다",
    descriptionEn: "Wrote 5 recipe posts",
    icon: "👨‍🍳",
    category: "community",
    requirement: JSON.stringify({ type: "recipe_post_count", value: 5 }),
    xpReward: 200
  },
  {
    slug: "helpful_member",
    name: "도움의 손길",
    nameEn: "Helpful Member",
    description: "Q&A 게시판에서 답변 10개를 작성했습니다",
    descriptionEn: "Answered 10 questions in Q&A",
    icon: "🤝",
    category: "community",
    requirement: JSON.stringify({ type: "qna_answer_count", value: 10 }),
    xpReward: 200
  }
];

async function main() {
  console.log("🌱 Starting database seed...\n");

  // 1. Create Users
  console.log("👤 Creating users...");
  const users = await Promise.all(
    MOCK_USERS.map(async (mockUser) => {
      return prisma.user.upsert({
        where: { email: `${mockUser.id}@kimchupa.demo` },
        update: {},
        create: {
          email: `${mockUser.id}@kimchupa.demo`,
          name: mockUser.nickname,
          nickname: mockUser.nickname,
          level: mockUser.level,
          xp: mockUser.xp,
          image: mockUser.profileImage
        }
      });
    })
  );
  console.log(`✅ Created ${users.length} users\n`);

  // Create a user map for reference
  const userMap = new Map(MOCK_USERS.map((m, i) => [m.id, users[i]]));

  // 2. Create Kimchi entries
  console.log("🥬 Creating kimchi entries...");
  const kimchiEntries = await Promise.all(
    KIMCHI_DATA.map(async (kimchi) => {
      const details = KIMCHI_DETAILS[kimchi.id] || KIMCHI_DETAILS_BATCH2[kimchi.id] || {};

      return prisma.kimchi.upsert({
        where: { slug: kimchi.id },
        update: {},
        create: {
          slug: kimchi.id,
          name: kimchi.name,
          nameEn: kimchi.nameEn,
          description: kimchi.description,
          descriptionEn: details.descriptionEn,
          region: kimchi.region,
          spicyLevel: kimchi.spicyLevel,
          fermentationLevel: kimchi.fermentationLevel,
          saltiness: kimchi.saltiness,
          crunchiness: kimchi.crunchiness,
          imageUrl: kimchi.imageUrl,
          history: details.history,
          makingProcess: details.makingProcess,
          storageMethod: details.storageMethod,
          nutritionInfo: details.nutritionInfo,
          variations: details.variations,
          ingredients: {
            create: kimchi.mainIngredients.map((ing, i) => ({
              name: ing,
              isMain: i < 3 // First 3 are main ingredients
            }))
          },
          pairings: {
            create: kimchi.bestWith.map((pairing) => ({
              name: pairing
            }))
          },
          healthBenefits: {
            create: kimchi.healthBenefits.map((benefit) => ({
              benefit
            }))
          },
          tags: {
            create: kimchi.tags.map((tag) => ({ tag }))
          }
        }
      });
    })
  );
  console.log(`✅ Created ${kimchiEntries.length} kimchi entries\n`);

  // Create kimchi map
  const kimchiMap = new Map(KIMCHI_DATA.map((k, i) => [k.id, kimchiEntries[i]]));

  // 3. Create Badges
  console.log("🏅 Creating badges...");
  const badges = await Promise.all(
    BADGES.map(async (badge) => {
      return prisma.badge.upsert({
        where: { slug: badge.slug },
        update: {},
        create: badge
      });
    })
  );
  console.log(`✅ Created ${badges.length} badges\n`);

  // 4. Create Posts
  console.log("📝 Creating posts...");
  const posts = await Promise.all(
    MOCK_POSTS.map(async (mockPost) => {
      const author = userMap.get(mockPost.author.id);
      if (!author) return null;

      return prisma.post.create({
        data: {
          type: mockPost.type as PostType,
          title: mockPost.title,
          content: mockPost.content,
          excerpt: mockPost.excerpt,
          authorId: author.id,
          likeCount: mockPost.likeCount,
          commentCount: mockPost.commentCount,
          viewCount: mockPost.viewCount,
          images: mockPost.images,
          createdAt: new Date(mockPost.createdAt),
          tags: {
            create: mockPost.tags.map((tag) => ({ tag }))
          }
        }
      });
    })
  );
  const validPosts = posts.filter(Boolean);
  console.log(`✅ Created ${validPosts.length} posts\n`);

  // Create post map
  const postMap = new Map(MOCK_POSTS.map((p, i) => [p.id, validPosts[i]]));

  // 5. Create Comments
  console.log("💬 Creating comments...");
  let commentCount = 0;
  for (const mockComment of MOCK_COMMENTS) {
    const post = postMap.get(mockComment.postId);
    const author = userMap.get(mockComment.author.id);

    if (!post || !author) continue;

    await prisma.comment.create({
      data: {
        postId: post.id,
        authorId: author.id,
        content: mockComment.content,
        likeCount: mockComment.likeCount,
        createdAt: new Date(mockComment.createdAt)
      }
    });
    commentCount++;
  }
  console.log(`✅ Created ${commentCount} comments\n`);

  // 6. Create sample KimchiDex entries for demo user
  console.log("📖 Creating sample KimchiDex entries...");
  const demoUser = users[0]; // First user
  const sampleKimchis = kimchiEntries.slice(0, 5);

  for (const kimchi of sampleKimchis) {
    await prisma.kimchiDexEntry.upsert({
      where: { userId_kimchiId: { userId: demoUser.id, kimchiId: kimchi.id } },
      update: {},
      create: {
        userId: demoUser.id,
        kimchiId: kimchi.id,
        status: KimchiDexStatus.tried,
        rating: Math.floor(Math.random() * 2) + 4,
        memo: "맛있게 먹었습니다!"
      }
    });
  }
  console.log(`✅ Created ${sampleKimchis.length} KimchiDex entries\n`);

  // 7. Create sample attendance for demo user
  console.log("📅 Creating sample attendance records...");
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    await prisma.attendance.upsert({
      where: { userId_date: { userId: demoUser.id, date: date } },
      update: {},
      create: {
        userId: demoUser.id,
        date: date,
        streak: 7 - i,
        xpEarned: 10 + (7 - i === 7 ? 10 : 0),
        bonus: 7 - i === 7 ? "7_day_streak" : null
      }
    });
  }
  console.log(`✅ Created 7 attendance records\n`);

  // 8. Award badges to demo user
  console.log("🎖️ Awarding badges to demo user...");
  const firstPostBadge = badges.find(b => b.slug === "first_post");
  const streakBadge = badges.find(b => b.slug === "7_day_streak");

  if (firstPostBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: demoUser.id, badgeId: firstPostBadge.id } },
      update: {},
      create: { userId: demoUser.id, badgeId: firstPostBadge.id }
    });
  }
  if (streakBadge) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: demoUser.id, badgeId: streakBadge.id } },
      update: {},
      create: { userId: demoUser.id, badgeId: streakBadge.id }
    });
  }
  console.log(`✅ Awarded badges to demo user\n`);

  // 9. Create sample challenges
  console.log("🎯 Creating sample challenges...");
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  await prisma.challenge.upsert({
    where: { id: "weekly-1" },
    update: {},
    create: {
      id: "weekly-1",
      title: "나만의 김치볶음밥 레시피 공유",
      description: "이번 주 챌린지! 여러분만의 특별한 김치볶음밥 레시피를 커뮤니티에 공유해주세요. 사진과 함께 올리면 보너스 XP!",
      emoji: "🍳",
      type: "recipe",
      xpReward: 100,
      startDate: weekStart,
      endDate: weekEnd,
      active: true,
    },
  });

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(lastWeekStart);
  lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

  await prisma.challenge.upsert({
    where: { id: "weekly-2" },
    update: {},
    create: {
      id: "weekly-2",
      title: "김치 발효 과정 사진 찍기",
      description: "김치가 발효되는 과정을 사진으로 기록해보세요! 3일간의 변화를 담아주세요.",
      emoji: "📸",
      type: "photo",
      xpReward: 75,
      startDate: lastWeekStart,
      endDate: lastWeekEnd,
      active: false,
    },
  });

  const twoWeeksAgoStart = new Date(lastWeekStart);
  twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 7);
  const twoWeeksAgoEnd = new Date(twoWeeksAgoStart);
  twoWeeksAgoEnd.setDate(twoWeeksAgoStart.getDate() + 6);

  await prisma.challenge.upsert({
    where: { id: "weekly-3" },
    update: {},
    create: {
      id: "weekly-3",
      title: "새로운 김치 3종 도감에 등록하기",
      description: "아직 시도해보지 않은 김치 3종류를 찾아서 도감에 등록해보세요!",
      emoji: "🗺️",
      type: "explore",
      xpReward: 50,
      startDate: twoWeeksAgoStart,
      endDate: twoWeeksAgoEnd,
      active: false,
    },
  });

  console.log("✅ Created 3 sample challenges\n");

  console.log("🎉 Database seed completed successfully!");
  console.log(`
Summary:
- Users: ${users.length}
- Kimchi types: ${kimchiEntries.length}
- Badges: ${badges.length}
- Posts: ${validPosts.length}
- Comments: ${commentCount}
- Challenges: 3
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
