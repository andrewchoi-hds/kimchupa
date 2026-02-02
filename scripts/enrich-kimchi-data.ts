/**
 * 김치 데이터 강화 스크립트
 * - Unsplash에서 김치 이미지 가져오기
 * - 상세 정보 추가 (역사, 제조법, 영양정보 등)
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// Unsplash 이미지 URLs (미리 수집된 김치 관련 이미지)
const KIMCHI_IMAGES: Record<string, string> = {
  baechu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  kkakdugi: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800",
  chonggak: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800",
  dongchimi: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
  nabak: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
  yeolmu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  oisobagi: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
  gat: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  pa: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  bossam: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  baek: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
  buchu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
};

// 기본 이미지 (특정 김치 이미지가 없을 때)
const DEFAULT_KIMCHI_IMAGE = "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800";

// 상세 김치 데이터
interface KimchiDetails {
  history: string;
  makingProcess: string;
  storageMethod: string;
  nutritionInfo: {
    calories: number;
    carbohydrates: number;
    protein: number;
    fat: number;
    fiber: number;
    sodium: number;
    vitaminC?: number;
    probiotics?: string;
  };
  variations?: string;
  tips?: string;
  descriptionEn?: string;
}

const DETAILED_KIMCHI_DATA: Record<string, KimchiDetails> = {
  // ===== 기본 김치 (1-12) =====
  baechu: {
    history: `배추김치는 한국 김치의 대표격으로, 조선시대 이후 고춧가루가 전래되면서 현재의 형태를 갖추게 되었습니다.

19세기 이전에는 주로 무를 소금에 절여 김치로 담갔고, 배추는 잎이 연약해 절이면 물러져서 겉절이 형태로만 즐겼습니다.

1950년 우장춘 박사가 '결구배추' 품종을 개발하면서 오늘날 우리가 아는 통배추김치가 대중화되었습니다. 2013년 김장 문화가 유네스코 인류무형문화유산으로 등재되었습니다.`,
    makingProcess: `**1단계: 배추 절이기**
- 물 10 : 소금 1.2 비율로 소금물 준비
- 배추를 4등분하여 8-12시간 절임
- 깨끗이 헹궈 물기 제거

**2단계: 양념 만들기**
- 무채 + 고춧가루 50% + 젓갈 30% + 마늘 10%
- 찹쌀풀로 농도 조절
- 파, 생강, 설탕 추가

**3단계: 버무리기**
- 배추 잎 사이사이에 양념소 골고루 넣기
- 겉잎으로 감싸 모양 정돈

**4단계: 숙성**
- 실온 1-2일 → 냉장 보관
- 김치냉장고 -1~0°C 권장`,
    storageMethod: `• **김치냉장고**: -1~0°C에서 최대 3개월 보관
• **일반냉장고**: 4°C에서 2-3주
• **밀폐용기** 필수 사용
• 김칫국물에 완전히 잠기도록 보관
• 공기 접촉 최소화`,
    nutritionInfo: {
      calories: 15,
      carbohydrates: 2.4,
      protein: 1.1,
      fat: 0.3,
      fiber: 1.6,
      sodium: 232,
      vitaminC: 18,
      probiotics: "10^8 CFU/g"
    },
    variations: `• **서울식**: 젓갈 적게, 담백한 맛
• **전라도식**: 젓갈 풍부, 감칠맛 강함
• **경상도식**: 멸치젓 위주, 국물 적음
• **강원도식**: 생태/명태 사용
• **충청도식**: 균형잡힌 중간 맛`,
    tips: `• 11월 중순 김장철 배추가 가장 맛있음
• 절이는 시간은 최소 8시간 이상
• 양념은 과하게 넣지 않는 것이 포인트`,
    descriptionEn: "The most iconic Korean kimchi. Napa cabbage is salted and fermented with red pepper powder, fish sauce, garlic, and ginger. UNESCO Intangible Cultural Heritage since 2013."
  },
  kkakdugi: {
    history: `깍두기는 조선시대 후기에 등장한 것으로 추정됩니다. '깍뚝깍뚝' 썰었다 하여 깍두기라는 이름이 붙었습니다.

왕실에서 시작되어 민간으로 퍼졌다는 설과, 서민들이 무를 효율적으로 활용하기 위해 만들었다는 설이 있습니다.

설렁탕, 곰탕 등 국물 요리와 함께 먹는 문화가 정착되면서 대중화되었습니다.`,
    makingProcess: `**1단계: 무 손질**
- 무를 2-3cm 크기로 깍둑썰기
- 소금과 설탕으로 30분-1시간 절임

**2단계: 양념 준비**
- 고춧가루 + 젓갈 + 마늘 + 생강 + 파
- 찹쌀풀 추가 (선택)

**3단계: 버무리기**
- 절인 무의 물기를 적당히 제거
- 양념과 골고루 버무림

**4단계: 숙성**
- 실온 1일 → 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2-3주
• 아삭한 식감을 위해 빨리 소비 권장
• 발효가 진행되면 물러지므로 주의`,
    nutritionInfo: {
      calories: 18,
      carbohydrates: 3.8,
      protein: 0.7,
      fat: 0.1,
      fiber: 1.2,
      sodium: 280,
      vitaminC: 14
    },
    tips: `• 가을 무가 가장 달고 아삭함
• 너무 오래 절이면 물러짐
• 설탕을 약간 넣으면 아삭함 유지`,
    descriptionEn: "Cubed radish kimchi with a wonderfully crunchy texture. Perfect accompaniment to Korean soups like seolleongtang and gomtang."
  },
  dongchimi: {
    history: `동치미는 '동(冬)'과 '치미(沈)', 즉 '겨울에 담그는 김치'라는 뜻입니다.

삼국시대부터 존재했던 것으로 추정되며, 고춧가루가 들어오기 전의 원형 김치에 가깝습니다.

조선시대 문헌에 '동침이'로 기록되어 있으며, 특히 냉면 육수로 사용되면서 큰 인기를 얻었습니다.`,
    makingProcess: `**1단계: 재료 준비**
- 무를 깨끗이 씻어 통째로 또는 큼직하게 자름
- 배, 대파, 생강, 마늘 준비

**2단계: 절이기**
- 소금물에 무를 하루 정도 절임

**3단계: 담그기**
- 항아리에 무와 재료들을 넣고 소금물 부음
- 서늘한 곳에서 2-3주 발효

**4단계: 숙성**
- 국물이 시원하고 탄산이 느껴지면 완성`,
    storageMethod: `• 냉장 보관 시 2-3개월
• 무가 국물에 완전히 잠기도록 유지
• 국물이 탁해지면 맛이 떨어짐`,
    nutritionInfo: {
      calories: 8,
      carbohydrates: 1.5,
      protein: 0.4,
      fat: 0.1,
      fiber: 0.5,
      sodium: 150,
      vitaminC: 10
    },
    tips: `• 배를 넣으면 국물이 더 시원해짐
• 발효 시 뚜껑을 완전히 밀봉하지 않기
• 냉면 육수로 사용 시 최고의 맛`,
    descriptionEn: "A refreshing winter water kimchi. The tangy, effervescent broth is traditionally used as a base for cold noodle soup (naengmyeon)."
  },
  nabak: {
    history: `나박김치는 무와 배추를 납작하게 썰어 만든 물김치입니다.

'나박나박' 썬다고 해서 나박김치라는 이름이 붙었습니다.

여름철 시원하게 먹는 김치로, 국물이 맑고 깔끔한 것이 특징입니다.`,
    makingProcess: `**1단계: 재료 손질**
- 무와 배추를 납작하게 썰기
- 미나리, 쪽파 준비

**2단계: 절이기**
- 소금으로 살짝 절임 (30분)

**3단계: 국물 만들기**
- 물 + 소금 + 고춧가루 (붉은 물만)
- 마늘, 생강 추가

**4단계: 담그기**
- 재료와 국물을 합쳐 1-2일 숙성`,
    storageMethod: `• 냉장 보관 시 1-2주
• 빨리 먹는 것이 좋음
• 국물 위주로 즐김`,
    nutritionInfo: {
      calories: 10,
      carbohydrates: 2.0,
      protein: 0.5,
      fat: 0.1,
      fiber: 0.8,
      sodium: 180,
      vitaminC: 12
    },
    tips: `• 고춧가루는 체에 걸러 맑은 물만 사용
• 여름철 식욕 없을 때 좋음`,
    descriptionEn: "Light water kimchi with thinly sliced radish and cabbage. Perfect for summer with its refreshing, clean taste."
  },
  yeolmu: {
    history: `열무김치는 어린 무청(열무)으로 담그는 여름철 별미 김치입니다.

'열무'는 '어린 무'라는 뜻으로, 여름에 수확하는 어린 무의 줄기와 잎을 사용합니다.

비빔밥, 비빔국수와 함께 먹는 것이 정석입니다.`,
    makingProcess: `**1단계: 열무 손질**
- 시든 잎 제거, 깨끗이 세척
- 먹기 좋은 크기로 자름

**2단계: 절이기**
- 소금으로 살짝 절임 (20-30분)
- 너무 오래 절이면 물러짐

**3단계: 양념**
- 고춧가루 + 멸치액젓 + 마늘
- 찹쌀풀로 걸쭉하게

**4단계: 버무리기**
- 살살 버무려 손상 최소화`,
    storageMethod: `• 냉장 보관 시 1-2주
• 금방 물러지므로 빨리 소비
• 비빔용으로 최적`,
    nutritionInfo: {
      calories: 12,
      carbohydrates: 1.8,
      protein: 0.8,
      fat: 0.2,
      fiber: 1.0,
      sodium: 200,
      vitaminC: 15
    },
    tips: `• 어린 열무일수록 부드럽고 맛있음
• 절이는 시간 짧게
• 비빔국수와 환상 궁합`,
    descriptionEn: "Summer kimchi made with young radish greens. Best enjoyed with bibimbap or cold noodles."
  },
  oisobagi: {
    history: `오이소박이는 오이에 십자 칼집을 내어 소를 채워 넣은 김치입니다.

'소박이'는 '소를 박다'라는 뜻으로, 속에 양념을 넣는다는 의미입니다.

여름철 대표 김치로, 아삭하고 시원한 맛이 특징입니다.`,
    makingProcess: `**1단계: 오이 손질**
- 굵은 소금으로 문질러 씻기
- 양 끝을 자르고 십자 칼집

**2단계: 절이기**
- 소금물에 30분-1시간 절임

**3단계: 소 만들기**
- 부추 + 고춧가루 + 젓갈 + 마늘
- 잘게 다져서 버무림

**4단계: 채우기**
- 칼집 사이에 소를 꽉 채움
- 실온 반나절 → 냉장`,
    storageMethod: `• 냉장 보관 시 1주일
• 오래 두면 물러지고 신맛 강해짐
• 담근 후 빨리 먹는 것이 좋음`,
    nutritionInfo: {
      calories: 14,
      carbohydrates: 2.2,
      protein: 0.9,
      fat: 0.2,
      fiber: 0.8,
      sodium: 220,
      vitaminC: 8
    },
    tips: `• 노각(늙은 오이)보다 취청이 좋음
• 칼집을 너무 깊이 내면 부서짐
• 부추 대신 쪽파 사용 가능`,
    descriptionEn: "Stuffed cucumber kimchi. Cucumbers are scored and filled with seasoned vegetables, creating a crunchy summer treat."
  },
  gat: {
    history: `갓김치는 전라도 지역의 대표적인 향토 김치입니다.

갓의 알싸하고 톡 쏘는 맛이 특징이며, 전라도에서는 배추김치만큼 중요하게 여깁니다.

특히 여수, 순천, 해남 지역의 갓김치가 유명합니다.`,
    makingProcess: `**1단계: 갓 손질**
- 시든 잎 제거, 깨끗이 세척
- 적당한 크기로 자름

**2단계: 절이기**
- 소금에 2-3시간 절임
- 갓은 빨리 절여짐

**3단계: 양념**
- 고춧가루 + 젓갈 + 마늘 + 생강
- 찹쌀풀 추가

**4단계: 버무리기**
- 갓이 상하지 않게 살살 버무림`,
    storageMethod: `• 냉장 보관 시 2-3주
• 익을수록 톡 쏘는 맛 강해짐
• 전라도식 밥상에 필수`,
    nutritionInfo: {
      calories: 16,
      carbohydrates: 2.5,
      protein: 1.0,
      fat: 0.3,
      fiber: 1.5,
      sodium: 250,
      vitaminC: 20
    },
    tips: `• 어린 갓이 더 부드럽고 맛있음
• 너무 익히면 쓴맛이 남
• 고기와 함께 먹으면 느끼함 제거`,
    descriptionEn: "Mustard leaf kimchi from Jeolla province. Known for its pungent, spicy kick that pairs perfectly with grilled meat."
  },
  baek: {
    history: `백김치는 고춧가루를 넣지 않고 담근 하얀 김치입니다.

조선시대 양반가에서 즐겨 먹던 고급 김치로, 담백하고 시원한 맛이 특징입니다.

어린이나 매운 것을 못 먹는 사람, 환자식으로도 좋습니다.`,
    makingProcess: `**1단계: 배추 절이기**
- 소금물에 8-10시간 절임
- 깨끗이 헹궈 물기 제거

**2단계: 속 재료 준비**
- 무채 + 배 + 밤 + 대추 + 잣
- 미나리, 쪽파 추가

**3단계: 양념**
- 마늘 + 생강 (고춧가루 없음)
- 소금으로만 간

**4단계: 담그기**
- 배추 사이에 속 재료 넣기
- 국물 부어 담금`,
    storageMethod: `• 냉장 보관 시 2-3주
• 맑은 국물 유지가 중요
• 공기 접촉 최소화`,
    nutritionInfo: {
      calories: 12,
      carbohydrates: 2.0,
      protein: 0.8,
      fat: 0.1,
      fiber: 1.0,
      sodium: 200,
      vitaminC: 15
    },
    tips: `• 배를 넣으면 단맛과 시원함 증가
• 밤, 대추로 고급스러운 맛
• 어린이 입문용으로 좋음`,
    descriptionEn: "White kimchi without red pepper. A mild, refreshing variety perfect for children or those who prefer non-spicy food."
  },

  // 총각김치
  chonggak: {
    history: `총각김치는 '총각무'라 불리는 알타리무로 담그는 김치입니다. 무의 꼬리가 총각의 댕기머리를 닮았다 하여 이름이 붙었습니다.

조선시대부터 전해 내려온 전통 김치로, 특히 가을철에 담가 겨울 내내 즐기는 저장 발효 식품입니다.

알싸하고 아삭한 맛이 특징이며, 고기 요리와 궁합이 좋습니다.`,
    makingProcess: `**1단계: 총각무 손질**
- 깨끗이 씻어 흙 제거
- 무청 부분 다듬기

**2단계: 절이기**
- 굵은 소금으로 3-4시간 절임
- 중간에 한 번 뒤집어주기

**3단계: 양념 만들기**
- 고춧가루 + 젓갈 + 마늘 + 생강 + 파
- 찹쌀풀로 양념 농도 맞추기

**4단계: 버무리기**
- 양념을 무와 무청에 골고루 버무림
- 실온 1일 → 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2-3주
• 아삭한 식감 유지가 중요
• 익을수록 신맛 증가`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 4.0,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.5,
      sodium: 290,
      vitaminC: 16
    },
    tips: `• 총각무는 가을철이 가장 맛있음
• 무청도 함께 절여 버무림
• 고기와 함께 먹으면 느끼함 제거`,
    descriptionEn: "Ponytail radish kimchi made with small radishes including their greens. The name comes from the radish's tail resembling a bachelor's topknot hairstyle."
  },

  // 파김치
  pa: {
    history: `파김치는 쪽파나 대파를 통째로 양념에 버무린 김치입니다.

예로부터 고기 요리와 함께 먹는 '고기 친구' 김치로 사랑받아 왔습니다. 파의 향긋한 향과 매콤한 양념이 기름진 고기의 느끼함을 잡아줍니다.

특히 삼겹살, 불고기와 함께 먹으면 맛이 배가됩니다.`,
    makingProcess: `**1단계: 파 손질**
- 쪽파 또는 실파를 깨끗이 씻기
- 뿌리 부분 제거

**2단계: 절이기**
- 소금으로 살짝 절임 (20-30분)
- 너무 오래 절이면 물러짐

**3단계: 양념**
- 고춧가루 + 멸치액젓 + 마늘 + 참기름
- 찹쌀풀로 양념이 잘 붙도록

**4단계: 버무리기**
- 파가 부러지지 않게 살살 버무림
- 바로 먹거나 냉장 보관`,
    storageMethod: `• 냉장 보관 시 1-2주
• 오래 두면 물러지므로 빨리 소비
• 고기 구울 때 함께 먹기 좋음`,
    nutritionInfo: {
      calories: 22,
      carbohydrates: 3.5,
      protein: 1.2,
      fat: 0.4,
      fiber: 1.8,
      sodium: 240,
      vitaminC: 12
    },
    tips: `• 봄철 쪽파가 가장 연하고 맛있음
• 절이는 시간은 짧게
• 삼겹살과 환상의 궁합`,
    descriptionEn: "Green onion kimchi made with whole scallions. A perfect accompaniment to grilled meats, especially Korean BBQ."
  },

  // 보쌈김치
  bossam: {
    history: `보쌈김치는 조선시대 왕실과 양반가에서 즐기던 고급 김치입니다.

'보쌈'은 '싸다'라는 뜻으로, 배추잎에 여러 재료를 싸서 담근다 하여 붙은 이름입니다. 굴, 낙지, 전복 등 해산물과 밤, 대추, 배 등 다양한 재료가 들어갑니다.

명절이나 특별한 손님상에 올리는 귀한 음식으로 여겨졌습니다.`,
    makingProcess: `**1단계: 배추 준비**
- 통배추를 절여 준비
- 잎을 한 장씩 펼칠 수 있게

**2단계: 소 재료 준비**
- 무채, 굴, 낙지, 새우 손질
- 밤, 대추, 배, 잣 준비

**3단계: 양념 만들기**
- 고춧가루 + 젓갈 + 마늘 (약하게)
- 생강, 설탕 추가

**4단계: 보쌈 형태로 담기**
- 배추잎에 소를 얹어 보자기처럼 싸기
- 차곡차곡 담아 숙성`,
    storageMethod: `• 냉장 보관 시 1-2주
• 해산물이 들어가 빨리 소비 권장
• 특별한 날 소량 담그기`,
    nutritionInfo: {
      calories: 35,
      carbohydrates: 4.5,
      protein: 3.2,
      fat: 0.8,
      fiber: 1.2,
      sodium: 200,
      vitaminC: 15
    },
    tips: `• 신선한 해산물 사용이 핵심
• 소금간을 약하게 해 담백하게
• 명절 선물용으로도 인기`,
    descriptionEn: "Royal-style wrapped kimchi filled with premium ingredients like oysters, octopus, chestnuts, and jujubes. A luxurious dish for special occasions."
  },

  // 부추김치
  buchu: {
    history: `부추김치는 부추의 향긋한 향과 부드러운 식감이 특징인 김치입니다.

부추는 예로부터 '정력에 좋은 채소'로 알려져 스태미나 식품으로 사랑받았습니다. 비빔밥, 국수 등에 곁들여 먹으면 맛과 영양을 함께 즐길 수 있습니다.

특히 봄철 부추가 가장 연하고 향이 좋습니다.`,
    makingProcess: `**1단계: 부추 손질**
- 깨끗이 씻어 물기 제거
- 먹기 좋은 길이로 자름

**2단계: 양념 준비**
- 고춧가루 + 멸치액젓 + 마늘
- 참기름 + 깨 추가

**3단계: 버무리기**
- 부추가 상하지 않게 살살 버무림
- 바로 먹는 겉절이 스타일

**4단계: 보관**
- 냉장 보관 1주일 이내 소비 권장`,
    storageMethod: `• 냉장 보관 시 1주일
• 오래 두면 물이 생기고 물러짐
• 담근 직후가 가장 맛있음`,
    nutritionInfo: {
      calories: 18,
      carbohydrates: 2.8,
      protein: 1.5,
      fat: 0.3,
      fiber: 1.3,
      sodium: 210,
      vitaminC: 10
    },
    tips: `• 봄 부추가 가장 연함
• 멸치액젓으로 감칠맛 추가
• 비빔밥에 필수 토핑`,
    descriptionEn: "Chive kimchi with a delicate, fragrant flavor. Known as a stamina-boosting vegetable in Korean cuisine."
  },

  // ===== 추가 김치 (13-55) =====

  // 무말랭이김치
  mumallaengi: {
    history: `무말랭이김치는 무를 채 썰어 말린 후 양념에 버무린 김치입니다.

겨울철 저장 식품으로 발달했으며, 무를 말리면서 수분이 빠지고 식감이 쫄깃해집니다. 고소한 참기름과 간장 양념이 특징입니다.

도시락 반찬이나 밑반찬으로 오래 두고 먹을 수 있어 인기가 높습니다.`,
    makingProcess: `**1단계: 무말랭이 준비**
- 시판 무말랭이를 물에 불림 (2-3시간)
- 꼭 짜서 물기 제거

**2단계: 양념 만들기**
- 간장 + 고춧가루 + 마늘 + 생강
- 참기름 + 깨 + 설탕

**3단계: 버무리기**
- 양념과 무말랭이를 골고루 섞기
- 하루 정도 재워두면 맛이 배임`,
    storageMethod: `• 냉장 보관 시 2-3주
• 밀폐용기에 보관
• 시간이 지나도 식감 유지`,
    nutritionInfo: {
      calories: 45,
      carbohydrates: 8.5,
      protein: 1.2,
      fat: 1.0,
      fiber: 2.5,
      sodium: 350
    },
    tips: `• 무말랭이는 충분히 불려야 함
• 참기름을 넉넉히 넣으면 고소함 UP
• 도시락 반찬으로 최고`,
    descriptionEn: "Dried radish kimchi with a chewy texture. A popular side dish that keeps well and is perfect for lunchboxes."
  },

  // 고들빼기김치
  godeulppaegi: {
    history: `고들빼기김치는 전라도 지역의 대표적인 향토 김치입니다.

고들빼기의 쌉싸름한 맛이 특징이며, 이 쓴맛을 빼기 위해 소금물에 오래 절이는 과정이 필수입니다. 전라도에서는 '고들빼기 없으면 밥상이 아니다'라는 말이 있을 정도입니다.

간 건강에 좋다고 알려져 보양식으로도 즐깁니다.`,
    makingProcess: `**1단계: 고들빼기 손질**
- 깨끗이 씻어 다듬기
- 소금물에 3-4일 절여 쓴맛 제거

**2단계: 양념 준비**
- 고춧가루 + 젓갈 + 마늘
- 찹쌀풀 + 파

**3단계: 버무리기**
- 절인 고들빼기와 양념 버무림
- 깊은 맛을 위해 충분히 숙성`,
    storageMethod: `• 냉장 보관 시 3-4주
• 충분히 익혀야 쓴맛이 줄어듦
• 오래 두면 깊은 맛 발현`,
    nutritionInfo: {
      calories: 25,
      carbohydrates: 4.2,
      protein: 1.5,
      fat: 0.3,
      fiber: 2.0,
      sodium: 280
    },
    tips: `• 쓴맛 제거를 위해 충분히 절이기
• 전라도식 밥상의 필수품
• 보리밥과 환상 궁합`,
    descriptionEn: "Korean lettuce kimchi from Jeolla province with a distinctive bitter-sweet taste. Known for its liver health benefits."
  },

  // 깻잎김치
  kkaennip: {
    history: `깻잎김치는 향긋한 깻잎을 간장이나 고추장 양념에 절인 김치입니다.

들깨의 잎인 깻잎은 특유의 향이 강해 고기를 쌈싸 먹거나 밥에 얹어 먹습니다. 한국에서만 즐기는 독특한 채소로, 외국인들에게는 새로운 맛으로 다가옵니다.

철분과 칼슘이 풍부해 빈혈 예방에 좋습니다.`,
    makingProcess: `**1단계: 깻잎 손질**
- 깨끗이 씻어 물기 제거
- 한 장씩 펼쳐 준비

**2단계: 양념장 만들기**
- 간장 + 고춧가루 + 마늘 + 파
- 참기름 + 깨 + 설탕

**3단계: 양념 바르기**
- 깻잎 사이사이에 양념장 바르기
- 차곡차곡 쌓아 밀폐 용기에 보관`,
    storageMethod: `• 냉장 보관 시 2-3주
• 양념장에 잠기도록 유지
• 시간이 지나면 맛이 더 깊어짐`,
    nutritionInfo: {
      calories: 30,
      carbohydrates: 4.0,
      protein: 2.0,
      fat: 0.8,
      fiber: 1.5,
      sodium: 320
    },
    tips: `• 깻잎은 상하기 쉬우니 신선할 때 담그기
• 간장 양념이 클래식
• 쌈밥의 필수 반찬`,
    descriptionEn: "Perilla leaf kimchi with a distinctive aromatic flavor. Rich in iron and calcium, perfect for wrapping rice or meat."
  },

  // 미나리김치
  minari: {
    history: `미나리김치는 미나리의 아삭한 식감과 독특한 향이 살아있는 봄철 별미 김치입니다.

미나리는 해독 작용이 뛰어나 예로부터 '해장 채소'로 불렸습니다. 삼겹살과 함께 먹으면 느끼함을 잡아주고, 매운탕에 넣으면 비린내를 없애줍니다.

영화 '미나리'로 세계적으로 알려진 한국의 전통 채소입니다.`,
    makingProcess: `**1단계: 미나리 손질**
- 깨끗이 씻어 뿌리 제거
- 먹기 좋은 길이로 자름

**2단계: 양념 준비**
- 고춧가루 + 멸치액젓 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 미나리와 양념 살살 버무림
- 바로 먹는 겉절이 스타일`,
    storageMethod: `• 냉장 보관 시 3-5일
• 물러지기 쉬우니 빨리 소비
• 담근 직후가 가장 맛있음`,
    nutritionInfo: {
      calories: 15,
      carbohydrates: 2.5,
      protein: 1.0,
      fat: 0.2,
      fiber: 1.8,
      sodium: 180
    },
    tips: `• 봄 미나리가 가장 연하고 향긋함
• 삼겹살과 환상 궁합
• 해독 효과로 해장에 좋음`,
    descriptionEn: "Water parsley kimchi with a refreshing, detoxifying quality. A spring specialty known for its cleansing properties."
  },

  // 석박지
  seokbakji: {
    history: `석박지는 무와 배추를 큼직하게 썰어 시원한 국물과 함께 담근 김치입니다.

이름은 '섞어서 박다(담그다)'에서 유래했다는 설과, '석석(昔昔) 박다'에서 왔다는 설이 있습니다. 칼국수나 수제비 같은 면 요리와 함께 먹으면 시원하고 담백한 맛을 즐길 수 있습니다.`,
    makingProcess: `**1단계: 재료 손질**
- 무와 배추를 3-4cm 크기로 자름
- 미나리, 쪽파 준비

**2단계: 절이기**
- 소금에 살짝 절임 (1-2시간)

**3단계: 양념**
- 고춧가루 + 젓갈 + 마늘
- 국물을 넉넉히

**4단계: 담그기**
- 재료와 양념, 국물 합쳐 담금`,
    storageMethod: `• 냉장 보관 시 2-3주
• 국물이 충분해야 맛있음
• 면 요리와 함께 먹기 좋음`,
    nutritionInfo: {
      calories: 12,
      carbohydrates: 2.2,
      protein: 0.6,
      fat: 0.1,
      fiber: 1.0,
      sodium: 190
    },
    tips: `• 무와 배추 비율 조절이 핵심
• 국물을 넉넉히 담그기
• 칼국수, 수제비와 최고의 궁합`,
    descriptionEn: "Mixed vegetable water kimchi with chunky radish and cabbage. Best served with Korean noodle soups."
  },

  // 무생채
  museongchae: {
    history: `무생채는 무를 곱게 채 썰어 고춧가루 양념에 바로 버무린 즉석 김치입니다.

발효 과정 없이 바로 만들어 먹는 겉절이 스타일로, 아삭한 식감과 새콤달콤한 맛이 특징입니다. 불고기, 갈비 등 고기 요리의 필수 반찬입니다.`,
    makingProcess: `**1단계: 무 손질**
- 무를 곱게 채 썰기
- 소금으로 살짝 절임 (10분)

**2단계: 양념**
- 고춧가루 + 식초 + 설탕 + 마늘
- 멸치액젓으로 감칠맛 추가

**3단계: 버무리기**
- 절인 무와 양념 버무림
- 바로 먹거나 냉장 보관`,
    storageMethod: `• 냉장 보관 시 3-5일
• 시간이 지나면 물이 생김
• 담근 직후가 가장 아삭`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 4.0,
      protein: 0.5,
      fat: 0.1,
      fiber: 1.2,
      sodium: 200
    },
    tips: `• 무는 곱게 채 썰어야 맛있음
• 식초와 설탕 비율 조절이 핵심
• 고기 요리의 필수 반찬`,
    descriptionEn: "Fresh shredded radish salad with a sweet and tangy dressing. An essential side dish for Korean BBQ."
  },

  // 고구마줄기김치
  goguma: {
    history: `고구마줄기김치는 고구마 줄기(순)를 양념에 버무린 여름철 별미 김치입니다.

고구마줄기는 질긴 껍질을 벗겨 사용하며, 쫄깃한 식감과 구수한 맛이 특징입니다. 시골에서 여름철에 즐겨 담가 먹던 향토 음식입니다.`,
    makingProcess: `**1단계: 고구마줄기 손질**
- 질긴 겉껍질 벗기기
- 먹기 좋은 길이로 자름

**2단계: 데치기**
- 끓는 물에 살짝 데침
- 찬물에 헹궈 식히기

**3단계: 양념**
- 된장 + 고춧가루 + 마늘 + 들깨
- 참기름 추가

**4단계: 버무리기**
- 양념과 골고루 버무림`,
    storageMethod: `• 냉장 보관 시 1주일
• 데친 후 빨리 조리
• 들깨가루 넣으면 고소함 UP`,
    nutritionInfo: {
      calories: 25,
      carbohydrates: 4.5,
      protein: 1.0,
      fat: 0.5,
      fiber: 2.0,
      sodium: 220
    },
    tips: `• 껍질을 깨끗이 벗겨야 부드러움
• 된장과 들깨의 조합이 핵심
• 보리밥과 찰떡궁합`,
    descriptionEn: "Sweet potato stem kimchi with a chewy texture. A summer specialty from rural Korea."
  },

  // 콩나물김치
  kongnamul: {
    history: `콩나물김치는 아삭한 콩나물에 양념을 버무린 즉석 김치입니다.

콩나물은 비타민 C와 아스파라긴산이 풍부해 해장에 좋다고 알려져 있습니다. 비빔밥의 필수 재료이자, 해장국의 단짝입니다.`,
    makingProcess: `**1단계: 콩나물 손질**
- 깨끗이 씻어 꼬리 다듬기
- 끓는 물에 살짝 데침

**2단계: 양념**
- 고춧가루 + 파 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 식힌 콩나물과 양념 버무림
- 바로 먹거나 냉장 보관`,
    storageMethod: `• 냉장 보관 시 3-5일
• 물이 생기면 맛이 떨어짐
• 담근 직후가 가장 아삭`,
    nutritionInfo: {
      calories: 22,
      carbohydrates: 3.0,
      protein: 2.5,
      fat: 0.5,
      fiber: 1.5,
      sodium: 180
    },
    tips: `• 콩나물은 뚜껑 열지 않고 데치기
• 아삭한 식감 유지가 핵심
• 비빔밥 필수 재료`,
    descriptionEn: "Bean sprout kimchi with a refreshing crunch. Rich in vitamin C and known for its hangover-curing properties."
  },

  // 양배추김치
  yangbaechu: {
    history: `양배추김치는 양배추로 담근 현대적인 김치입니다.

배추 대신 양배추를 사용해 부드럽고 달콤한 맛이 특징입니다. 위장 건강에 좋은 비타민 U가 풍부하고, 양식과도 잘 어울립니다.`,
    makingProcess: `**1단계: 양배추 손질**
- 양배추를 먹기 좋게 자름
- 소금으로 살짝 절임

**2단계: 양념**
- 고춧가루 + 멸치액젓 + 마늘
- 설탕으로 단맛 조절

**3단계: 버무리기**
- 절인 양배추와 양념 버무림
- 하루 정도 숙성`,
    storageMethod: `• 냉장 보관 시 2주
• 배추김치보다 빨리 익음
• 달콤한 맛이 특징`,
    nutritionInfo: {
      calories: 18,
      carbohydrates: 3.5,
      protein: 0.8,
      fat: 0.2,
      fiber: 1.5,
      sodium: 200
    },
    tips: `• 배추보다 부드러운 식감
• 단맛이 강해 아이들도 좋아함
• 돈까스, 양식과 잘 어울림`,
    descriptionEn: "Cabbage kimchi with a sweeter, milder taste than traditional napa cabbage kimchi. Perfect for those who prefer a gentler flavor."
  },

  // 풋배추김치
  putbaechu: {
    history: `풋배추김치는 결구되기 전의 어린 배추로 담근 봄철 별미 김치입니다.

봄에 나오는 풋배추는 연하고 달콤해 겉절이 스타일로 담가 먹습니다. 봄날의 신선함을 담은 계절 김치입니다.`,
    makingProcess: `**1단계: 풋배추 손질**
- 어린 배추를 통째로 또는 반으로 자름
- 소금으로 살짝 절임

**2단계: 양념**
- 고춧가루 + 멸치액젓 + 마늘
- 파 + 참기름

**3단계: 버무리기**
- 절인 풋배추와 양념 버무림
- 바로 먹거나 1-2일 숙성`,
    storageMethod: `• 냉장 보관 시 1주일
• 빨리 물러지므로 신선할 때 소비
• 봄철 한정 별미`,
    nutritionInfo: {
      calories: 14,
      carbohydrates: 2.5,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.2,
      sodium: 190
    },
    tips: `• 봄 풋배추가 가장 연하고 달콤
• 겉절이로 바로 먹는 것이 좋음
• 삼겹살과 함께`,
    descriptionEn: "Young cabbage kimchi made with tender spring cabbages. A seasonal specialty with a fresh, sweet taste."
  },

  // 알타리김치
  altari: {
    history: `알타리김치는 작고 어린 알타리무로 담근 김치입니다.

총각김치와 비슷하지만 더 작은 무를 사용합니다. 아삭하고 알싸한 맛이 특징이며, 삼겹살이나 보쌈과 함께 먹으면 좋습니다.`,
    makingProcess: `**1단계: 알타리무 손질**
- 깨끗이 씻어 다듬기
- 무청도 함께 준비

**2단계: 절이기**
- 굵은 소금으로 2-3시간 절임

**3단계: 양념**
- 고춧가루 + 젓갈 + 마늘
- 찹쌀풀 추가

**4단계: 버무리기**
- 양념과 골고루 버무림
- 실온 숙성 후 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2-3주
• 아삭한 식감이 포인트
• 고기와 함께 먹기 좋음`,
    nutritionInfo: {
      calories: 18,
      carbohydrates: 3.5,
      protein: 0.8,
      fat: 0.2,
      fiber: 1.3,
      sodium: 260
    },
    tips: `• 작은 무일수록 아삭함
• 무청도 함께 버무림
• 보쌈 필수 반찬`,
    descriptionEn: "Baby radish kimchi with a crisp, pungent taste. A must-have accompaniment for bossam (steamed pork belly)."
  },

  // 술김치
  sulkimchi: {
    history: `술김치는 막걸리를 넣어 담근 충청도 지역의 전통 김치입니다.

막걸리의 효모가 발효를 촉진하고, 달큰하면서도 깊은 맛을 만들어냅니다. 충청도에서는 '술지'라고도 부릅니다.`,
    makingProcess: `**1단계: 배추 절이기**
- 배추를 소금물에 절임
- 깨끗이 헹궈 물기 제거

**2단계: 막걸리 양념**
- 막걸리 + 고춧가루 + 마늘
- 설탕으로 단맛 조절

**3단계: 버무리기**
- 배추와 양념 버무림
- 충분한 숙성 시간 필요`,
    storageMethod: `• 냉장 보관 시 2-3주
• 막걸리로 인해 발효가 빠름
• 익을수록 깊은 맛`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 3.8,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.3,
      sodium: 210
    },
    tips: `• 막걸리는 생막걸리 사용
• 달큰한 맛이 특징
• 충청도 전통 김치`,
    descriptionEn: "Rice wine kimchi from Chungcheong province. Makgeolli adds a sweet, deep flavor and accelerates fermentation."
  },

  // 장김치
  jangkimchi: {
    history: `장김치는 간장 양념으로 담근 담백하고 깔끔한 김치입니다.

고춧가루를 거의 사용하지 않아 색이 연하고, 양반가의 품격 있는 밥상에 올랐습니다. 환자식이나 어린이 식단에도 적합합니다.`,
    makingProcess: `**1단계: 배추 절이기**
- 소금물에 배추 절임
- 깨끗이 헹궈 물기 제거

**2단계: 간장 양념**
- 간장 + 마늘 + 생강 + 파
- 고춧가루 없이 또는 소량만

**3단계: 버무리기**
- 배추와 양념 버무림
- 국물과 함께 담금`,
    storageMethod: `• 냉장 보관 시 2-3주
• 맑은 국물 유지가 중요
• 담백한 맛이 특징`,
    nutritionInfo: {
      calories: 14,
      carbohydrates: 2.5,
      protein: 0.8,
      fat: 0.1,
      fiber: 1.0,
      sodium: 280
    },
    tips: `• 간장 품질이 맛을 좌우
• 순한 맛으로 누구나 즐김
• 죽, 미음과 잘 어울림`,
    descriptionEn: "Soy sauce kimchi with a clean, mild taste. Non-spicy version perfect for children or those with sensitive stomachs."
  },

  // 숙채김치
  sukchae: {
    history: `숙채김치는 데친 채소에 양념을 버무린 부드러운 김치입니다.

시금치, 콩나물 등 여러 나물을 데쳐서 양념에 버무립니다. 비빔밥의 필수 재료이자, 건강한 한식 밥상의 기본입니다.`,
    makingProcess: `**1단계: 채소 데치기**
- 시금치, 콩나물 등을 데침
- 찬물에 헹궈 물기 꼭 짜기

**2단계: 양념**
- 고춧가루 + 참기름 + 깨
- 간장으로 간 맞추기

**3단계: 버무리기**
- 데친 채소와 양념 버무림
- 바로 먹거나 냉장 보관`,
    storageMethod: `• 냉장 보관 시 3-5일
• 물기를 꼭 짜야 오래 보관
• 비빔밥 재료로 최고`,
    nutritionInfo: {
      calories: 28,
      carbohydrates: 3.2,
      protein: 2.0,
      fat: 1.2,
      fiber: 1.8,
      sodium: 180
    },
    tips: `• 채소별로 데치는 시간 다름
• 물기 제거가 핵심
• 비빔밥 필수 재료`,
    descriptionEn: "Blanched vegetable kimchi with a soft texture. Essential ingredients for bibimbap."
  },

  // 우엉김치
  ueong: {
    history: `우엉김치는 우엉의 향긋하고 쫄깃한 식감이 특징인 김치입니다.

우엉은 식이섬유가 풍부하고 혈당 조절에 좋다고 알려져 있습니다. 간장 양념에 조려서 밑반찬이나 김밥 속으로 활용합니다.`,
    makingProcess: `**1단계: 우엉 손질**
- 껍질 벗기고 채 썰기
- 식초물에 담가 갈변 방지

**2단계: 양념**
- 간장 + 설탕 + 물엿
- 고춧가루 + 참기름

**3단계: 조리기**
- 양념과 함께 조림
- 국물이 거의 없어질 때까지`,
    storageMethod: `• 냉장 보관 시 2-3주
• 밀폐용기에 보관
• 김밥 속 재료로 최고`,
    nutritionInfo: {
      calories: 40,
      carbohydrates: 8.0,
      protein: 1.5,
      fat: 0.8,
      fiber: 3.5,
      sodium: 320
    },
    tips: `• 우엉은 빨리 갈변하니 식초물에 담금
• 간장 조림 스타일이 일반적
• 도시락, 김밥 필수 재료`,
    descriptionEn: "Burdock root kimchi with a fragrant, chewy texture. Rich in fiber and perfect for gimbap or lunchboxes."
  },

  // 도라지김치
  doraji: {
    history: `도라지김치는 도라지의 쌉싸름하고 아삭한 맛이 특징인 건강 김치입니다.

도라지는 기관지에 좋은 사포닌이 풍부해 예로부터 한방에서 약재로 사용했습니다. 감기나 기침에 좋다고 알려져 있습니다.`,
    makingProcess: `**1단계: 도라지 손질**
- 껍질 벗기고 얇게 찢기
- 소금으로 주물러 쓴맛 제거

**2단계: 양념**
- 고춧가루 + 간장 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 도라지와 양념 버무림
- 바로 먹거나 하루 숙성`,
    storageMethod: `• 냉장 보관 시 1-2주
• 시간이 지나면 쓴맛 줄어듦
• 한정식 밥상의 기본 반찬`,
    nutritionInfo: {
      calories: 25,
      carbohydrates: 5.0,
      protein: 1.2,
      fat: 0.3,
      fiber: 2.0,
      sodium: 250
    },
    tips: `• 쓴맛 제거를 위해 소금에 주무르기
• 기관지 건강에 좋음
• 잔치국수와 함께 먹기 좋음`,
    descriptionEn: "Bellflower root kimchi with a slightly bitter, crisp taste. Known for its respiratory health benefits."
  },

  // 멸치젓무침
  myeolchi: {
    history: `멸치젓무침은 멸치젓에 무채를 버무린 짭짤한 밑반찬입니다.

남해안 지역에서 잡은 신선한 멸치로 담근 젓갈을 사용하며, 밥도둑으로 유명합니다. 칼슘과 단백질이 풍부합니다.`,
    makingProcess: `**1단계: 무 손질**
- 무를 곱게 채 썰기
- 소금에 살짝 절임

**2단계: 양념**
- 멸치젓 + 고춧가루 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 무채와 멸치젓 양념 버무림
- 바로 먹거나 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2주
• 짭짤하니 소량씩 먹기
• 밥도둑 반찬`,
    nutritionInfo: {
      calories: 35,
      carbohydrates: 4.0,
      protein: 3.0,
      fat: 1.5,
      fiber: 0.8,
      sodium: 580
    },
    tips: `• 좋은 품질의 멸치젓이 핵심
• 짭짤해서 밥과 최고의 궁합
• 남해안 명물`,
    descriptionEn: "Anchovy kimchi with shredded radish. A salty, umami-rich side dish from the southern coast of Korea."
  },

  // 고추김치
  gochu: {
    history: `고추김치는 풋고추나 청양고추를 통째로 담근 매콤한 김치입니다.

고추 특유의 알싸한 매운맛과 아삭한 식감이 특징입니다. 삼겹살 구워 먹을 때 곁들이면 느끼함을 잡아주고, 소주 안주로도 인기입니다.`,
    makingProcess: `**1단계: 고추 손질**
- 깨끗이 씻어 꼭지 제거
- 칼집을 넣어 양념이 배도록

**2단계: 양념**
- 젓갈 + 마늘 + 생강
- 찹쌀풀로 양념 농도 맞춤

**3단계: 버무리기**
- 고추와 양념 버무림
- 실온 숙성 후 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2주
• 익을수록 매운맛 감소
• 삼겹살, 소주 안주로 최고`,
    nutritionInfo: {
      calories: 25,
      carbohydrates: 4.5,
      protein: 1.2,
      fat: 0.3,
      fiber: 1.8,
      sodium: 300,
      vitaminC: 80
    },
    tips: `• 청양고추는 매우 매우니 주의
• 칼집을 넣으면 양념이 잘 배임
• 술안주로 인기`,
    descriptionEn: "Whole pepper kimchi with a spicy kick. Perfect accompaniment for Korean BBQ and soju."
  },

  // 마늘김치
  maneul: {
    history: `마늘김치는 통마늘을 절여 담근 건강 김치입니다.

마늘은 항균, 면역력 강화 효과가 있어 '천연 항생제'로 불립니다. 발효되면 알싸한 맛이 부드러워지고 감칠맛이 깊어집니다.`,
    makingProcess: `**1단계: 마늘 손질**
- 통마늘 껍질 벗기기
- 깨끗이 씻어 준비

**2단계: 절이기**
- 간장 + 식초 + 설탕물에 절임
- 2-3주 숙성

**3단계: 양념**
- 고춧가루 추가 (선택)
- 참기름으로 마무리`,
    storageMethod: `• 냉장 보관 시 2-3개월
• 오래 숙성할수록 맛이 깊어짐
• 간 보호 효과`,
    nutritionInfo: {
      calories: 35,
      carbohydrates: 7.0,
      protein: 1.5,
      fat: 0.2,
      fiber: 0.8,
      sodium: 280
    },
    tips: `• 통마늘 숙성에 시간 필요
• 오래 두면 알싸한 맛 감소
• 건강식으로 인기`,
    descriptionEn: "Whole garlic kimchi with antibacterial properties. The fermentation mellows the pungent flavor into a rich, savory taste."
  },

  // 창난젓김치
  changnan: {
    history: `창난젓김치는 명태 창난젓에 무채를 버무린 강원도 향토 김치입니다.

창난젓은 명태의 내장으로 담근 젓갈로, 강원도 동해안 지역의 특산물입니다. 짭짤하고 깊은 감칠맛이 특징입니다.`,
    makingProcess: `**1단계: 무 손질**
- 무를 채 썰기
- 소금에 살짝 절임

**2단계: 양념**
- 창난젓 + 고춧가루 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 무채와 양념 버무림
- 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2주
• 짭짤하니 소량씩
• 밥반찬, 술안주로 좋음`,
    nutritionInfo: {
      calories: 40,
      carbohydrates: 4.5,
      protein: 4.0,
      fat: 1.5,
      fiber: 0.8,
      sodium: 620
    },
    tips: `• 창난젓 품질이 핵심
• 강원도 전통 맛
• 밥도둑 반찬`,
    descriptionEn: "Pollack roe kimchi from Gangwon province. A salty, rich-flavored side dish made with fermented fish innards."
  },

  // 시금치김치
  sigeumchi: {
    history: `시금치김치는 시금치를 데쳐서 양념에 버무린 부드러운 김치입니다.

시금치는 철분과 엽산이 풍부한 영양 채소입니다. 비빔밥의 필수 재료이며, 한정식 밥상의 기본 나물입니다.`,
    makingProcess: `**1단계: 시금치 데치기**
- 끓는 물에 살짝 데침
- 찬물에 헹궈 물기 꼭 짜기

**2단계: 양념**
- 고춧가루 + 참기름 + 깨
- 마늘 + 간장

**3단계: 버무리기**
- 시금치와 양념 버무림
- 바로 먹거나 냉장 보관`,
    storageMethod: `• 냉장 보관 시 3-5일
• 물기 제거가 중요
• 비빔밥 필수 재료`,
    nutritionInfo: {
      calories: 22,
      carbohydrates: 2.5,
      protein: 2.5,
      fat: 0.8,
      fiber: 2.0,
      sodium: 150
    },
    tips: `• 살짝만 데쳐야 영양소 보존
• 물기를 꼭 짜기
• 비빔밥에 필수`,
    descriptionEn: "Spinach kimchi with a soft texture. Rich in iron and folate, an essential ingredient for bibimbap."
  },

  // 숙주나물김치
  sukjunamul: {
    history: `숙주나물김치는 아삭한 숙주나물에 양념을 버무린 즉석 김치입니다.

숙주나물은 비타민 C가 풍부하고 저칼로리 식품입니다. 쌀국수, 비빔밥 등에 곁들여 먹으면 좋습니다.`,
    makingProcess: `**1단계: 숙주나물 손질**
- 깨끗이 씻어 다듬기
- 끓는 물에 살짝 데침

**2단계: 양념**
- 고춧가루 + 파 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 식힌 숙주나물과 양념 버무림
- 바로 먹기`,
    storageMethod: `• 냉장 보관 시 2-3일
• 빨리 물러지므로 빨리 소비
• 담근 직후가 가장 아삭`,
    nutritionInfo: {
      calories: 15,
      carbohydrates: 2.0,
      protein: 1.5,
      fat: 0.3,
      fiber: 1.0,
      sodium: 160
    },
    tips: `• 살짝만 데쳐 아삭함 유지
• 저칼로리 다이어트 식품
• 쌀국수와 함께`,
    descriptionEn: "Mung bean sprout kimchi with a refreshing crunch. A low-calorie side dish perfect with pho or bibimbap."
  },

  // 굴김치
  gulkimchi: {
    history: `굴김치는 신선한 굴을 넣어 담근 겨울철 별미 김치입니다.

서해안과 남해안의 신선한 굴을 사용하며, 굴의 감칠맛과 배추김치의 조화가 특징입니다. 겨울 제철에만 맛볼 수 있는 특별한 김치입니다.`,
    makingProcess: `**1단계: 재료 준비**
- 배추 절여 준비
- 신선한 굴 깨끗이 씻기

**2단계: 양념**
- 고춧가루 + 젓갈 + 마늘
- 굴을 양념에 살짝 버무림

**3단계: 담그기**
- 배추 사이에 굴 넣어 담금
- 빨리 익혀 빨리 소비`,
    storageMethod: `• 냉장 보관 시 1-2주
• 굴이 상하기 쉬우니 빨리 소비
• 겨울 한정 별미`,
    nutritionInfo: {
      calories: 30,
      carbohydrates: 3.0,
      protein: 4.0,
      fat: 0.8,
      fiber: 1.2,
      sodium: 280
    },
    tips: `• 겨울 제철 굴이 가장 맛있음
• 신선한 굴 사용이 핵심
• 빨리 먹는 것이 좋음`,
    descriptionEn: "Oyster kimchi, a winter delicacy. Fresh oysters add a rich, briny flavor to traditional cabbage kimchi."
  },

  // 족발김치 (겉절이)
  jokbal: {
    history: `족발김치는 족발과 함께 먹는 겉절이 스타일의 신선한 김치입니다.

족발은 콜라겐이 풍부한 한국식 족발 요리로, 신선한 겉절이와 함께 먹으면 느끼함을 잡아줍니다. 막국수와 함께 먹는 것이 정석입니다.`,
    makingProcess: `**1단계: 재료 손질**
- 배추, 무를 먹기 좋게 썰기
- 소금에 살짝 절임

**2단계: 양념**
- 고춧가루 + 새우젓 + 마늘
- 식초 + 설탕으로 새콤달콤하게

**3단계: 버무리기**
- 재료와 양념 살살 버무림
- 바로 먹기`,
    storageMethod: `• 냉장 보관 시 2-3일
• 겉절이라 빨리 소비
• 족발과 함께 먹기`,
    nutritionInfo: {
      calories: 18,
      carbohydrates: 3.2,
      protein: 0.8,
      fat: 0.2,
      fiber: 1.2,
      sodium: 200
    },
    tips: `• 신선하게 바로 만들어 먹기
• 새콤달콤하게 양념
• 족발, 보쌈과 최고의 궁합`,
    descriptionEn: "Fresh kimchi salad served with jokbal (pigs feet). The tangy, refreshing taste cuts through the richness of the meat."
  },

  // 젓국지
  jeotgal: {
    history: `젓국지는 새우젓국물로 담근 시원하고 깊은 맛의 김치입니다.

젓갈의 감칠맛이 김치에 스며들어 깊고 진한 맛을 만들어냅니다. 전통적인 발효 방식으로 오래 두고 먹을 수 있습니다.`,
    makingProcess: `**1단계: 배추 절이기**
- 소금물에 배추 절임
- 깨끗이 헹궈 물기 제거

**2단계: 젓국 양념**
- 새우젓국 + 마늘 + 생강
- 고춧가루 추가

**3단계: 담그기**
- 배추와 양념 버무림
- 충분히 숙성`,
    storageMethod: `• 냉장 보관 시 3-4주
• 오래 두면 깊은 맛 발현
• 젓갈 특유의 감칠맛`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 2.8,
      protein: 1.5,
      fat: 0.3,
      fiber: 1.2,
      sodium: 380
    },
    tips: `• 좋은 새우젓이 핵심
• 충분한 숙성 시간 필요
• 깊은 감칠맛이 특징`,
    descriptionEn: "Fermented fish brine kimchi with a deep, umami-rich flavor. Made with shrimp sauce for authentic taste."
  },

  // 호박김치
  hobak: {
    history: `호박김치는 애호박을 이용해 담근 여름철 별미 김치입니다.

여름 제철 채소인 애호박의 부드럽고 달콤한 맛이 특징입니다. 수분이 많아 여름철 시원하게 즐길 수 있습니다.`,
    makingProcess: `**1단계: 호박 손질**
- 애호박을 반달 모양으로 썰기
- 소금에 살짝 절임

**2단계: 양념**
- 새우젓 + 고춧가루 + 마늘
- 파 + 깨

**3단계: 버무리기**
- 호박과 양념 살살 버무림
- 바로 먹거나 살짝 숙성`,
    storageMethod: `• 냉장 보관 시 1주일
• 빨리 물러지므로 빨리 소비
• 여름 한정 별미`,
    nutritionInfo: {
      calories: 16,
      carbohydrates: 3.0,
      protein: 0.8,
      fat: 0.2,
      fiber: 1.0,
      sodium: 180
    },
    tips: `• 여름 애호박이 가장 맛있음
• 부드러운 식감이 특징
• 저칼로리 다이어트 김치`,
    descriptionEn: "Zucchini kimchi, a refreshing summer specialty. The soft texture and mild sweetness make it a light, healthy choice."
  },

  // 가지김치
  gaji: {
    history: `가지김치는 가지를 쪄서 양념장에 버무린 부드러운 김치입니다.

가지는 안토시아닌이 풍부한 항산화 채소입니다. 부드러운 식감과 담백한 맛이 특징이며, 여름철 별미로 즐깁니다.`,
    makingProcess: `**1단계: 가지 손질**
- 가지를 반으로 갈라 칼집
- 찜기에 쪄서 익히기

**2단계: 양념**
- 간장 + 고춧가루 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 식힌 가지와 양념 버무림
- 바로 먹거나 냉장 보관`,
    storageMethod: `• 냉장 보관 시 1주일
• 부드러운 식감 유지
• 여름 별미`,
    nutritionInfo: {
      calories: 22,
      carbohydrates: 4.0,
      protein: 1.0,
      fat: 0.5,
      fiber: 2.0,
      sodium: 250
    },
    tips: `• 가지는 칼집을 내야 양념이 배임
• 쪄서 사용하면 부드러움
• 비빔밥 재료로도 좋음`,
    descriptionEn: "Eggplant kimchi with a soft, tender texture. Rich in antioxidants and perfect for summer meals."
  },

  // 달래김치
  dalrae: {
    history: `달래김치는 봄 달래의 알싸하고 향긋한 맛이 특징인 봄철 김치입니다.

달래는 봄에만 맛볼 수 있는 제철 채소로, 독특한 향과 맛이 있습니다. 봄철 입맛을 돋우는 계절 김치입니다.`,
    makingProcess: `**1단계: 달래 손질**
- 달래 뿌리와 잎 다듬기
- 깨끗이 씻어 준비

**2단계: 양념**
- 고춧가루 + 멸치액젓 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 달래와 양념 살살 버무림
- 바로 먹기`,
    storageMethod: `• 냉장 보관 시 3-5일
• 빨리 물러지므로 빨리 소비
• 봄 한정 별미`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 3.2,
      protein: 1.2,
      fat: 0.4,
      fiber: 1.5,
      sodium: 190
    },
    tips: `• 봄 달래가 가장 향긋함
• 알싸한 맛이 특징
• 된장찌개와 함께`,
    descriptionEn: "Wild chive kimchi, a spring specialty with a pungent, garlicky flavor. Only available during the spring season."
  },

  // 냉이김치
  naengi: {
    history: `냉이김치는 봄 냉이의 구수하고 향긋한 맛이 살아있는 계절 김치입니다.

냉이는 비타민 A와 칼슘이 풍부한 봄나물입니다. 된장국이나 무침으로 많이 먹지만, 김치로 담가도 맛있습니다.`,
    makingProcess: `**1단계: 냉이 손질**
- 뿌리와 잎 다듬기
- 흙을 깨끗이 씻어내기

**2단계: 양념**
- 된장 + 고춧가루 + 마늘
- 참기름 추가

**3단계: 버무리기**
- 냉이와 양념 버무림
- 바로 먹기`,
    storageMethod: `• 냉장 보관 시 3-5일
• 봄철 한정 별미
• 구수한 맛이 특징`,
    nutritionInfo: {
      calories: 22,
      carbohydrates: 3.5,
      protein: 1.8,
      fat: 0.3,
      fiber: 2.0,
      sodium: 200
    },
    tips: `• 봄 냉이가 가장 향긋함
• 된장과 궁합이 좋음
• 된장국과 함께`,
    descriptionEn: "Shepherds purse kimchi with an earthy, herbal flavor. A spring delicacy rich in vitamins and calcium."
  },

  // 쑥김치
  ssuk: {
    history: `쑥김치는 쑥의 쌉싸름하고 향긋한 맛이 특징인 봄철 건강 김치입니다.

쑥은 예로부터 약재로 사용된 건강 식품입니다. 철분이 풍부하고 여성 건강에 좋다고 알려져 있습니다.`,
    makingProcess: `**1단계: 쑥 손질**
- 어린 쑥잎만 따서 준비
- 깨끗이 씻어 물기 제거

**2단계: 양념**
- 고춧가루 + 된장 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 쑥과 양념 버무림
- 바로 먹기`,
    storageMethod: `• 냉장 보관 시 3-5일
• 봄철 한정 별미
• 쌉싸름한 맛이 특징`,
    nutritionInfo: {
      calories: 25,
      carbohydrates: 3.8,
      protein: 2.0,
      fat: 0.5,
      fiber: 2.5,
      sodium: 180
    },
    tips: `• 어린 쑥이 부드러움
• 쌉싸름한 맛 조절 필요
• 건강식으로 인기`,
    descriptionEn: "Mugwort kimchi with a distinctive bitter-sweet, aromatic flavor. Known for its health benefits, especially for women."
  },

  // 부추겉절이
  buchukimchi: {
    history: `부추겉절이는 부추를 바로 버무려 먹는 신선한 겉절이 김치입니다.

부추는 스태미나 채소로 알려져 있으며, 고기와 함께 먹으면 궁합이 좋습니다. 신선하게 바로 만들어 먹는 것이 특징입니다.`,
    makingProcess: `**1단계: 부추 손질**
- 깨끗이 씻어 물기 제거
- 먹기 좋게 자름

**2단계: 양념**
- 고춧가루 + 멸치액젓 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 부추와 양념 살살 버무림
- 바로 먹기`,
    storageMethod: `• 냉장 보관 시 2-3일
• 신선하게 바로 먹기
• 고기와 함께`,
    nutritionInfo: {
      calories: 20,
      carbohydrates: 3.0,
      protein: 1.5,
      fat: 0.5,
      fiber: 1.5,
      sodium: 200
    },
    tips: `• 신선한 부추 사용
• 고기와 환상 궁합
• 바로 만들어 먹기`,
    descriptionEn: "Fresh chive salad kimchi, best served immediately. A stamina-boosting side dish perfect with grilled meats."
  },

  // 상추김치
  sangchu: {
    history: `상추김치는 상추를 겉절이로 담근 시원하고 가벼운 김치입니다.

상추는 수분이 많고 식이섬유가 풍부한 저칼로리 채소입니다. 삼겹살과 함께 쌈으로 먹는 것이 일반적이지만, 겉절이로도 맛있습니다.`,
    makingProcess: `**1단계: 상추 손질**
- 깨끗이 씻어 물기 제거
- 손으로 먹기 좋게 찢기

**2단계: 양념**
- 고춧가루 + 멸치액젓 + 마늘
- 참기름 + 깨

**3단계: 버무리기**
- 상추와 양념 살살 버무림
- 바로 먹기`,
    storageMethod: `• 바로 먹기 (보관 X)
• 물러지기 쉬움
• 즉석에서 만들어 먹기`,
    nutritionInfo: {
      calories: 12,
      carbohydrates: 2.0,
      protein: 0.8,
      fat: 0.2,
      fiber: 1.0,
      sodium: 150
    },
    tips: `• 바로 만들어 바로 먹기
• 저칼로리 건강식
• 삼겹살과 함께`,
    descriptionEn: "Fresh lettuce kimchi salad for immediate consumption. Light, refreshing, and perfect with Korean BBQ."
  },

  // 율무김치
  yulmukimchi: {
    history: `율무김치는 율무를 넣어 담근 건강 김치입니다.

율무는 피부 건강과 부종 완화에 좋다고 알려진 건강 곡물입니다. 고소하고 담백한 맛이 특징입니다.`,
    makingProcess: `**1단계: 율무 준비**
- 율무를 삶아 준비
- 배추 절여 준비

**2단계: 양념**
- 고춧가루 + 마늘 + 젓갈
- 율무 추가

**3단계: 버무리기**
- 배추, 율무, 양념 버무림
- 숙성 후 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2-3주
• 율무가 들어가 영양 UP
• 건강식으로 인기`,
    nutritionInfo: {
      calories: 30,
      carbohydrates: 5.5,
      protein: 1.5,
      fat: 0.3,
      fiber: 1.8,
      sodium: 220
    },
    tips: `• 율무는 미리 삶아 준비
• 피부 건강에 좋음
• 다이어트 김치로 인기`,
    descriptionEn: "Jobs tears kimchi known for its skin health and anti-swelling benefits. A unique, nutritious variation."
  },

  // 쭈꾸미김치
  jukkumi: {
    history: `쭈꾸미김치는 쭈꾸미를 넣어 담근 특별한 봄철 별미 김치입니다.

봄철 쭈꾸미는 알이 차서 가장 맛있습니다. 쭈꾸미의 쫄깃한 식감과 매콤한 양념이 조화를 이룹니다.`,
    makingProcess: `**1단계: 재료 준비**
- 쭈꾸미 손질하여 준비
- 배추 절여 준비

**2단계: 양념**
- 고춧가루 + 젓갈 + 마늘
- 쭈꾸미 추가

**3단계: 담그기**
- 배추와 쭈꾸미, 양념 버무림
- 빨리 소비`,
    storageMethod: `• 냉장 보관 시 1주일
• 해산물이라 빨리 소비
• 봄 한정 별미`,
    nutritionInfo: {
      calories: 35,
      carbohydrates: 3.0,
      protein: 5.0,
      fat: 0.8,
      fiber: 1.0,
      sodium: 300
    },
    tips: `• 봄 쭈꾸미가 가장 맛있음
• 신선한 재료 사용
• 빨리 먹는 것이 좋음`,
    descriptionEn: "Webfoot octopus kimchi, a spring delicacy from the western coast. The chewy texture pairs perfectly with spicy kimchi."
  },

  // 조개젓김치
  jogaejeotgal: {
    history: `조개젓김치는 조개젓으로 담근 시원하고 감칠맛 나는 김치입니다.

서해안의 신선한 조개로 담근 젓갈을 사용하며, 바다의 감칠맛이 김치에 스며듭니다.`,
    makingProcess: `**1단계: 배추 절이기**
- 소금물에 배추 절임
- 깨끗이 헹궈 준비

**2단계: 조개젓 양념**
- 조개젓 + 고춧가루 + 마늘
- 파 + 생강

**3단계: 버무리기**
- 배추와 양념 버무림
- 충분히 숙성`,
    storageMethod: `• 냉장 보관 시 2-3주
• 조개젓의 감칠맛이 특징
• 깊은 맛 발현`,
    nutritionInfo: {
      calories: 25,
      carbohydrates: 3.0,
      protein: 2.5,
      fat: 0.5,
      fiber: 1.2,
      sodium: 400
    },
    tips: `• 서해안 조개젓이 유명
• 감칠맛이 깊음
• 해물요리와 잘 어울림`,
    descriptionEn: "Clam kimchi with a rich, briny flavor from the western coast. The fermented clam sauce adds depth and umami."
  },

  // 코다리김치
  kodari: {
    history: `코다리김치는 코다리를 넣어 담근 강원도 향토 김치입니다.

코다리는 반건조 명태로, 강원도 동해안 지역의 특산물입니다. 생선의 감칠맛이 김치에 스며들어 깊은 맛을 냅니다.`,
    makingProcess: `**1단계: 재료 준비**
- 코다리 손질하여 준비
- 배추 절여 준비

**2단계: 양념**
- 고춧가루 + 젓갈 + 마늘
- 코다리 추가

**3단계: 담그기**
- 배추와 코다리, 양념 버무림
- 숙성 후 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2주
• 코다리의 감칠맛이 특징
• 강원도 전통 맛`,
    nutritionInfo: {
      calories: 35,
      carbohydrates: 3.0,
      protein: 5.5,
      fat: 1.0,
      fiber: 1.0,
      sodium: 380
    },
    tips: `• 강원도 코다리가 유명
• 생선 특유의 감칠맛
• 막국수와 함께`,
    descriptionEn: "Semi-dried pollack kimchi from Gangwon province. The fish adds a rich, savory depth to the fermented cabbage."
  },

  // 먹갈김치
  meokgalkimchi: {
    history: `먹갈김치는 깻잎을 오래 삭혀 담근 깊은 맛의 김치입니다.

전라도 지역에서 깻잎을 장기간 발효시켜 만드는 전통 김치입니다. 오래 삭힐수록 깊고 진한 맛이 납니다.`,
    makingProcess: `**1단계: 깻잎 준비**
- 깻잎을 깨끗이 씻어 준비
- 한 장씩 펼쳐 놓기

**2단계: 양념장**
- 간장 + 고춧가루 + 마늘
- 참기름 + 깨

**3단계: 담그기**
- 깻잎에 양념 발라 쌓기
- 오래 삭혀 숙성`,
    storageMethod: `• 냉장 보관 시 1-2개월
• 오래 삭힐수록 깊은 맛
• 전라도 전통 김치`,
    nutritionInfo: {
      calories: 35,
      carbohydrates: 4.5,
      protein: 2.0,
      fat: 1.0,
      fiber: 1.5,
      sodium: 400
    },
    tips: `• 오래 숙성이 핵심
• 전라도 전통 맛
• 보쌈과 함께`,
    descriptionEn: "Aged perilla leaf kimchi from Jeolla province. Long fermentation creates an intensely deep, complex flavor."
  },

  // 꽈리고추김치
  ggwarigochu: {
    history: `꽈리고추김치는 꽈리고추를 간장 양념에 조린 밑반찬 김치입니다.

꽈리고추는 매운맛이 적고 달콤한 맛이 나는 고추입니다. 도시락 반찬이나 밥반찬으로 인기가 높습니다.`,
    makingProcess: `**1단계: 꽈리고추 손질**
- 꼭지 제거하고 씻기
- 이쑤시개로 구멍 뚫기

**2단계: 양념**
- 간장 + 마늘 + 설탕
- 참기름 + 깨

**3단계: 조리기**
- 팬에 양념과 함께 조림
- 국물이 자작해질 때까지`,
    storageMethod: `• 냉장 보관 시 2주
• 밀폐용기에 보관
• 도시락 반찬으로 최고`,
    nutritionInfo: {
      calories: 30,
      carbohydrates: 5.0,
      protein: 1.0,
      fat: 0.8,
      fiber: 1.5,
      sodium: 320
    },
    tips: `• 구멍을 뚫어야 양념이 배임
• 간장 조림 스타일
• 도시락 필수 반찬`,
    descriptionEn: "Shishito pepper kimchi braised in soy sauce. A mild, sweet side dish perfect for lunchboxes."
  },

  // 오징어젓김치
  ojingeo: {
    history: `오징어젓김치는 오징어젓을 넣어 담근 쫄깃하고 감칠맛 나는 김치입니다.

동해안의 신선한 오징어로 담근 젓갈을 사용하며, 오징어의 쫄깃한 식감과 감칠맛이 특징입니다.`,
    makingProcess: `**1단계: 배추 준비**
- 배추 절여 준비

**2단계: 오징어젓 양념**
- 오징어젓 + 고춧가루 + 마늘
- 파 + 생강

**3단계: 버무리기**
- 배추와 양념 버무림
- 충분히 숙성`,
    storageMethod: `• 냉장 보관 시 2-3주
• 오징어젓의 감칠맛이 특징
• 동해안 전통 맛`,
    nutritionInfo: {
      calories: 30,
      carbohydrates: 3.0,
      protein: 4.0,
      fat: 0.8,
      fiber: 1.2,
      sodium: 420
    },
    tips: `• 동해안 오징어젓이 유명
• 쫄깃한 식감이 특징
• 밥반찬, 술안주로 좋음`,
    descriptionEn: "Squid kimchi from the eastern coast. The chewy fermented squid adds a unique texture and umami flavor."
  },

  // 진주김치
  jinju: {
    history: `진주김치는 경상남도 진주 지역의 전통 김치입니다.

진주는 비빔밥으로 유명한 도시로, 진주김치는 담백하고 깔끔한 맛이 특징입니다. 진주비빔밥과 함께 먹으면 좋습니다.`,
    makingProcess: `**1단계: 배추 절이기**
- 소금물에 배추 절임
- 깨끗이 헹궈 준비

**2단계: 양념**
- 고춧가루 + 젓갈 + 마늘 + 미나리
- 담백하게 양념

**3단계: 버무리기**
- 배추와 양념 버무림
- 숙성 후 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2-3주
• 담백한 맛이 특징
• 진주비빔밥과 함께`,
    nutritionInfo: {
      calories: 16,
      carbohydrates: 2.8,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.3,
      sodium: 220
    },
    tips: `• 진주 스타일의 담백한 맛
• 비빔밥과 환상 궁합
• 깔끔한 맛이 특징`,
    descriptionEn: "Jinju-style kimchi from South Gyeongsang province. Known for its clean, mild taste that pairs perfectly with Jinju bibimbap."
  },

  // 안동김치
  andong: {
    history: `안동김치는 경상북도 안동의 전통 김치입니다.

안동은 유교 문화의 중심지로, 안동김치는 간장을 사용해 담백하고 품위 있는 맛이 특징입니다. 안동찜닭, 간고등어와 함께 먹으면 좋습니다.`,
    makingProcess: `**1단계: 배추 절이기**
- 소금물에 배추 절임
- 깨끗이 헹궈 준비

**2단계: 간장 양념**
- 간장 + 마늘 + 생강
- 고춧가루 적게 또는 없이

**3단계: 버무리기**
- 배추와 양념 버무림
- 숙성 후 냉장 보관`,
    storageMethod: `• 냉장 보관 시 2-3주
• 간장의 담백한 맛
• 안동 전통 맛`,
    nutritionInfo: {
      calories: 14,
      carbohydrates: 2.5,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.1,
      sodium: 300
    },
    tips: `• 안동 스타일의 간장 김치
• 담백하고 품위 있는 맛
• 안동찜닭과 함께`,
    descriptionEn: "Andong-style soy sauce kimchi from North Gyeongsang province. A refined, mild variety reflecting the regions Confucian heritage."
  },

  // 거제도김치
  geoje: {
    history: `거제도김치는 거제도의 신선한 해산물을 넣은 바다 향 가득한 김치입니다.

거제도는 남해안의 섬으로, 신선한 해산물이 풍부합니다. 멸치, 굴, 새우 등을 넣어 바다의 감칠맛이 특징입니다.`,
    makingProcess: `**1단계: 재료 준비**
- 배추 절여 준비
- 신선한 해산물 준비

**2단계: 양념**
- 고춧가루 + 젓갈 + 마늘
- 해산물 추가

**3단계: 담그기**
- 배추와 해산물, 양념 버무림
- 숙성 후 냉장 보관`,
    storageMethod: `• 냉장 보관 시 1-2주
• 해산물이라 빨리 소비
• 바다 향이 특징`,
    nutritionInfo: {
      calories: 28,
      carbohydrates: 3.0,
      protein: 3.5,
      fat: 0.6,
      fiber: 1.2,
      sodium: 300
    },
    tips: `• 신선한 해산물이 핵심
• 바다의 감칠맛
• 회와 함께 먹기 좋음`,
    descriptionEn: "Geoje Island kimchi filled with fresh seafood from the southern coast. The ocean flavors create a uniquely rich taste."
  },

  // 제주김치
  jeju: {
    history: `제주김치는 제주도의 전복과 해산물을 넣은 특별한 섬김치입니다.

제주도는 전복, 톳 등 특산 해산물이 유명합니다. 제주 흑돼지와 함께 먹으면 최고의 궁합을 자랑합니다.`,
    makingProcess: `**1단계: 재료 준비**
- 배추 절여 준비
- 전복, 톳 등 해산물 준비

**2단계: 양념**
- 고춧가루 + 젓갈 + 마늘
- 전복, 톳 추가

**3단계: 담그기**
- 배추와 해산물, 양념 버무림
- 숙성 후 냉장 보관`,
    storageMethod: `• 냉장 보관 시 1-2주
• 전복이라 빨리 소비
• 제주 특산물의 맛`,
    nutritionInfo: {
      calories: 32,
      carbohydrates: 3.5,
      protein: 4.0,
      fat: 0.5,
      fiber: 1.5,
      sodium: 280
    },
    tips: `• 제주 전복이 핵심
• 톳의 바다 향
• 흑돼지와 환상 궁합`,
    descriptionEn: "Jeju Island kimchi featuring local abalone and seaweed. A premium variety that pairs perfectly with Jeju black pork."
  }
};

async function updateKimchiData() {
  console.log("🥬 김치 데이터 강화 시작...\n");

  const kimchis = await prisma.kimchi.findMany();
  console.log(`📊 총 ${kimchis.length}개 김치 데이터 발견\n`);

  let updated = 0;
  let imagesUpdated = 0;

  for (const kimchi of kimchis) {
    const details = DETAILED_KIMCHI_DATA[kimchi.slug];
    const imageUrl = KIMCHI_IMAGES[kimchi.slug] || DEFAULT_KIMCHI_IMAGE;

    // 이미지 URL 업데이트
    if (!kimchi.imageUrl || kimchi.imageUrl.startsWith("/images/")) {
      await prisma.kimchi.update({
        where: { id: kimchi.id },
        data: { imageUrl }
      });
      imagesUpdated++;
      console.log(`🖼️  ${kimchi.name} 이미지 업데이트`);
    }

    // 상세 정보 업데이트
    if (details) {
      await prisma.kimchi.update({
        where: { id: kimchi.id },
        data: {
          history: details.history,
          makingProcess: details.makingProcess,
          storageMethod: details.storageMethod,
          nutritionInfo: details.nutritionInfo,
          variations: details.variations,
          descriptionEn: details.descriptionEn
        }
      });
      updated++;
      console.log(`✅ ${kimchi.name} 상세 정보 업데이트`);
    }
  }

  console.log(`\n🎉 완료! ${updated}개 상세 정보, ${imagesUpdated}개 이미지 업데이트됨`);
}

// 실행
updateKimchiData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
