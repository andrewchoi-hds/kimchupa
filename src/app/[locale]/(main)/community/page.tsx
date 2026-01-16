"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LevelBadge from "@/components/ui/LevelBadge";
import { type MockPost } from "@/constants/mockData";
import { LEVEL_EMOJIS } from "@/constants/levels";
import { usePostsStore } from "@/stores/postsStore";
import { useUserStore } from "@/stores/userStore";

type PostFilter = "all" | "recipe" | "free" | "qna" | "review" | "diary";

const POSTS_PER_PAGE = 20;

// Wrapper component with Suspense for useSearchParams
export default function CommunityPage() {
  return (
    <Suspense fallback={<CommunityPageLoading />}>
      <CommunityPageContent />
    </Suspense>
  );
}

function CommunityPageLoading() {
  const t = useTranslations("common");
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-zinc-600 dark:text-zinc-400">{t("loading")}</p>
      </div>
    </div>
  );
}

function CommunityPageContent() {
  const t = useTranslations("community");
  const { data: session } = useSession();
  const { profile, initFromSession } = useUserStore();
  const posts = usePostsStore((state) => state.posts);
  const getPopularTags = usePostsStore((state) => state.getPopularTags);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  // URL 쿼리 파라미터로 페이지 및 필터 관리
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  // board 쿼리 파라미터에서 필터 읽기
  const boardParam = searchParams.get("board") as PostFilter | null;
  const [filter, setFilter] = useState<PostFilter>(boardParam || "all");

  // board 파라미터 변경 시 필터 동기화
  useEffect(() => {
    const validFilters: PostFilter[] = ["all", "recipe", "free", "qna", "review", "diary"];
    if (boardParam && validFilters.includes(boardParam)) {
      setFilter(boardParam);
    } else if (!boardParam) {
      setFilter("all");
    }
  }, [boardParam]);

  // 세션 변경 시 프로필 동기화
  useEffect(() => {
    initFromSession(session);
  }, [session, initFromSession]);

  const filters: { id: PostFilter; label: string; emoji: string }[] = [
    { id: "all", label: t("boards.all"), emoji: "📋" },
    { id: "recipe", label: t("boards.recipe"), emoji: "👨‍🍳" },
    { id: "free", label: t("boards.free"), emoji: "💬" },
    { id: "qna", label: t("boards.qna"), emoji: "❓" },
    { id: "review", label: t("boards.review"), emoji: "⭐" },
    { id: "diary", label: t("boards.diary"), emoji: "📔" },
  ];

  // 필터링 및 정렬
  const filteredAndSortedPosts = posts.filter(
    (post) => filter === "all" || post.type === filter
  ).sort((a, b) => {
    if (sortBy === "popular") {
      return b.likeCount - a.likeCount;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 페이지네이션 계산
  const totalPosts = filteredAndSortedPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredAndSortedPosts.slice(startIndex, endIndex);

  // 페이지 변경 함수
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // 페이지 번호 배열 생성 (현재 페이지 주변 5개)
  const getPageNumbers = () => {
    const pages: number[] = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // 시작이나 끝에 가까우면 5개 유지
    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 필터 변경 시 URL 업데이트 및 첫 페이지로 이동
  const handleFilterChange = (newFilter: PostFilter) => {
    setFilter(newFilter);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (newFilter === "all") {
      params.delete("board");
    } else {
      params.set("board", newFilter);
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return t("time.justNow");
    if (hours < 24) return t("time.hoursAgo", { hours });
    if (days < 7) return t("time.daysAgo", { days });
    return date.toLocaleDateString();
  };

  const getTypeLabel = (type: MockPost["type"]) => {
    const labels = {
      recipe: { label: t("boards.recipe"), color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
      free: { label: t("boards.free"), color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300" },
      qna: { label: t("boards.qna"), color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      review: { label: t("boards.review"), color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
      diary: { label: t("boards.diary"), color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    };
    return labels[type];
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
        {/* Hero */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
              <p className="text-lg text-white/90 mb-6">
                {t("heroDescription")}
              </p>
              <Link
                href="/community/write"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
              >
                <span>✏️</span>
                {t("write")}
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Filters */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-6 sticky top-16 z-30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                    {filters.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleFilterChange(f.id)}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                          filter === f.id
                            ? "bg-purple-600 text-white"
                            : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                        }`}
                      >
                        <span>{f.emoji}</span>
                        <span>{f.label}</span>
                      </button>
                    ))}
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "latest" | "popular")}
                    className="px-3 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg text-sm border-none"
                  >
                    <option value="latest">{t("sort.latest")}</option>
                    <option value="popular">{t("sort.popular")}</option>
                  </select>
                </div>
              </div>

              {/* Posts List */}
              <div className="space-y-4">
                {paginatedPosts.map((post) => {
                  const typeInfo = getTypeLabel(post.type);
                  return (
                    <Link
                      key={post.id}
                      href={`/community/${post.id}`}
                      className="block bg-white dark:bg-zinc-800 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        {/* Author Avatar */}
                        <div className="hidden sm:flex w-12 h-12 bg-zinc-100 dark:bg-zinc-700 rounded-full items-center justify-center flex-shrink-0">
                          <span className="text-xl">
                            {LEVEL_EMOJIS[post.author.level] || "🌱"}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeInfo.color}`}>
                              {typeInfo.label}
                            </span>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white hover:text-purple-600 transition-colors line-clamp-1">
                              {post.title}
                            </h2>
                          </div>

                          {/* Excerpt */}
                          <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-500 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm text-zinc-500">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <span>{LEVEL_EMOJIS[post.author.level]}</span>
                                <span>{post.author.nickname}</span>
                              </span>
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <span>👁️</span>
                                <span>{post.viewCount.toLocaleString()}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span>❤️</span>
                                <span>{post.likeCount}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span>💬</span>
                                <span>{post.commentCount}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center mt-8 gap-4">
                  <p className="text-sm text-zinc-500">
                    {t("pagination.showing", { total: totalPosts, start: startIndex + 1, end: Math.min(endIndex, totalPosts) })}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === 1
                          ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      ← {t("pagination.prev")}
                    </button>
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          page === currentPage
                            ? "bg-purple-600 text-white"
                            : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === totalPages
                          ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {t("pagination.next")} →
                    </button>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {paginatedPosts.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-xl">
                  <span className="text-5xl block mb-4">📭</span>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                    {t("noResults")}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {t("noResultsHint")}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* My Activity */}
              {session?.user && (
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">
                    {t("sidebar.myActivity")}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xl">{LEVEL_EMOJIS[profile.level]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {profile.nickname}
                      </p>
                      <LevelBadge
                        level={profile.level}
                        levelName={profile.levelName}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">12</p>
                      <p className="text-xs text-zinc-500">{t("sidebar.posts")}</p>
                    </div>
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">48</p>
                      <p className="text-xs text-zinc-500">{t("sidebar.comments")}</p>
                    </div>
                    <div className="p-2 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">156</p>
                      <p className="text-xs text-zinc-500">{t("sidebar.likes")}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Login prompt for non-logged in users */}
              {!session?.user && (
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                  <h3 className="font-bold text-zinc-900 dark:text-white mb-4">
                    {t("sidebar.loginPromptTitle")}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    {t("sidebar.loginPromptDesc")}
                  </p>
                  <Link
                    href="/login"
                    className="block text-center py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    {t("sidebar.login")}
                  </Link>
                </div>
              )}

              {/* Popular Tags */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-4">
                  {t("sidebar.popularTags")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getPopularTags(10).map(({ tag, count }) => (
                    <Link
                      key={tag}
                      href={`/community?tag=${tag}`}
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-full text-sm hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-1"
                      title={t("sidebar.postsCount", { count })}
                    >
                      #{tag}
                      <span className="text-xs text-zinc-400">({count})</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Today's Challenge */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-2">
                  {t("sidebar.challengeTitle")}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  {t("sidebar.challengeDesc")}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-500">{t("sidebar.participants")}</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {t("sidebar.participantCount", { count: 127 })}
                  </span>
                </div>
                <div className="h-2 bg-white dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-3/4" />
                </div>
                <Link
                  href="/community/challenge"
                  className="block mt-4 text-center py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  {t("sidebar.participate")}
                </Link>
              </div>

              {/* Ranking */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-zinc-900 dark:text-white mb-4">
                  {t("sidebar.weeklyTop")}
                </h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "김치마스터", level: 6, xp: 450 },
                    { rank: 2, name: "할머니손맛", level: 7, xp: 380 },
                    { rank: 3, name: "발효덕후", level: 5, xp: 320 },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center gap-3"
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.rank === 1 ? "bg-yellow-400 text-yellow-900" :
                        user.rank === 2 ? "bg-zinc-300 text-zinc-700" :
                        "bg-orange-300 text-orange-800"
                      }`}>
                        {user.rank}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {LEVEL_EMOJIS[user.level]} Lv.{user.level}
                        </p>
                      </div>
                      <span className="text-sm text-purple-600 font-medium">
                        +{user.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
