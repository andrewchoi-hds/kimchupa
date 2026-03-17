import { PrismaClient, PostType, KimchiDexStatus } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { KIMCHI_DATA } from "@kimchupa/shared/src/constants/kimchi";
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
      const details = KIMCHI_DETAILS[kimchi.id] || {};

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

  console.log("🎉 Database seed completed successfully!");
  console.log(`
Summary:
- Users: ${users.length}
- Kimchi types: ${kimchiEntries.length}
- Badges: ${badges.length}
- Posts: ${validPosts.length}
- Comments: ${commentCount}
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
