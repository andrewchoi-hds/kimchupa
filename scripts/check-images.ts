import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function check() {
  const kimchis = await prisma.kimchi.findMany({
    select: { name: true, imageUrl: true },
    take: 15
  });

  console.log("김치 이미지 URL 확인:\n");

  let withImage = 0;
  let withoutImage = 0;

  kimchis.forEach(k => {
    const hasImage = k.imageUrl && !k.imageUrl.startsWith("/images/");
    if (hasImage) withImage++;
    else withoutImage++;
    console.log(`- ${k.name}: ${k.imageUrl || "없음"}`);
  });

  console.log(`\n총 ${kimchis.length}개 중 외부 이미지: ${withImage}개, 로컬 경로: ${withoutImage}개`);

  await prisma.$disconnect();
}

check();
