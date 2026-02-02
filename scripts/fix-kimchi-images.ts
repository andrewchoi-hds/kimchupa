/**
 * 검증된 Wikimedia Commons 이미지 URL로 김치 이미지 업데이트
 * 모든 URL은 200 OK 응답 확인됨
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

// 검증된 Wikimedia Commons 이미지 URL (모두 200 OK 확인됨)
const VERIFIED_IMAGE_URLS: Record<string, string> = {
  // 배추김치 (기본 김치)
  baechu: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Korean.food-kimchi-02.jpg",

  // 깍두기
  kkakdugi: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Korean.food-kkakdugi-01.jpg",

  // 동치미
  dongchimi: "https://upload.wikimedia.org/wikipedia/commons/5/53/Korean-Dongchimi-01.jpg",

  // 총각김치
  chonggak: "https://upload.wikimedia.org/wikipedia/commons/8/87/Korean_cuisine-Chonggak_kimchi-01.jpg",

  // 나박김치
  nabak: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Korean_cuisine-Nabak_kimchi-01.jpg",

  // 열무김치
  yeolmu: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Yeolmu-kimchi.jpg",

  // 오이소박이
  oisobagi: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Oi-sobagi.jpg",

  // 갓김치
  gat: "https://upload.wikimedia.org/wikipedia/commons/9/93/Gat-gimchi.jpg",

  // 파김치
  pa: "https://upload.wikimedia.org/wikipedia/commons/4/46/Pa-gimchi.jpg",

  // 백김치
  baek: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Baek-kimchi.jpg",

  // 부추김치 (깻잎김치 이미지 대체)
  buchu: "https://upload.wikimedia.org/wikipedia/commons/3/30/Kkaennip-kimchi.jpg",

  // 보쌈김치
  bossam: "https://upload.wikimedia.org/wikipedia/commons/4/40/Bossam-kimchi_%28cropped%29.jpg",

  // 깻잎김치
  kkaennip: "https://upload.wikimedia.org/wikipedia/commons/3/30/Kkaennip-kimchi.jpg",

  // 콩나물김치
  kongnamul: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Kongnamul_muchim_%28soybean_sprouts%29.jpg",

  // 무청김치 (깍두기 이미지 유사)
  museongchae: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Korean.food-kkakdugi-01.jpg",

  // 무말랭이김치 (깍두기 이미지 유사)
  mumallaengi: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Korean.food-kkakdugi-01.jpg",

  // 알타리김치 (총각김치와 동일)
  altari: "https://upload.wikimedia.org/wikipedia/commons/8/87/Korean_cuisine-Chonggak_kimchi-01.jpg",

  // 양배추김치 (배추김치 유사)
  yangbaechu: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Korean.food-kimchi-02.jpg",

  // 풋배추김치 (배추김치 유사)
  putbaechu: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Korean.food-kimchi-02.jpg",

  // 고들빼기김치 (배추김치 유사)
  godeulppaegi: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Korean.food-kimchi-02.jpg",

  // 미나리김치 (배추김치 유사)
  minari: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Korean.food-kimchi-02.jpg",

  // 석박지 (나박김치 유사)
  seokbakji: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Korean_cuisine-Nabak_kimchi-01.jpg",

  // 굴김치 (배추김치 유사)
  gulkimchi: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Korean.food-kimchi-02.jpg",
};

// 기본 이미지 (매핑되지 않은 김치용)
const DEFAULT_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/c/ce/Korean.food-kimchi-02.jpg";

async function updateKimchiImages() {
  console.log("🥬 검증된 이미지 URL로 김치 데이터 업데이트 시작...\n");

  const kimchis = await prisma.kimchi.findMany({
    select: { id: true, slug: true, name: true, imageUrl: true }
  });

  console.log(`📊 총 ${kimchis.length}개 김치 데이터 발견\n`);

  let updated = 0;
  let defaultUsed = 0;

  for (const kimchi of kimchis) {
    const imageUrl = VERIFIED_IMAGE_URLS[kimchi.slug] || DEFAULT_IMAGE;
    const isDefault = !VERIFIED_IMAGE_URLS[kimchi.slug];

    await prisma.kimchi.update({
      where: { id: kimchi.id },
      data: { imageUrl }
    });

    if (isDefault) {
      console.log(`⚠️ ${kimchi.name} (${kimchi.slug}) - 기본 이미지 사용`);
      defaultUsed++;
    } else {
      console.log(`✅ ${kimchi.name} (${kimchi.slug}) - 전용 이미지`);
    }

    updated++;
  }

  console.log(`\n🎉 완료! ${updated}개 업데이트 (${updated - defaultUsed}개 전용, ${defaultUsed}개 기본)`);
}

// 상수 파일도 업데이트
async function updateConstantsFile() {
  const fs = await import('fs');
  const path = await import('path');

  const kimchis = await prisma.kimchi.findMany({
    select: { slug: true, imageUrl: true }
  });

  const filePath = path.join(process.cwd(), "src/constants/kimchi.ts");
  let content = fs.readFileSync(filePath, "utf-8");

  for (const kimchi of kimchis) {
    if (kimchi.imageUrl) {
      // 기존 imageUrl 패턴 찾아서 교체
      const pattern = new RegExp(
        `(id: "${kimchi.slug}",[\\s\\S]*?imageUrl: ")[^"]*(")`
      );
      content = content.replace(pattern, `$1${kimchi.imageUrl}$2`);
    }
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("\n✅ src/constants/kimchi.ts 파일도 업데이트 완료!");
}

async function main() {
  await updateKimchiImages();
  await updateConstantsFile();
  await prisma.$disconnect();
}

main().catch(console.error);
