"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LevelBadge from "@/components/ui/LevelBadge";
import ImageLightbox from "@/components/ui/ImageLightbox";
import { LEVEL_EMOJIS } from "@/constants/levels";
import { usePostsStore } from "@/stores/postsStore";
import { useUserStore } from "@/stores/userStore";
import { useBookmarksStore } from "@/stores/bookmarksStore";
import { toast } from "@/stores/toastStore";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const { profile, initFromSession, addXp } = useUserStore();
  const { isBookmarked, toggleBookmark } = useBookmarksStore();
  const [commentText, setCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // 답글 중인 댓글 ID
  const [replyText, setReplyText] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // 세션 변경 시 프로필 동기화
  useEffect(() => {
    initFromSession(session);
  }, [session, initFromSession]);

  const {
    getPostById,
    getCommentsByPostId,
    getReplies,
    addComment,
    toggleLike,
    incrementViewCount,
    isLikedByUser,
    getAdjacentPosts,
    deletePost,
  } = usePostsStore();
  const post = getPostById(id);
  const comments = getCommentsByPostId(id);

  // Increment view count on mount
  useEffect(() => {
    incrementViewCount(id);
  }, [id, incrementViewCount]);

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

    if (!session?.user) {
      toast.error("로그인 필요", "댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    // 현재 사용자 정보를 author로 전달
    const author = {
      id: profile.id,
      nickname: profile.nickname,
      level: profile.level,
      levelName: profile.levelName,
      xp: profile.xp,
    };

    addComment(id, commentText.trim(), author);
    setCommentText("");

    // 댓글 작성 XP
    addXp(5);
    toast.xp(5, "댓글 작성");
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyText.trim()) return;

    if (!session?.user) {
      toast.error("로그인 필요", "답글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    const author = {
      id: profile.id,
      nickname: profile.nickname,
      level: profile.level,
      levelName: profile.levelName,
      xp: profile.xp,
    };

    addComment(id, replyText.trim(), author, parentId);
    setReplyText("");
    setReplyingTo(null);

    addXp(5);
    toast.xp(5, "답글 작성");
  };

  const handleToggleLike = () => {
    if (!session?.user) {
      toast.error("로그인 필요", "좋아요를 하려면 로그인이 필요합니다.");
      return;
    }

    const isNowLiked = toggleLike(id, profile.id);
    if (isNowLiked) {
      toast.success("좋아요", "게시글에 좋아요를 눌렀습니다.");
    }
  };

  // 이전/다음 글 데이터
  const { prev: prevPost, next: nextPost } = getAdjacentPosts(id);
  const isLiked = isLikedByUser(id, profile.id);

  // 작성자 본인 확인
  const isAuthor = session?.user && post.author.id === profile.id;

  // 삭제 처리
  const handleDelete = () => {
    deletePost(id);
    toast.success("삭제 완료", "게시글이 삭제되었습니다.");
    router.push("/community");
  };

  // Header에 전달할 사용자 정보
  const headerUser = session?.user ? {
    nickname: profile.nickname,
    level: profile.level,
    levelName: profile.levelName,
    xp: profile.xp,
    profileImage: profile.profileImage || undefined,
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={headerUser} />

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
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  {isAuthor && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/community/edit/${id}`}
                        className="px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-3 py-1 text-sm text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  )}
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

                {/* Image Gallery */}
                {post.images && post.images.length > 0 && (
                  <div className="mt-6">
                    <div className={`grid gap-2 ${
                      post.images.length === 1 ? "grid-cols-1" :
                      post.images.length === 2 ? "grid-cols-2" :
                      "grid-cols-2 md:grid-cols-3"
                    }`}>
                      {post.images.map((image, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setLightboxIndex(idx);
                            setLightboxOpen(true);
                          }}
                          className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                        >
                          <img
                            src={image}
                            alt={`게시글 이미지 ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                              🔍
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-2 text-center">
                      이미지를 클릭하면 크게 볼 수 있습니다
                    </p>
                  </div>
                )}

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
                    onClick={handleToggleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span>{isLiked ? "❤️" : "🤍"}</span>
                    <span>{post.likeCount}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!session?.user) {
                        toast.error("로그인 필요", "북마크를 하려면 로그인이 필요합니다.");
                        return;
                      }
                      const wasBookmarked = isBookmarked(id);
                      toggleBookmark(id);
                      if (!wasBookmarked) {
                        toast.success("북마크 추가", "게시글이 북마크에 추가되었습니다.");
                      } else {
                        toast.info("북마크 해제", "게시글이 북마크에서 제거되었습니다.");
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isBookmarked(id)
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
                        : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span>{isBookmarked(id) ? "⭐" : "☆"}</span>
                    <span>북마크</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        toast.success("복사 완료", "링크가 클립보드에 복사되었습니다.");
                      } catch {
                        toast.error("복사 실패", "링크 복사에 실패했습니다.");
                      }
                    }}
                    className="p-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    📋 복사
                  </button>
                  <button
                    onClick={() => {
                      // 카카오톡 공유 (Kakao SDK 없이 share URL 사용)
                      const shareUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=YOUR_KAKAO_APP_KEY&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`;
                      // 실제 환경에서는 Kakao SDK 사용 권장
                      // 대체: Web Share API 사용
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          text: post.excerpt,
                          url: window.location.href,
                        }).catch(() => {
                          // 사용자가 취소한 경우
                        });
                      } else {
                        // Web Share API 미지원 시 트위터 공유
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
                        window.open(twitterUrl, "_blank", "width=600,height=400");
                      }
                    }}
                    className="p-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
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
              {session?.user ? (
                <form onSubmit={handleSubmitComment} className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>{LEVEL_EMOJIS[profile.level]}</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="댓글을 작성해주세요"
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
              ) : (
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-6 text-center">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                    댓글을 작성하려면 로그인이 필요합니다.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    로그인
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => {
                    const replies = getReplies(comment.id);
                    return (
                      <div key={comment.id} className="space-y-2">
                        {/* Parent Comment */}
                        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4">
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
                                <button
                                  onClick={() => {
                                    if (!session?.user) {
                                      toast.error("로그인 필요", "답글을 작성하려면 로그인이 필요합니다.");
                                      return;
                                    }
                                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                    setReplyText("");
                                  }}
                                  className={`hover:text-purple-500 ${replyingTo === comment.id ? "text-purple-600 font-medium" : "text-zinc-500"}`}
                                >
                                  {replyingTo === comment.id ? "취소" : "답글"}
                                </button>
                              </div>

                              {/* Reply Form */}
                              {replyingTo === comment.id && (
                                <div className="mt-4 pl-4 border-l-2 border-purple-300">
                                  <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-sm">{LEVEL_EMOJIS[profile.level]}</span>
                                    </div>
                                    <div className="flex-1">
                                      <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`@${comment.author.nickname} 에게 답글 작성...`}
                                        className="w-full p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                        rows={2}
                                      />
                                      <div className="flex justify-end mt-2">
                                        <button
                                          onClick={() => handleSubmitReply(comment.id)}
                                          className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                          disabled={!replyText.trim()}
                                        >
                                          답글 등록
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Replies */}
                        {replies.length > 0 && (
                          <div className="ml-8 space-y-2">
                            {replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border-l-4 border-purple-300"
                              >
                                <div className="flex gap-3">
                                  <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm">{LEVEL_EMOJIS[reply.author.level]}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-medium text-zinc-900 dark:text-white text-sm">
                                        {reply.author.nickname}
                                      </span>
                                      <LevelBadge
                                        level={reply.author.level}
                                        levelName={reply.author.levelName}
                                        size="sm"
                                        showName={false}
                                      />
                                      <span className="text-xs text-zinc-500">
                                        {formatDate(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                                      {reply.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs mt-2">
                                      <button className="text-zinc-500 hover:text-red-500 flex items-center gap-1">
                                        <span>❤️</span>
                                        <span>{reply.likeCount}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
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
                {prevPost ? (
                  <Link
                    href={`/community/${prevPost.id}`}
                    className="px-4 py-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    title={prevPost.title}
                  >
                    ← 이전 글
                  </Link>
                ) : (
                  <span className="px-4 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg text-zinc-400 cursor-not-allowed">
                    ← 이전 글
                  </span>
                )}
                {nextPost ? (
                  <Link
                    href={`/community/${nextPost.id}`}
                    className="px-4 py-2 bg-white dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    title={nextPost.title}
                  >
                    다음 글 →
                  </Link>
                ) : (
                  <span className="px-4 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg text-zinc-400 cursor-not-allowed">
                    다음 글 →
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <span className="text-5xl block mb-4">⚠️</span>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                게시글 삭제
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                정말로 이 게시글을 삭제하시겠습니까?
                <br />
                삭제된 게시글은 복구할 수 없습니다.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {post.images && post.images.length > 0 && (
        <ImageLightbox
          images={post.images}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
