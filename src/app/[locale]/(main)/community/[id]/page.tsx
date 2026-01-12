"use client";

import { useState, use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LevelBadge from "@/components/ui/LevelBadge";
import { MOCK_POSTS, MOCK_COMMENTS, CURRENT_USER } from "@/constants/mockData";
import { LEVEL_EMOJIS } from "@/constants/levels";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");

  const post = MOCK_POSTS.find((p) => p.id === id);
  const comments = MOCK_COMMENTS.filter((c) => c.postId === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold mb-2">게시글을 찾을 수 없습니다</h1>
          <Link href="/community" className="text-purple-600 hover:underline">
            커뮤니티로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const typeInfo = getTypeLabel(post.type);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    // TODO: Submit comment
    alert("댓글이 등록되었습니다! (데모)");
    setCommentText("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={CURRENT_USER} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-purple-600">홈</Link>
              <span>/</span>
              <Link href="/community" className="hover:text-purple-600">커뮤니티</Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-white">{typeInfo.label}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Post */}
            <article className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                  {post.title}
                </h1>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                      <span className="text-lg">{LEVEL_EMOJIS[post.author.level]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {post.author.nickname}
                      </p>
                      <div className="flex items-center gap-2">
                        <LevelBadge
                          level={post.author.level}
                          levelName={post.author.levelName}
                          size="sm"
                          showName={false}
                        />
                        <span className="text-sm text-zinc-500">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>조회 {post.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  {post.content.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-zinc-700 dark:text-zinc-300">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/community?tag=${tag}`}
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-full text-sm hover:bg-purple-100 hover:text-purple-600 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span>{isLiked ? "❤️" : "🤍"}</span>
                    <span>{post.likeCount + (isLiked ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isBookmarked
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span>{isBookmarked ? "⭐" : "☆"}</span>
                    <span>북마크</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                    📋 복사
                  </button>
                  <button className="p-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                    📤 공유
                  </button>
                </div>
              </div>
            </article>

            {/* Comments */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                댓글 {comments.length}개
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>{LEVEL_EMOJIS[CURRENT_USER.level]}</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="댓글을 작성해주세요 (Lv.2 이상)"
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!commentText.trim()}
                      >
                        댓글 등록
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white dark:bg-zinc-800 rounded-xl p-4"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span>{LEVEL_EMOJIS[comment.author.level]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-zinc-900 dark:text-white">
                              {comment.author.nickname}
                            </span>
                            <LevelBadge
                              level={comment.author.level}
                              levelName={comment.author.levelName}
                              size="sm"
                              showName={false}
                            />
                            <span className="text-sm text-zinc-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="text-zinc-500 hover:text-red-500 flex items-center gap-1">
                              <span>❤️</span>
                              <span>{comment.likeCount}</span>
                            </button>
                            <button className="text-zinc-500 hover:text-purple-500">
                              답글
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    <span className="text-4xl block mb-2">💬</span>
                    <p>첫 번째 댓글을 남겨보세요!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <Link
                href="/community"
                className="px-4 py-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                ← 목록으로
              </Link>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  이전 글
                </button>
                <button className="px-4 py-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  다음 글
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
