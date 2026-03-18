import { prisma } from "@kimchupa/db";

const postTypeLabels: Record<string, string> = {
  recipe: "레시피",
  free: "자유",
  qna: "Q&A",
  review: "리뷰",
  diary: "일기",
};

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      likeCount: true,
      commentCount: true,
      viewCount: true,
      createdAt: true,
      author: {
        select: {
          nickname: true,
          email: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">게시글 관리</h1>
        <span className="text-sm text-muted-foreground">
          총 {posts.length}개
        </span>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  제목
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  유형
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  작성자
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium text-right">
                  조회
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium text-right">
                  좋아요
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium text-right">
                  댓글
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  작성일
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-foreground max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      {postTypeLabels[post.type] || post.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {post.author.nickname || post.author.email}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-right">
                    {post.viewCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-right">
                    {post.likeCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-right">
                    {post.commentCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {post.createdAt.toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
