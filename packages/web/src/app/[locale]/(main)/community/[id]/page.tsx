import type { Metadata } from "next";
import { postService } from "@kimchupa/api";
import PostDetailClient from "./PostDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  let post = null;
  try {
    post = await postService.getById(id);
  } catch {}

  if (!post) {
    return { title: "게시글을 찾을 수 없습니다" };
  }

  const title = `${post.title} | 김추페 커뮤니티`;
  const description = (post.excerpt as string) || (post.content as string).slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...((post.images as string[])?.[0] ? { images: [(post.images as string[])[0]] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  // 서버에서 초기 데이터 prefetch
  let initialPost = null;
  try {
    const post = await postService.getByIdWithViewIncrement(id);
    if (post) {
      initialPost = { success: true, data: post };
    }
  } catch {
    // DB 연결 실패 시 클라이언트에서 재시도
  }

  return <PostDetailClient postId={id} initialPost={initialPost} />;
}
