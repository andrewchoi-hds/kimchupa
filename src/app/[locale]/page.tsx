"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePostsStore } from "@/stores/postsStore";
import { LEVEL_EMOJIS } from "@/constants/levels";

export default function Home() {
  const { data: session } = useSession();
  const common = useTranslations("common");
  const hero = useTranslations("hero");
  const features = useTranslations("features");
  const levels = useTranslations("levels");

  const posts = usePostsStore((state) => state.posts);
  const popularPosts = [...posts]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 3);

  // 세션에서 유저 정보 추출
  const user = session?.user
    ? {
        nickname: session.user.name || "사용자",
        level: 1,
        levelName: levels("1"),
        xp: 0,
        profileImage: session.user.image || undefined,
      }
    : null;

  // Mock stats (실제로는 API에서 가져옴)
  const stats = {
    recipes: 127,
    members: 1842,
    posts: posts.length,
    wikiEntries: 56,
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={user} />

      <main className="flex-1">
        {/* Hero Section - 김치 테마 */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500">
          {/* Floating Kimchi Emojis Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-[10%] text-6xl animate-float opacity-20">🥬</div>
            <div className="absolute top-20 right-[15%] text-5xl animate-float-delay opacity-20">🌶️</div>
            <div className="absolute bottom-20 left-[20%] text-4xl animate-float opacity-20">🧄</div>
            <div className="absolute top-1/3 right-[10%] text-7xl animate-float-delay opacity-20">🥢</div>
            <div className="absolute bottom-10 right-[25%] text-5xl animate-float opacity-20">🫙</div>
            <div className="absolute top-1/2 left-[5%] text-4xl animate-float-delay opacity-20">🧅</div>
          </div>

          <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <span className="animate-pulse">🔥</span>
                <span>대한민국 No.1 김치 커뮤니티</span>
              </div>

              {/* Main Title with Emoji */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="inline-block animate-bounce-slow">🥬</span>{" "}
                {hero("title")}{" "}
                <span className="inline-block animate-bounce-slow delay-100">🌶️</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                {hero("subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/recommendation"
                  className="px-8 py-4 bg-white text-red-600 text-lg font-bold rounded-2xl hover:bg-zinc-100 transition-all hover:scale-105 shadow-xl"
                >
                  🎯 나에게 맞는 김치 찾기
                </Link>
                <Link
                  href="/community"
                  className="px-8 py-4 bg-white/20 backdrop-blur text-white text-lg font-bold rounded-2xl hover:bg-white/30 transition-all border-2 border-white/50"
                >
                  👥 커뮤니티 참여하기
                </Link>
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                className="fill-zinc-50 dark:fill-zinc-900"
              />
            </svg>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 -mt-6 relative z-20">
          <div className="container mx-auto px-4">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-red-600 mb-1">
                    {stats.recipes}+
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">공유된 레시피</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-1">
                    {stats.members.toLocaleString()}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">김치 러버</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-1">
                    {stats.posts}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">커뮤니티 글</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-500 mb-1">
                    {stats.wikiEntries}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">김치백과 항목</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                {features("section.title")}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                김추페에서 김치의 모든 것을 경험하세요
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 - AI 추천 */}
              <Link
                href="/recommendation"
                className="group relative bg-gradient-to-br from-red-500 to-red-600 p-8 rounded-3xl text-white overflow-hidden hover:scale-[1.02] transition-all shadow-lg hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 text-[120px] opacity-10 -mr-6 -mt-6 group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-3xl">🥬</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {features("recommendation.title")}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {features("recommendation.description")}
                  </p>
                  <span className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                    시작하기 <span>→</span>
                  </span>
                </div>
              </Link>

              {/* Feature 2 - 김치백과 */}
              <Link
                href="/wiki"
                className="group relative bg-gradient-to-br from-orange-500 to-amber-500 p-8 rounded-3xl text-white overflow-hidden hover:scale-[1.02] transition-all shadow-lg hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 text-[120px] opacity-10 -mr-6 -mt-6 group-hover:scale-110 transition-transform">
                  📚
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-3xl">📖</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {features("wiki.title")}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {features("wiki.description")}
                  </p>
                  <span className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                    둘러보기 <span>→</span>
                  </span>
                </div>
              </Link>

              {/* Feature 3 - 커뮤니티 */}
              <Link
                href="/community"
                className="group relative bg-gradient-to-br from-emerald-500 to-green-600 p-8 rounded-3xl text-white overflow-hidden hover:scale-[1.02] transition-all shadow-lg hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 text-[120px] opacity-10 -mr-6 -mt-6 group-hover:scale-110 transition-transform">
                  💬
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-3xl">👥</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    {features("community.title")}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {features("community.description")}
                  </p>
                  <span className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                    참여하기 <span>→</span>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Posts Section */}
        {popularPosts.length > 0 && (
          <section className="py-16 bg-white dark:bg-zinc-800">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                    🔥 인기 게시글
                  </h2>
                  <p className="text-zinc-500 mt-1">지금 가장 핫한 이야기</p>
                </div>
                <Link
                  href="/community"
                  className="text-red-600 font-medium hover:underline"
                >
                  더보기 →
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {popularPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="group bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {index === 0 && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-bold rounded-full">
                          🏆 BEST
                        </span>
                      )}
                      <span className="text-xs text-zinc-500">
                        {LEVEL_EMOJIS[post.author.level]} {post.author.nickname}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <span>❤️ {post.likeCount}</span>
                      <span>💬 {post.commentCount}</span>
                      <span>👁️ {post.viewCount}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Level System Preview */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 text-8xl">🌱</div>
                <div className="absolute bottom-10 right-10 text-8xl">👑</div>
                <div className="absolute top-1/2 right-1/4 text-6xl">🌶️</div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {features("level.title")}
                  </h2>
                  <p className="text-white/80 max-w-xl mx-auto">
                    {features("level.description")}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  {[
                    { level: 1, emoji: "🌱", name: "김치 새싹" },
                    { level: 2, emoji: "🥬", name: "김치 입문자" },
                    { level: 3, emoji: "👨‍🍳", name: "김치 수습생" },
                    { level: 4, emoji: "🧑‍🍳", name: "김치 요리사" },
                    { level: 5, emoji: "⭐", name: "김치 장인" },
                    { level: 6, emoji: "🏆", name: "김치 달인" },
                    { level: 7, emoji: "👑", name: "김치 명인" },
                  ].map((item) => (
                    <div
                      key={item.level}
                      className="bg-white/20 backdrop-blur px-4 py-3 rounded-xl hover:bg-white/30 transition-colors cursor-default"
                    >
                      <span className="text-2xl mr-2">{item.emoji}</span>
                      <span className="font-medium">Lv.{item.level}</span>
                      <span className="text-white/70 ml-1 hidden sm:inline">{item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-zinc-100 transition-colors"
                  >
                    내 레벨 확인하기 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!session && (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-2xl mx-auto">
                <span className="text-6xl block mb-6">🥬</span>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                  {common("cta.title")}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg">
                  {common("cta.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    {common("cta.button")}
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-lg font-bold rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    이미 계정이 있어요
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}
