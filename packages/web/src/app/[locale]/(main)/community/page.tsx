import { postService } from "@kimchupa/api";
import CommunityClient from "./CommunityClient";

export default async function CommunityPage() {
  // 서버에서 초기 데이터 prefetch (Neon cold start를 서버에서 처리)
  let initialPosts = null;
  try {
    const result = await postService.list({ page: 1, limit: 20 });
    initialPosts = {
      success: true,
      data: result.posts,
      meta: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
    };
  } catch {
    // DB 연결 실패 시 클라이언트에서 재시도
  }

  return <CommunityClient initialPosts={initialPosts} />;
}
