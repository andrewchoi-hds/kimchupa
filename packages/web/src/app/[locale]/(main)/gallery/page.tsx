import { prisma } from "@kimchupa/db";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  let posts = null;
  try {
    posts = await prisma.post.findMany({
      where: { images: { isEmpty: false } },
      select: {
        id: true,
        title: true,
        images: true,
        likeCount: true,
        commentCount: true,
        author: { select: { nickname: true, image: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    // DB 연결 실패 시 클라이언트에서 빈 상태 표시
  }

  return <GalleryClient initialPosts={JSON.parse(JSON.stringify(posts ?? []))} />;
}
