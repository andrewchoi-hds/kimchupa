"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useUserStore } from "@/stores/userStore";
import { useBookmarksStore } from "@/stores/bookmarksStore";
import { usePostsStore } from "@/stores/postsStore";
import { LEVEL_EMOJIS } from "@/constants/levels";

export default function BookmarksPage() {
  const { profile } = useUserStore();
  const { bookmarkedPosts, toggleBookmark } = useBookmarksStore();
  const { getPostById } = usePostsStore();

  // Get full post data for bookmarked posts
  const bookmarkedPostsData = bookmarkedPosts
    .map((postId) => getPostById(postId))
    .filter((post) => post !== undefined);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      recipe: { label: "레시피", color: "bg-orange-100 text-orange-700" },
      free: { label: "자유", color: "bg-zinc-100 text-zinc-700" },
      qna: { label: "Q&A", color: "bg-blue-100 text-blue-700" },
      review: { label: "리뷰", color: "bg-yellow-100 text-yellow-700" },
      diary: { label: "김치일기", color: "bg-green-100 text-green-700" },
    };
    return labels[type] || labels.free;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRemoveBookmark = (postId: string) => {
    toggleBookmark(postId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header
        user={{
          nickname: profile.nickname,
          level: profile.level,
          levelName: profile.levelName,
          xp: profile.xp,
          profileImage: profile.profileImage ?? undefined,
        }}
      />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-purple-600">
                홈
              </Link>
              <span>/</span>
              <Link href="/profile" className="hover:text-purple-600">
                프로필
              </Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-white">북마크</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                북마크
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                저장한 게시글을 모아보세요
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <span className="text-2xl">⭐</span>
                <span className="font-medium text-yellow-700 dark:text-yellow-400">
                  {bookmarkedPostsData.length}개 저장됨
                </span>
              </div>
            </div>

            {/* Bookmarked Posts */}
            {bookmarkedPostsData.length > 0 ? (
              <div className="space-y-4">
                {bookmarkedPostsData.map((post) => {
                  const typeInfo = getTypeLabel(post.type);
                  return (
                    <div
                      key={post.id}
                      className="bg-white dark:bg-zinc-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}
                            >
                              {typeInfo.label}
                            </span>
                          </div>
                          <Link href={`/community/${post.id}`}>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white hover:text-purple-600 transition-colors mb-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-zinc-500">
                            <div className="flex items-center gap-1">
                              <span>{LEVEL_EMOJIS[post.author.level]}</span>
                              <span>{post.author.nickname}</span>
                            </div>
                            <span>{formatDate(post.createdAt)}</span>
                            <span>❤️ {post.likeCount}</span>
                            <span>💬 {post.commentCount}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBookmark(post.id)}
                          className="flex-shrink-0 p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                          title="북마크 해제"
                        >
                          <span className="text-xl">⭐</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-12 text-center">
                <span className="text-5xl block mb-4">⭐</span>
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                  아직 북마크한 게시글이 없습니다
                </p>
                <p className="text-sm text-zinc-500 mb-6">
                  관심 있는 게시글을 저장하여 나중에 쉽게 찾아보세요!
                </p>
                <Link
                  href="/community"
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  커뮤니티 둘러보기
                </Link>
              </div>
            )}

            {/* Back to Profile */}
            <div className="mt-8 text-center">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              >
                ← 프로필로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
