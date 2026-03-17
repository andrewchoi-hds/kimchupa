"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import PageHero from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { useProfile } from "@/hooks/useProfile";
import { useBookmarks, useToggleBookmark } from "@/hooks/useBookmarks";
import { LEVEL_EMOJIS } from "@/constants/levels";
import { ArrowLeft, Bookmark, Star } from "lucide-react";

interface BookmarkPost {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  author: {
    nickname: string;
    level: number;
  };
  post?: BookmarkPost;
}

export default function BookmarksPage() {
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: bookmarksData, isLoading: bookmarksLoading } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const profile = profileData?.data;
  const bookmarks: BookmarkPost[] = bookmarksData?.data ?? [];

  const isLoading = profileLoading || bookmarksLoading;

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Normalize bookmark data - API may return bookmarks with nested `post` or flat post data
  const bookmarkedPostsData = bookmarks.map((b) => b.post ?? b);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; variant: "default" | "primary" | "secondary" | "accent" }> = {
      recipe: { label: "레시피", variant: "accent" },
      free: { label: "자유", variant: "default" },
      qna: { label: "Q&A", variant: "secondary" },
      review: { label: "리뷰", variant: "primary" },
      diary: { label: "김치일기", variant: "accent" },
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
    toggleBookmark.mutateAsync(postId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                홈
              </Link>
              <span>/</span>
              <Link href="/profile" className="hover:text-primary">
                프로필
              </Link>
              <span>/</span>
              <span className="text-foreground">북마크</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <PageHero
              title="북마크"
              description="저장한 게시글을 모아보세요"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                <span className="text-2xl">⭐</span>
                <span className="font-medium text-accent-dark">
                  {bookmarkedPostsData.length}개 저장됨
                </span>
              </div>
            </PageHero>

            {/* Bookmarked Posts */}
            {bookmarkedPostsData.length > 0 ? (
              <div className="space-y-4">
                {bookmarkedPostsData.map((post) => {
                  const typeInfo = getTypeLabel(post.type);
                  return (
                    <Card
                      key={post.id}
                      hover
                      padding="lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag variant={typeInfo.variant}>
                              {typeInfo.label}
                            </Tag>
                          </div>
                          <Link href={`/community/${post.id}`}>
                            <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors mb-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {post.author && (
                              <div className="flex items-center gap-1">
                                <span>{LEVEL_EMOJIS[post.author.level]}</span>
                                <span>{post.author.nickname}</span>
                              </div>
                            )}
                            {post.createdAt && <span>{formatDate(post.createdAt)}</span>}
                            <span>❤️ {post.likeCount ?? 0}</span>
                            <span>💬 {post.commentCount ?? 0}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBookmark(post.id)}
                          className="flex-shrink-0 p-2 text-accent hover:bg-accent/10 rounded-[var(--radius)] transition-colors"
                          title="북마크 해제"
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card padding="lg">
                <EmptyState
                  icon={Bookmark}
                  title="아직 북마크한 게시글이 없습니다"
                  description="관심 있는 게시글을 저장하여 나중에 쉽게 찾아보세요!"
                  action={
                    <Link href="/community">
                      <Button variant="primary">
                        커뮤니티 둘러보기
                      </Button>
                    </Link>
                  }
                />
              </Card>
            )}

            {/* Back to Profile */}
            <div className="mt-8 text-center">
              <Link href="/profile">
                <Button variant="ghost" icon={<ArrowLeft className="h-4 w-4" />}>
                  프로필로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
