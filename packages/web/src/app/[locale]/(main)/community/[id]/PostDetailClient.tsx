"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, Bookmark, Copy, Share2, MessageCircle, Flag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LevelBadge from "@/components/ui/LevelBadge";
import ImageLightbox from "@/components/ui/ImageLightbox";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import Avatar from "@/components/ui/Avatar";
import ReportModal from "@/components/ui/ReportModal";
import { LEVEL_EMOJIS } from "@/constants/levels";
import { renderMarkdown } from "@/lib/renderMarkdown";
import { usePost, useCreateComment, useLikePost, useDeletePost } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
import { useBookmarks, useToggleBookmark } from "@/hooks/useBookmarks";
import { toast } from "@/stores/toastStore";

interface PostDetailClientProps {
  postId: string;
  initialPost: { success: boolean; data: Record<string, unknown> } | null;
}

export default function PostDetailClient({ postId, initialPost }: PostDetailClientProps) {
  const id = postId;
  const router = useRouter();
  const { data: session } = useSession();
  const { data: profileData } = useProfile();
  const profile = profileData?.data;
  const { data: postData, isLoading: isPostLoading } = usePost(id);
  const activeData = postData || initialPost;
  const post = activeData?.data as Record<string, unknown> | undefined;
  const comments = (post?.comments ?? []) as Record<string, unknown>[];
  const { data: bookmarksData } = useBookmarks();
  const bookmarkedIds: string[] = bookmarksData?.data?.map((b: { postId: string }) => b.postId) ?? [];
  const { mutateAsync: toggleBookmarkAsync } = useToggleBookmark();
  const { mutateAsync: likePostAsync } = useLikePost();
  const { mutateAsync: createCommentAsync, isPending: isCommentPending } = useCreateComment();
  const { mutateAsync: deletePostAsync } = useDeletePost();

  const [commentText, setCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // 로딩 상태
  if (isPostLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h1 className="text-2xl font-bold text-foreground mb-2">게시글을 찾을 수 없습니다</h1>
          <Link href="/community" className="text-primary hover:underline">
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
    const labels: Record<string, { label: string; variant: "default" | "primary" | "secondary" | "accent" }> = {
      recipe: { label: "레시피", variant: "primary" },
      free: { label: "자유", variant: "default" },
      qna: { label: "Q&A", variant: "accent" },
      review: { label: "리뷰", variant: "secondary" },
      diary: { label: "김치일기", variant: "accent" },
    };
    return labels[type] || labels.free;
  };

  const typeInfo = getTypeLabel((post.type as string));
  const isBookmarked = bookmarkedIds.includes(id);
  const isLiked = (post.isLiked as boolean) ?? false;
  const author = post.author as { id: string; nickname: string; level: number; levelName: string } | undefined;

  // 작성자 본인 확인
  const isAuthor = session?.user && profile && author?.id === profile.id;

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!session?.user) {
      toast.error("로그인 필요", "댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    try {
      await createCommentAsync({ postId: id, content: commentText.trim() });
      setCommentText("");
      toast.success("댓글 등록", "댓글이 등록되었습니다.");
    } catch {
      toast.error("오류", "댓글 등록에 실패했습니다.");
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    if (!session?.user) {
      toast.error("로그인 필요", "답글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    try {
      await createCommentAsync({ postId: id, content: replyText.trim(), parentId });
      setReplyText("");
      setReplyingTo(null);
      toast.success("답글 등록", "답글이 등록되었습니다.");
    } catch {
      toast.error("오류", "답글 등록에 실패했습니다.");
    }
  };

  const handleToggleLike = async () => {
    if (!session?.user) {
      toast.error("로그인 필요", "좋아요를 하려면 로그인이 필요합니다.");
      return;
    }

    try {
      await likePostAsync(id);
    } catch {
      toast.error("오류", "좋아요 처리에 실패했습니다.");
    }
  };

  const handleBookmark = async () => {
    if (!session?.user) {
      toast.error("로그인 필요", "북마크를 하려면 로그인이 필요합니다.");
      return;
    }

    try {
      const wasBookmarked = isBookmarked;
      await toggleBookmarkAsync(id);
      if (!wasBookmarked) {
        toast.success("북마크 추가", "게시글이 북마크에 추가되었습니다.");
      } else {
        toast.info("북마크 해제", "게시글이 북마크에서 제거되었습니다.");
      }
    } catch {
      toast.error("오류", "북마크 처리에 실패했습니다.");
    }
  };

  // 삭제 처리
  const handleDelete = async () => {
    try {
      await deletePostAsync(id);
      toast.success("삭제 완료", "게시글이 삭제되었습니다.");
      router.push("/community");
    } catch {
      toast.error("오류", "게시글 삭제에 실패했습니다.");
    }
  };

  // 댓글에서 최상위 댓글과 답글 분리
  const topLevelComments = comments.filter((c: { parentId?: string | null }) => !c.parentId);
  const getReplies = (commentId: string) =>
    comments.filter((c: { parentId?: string | null }) => c.parentId === commentId);

  // Header에 전달할 사용자 정보
  const headerUser = session?.user && profile ? {
    nickname: profile.nickname,
    level: profile.level,
    levelName: profile.levelName,
    xp: profile.xp,
    profileImage: profile.profileImage || undefined,
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={headerUser} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">홈</Link>
              <span>/</span>
              <Link href="/community" className="hover:text-primary">커뮤니티</Link>
              <span>/</span>
              <span className="text-foreground">{typeInfo.label}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Post */}
            <article className="bg-card rounded-[var(--radius-lg)] overflow-hidden shadow-sm border border-border">
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <Tag variant={typeInfo.variant}>{typeInfo.label}</Tag>
                  {isAuthor && (
                    <div className="flex items-center gap-2">
                      <Link href={`/community/edit/${id}`}>
                        <Button variant="ghost" size="sm">수정</Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteModal(true)}
                        className="text-error hover:text-error"
                      >
                        삭제
                      </Button>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  {(post.title as string)}
                </h1>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={author?.nickname ?? "?"} size="md" />
                    <div>
                      <p className="font-medium text-foreground">
                        {author?.nickname}
                      </p>
                      <div className="flex items-center gap-2">
                        <LevelBadge
                          level={author?.level ?? 1}
                          levelName={author?.levelName ?? ""}
                          size="sm"
                          showName={false}
                        />
                        <span className="text-sm text-muted-foreground">
                          {formatDate((post.createdAt as string))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>조회 {(post.viewCount as number)?.toLocaleString?.() ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div
                  className="prose max-w-none text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content as string) }}
                />

                {/* Image Gallery */}
                {(post.images as string[]) && (post.images as string[]).length > 0 && (
                  <div className="mt-6">
                    <div className={`grid gap-2 ${
                      (post.images as string[]).length === 1 ? "grid-cols-1" :
                      (post.images as string[]).length === 2 ? "grid-cols-2" :
                      "grid-cols-2 md:grid-cols-3"
                    }`}>
                      {(post.images as string[]).map((image: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setLightboxIndex(idx);
                            setLightboxOpen(true);
                          }}
                          className="relative aspect-square overflow-hidden rounded-[var(--radius)] group cursor-pointer"
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
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      이미지를 클릭하면 크게 볼 수 있습니다
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                  {(post.tags as Array<string | { tag: string }> ?? []).map((t: string | { tag: string }) => {
                    const tagStr = typeof t === "string" ? t : t.tag;
                    return (
                      <Link key={tagStr} href={`/community?tag=${tagStr}`}>
                        <Tag variant="primary" className="hover:opacity-80 transition-opacity">
                          #{tagStr}
                        </Tag>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleToggleLike}
                    variant={isLiked ? "primary" : "outline"}
                    size="sm"
                    icon={<Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />}
                  >
                    {(post.likeCount as number) ?? 0}
                  </Button>
                  <Button
                    onClick={handleBookmark}
                    variant={isBookmarked ? "secondary" : "outline"}
                    size="sm"
                    icon={<Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />}
                  >
                    북마크
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Copy className="h-4 w-4" />}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        toast.success("복사 완료", "링크가 클립보드에 복사되었습니다.");
                      } catch {
                        toast.error("복사 실패", "링크 복사에 실패했습니다.");
                      }
                    }}
                  >
                    복사
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Share2 className="h-4 w-4" />}
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: (post.title as string),
                          text: (post.excerpt as string),
                          url: window.location.href,
                        }).catch(() => {
                          // 사용자가 취소한 경우
                        });
                      } else {
                        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent((post.title as string))}&url=${encodeURIComponent(window.location.href)}`;
                        window.open(twitterUrl, "_blank", "width=600,height=400");
                      }
                    }}
                  >
                    공유
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Flag className="h-4 w-4" />}
                    onClick={() => {
                      if (!session?.user) {
                        toast.error("로그인 필요", "신고를 하려면 로그인이 필요합니다.");
                        return;
                      }
                      setReportModalOpen(true);
                    }}
                  >
                    신고
                  </Button>
                </div>
              </div>
            </article>

            {/* Comments */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                댓글 {comments.length}개
              </h2>

              {/* Comment Form */}
              {session?.user && profile ? (
                <Card padding="md" className="mb-6">
                  <form onSubmit={handleSubmitComment}>
                    <div className="flex gap-3">
                      <Avatar name={profile.nickname} size="md" />
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="댓글을 작성해주세요"
                          className="w-full p-3 bg-muted rounded-[var(--radius)] border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={!commentText.trim() || isCommentPending}
                            loading={isCommentPending}
                          >
                            댓글 등록
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Card>
              ) : (
                <Card padding="md" className="mb-6 text-center">
                  <p className="text-muted-foreground mb-3">
                    댓글을 작성하려면 로그인이 필요합니다.
                  </p>
                  <Link href="/login">
                    <Button variant="primary" size="sm">로그인</Button>
                  </Link>
                </Card>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {topLevelComments.length > 0 ? (
                  topLevelComments.map((comment: Record<string, unknown>) => {
                    const replies = getReplies(comment.id as string);
                    const commentAuthor = comment.author as { nickname: string; level: number; levelName: string };
                    return (
                      <div key={comment.id as string} className="space-y-2">
                        {/* Parent Comment */}
                        <Card padding="md">
                          <div className="flex gap-3">
                            <Avatar name={commentAuthor.nickname} size="md" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-foreground">
                                  {commentAuthor.nickname}
                                </span>
                                <LevelBadge
                                  level={commentAuthor.level}
                                  levelName={commentAuthor.levelName}
                                  size="sm"
                                  showName={false}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(comment.createdAt as string)}
                                </span>
                              </div>
                              <p className="text-foreground/80 mb-3">
                                {comment.content as string}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <button className="text-muted-foreground hover:text-error flex items-center gap-1 transition-colors">
                                  <Heart className="h-3.5 w-3.5" />
                                  <span>{(comment.likeCount as number) ?? 0}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (!session?.user) {
                                      toast.error("로그인 필요", "답글을 작성하려면 로그인이 필요합니다.");
                                      return;
                                    }
                                    setReplyingTo(replyingTo === (comment.id as string) ? null : (comment.id as string));
                                    setReplyText("");
                                  }}
                                  className={`transition-colors ${replyingTo === (comment.id as string) ? "text-primary font-medium" : "text-muted-foreground hover:text-primary"}`}
                                >
                                  {replyingTo === (comment.id as string) ? "취소" : "답글"}
                                </button>
                              </div>

                              {/* Reply Form */}
                              {replyingTo === (comment.id as string) && profile && (
                                <div className="mt-4 pl-4 border-l-2 border-primary/30">
                                  <div className="flex gap-3">
                                    <Avatar name={profile.nickname} size="sm" />
                                    <div className="flex-1">
                                      <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`@${commentAuthor.nickname} 에게 답글 작성...`}
                                        className="w-full p-2 bg-muted rounded-[var(--radius)] border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-muted-foreground"
                                        rows={2}
                                      />
                                      <div className="flex justify-end mt-2">
                                        <Button
                                          onClick={() => handleSubmitReply(comment.id as string)}
                                          variant="primary"
                                          size="sm"
                                          disabled={!replyText.trim() || isCommentPending}
                                          loading={isCommentPending}
                                        >
                                          답글 등록
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>

                        {/* Replies */}
                        {replies.length > 0 && (
                          <div className="ml-8 space-y-2">
                            {replies.map((reply: Record<string, unknown>) => {
                              const replyAuthor = reply.author as { nickname: string; level: number; levelName: string };
                              return (
                                <Card
                                  key={reply.id as string}
                                  padding="md"
                                  className="bg-muted/50 border-l-4 border-primary/30"
                                >
                                  <div className="flex gap-3">
                                    <Avatar name={replyAuthor.nickname} size="sm" />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-foreground text-sm">
                                          {replyAuthor.nickname}
                                        </span>
                                        <LevelBadge
                                          level={replyAuthor.level}
                                          levelName={replyAuthor.levelName}
                                          size="sm"
                                          showName={false}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                          {formatDate(reply.createdAt as string)}
                                        </span>
                                      </div>
                                      <p className="text-foreground/80 text-sm">
                                        {reply.content as string}
                                      </p>
                                      <div className="flex items-center gap-4 text-xs mt-2">
                                        <button className="text-muted-foreground hover:text-error flex items-center gap-1 transition-colors">
                                          <Heart className="h-3 w-3" />
                                          <span>{(reply.likeCount as number) ?? 0}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>첫 번째 댓글을 남겨보세요!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <Link href="/community">
                <Button variant="outline" size="sm">
                  ← 목록으로
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card padding="lg" className="max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <span className="text-5xl block mb-4">⚠️</span>
              <h3 className="text-xl font-bold text-foreground mb-2">
                게시글 삭제
              </h3>
              <p className="text-muted-foreground mb-6">
                정말로 이 게시글을 삭제하시겠습니까?
                <br />
                삭제된 게시글은 복구할 수 없습니다.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  취소
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Image Lightbox */}
      {(post.images as string[]) && (post.images as string[]).length > 0 && (
        <ImageLightbox
          images={(post.images as string[])}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        targetType="post"
        targetId={id}
      />
    </div>
  );
}
