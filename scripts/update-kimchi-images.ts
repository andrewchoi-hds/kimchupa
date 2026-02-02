/**
 * 김치 상수 파일의 이미지 URL 업데이트 스크립트
 */

import * as fs from "fs";
import * as path from "path";

// 김치별 Unsplash 이미지 URL 매핑
const KIMCHI_IMAGES: Record<string, string> = {
  // 배추 계열
  baechu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  baek: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
  putbaechu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  yangbaechu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  bossam: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",

  // 무 계열
  kkakdugi: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800",
  chonggak: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800",
  altari: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800",
  museongchae: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800",
  mumallaengi: "https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=800",

  // 물김치 계열
  dongchimi: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
  nabak: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
  seokbakji: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",

  // 오이 계열
  oisobagi: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",

  // 파/부추 계열
  pa: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  buchu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  buchukimchi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",

  // 열무/잎채소 계열
  yeolmu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  gat: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  godeulppaegi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  kkaennip: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  minari: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  sigeumchi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  sangchu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  ssuk: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  dalrae: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  naengi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  meokgalkimchi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",

  // 나물/뿌리 계열
  kongnamul: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  sukjunamul: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  goguma: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  ueong: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  doraji: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",

  // 고추/마늘 계열
  gochu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  maneul: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  ggwarigochu: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",

  // 해산물 계열
  gulkimchi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  myeolchi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  changnan: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  ojingeo: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  jogaejeotgal: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  jukkumi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  kodari: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  jeotgal: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",

  // 특수 계열
  hobak: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  gaji: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  sukchae: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  jokbal: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  sulkimchi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  jangkimchi: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
  yulmukimchi: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",

  // 지역 특산 계열
  jinju: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  andong: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800",
  geoje: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
  jeju: "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1583224944034-80ab2cdcce35?w=800";

async function updateKimchiConstants() {
  const filePath = path.join(process.cwd(), "src/constants/kimchi.ts");
  let content = fs.readFileSync(filePath, "utf-8");

  // 각 김치 ID에 대해 이미지 URL 업데이트
  for (const [id, imageUrl] of Object.entries(KIMCHI_IMAGES)) {
    // /images/kimchi/xxx.jpg 패턴을 새 URL로 교체
    const oldPattern = new RegExp(`imageUrl: "/images/kimchi/${id}\\.jpg"`, "g");
    const newValue = `imageUrl: "${imageUrl}"`;
    content = content.replace(oldPattern, newValue);
  }

  // 남은 로컬 경로도 기본 이미지로 교체
  content = content.replace(
    /imageUrl: "\/images\/kimchi\/[^"]+"/g,
    `imageUrl: "${DEFAULT_IMAGE}"`
  );

  fs.writeFileSync(filePath, content, "utf-8");
  console.log("✅ 김치 상수 파일 이미지 URL 업데이트 완료!");
}

updateKimchiConstants();
