export interface KimchiType {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  region: string;
  spicyLevel: number; // 1-5
  fermentationLevel: number; // 1-5
  saltiness: number; // 1-5
  crunchiness: number; // 1-5
  mainIngredients: string[];
  bestWith: string[]; // 어울리는 음식
  healthBenefits: string[];
  imageUrl: string;
  tags: string[];
}

export const KIMCHI_DATA: KimchiType[] = [
  {
    id: "baechu",
    name: "배추김치",
    nameEn: "Napa Cabbage Kimchi",
    description: "가장 대표적인 한국 김치. 배추를 소금에 절여 고춧가루, 젓갈, 마늘 등으로 양념하여 발효시킨 김치입니다.",
    region: "전국",
    spicyLevel: 3,
    fermentationLevel: 4,
    saltiness: 3,
    crunchiness: 4,
    mainIngredients: ["배추", "고춧가루", "젓갈", "마늘", "생강"],
    bestWith: ["삼겹살", "김치찌개", "김치볶음밥", "라면"],
    healthBenefits: ["유산균 풍부", "비타민 C", "식이섬유", "면역력 강화"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Baechu-kimchi_%EB%B0%B0%EC%B6%94%EA%B9%80%EC%B9%98H.jpg",
    tags: ["전통", "발효", "매운맛", "기본"],
  },
  {
    id: "kkakdugi",
    name: "깍두기",
    nameEn: "Cubed Radish Kimchi",
    description: "무를 깍둑썰기하여 고춧가루 양념에 버무린 김치. 아삭한 식감이 특징입니다.",
    region: "전국",
    spicyLevel: 3,
    fermentationLevel: 3,
    saltiness: 3,
    crunchiness: 5,
    mainIngredients: ["무", "고춧가루", "젓갈", "마늘", "파"],
    bestWith: ["설렁탕", "곰탕", "순대국", "수육"],
    healthBenefits: ["소화 촉진", "비타민 C", "식이섬유"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Korean.food-kkakdugi-01.jpg",
    tags: ["아삭함", "국물요리", "담백"],
  },
  {
    id: "chonggak",
    name: "총각김치",
    nameEn: "Ponytail Radish Kimchi",
    description: "총각무를 통째로 담근 김치. 알싸한 맛과 아삭한 식감이 특징입니다.",
    region: "전국",
    spicyLevel: 4,
    fermentationLevel: 4,
    saltiness: 3,
    crunchiness: 5,
    mainIngredients: ["총각무", "고춧가루", "젓갈", "마늘"],
    bestWith: ["고기구이", "비빔밥", "보쌈"],
    healthBenefits: ["소화 촉진", "항산화 작용"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Korean_cuisine-Chonggak_kimchi-01.jpg",
    tags: ["알싸함", "아삭함", "전통"],
  },
  {
    id: "nabak",
    name: "나박김치",
    nameEn: "Water Kimchi",
    description: "무와 배추를 납작하게 썰어 시원한 국물과 함께 담근 물김치입니다.",
    region: "전국",
    spicyLevel: 1,
    fermentationLevel: 3,
    saltiness: 2,
    crunchiness: 3,
    mainIngredients: ["무", "배추", "미나리", "쪽파"],
    bestWith: ["면요리", "밥", "여름철 식사"],
    healthBenefits: ["수분 보충", "소화 촉진", "청량감"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Korean_cuisine-Nabak_kimchi-01.jpg",
    tags: ["시원함", "물김치", "여름"],
  },
  {
    id: "dongchimi",
    name: "동치미",
    nameEn: "Radish Water Kimchi",
    description: "무를 통째로 소금물에 담가 발효시킨 겨울철 대표 물김치입니다.",
    region: "전국",
    spicyLevel: 1,
    fermentationLevel: 4,
    saltiness: 2,
    crunchiness: 4,
    mainIngredients: ["무", "배", "대파", "마늘"],
    bestWith: ["냉면", "만두", "겨울철 식사"],
    healthBenefits: ["소화 촉진", "해독 작용", "수분 보충"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/53/Korean-Dongchimi-01.jpg",
    tags: ["시원함", "물김치", "겨울", "냉면"],
  },
  {
    id: "yeolmu",
    name: "열무김치",
    nameEn: "Young Radish Kimchi",
    description: "어린 무청을 이용해 담근 여름철 별미 김치입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 2,
    saltiness: 2,
    crunchiness: 3,
    mainIngredients: ["열무", "고춧가루", "멸치액젓"],
    bestWith: ["비빔밥", "비빔국수", "열무냉면"],
    healthBenefits: ["비타민 풍부", "청량감"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Yeolmu-kimchi.jpg",
    tags: ["여름", "상큼함", "비빔"],
  },
  {
    id: "oisobagi",
    name: "오이소박이",
    nameEn: "Stuffed Cucumber Kimchi",
    description: "오이에 칼집을 내어 부추와 양념소를 채워 넣은 여름철 김치입니다.",
    region: "전국",
    spicyLevel: 3,
    fermentationLevel: 2,
    saltiness: 2,
    crunchiness: 5,
    mainIngredients: ["오이", "부추", "고춧가루", "마늘"],
    bestWith: ["보리밥", "된장찌개", "삼겹살"],
    healthBenefits: ["수분 보충", "비타민 K", "청량감"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Oi-sobagi.jpg",
    tags: ["여름", "아삭함", "시원함"],
  },
  {
    id: "gat",
    name: "갓김치",
    nameEn: "Mustard Leaf Kimchi",
    description: "갓 특유의 알싸하고 톡 쏘는 맛이 특징인 전라도 대표 김치입니다.",
    region: "전라도",
    spicyLevel: 4,
    fermentationLevel: 4,
    saltiness: 3,
    crunchiness: 3,
    mainIngredients: ["갓", "고춧가루", "젓갈", "마늘"],
    bestWith: ["고기구이", "굴밥", "밥"],
    healthBenefits: ["항암 효과", "비타민 A", "철분"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Gat-gimchi.jpg",
    tags: ["전라도", "알싸함", "향긋함"],
  },
  {
    id: "pa",
    name: "파김치",
    nameEn: "Green Onion Kimchi",
    description: "쪽파나 실파를 통째로 양념에 버무린 김치로, 고기와 궁합이 좋습니다.",
    region: "전국",
    spicyLevel: 3,
    fermentationLevel: 3,
    saltiness: 3,
    crunchiness: 2,
    mainIngredients: ["쪽파", "고춧가루", "젓갈", "마늘"],
    bestWith: ["삼겹살", "불고기", "제육볶음"],
    healthBenefits: ["혈액순환", "항균 작용", "비타민 C"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/Pa-gimchi.jpg",
    tags: ["고기안주", "향긋함"],
  },
  {
    id: "bossam",
    name: "보쌈김치",
    nameEn: "Wrapped Kimchi",
    description: "배추잎에 여러 해산물과 과일을 넣어 싸서 담근 궁중식 고급 김치입니다.",
    region: "서울/경기",
    spicyLevel: 2,
    fermentationLevel: 3,
    saltiness: 2,
    crunchiness: 3,
    mainIngredients: ["배추", "굴", "낙지", "밤", "대추", "배"],
    bestWith: ["특별한 식사", "명절", "손님상"],
    healthBenefits: ["단백질", "미네랄", "영양 균형"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/40/Bossam-kimchi_%28cropped%29.jpg",
    tags: ["고급", "궁중", "해산물", "특별"],
  },
  {
    id: "baek",
    name: "백김치",
    nameEn: "White Kimchi",
    description: "고춧가루를 넣지 않고 담근 하얀 김치. 담백하고 시원한 맛이 특징입니다.",
    region: "전국",
    spicyLevel: 0,
    fermentationLevel: 3,
    saltiness: 2,
    crunchiness: 4,
    mainIngredients: ["배추", "무", "배", "밤", "대추"],
    bestWith: ["어린이 식사", "환자식", "담백한 식사"],
    healthBenefits: ["소화 촉진", "위장 보호"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Baek-kimchi.jpg",
    tags: ["순한맛", "어린이", "담백"],
  },
  {
    id: "buchu",
    name: "부추김치",
    nameEn: "Chive Kimchi",
    description: "부추를 양념에 버무린 김치로, 향긋한 향과 부드러운 식감이 특징입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 2,
    saltiness: 2,
    crunchiness: 2,
    mainIngredients: ["부추", "고춧가루", "멸치액젓"],
    bestWith: ["비빔밥", "국수", "고기"],
    healthBenefits: ["스태미나", "비타민 A", "철분"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Kkaennip-kimchi.jpg",
    tags: ["향긋함", "부드러움", "스태미나"],
  },
  {
    id: "kkaennip",
    name: "깻잎김치",
    nameEn: "Perilla Leaf Kimchi",
    description: "깻잎을 양념장에 절여 만든 김치. 향긋한 깻잎 향이 특징입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 2,
    saltiness: 3,
    crunchiness: 2,
    mainIngredients: ["깻잎", "간장", "고춧가루", "마늘"],
    bestWith: ["쌈밥", "고기", "비빔밥"],
    healthBenefits: ["철분", "칼슘", "항알러지"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/Kkaennip-kimchi.jpg",
    tags: ["향긋함", "쌈", "밑반찬"],
  },
  {
    id: "godeulppaegi",
    name: "고들빼기김치",
    nameEn: "Korean Lettuce Kimchi",
    description: "고들빼기의 쌉싸름한 맛이 특징인 전라도 향토 김치입니다.",
    region: "전라도",
    spicyLevel: 3,
    fermentationLevel: 4,
    saltiness: 3,
    crunchiness: 3,
    mainIngredients: ["고들빼기", "고춧가루", "젓갈", "마늘"],
    bestWith: ["보리밥", "된장국", "고기"],
    healthBenefits: ["간 건강", "해독 작용", "소화 촉진"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/42/Godeulppaegi-kimchi.jpg",
    tags: ["전라도", "쌉싸름", "향토"],
  },
  {
    id: "gaji",
    name: "가지김치",
    nameEn: "Eggplant Kimchi",
    description: "가지를 쪄서 양념장에 버무린 부드러운 김치입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 2,
    saltiness: 2,
    crunchiness: 2,
    mainIngredients: ["가지", "간장", "고춧가루", "참기름"],
    bestWith: ["밥", "비빔밥", "고기"],
    healthBenefits: ["안토시아닌", "항산화", "식이섬유"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/Gaji-gimchi.jpg",
    tags: ["여름", "부드러움", "가지"],
  },
  {
    id: "buchukimchi",
    name: "부추겉절이",
    nameEn: "Fresh Chive Kimchi",
    description: "부추를 바로 버무려 먹는 신선한 겉절이 김치입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 1,
    saltiness: 2,
    crunchiness: 3,
    mainIngredients: ["부추", "고춧가루", "멸치액젓", "참기름"],
    bestWith: ["삼겹살", "오리고기", "불고기"],
    healthBenefits: ["스태미나", "비타민 A", "혈액순환"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/27/Buchu-geotjeori.jpg",
    tags: ["겉절이", "고기", "신선함"],
  },
  {
    id: "yangbaechu",
    name: "양배추김치",
    nameEn: "Cabbage Kimchi",
    description: "양배추로 담근 김치. 부드럽고 달콤한 맛이 특징입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 2,
    saltiness: 2,
    crunchiness: 3,
    mainIngredients: ["양배추", "고춧가루", "멸치액젓", "마늘"],
    bestWith: ["돈까스", "양식", "샌드위치"],
    healthBenefits: ["위장 건강", "비타민 U", "항산화"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Korean_cuisine-Kimchi-01.jpg",
    tags: ["부드러움", "달콤함", "퓨전"],
  },
  {
    id: "putbaechu",
    name: "풋배추김치",
    nameEn: "Young Cabbage Kimchi",
    description: "어린 배추로 담근 봄철 별미 김치입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 2,
    saltiness: 2,
    crunchiness: 4,
    mainIngredients: ["풋배추", "고춧가루", "멸치액젓", "마늘"],
    bestWith: ["삼겹살", "된장찌개", "보리밥"],
    healthBenefits: ["비타민 C", "엽산", "칼슘"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/16/Geotjeori.jpg",
    tags: ["봄", "어린배추", "신선함"],
  },
  {
    id: "altari",
    name: "알타리김치",
    nameEn: "Baby Radish Kimchi",
    description: "작은 알타리무로 담근 아삭하고 알싸한 김치입니다.",
    region: "전국",
    spicyLevel: 3,
    fermentationLevel: 3,
    saltiness: 3,
    crunchiness: 5,
    mainIngredients: ["알타리무", "고춧가루", "젓갈", "마늘"],
    bestWith: ["삼겹살", "보쌈", "수육"],
    healthBenefits: ["소화 촉진", "항산화"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Korean_cuisine-Chonggak_kimchi-01.jpg",
    tags: ["아삭함", "알싸함", "고기"],
  },
  {
    id: "museongchae",
    name: "무생채",
    nameEn: "Fresh Radish Salad Kimchi",
    description: "무를 채 썰어 고춧가루 양념에 버무린 즉석 김치입니다.",
    region: "전국",
    spicyLevel: 3,
    fermentationLevel: 1,
    saltiness: 2,
    crunchiness: 5,
    mainIngredients: ["무", "고춧가루", "식초", "설탕"],
    bestWith: ["불고기", "갈비", "고기요리"],
    healthBenefits: ["소화 촉진", "비타민 C", "칼륨"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Korean.food-kkakdugi-01.jpg",
    tags: ["즉석", "아삭함", "새콤달콤"],
  },
  {
    id: "seokbakji",
    name: "석박지",
    nameEn: "Mixed Vegetable Kimchi",
    description: "무와 배추를 큼직하게 썰어 담근 시원한 김치입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 3,
    saltiness: 2,
    crunchiness: 4,
    mainIngredients: ["무", "배추", "고춧가루", "젓갈"],
    bestWith: ["칼국수", "수제비", "면요리"],
    healthBenefits: ["소화 촉진", "비타민 C"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Korean_cuisine-Nabak_kimchi-01.jpg",
    tags: ["시원함", "면요리", "담백"],
  },
  {
    id: "mumallaengi",
    name: "무말랭이김치",
    nameEn: "Dried Radish Kimchi",
    description: "무를 말려서 양념에 버무린 김치. 쫄깃한 식감과 고소한 맛이 특징입니다.",
    region: "전국",
    spicyLevel: 3,
    fermentationLevel: 3,
    saltiness: 3,
    crunchiness: 3,
    mainIngredients: ["무말랭이", "고춧가루", "간장", "참기름"],
    bestWith: ["도시락", "밥", "술안주"],
    healthBenefits: ["식이섬유", "소화 촉진"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Korean.food-kkakdugi-01.jpg",
    tags: ["쫄깃함", "고소함", "밑반찬"],
  },
  {
    id: "gulkimchi",
    name: "굴김치",
    nameEn: "Oyster Kimchi",
    description: "신선한 굴을 넣어 담근 겨울철 별미 김치입니다.",
    region: "서해안",
    spicyLevel: 3,
    fermentationLevel: 3,
    saltiness: 3,
    crunchiness: 3,
    mainIngredients: ["배추", "굴", "고춧가루", "젓갈"],
    bestWith: ["밥", "굴밥", "한정식"],
    healthBenefits: ["아연", "철분", "타우린"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/Korean.cuisine-Kimchi-Jeotgal-01.jpg",
    tags: ["겨울", "굴", "바다"],
  },
  {
    id: "sulkimchi",
    name: "술김치",
    nameEn: "Rice Wine Kimchi",
    description: "막걸리를 넣어 담근 달큰하고 부드러운 김치입니다.",
    region: "충청도",
    spicyLevel: 1,
    fermentationLevel: 4,
    saltiness: 2,
    crunchiness: 3,
    mainIngredients: ["배추", "막걸리", "고춧가루", "마늘"],
    bestWith: ["밥", "국", "한정식"],
    healthBenefits: ["유산균", "소화 촉진"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Baek-kimchi_3.jpg",
    tags: ["충청도", "달큼함", "부드러움"],
  },
  {
    id: "yulmukimchi",
    name: "율무김치",
    nameEn: "Jobs Tears Kimchi",
    description: "율무를 넣어 담근 건강 김치. 고소하고 담백한 맛입니다.",
    region: "전국",
    spicyLevel: 2,
    fermentationLevel: 3,
    saltiness: 2,
    crunchiness: 3,
    mainIngredients: ["배추", "율무", "고춧가루", "마늘"],
    bestWith: ["밥", "죽", "건강식"],
    healthBenefits: ["피부 건강", "부종 완화", "다이어트"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Yeolmu-kimchi.jpg",
    tags: ["건강", "율무", "다이어트"],
  },
];

// 퀴즈 질문 정의
export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    scores: {
      spicy?: number;
      fermented?: number;
      crunchy?: number;
      mild?: number;
      refreshing?: number;
    };
  }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "spicy",
    question: "매운 음식을 얼마나 좋아하시나요?",
    options: [
      { id: "none", label: "매운 건 못 먹어요", scores: { spicy: 0, mild: 5 } },
      { id: "mild", label: "약간 매운 정도가 좋아요", scores: { spicy: 2, mild: 3 } },
      { id: "medium", label: "적당히 매운 게 좋아요", scores: { spicy: 3 } },
      { id: "hot", label: "매울수록 좋아요!", scores: { spicy: 5 } },
    ],
  },
  {
    id: "texture",
    question: "어떤 식감을 선호하시나요?",
    options: [
      { id: "crunchy", label: "아삭아삭한 식감", scores: { crunchy: 5 } },
      { id: "soft", label: "부드러운 식감", scores: { crunchy: 1, fermented: 3 } },
      { id: "mixed", label: "둘 다 좋아요", scores: { crunchy: 3, fermented: 2 } },
    ],
  },
  {
    id: "fermentation",
    question: "발효된 신맛을 좋아하시나요?",
    options: [
      { id: "fresh", label: "겉절이처럼 신선한 게 좋아요", scores: { fermented: 1 } },
      { id: "medium", label: "적당히 익은 게 좋아요", scores: { fermented: 3 } },
      { id: "well", label: "잘 익은 신맛이 좋아요", scores: { fermented: 5 } },
    ],
  },
  {
    id: "purpose",
    question: "김치를 주로 어떻게 드시나요?",
    options: [
      { id: "rice", label: "밥이랑 먹어요", scores: { fermented: 3, spicy: 3 } },
      { id: "meat", label: "고기랑 먹어요", scores: { crunchy: 4, spicy: 3 } },
      { id: "soup", label: "국물 요리와 먹어요", scores: { crunchy: 5, refreshing: 3 } },
      { id: "noodle", label: "면 요리와 먹어요", scores: { refreshing: 5, crunchy: 3 } },
    ],
  },
  {
    id: "season",
    question: "지금 계절에 어울리는 김치를 원하시나요?",
    options: [
      { id: "spring", label: "봄 - 산뜻한 김치", scores: { refreshing: 4, crunchy: 3 } },
      { id: "summer", label: "여름 - 시원한 김치", scores: { refreshing: 5, spicy: 1 } },
      { id: "fall", label: "가을 - 깊은 맛 김치", scores: { fermented: 4, spicy: 3 } },
      { id: "winter", label: "겨울 - 든든한 김치", scores: { fermented: 5, spicy: 4 } },
    ],
  },
  {
    id: "experience",
    question: "김치 경험은 어느 정도인가요?",
    options: [
      { id: "beginner", label: "김치 초보 - 처음 먹어봐요", scores: { mild: 4, crunchy: 3 } },
      { id: "casual", label: "가끔 먹어요", scores: { spicy: 2, fermented: 2 } },
      { id: "regular", label: "매일 먹어요", scores: { spicy: 3, fermented: 3 } },
      { id: "expert", label: "김치 없이 못 살아요!", scores: { spicy: 4, fermented: 4 } },
    ],
  },
  {
    id: "health",
    question: "건강 관심사가 있나요?",
    options: [
      { id: "probiotic", label: "장 건강/유산균이 중요해요", scores: { fermented: 5 } },
      { id: "lowsalt", label: "나트륨이 적었으면 좋겠어요", scores: { mild: 3, refreshing: 3 } },
      { id: "vitamin", label: "비타민/영양소가 풍부한 게 좋아요", scores: { crunchy: 3, refreshing: 2 } },
      { id: "none", label: "맛이 최고!", scores: { spicy: 3, fermented: 3 } },
    ],
  },
  {
    id: "cooking",
    question: "김치를 요리에 활용할 계획이 있나요?",
    options: [
      { id: "raw", label: "그냥 반찬으로 먹을 거예요", scores: { crunchy: 4, spicy: 3 } },
      { id: "stew", label: "김치찌개/전골에 넣을 거예요", scores: { fermented: 5, spicy: 4 } },
      { id: "fried", label: "김치볶음밥/전에 쓸 거예요", scores: { fermented: 4, spicy: 3 } },
      { id: "various", label: "다양하게 활용할 거예요", scores: { fermented: 3, spicy: 3, crunchy: 3 } },
    ],
  },
];

// 김치 유형 성격 분석
export interface PersonalityType {
  type: string;
  emoji: string;
  desc: string;
}

export function getPersonalityType(scores: Record<string, number>): PersonalityType {
  if ((scores.spicy || 0) >= 4 && (scores.fermented || 0) >= 4)
    return { type: "김치 마니아", emoji: "🔥", desc: "매운맛과 깊은 발효의 조화를 사랑하는 진정한 김치 애호가!" };
  if ((scores.spicy || 0) >= 4)
    return { type: "매운맛 전사", emoji: "🌶️", desc: "강렬한 매운맛이 없으면 김치가 아니죠!" };
  if ((scores.fermented || 0) >= 4)
    return { type: "발효 탐험가", emoji: "🫙", desc: "깊고 풍부한 발효의 세계를 즐기는 미식가!" };
  if ((scores.refreshing || 0) >= 4)
    return { type: "시원함 추구형", emoji: "💧", desc: "시원하고 산뜻한 김치로 입맛을 돋우는 타입!" };
  if ((scores.crunchy || 0) >= 4)
    return { type: "아삭이 러버", emoji: "✨", desc: "아삭아삭한 식감이 생명! 신선함을 사랑하는 타입!" };
  if ((scores.mild || 0) >= 4)
    return { type: "순한맛 감성", emoji: "🥗", desc: "부드럽고 순한 맛으로 김치의 매력을 느끼는 타입!" };
  return { type: "김치 올라운더", emoji: "🥬", desc: "다양한 김치를 골고루 즐기는 균형잡힌 미식가!" };
}

// 추천 결과 타입
export interface KimchiRecommendation {
  kimchi: KimchiType;
  matchScore: number; // 0-100
  matchReason: string;
}

// 점수에 따른 김치 추천 로직
export function recommendKimchi(
  scores: { spicy: number; fermented: number; crunchy: number; mild: number; refreshing: number }
): KimchiRecommendation[] {
  const kimchiScores = KIMCHI_DATA.map((kimchi) => {
    let score = 0;
    const reasons: string[] = [];

    // 매운맛 점수
    if (scores.mild > 3) {
      if (kimchi.spicyLevel === 0 || kimchi.spicyLevel === 1) {
        score += 20;
        reasons.push("순한 맛이 잘 맞아요");
      } else {
        score -= 10;
      }
    } else {
      const spicyDiff = Math.abs(kimchi.spicyLevel - (scores.spicy || 3));
      if (spicyDiff <= 1) {
        score += 15;
        if (kimchi.spicyLevel >= 4) reasons.push("좋아하시는 매운맛");
        else if (kimchi.spicyLevel >= 2) reasons.push("적당한 매운맛");
      }
    }

    // 발효 점수
    const fermentedDiff = Math.abs(kimchi.fermentationLevel - (scores.fermented || 3));
    const fermentedScore = (5 - fermentedDiff) * 4;
    score += fermentedScore;
    if (fermentedDiff <= 1 && kimchi.fermentationLevel >= 3) {
      reasons.push("깊은 발효 풍미");
    }

    // 아삭함 점수
    const crunchyDiff = Math.abs(kimchi.crunchiness - (scores.crunchy || 3));
    const crunchyScore = (5 - crunchyDiff) * 3;
    score += crunchyScore;
    if (crunchyDiff <= 1 && kimchi.crunchiness >= 4) {
      reasons.push("아삭한 식감");
    }

    // 시원함 점수 (물김치 보너스)
    if (scores.refreshing > 3) {
      if (kimchi.tags.includes("물김치") || kimchi.tags.includes("시원함")) {
        score += 15;
        reasons.push("시원한 국물");
      }
      if (kimchi.tags.includes("여름") || kimchi.tags.includes("상큼함")) {
        score += 8;
        reasons.push("산뜻한 맛");
      }
    }

    // 순한맛 보너스
    if (scores.mild > 3) {
      if (kimchi.tags.includes("순한맛") || kimchi.tags.includes("담백") || kimchi.tags.includes("부드러움")) {
        score += 10;
        reasons.push("부드럽고 담백한 맛");
      }
    }

    // 건강 태그 보너스
    if (kimchi.healthBenefits.length >= 3) {
      score += 3;
    }

    // 대표 김치 약간의 보너스 (배추김치, 깍두기 등)
    if (["baechu", "kkakdugi", "chonggak", "dongchimi", "oisobagi"].includes(kimchi.id)) {
      score += 2;
    }

    const matchReason = reasons.length > 0
      ? reasons.slice(0, 3).join(", ")
      : "다양한 맛의 균형이 좋아요";

    return { kimchi, score, matchReason };
  });

  // 점수 순으로 정렬
  kimchiScores.sort((a, b) => b.score - a.score);

  // 최고 점수를 기준으로 0-100 matchScore 계산
  const maxScore = kimchiScores[0]?.score || 1;
  const minScore = kimchiScores[kimchiScores.length - 1]?.score || 0;
  const range = maxScore - minScore || 1;

  return kimchiScores
    .slice(0, 5)
    .map((item) => ({
      kimchi: item.kimchi,
      matchScore: Math.round(((item.score - minScore) / range) * 40 + 60), // 60-100 range
      matchReason: item.matchReason,
    }));
}
