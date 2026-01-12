"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const locale = useLocale();
  const { data: session } = useSession();
  const common = useTranslations("common");
  const hero = useTranslations("hero");
  const features = useTranslations("features");
  const levels = useTranslations("levels");

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800">
      <Header user={user} />

      <main className="flex-1 container mx-auto px-4">
        {/* Hero */}
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            {hero("title")}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            {hero("subtitle")}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/recommendation"
              className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              {hero("cta")}
            </Link>
            <Link
              href="/wiki"
              className="px-8 py-4 border-2 border-red-600 text-red-600 text-lg font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              {hero("exploreCta")}
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">
            {features("section.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - AI 추천 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🥬</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {features("recommendation.title")}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {features("recommendation.description")}
              </p>
            </div>

            {/* Feature 2 - 김치백과 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {features("wiki.title")}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {features("wiki.description")}
              </p>
            </div>

            {/* Feature 3 - 커뮤니티 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {features("community.title")}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {features("community.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Level System Preview */}
        <section className="py-16">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {features("level.title")}
            </h2>
            <p className="text-center text-white/80 mb-8 max-w-xl mx-auto">
              {features("level.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { level: 1, emoji: "🌱" },
                { level: 2, emoji: "🥬" },
                { level: 3, emoji: "👨‍🍳" },
                { level: 4, emoji: "🧑‍🍳" },
                { level: 5, emoji: "⭐" },
                { level: 6, emoji: "🏆" },
                { level: 7, emoji: "👑" },
              ].map((item) => (
                <div
                  key={item.level}
                  className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium"
                >
                  {item.emoji} Lv.{item.level} {levels(String(item.level))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        {!session && (
          <section className="py-20 text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              {common("cta.title")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              {common("cta.description")}
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              {common("cta.button")}
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
