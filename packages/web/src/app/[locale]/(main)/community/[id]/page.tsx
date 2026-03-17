import { postService } from "@kimchupa/api";
import PostDetailClient from "./PostDetailClient";

interface Props {
  params: Promise<{ id: string }>;
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
