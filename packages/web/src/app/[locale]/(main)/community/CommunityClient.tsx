"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Inbox, Eye, Heart, MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LevelBadge from "@/components/ui/LevelBadge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import PageHero from "@/components/ui/PageHero";
import Avatar from "@/components/ui/Avatar";
import { LEVEL_EMOJIS } from "@/constants/levels";
import { useInfinitePosts } from "@/hooks/useInfinitePosts";
import { useProfile } from "@/hooks/useProfile";

type PostFilter = "all" | "recipe" | "free" | "qna" | "review" | "diary";

const POSTS_PER_PAGE = 20;

interface InitialPostsData {
  success: boolean;
  data: Record<string, unknown>[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export default function CommunityClient({ initialPosts }: { initialPosts: InitialPostsData | null }) {
  return (
    <Suspense fallback={<CommunityLoading />}>
      <CommunityContent initialPosts={initialPosts} />
    </Suspense>
  );
}

function CommunityLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    </div>
  );
}

function CommunityContent({ initialPosts }: { initialPosts: InitialPostsData | null }) {
  const t = useTranslations("community");
  const { data: session } = useSession();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const profile = profileData?.data;
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const boardParam = searchParams.get("board") as PostFilter | null;
  const validFilters: PostFilter[] = ["all", "recipe", "free", "qna", "review", "diary"];
  const initialFilter = boardParam && validFilters.includes(boardParam) ? boardParam : "all";
  const [filter, setFilter] = useState<PostFilter>(initialFilter);

  const currentFilter = boardParam && validFilters.includes(boardParam) ? boardParam : "all";
  if (filter !== currentFilter) {
    setFilter(currentFilter);
  }

  const tagParam = searchParams.get("tag") || undefined;

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfinitePosts({
    type: filter === "all" ? undefined : filter,
    limit: POSTS_PER_PAGE,
    tag: tagParam,
  });

  const posts = data?.pages?.flatMap((p: { data?: Record<string, unknown>[] }) => p.data ?? []) ?? [];
  const totalPosts = data?.pages?.[0]?.meta?.total ?? initialPosts?.meta?.total ?? 0;
  const showLoading = !data && isLoading;

  const sortedPosts = sortBy === "popular"
    ? [...posts].sort((a: { likeCount?: number }, b: { likeCount?: number }) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
    : posts;

  // Infinite scroll observer
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage(); },
      { threshold: 0.5 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filterOptions = [
    { value: "all", label: `📋 ${t("boards.all")}` },
    { value: "recipe", label: `👨‍🍳 ${t("boards.recipe")}` },
    { value: "free", label: `💬 ${t("boards.free")}` },
    { value: "qna", label: `❓ ${t("boards.qna")}` },
    { value: "review", label: `⭐ ${t("boards.review")}` },
    { value: "diary", label: `📔 ${t("boards.diary")}` },
  ];

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter as PostFilter);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (newFilter === "all") params.delete("board"); else params.set("board", newFilter);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (hours < 1) return t("time.justNow");
    if (hours < 24) return t("time.hoursAgo", { hours });
    if (days < 7) return t("time.daysAgo", { days });
    return date.toLocaleDateString();
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      recipe: { label: t("boards.recipe"), color: "text-primary" },
      free: { label: t("boards.free"), color: "text-muted-foreground" },
      qna: { label: t("boards.qna"), color: "text-info" },
      review: { label: t("boards.review"), color: "text-accent-dark" },
      diary: { label: t("boards.diary"), color: "text-secondary" },
    };
    return labels[type] || labels.free;
  };

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
        <PageHero title={t("title")} description={t("heroDescription")} className="bg-gradient-to-r from-primary to-secondary text-white">
          <Link href="/community/write">
            <Button variant="outline" size="lg" className="bg-white text-primary border-white hover:bg-white/90">
              <span>✏️</span> {t("write")}
            </Button>
          </Link>
        </PageHero>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {/* Filters */}
              <Card padding="md" className="mb-6 sticky top-16 z-30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <FilterBar options={filterOptions} value={filter} onChange={handleFilterChange} className="w-full sm:w-auto" />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "latest" | "popular")} className="px-3 py-2 bg-muted rounded-[var(--radius)] text-sm border-none text-foreground">
                    <option value="latest">{t("sort.latest")}</option>
                    <option value="popular">{t("sort.popular")}</option>
                  </select>
                </div>
              </Card>

              {/* Posts */}
              {showLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} padding="lg">
                      <div className="flex items-start gap-4 animate-pulse">
                        <div className="hidden sm:block w-12 h-12 rounded-full bg-muted" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-full" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedPosts.map((post: Record<string, unknown>) => {
                    const typeInfo = getTypeLabel(post.type as string);
                    const author = post.author as { id?: string; nickname?: string; level?: number } | undefined;
                    const rawTags = (post.tags ?? []) as Array<string | { tag: string }>;
                    const tagStrings = rawTags.map((t: string | { tag: string }) => typeof t === "string" ? t : t.tag);
                    return (
                      <Link key={post.id as string} href={`/community/${post.id}`} className="block">
                        <Card hover padding="lg">
                          <div className="flex items-start gap-4">
                            <div className="hidden sm:block">
                              {author?.id ? (
                                <Link href={`/profile/${author.id}`} onClick={(e) => e.stopPropagation()}>
                                  <Avatar name={author?.nickname ?? "?"} size="lg" />
                                </Link>
                              ) : (
                                <Avatar name={author?.nickname ?? "?"} size="lg" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Tag variant="primary" className={typeInfo.color}>{typeInfo.label}</Tag>
                                <h2 className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1">{post.title as string}</h2>
                              </div>
                              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{post.excerpt as string}</p>
                              {tagStrings.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {tagStrings.slice(0, 3).map((tag: string) => (
                                    <Tag key={tag} variant="default">#{tag}</Tag>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-3">
                                  {author?.id ? (
                                    <Link href={`/profile/${author.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 hover:text-primary transition-colors">
                                      <span>{LEVEL_EMOJIS[author?.level ?? 1]}</span>
                                      <span>{author?.nickname ?? "?"}</span>
                                    </Link>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      <span>{LEVEL_EMOJIS[author?.level ?? 1]}</span>
                                      <span>{author?.nickname ?? "?"}</span>
                                    </span>
                                  )}
                                  <span>{formatDate(post.createdAt as string)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{(post.viewCount as number) ?? 0}</span>
                                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{(post.likeCount as number) ?? 0}</span>
                                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{(post.commentCount as number) ?? 0}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} className="py-8 text-center">
                {isFetchingNextPage && (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                )}
                {!hasNextPage && posts.length > 0 && (
                  <p className="text-sm text-muted-foreground">모든 게시글을 불러왔습니다</p>
                )}
              </div>

              {!showLoading && sortedPosts.length === 0 && (
                <Card><EmptyState icon={Inbox} title={t("noResults")} description={t("noResultsHint")} /></Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {session?.user && profile && !isProfileLoading && (
                <Card padding="lg">
                  <h3 className="font-bold text-foreground mb-4">{t("sidebar.myActivity")}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar name={profile.nickname} size="lg" />
                    <div>
                      <p className="font-medium text-foreground">{profile.nickname}</p>
                      <LevelBadge level={profile.level} levelName={profile.levelName} size="sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-muted rounded-[var(--radius)]">
                      <p className="text-lg font-bold text-foreground">{profile.postCount ?? 0}</p>
                      <p className="text-xs text-muted-foreground">{t("sidebar.posts")}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-[var(--radius)]">
                      <p className="text-lg font-bold text-foreground">{profile.commentCount ?? 0}</p>
                      <p className="text-xs text-muted-foreground">{t("sidebar.comments")}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-[var(--radius)]">
                      <p className="text-lg font-bold text-foreground">{profile.likeCount ?? 0}</p>
                      <p className="text-xs text-muted-foreground">{t("sidebar.likes")}</p>
                    </div>
                  </div>
                </Card>
              )}

              {!session?.user && (
                <Card padding="lg">
                  <h3 className="font-bold text-foreground mb-4">{t("sidebar.loginPromptTitle")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t("sidebar.loginPromptDesc")}</p>
                  <Link href="/login"><Button variant="primary" className="w-full">{t("sidebar.login")}</Button></Link>
                </Card>
              )}

              <Card padding="lg" className="bg-gradient-to-br from-accent/10 to-primary/10">
                <h3 className="font-bold text-foreground mb-2">{t("sidebar.challengeTitle")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("sidebar.challengeDesc")}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t("sidebar.participants")}</span>
                  <span className="text-sm font-medium text-foreground">{t("sidebar.participantCount", { count: 127 })}</span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden"><div className="h-full bg-accent w-3/4" /></div>
              </Card>

              <Card padding="lg">
                <h3 className="font-bold text-foreground mb-4">{t("sidebar.weeklyTop")}</h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "김치마스터", level: 6, xp: 450 },
                    { rank: 2, name: "할머니손맛", level: 7, xp: 380 },
                    { rank: 3, name: "발효덕후", level: 5, xp: 320 },
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${user.rank === 1 ? "bg-warning/30 text-warning" : user.rank === 2 ? "bg-muted text-muted-foreground" : "bg-accent/20 text-accent-dark"}`}>{user.rank}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{LEVEL_EMOJIS[user.level]} Lv.{user.level}</p>
                      </div>
                      <span className="text-sm text-primary font-medium">+{user.xp} XP</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
