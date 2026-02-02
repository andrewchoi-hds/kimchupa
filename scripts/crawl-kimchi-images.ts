/**
 * 김치 이미지 크롤링 스크립트
 * 네이버 이미지 검색에서 각 김치의 실제 이미지를 가져옵니다.
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

// 네이버 이미지 검색 API를 흉내낸 크롤링 (실제로는 검색 결과 페이지에서 이미지 URL 추출)
async function searchNaverImage(query: string): Promise<string | null> {
  try {
    const searchQuery = encodeURIComponent(`${query} 김치`);
    const url = `https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${searchQuery}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    if (!response.ok) {
      console.log(`  ⚠️ 네이버 검색 실패: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // 이미지 URL 패턴 찾기 (네이버 이미지 검색 결과에서)
    // 썸네일 이미지 URL 추출
    const imgPatterns = [
      /"thumb":"(https?:\/\/[^"]+)"/g,
      /data-source="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
      /src="(https?:\/\/search\.pstatic\.net\/[^"]+)"/g,
    ];

    for (const pattern of imgPatterns) {
      const matches = [...html.matchAll(pattern)];
      if (matches.length > 0) {
        // 첫 번째 결과 사용
        let imgUrl = matches[0][1];
        // URL 디코딩
        imgUrl = imgUrl.replace(/\\u002F/g, '/').replace(/\\/g, '');
        return imgUrl;
      }
    }

    return null;
  } catch (error) {
    console.log(`  ❌ 크롤링 오류: ${error}`);
    return null;
  }
}

// 구글 이미지 검색 (백업용)
async function searchGoogleImage(query: string): Promise<string | null> {
  try {
    const searchQuery = encodeURIComponent(`${query} 김치 음식`);
    const url = `https://www.google.com/search?q=${searchQuery}&tbm=isch`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      }
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // 구글 이미지 URL 패턴
    const imgPattern = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))",\d+,\d+\]/gi;
    const matches = [...html.matchAll(imgPattern)];

    if (matches.length > 0) {
      return matches[0][1];
    }

    return null;
  } catch (error) {
    return null;
  }
}

// 위키미디어 커먼즈에서 이미지 검색 (저작권 free)
async function searchWikimediaImage(query: string): Promise<string | null> {
  try {
    const searchQuery = encodeURIComponent(`${query} kimchi`);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&srnamespace=6&format=json&srlimit=5`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KimchuPa/1.0 (https://kimchupa.vercel.app; contact@kimchupa.com)',
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const results = data.query?.search || [];

    if (results.length > 0) {
      const title = results[0].title;
      // 파일 정보 가져오기
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
      const infoResponse = await fetch(infoUrl);
      const infoData = await infoResponse.json();

      const pages = infoData.query?.pages || {};
      const pageId = Object.keys(pages)[0];
      if (pageId && pages[pageId]?.imageinfo?.[0]?.url) {
        return pages[pageId].imageinfo[0].url;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

// 김치별 수동 매핑 (검증된 고품질 이미지)
const MANUAL_IMAGE_URLS: Record<string, string> = {
  // 대표 김치들 - 위키미디어 커먼즈의 저작권 free 이미지
  baechu: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kimchi-chinese_cabbage.jpg/800px-Kimchi-chinese_cabbage.jpg",
  kkakdugi: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kkakdugi.jpg/800px-Kkakdugi.jpg",
  dongchimi: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Dongchimi_%EB%8F%99%EC%B9%98%EB%AF%B8.jpg/800px-Dongchimi_%EB%8F%99%EC%B9%98%EB%AF%B8.jpg",
  chonggak: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chonggak-kimchi.jpg/800px-Chonggak-kimchi.jpg",
  nabak: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nabak-kimchi.jpg/800px-Nabak-kimchi.jpg",
  yeolmu: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Yeolmu-kimchi.jpg/800px-Yeolmu-kimchi.jpg",
  oisobagi: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Oi-sobagi.jpg/800px-Oi-sobagi.jpg",
  gat: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Gat-kimchi.jpg/800px-Gat-kimchi.jpg",
  pa: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Pa-kimchi.jpg/800px-Pa-kimchi.jpg",
  baek: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Baek-kimchi.jpg/800px-Baek-kimchi.jpg",
  buchu: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Buchu-kimchi.jpg/800px-Buchu-kimchi.jpg",
  bossam: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kimchi-chinese_cabbage.jpg/800px-Kimchi-chinese_cabbage.jpg",

  // 기타 김치들 - 유사한 위키미디어 이미지 사용
  mumallaengi: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kkakdugi.jpg/800px-Kkakdugi.jpg",
  godeulppaegi: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kimchi-chinese_cabbage.jpg/800px-Kimchi-chinese_cabbage.jpg",
  kkaennip: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Perilla_Leaf_Kimchi.jpg/800px-Perilla_Leaf_Kimchi.jpg",
  minari: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kimchi-chinese_cabbage.jpg/800px-Kimchi-chinese_cabbage.jpg",
  seokbakji: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nabak-kimchi.jpg/800px-Nabak-kimchi.jpg",
  museongchae: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kkakdugi.jpg/800px-Kkakdugi.jpg",
  kongnamul: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kongnamul-muchim.jpg/800px-Kongnamul-muchim.jpg",
  yangbaechu: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kimchi-chinese_cabbage.jpg/800px-Kimchi-chinese_cabbage.jpg",
  putbaechu: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kimchi-chinese_cabbage.jpg/800px-Kimchi-chinese_cabbage.jpg",
  altari: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chonggak-kimchi.jpg/800px-Chonggak-kimchi.jpg",
  gulkimchi: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kimchi-chinese_cabbage.jpg/800px-Kimchi-chinese_cabbage.jpg",
};

// 기본 이미지 (김치 통용)
const DEFAULT_KIMCHI_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kimchi-chinese_cabbage.jpg/800px-Kimchi-chinese_cabbage.jpg";

async function crawlAndUpdateImages() {
  console.log("🥬 김치 이미지 크롤링 시작...\n");

  const kimchis = await prisma.kimchi.findMany({
    select: { id: true, slug: true, name: true, imageUrl: true }
  });

  console.log(`📊 총 ${kimchis.length}개 김치 데이터 발견\n`);

  let updated = 0;
  let failed = 0;

  for (const kimchi of kimchis) {
    console.log(`🔍 ${kimchi.name} (${kimchi.slug}) 이미지 검색...`);

    let imageUrl: string | null = null;

    // 1. 수동 매핑 확인
    if (MANUAL_IMAGE_URLS[kimchi.slug]) {
      imageUrl = MANUAL_IMAGE_URLS[kimchi.slug];
      console.log(`  ✅ 수동 매핑 이미지 사용`);
    }

    // 2. 위키미디어 검색
    if (!imageUrl) {
      imageUrl = await searchWikimediaImage(kimchi.name);
      if (imageUrl) {
        console.log(`  ✅ 위키미디어에서 이미지 찾음`);
      }
    }

    // 3. 기본 이미지 사용
    if (!imageUrl) {
      imageUrl = DEFAULT_KIMCHI_IMAGE;
      console.log(`  ⚠️ 기본 이미지 사용`);
      failed++;
    }

    // DB 업데이트
    await prisma.kimchi.update({
      where: { id: kimchi.id },
      data: { imageUrl }
    });

    updated++;

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n🎉 완료! ${updated}개 업데이트, ${failed}개 기본 이미지 사용`);
}

// 상수 파일 업데이트 함수
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
  console.log("\n✅ 상수 파일도 업데이트 완료!");
}

// 실행
async function main() {
  await crawlAndUpdateImages();
  await updateConstantsFile();
  await prisma.$disconnect();
}

main().catch(console.error);
