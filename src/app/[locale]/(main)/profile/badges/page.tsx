"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import { useUserStore } from "@/stores/userStore";
import { useBadgesStore } from "@/stores/badgesStore";

export default function BadgesPage() {
  const { profile } = useUserStore();
  const { getAllBadgesWithStatus, getEarnedCount } = useBadgesStore();

  const allBadges = getAllBadgesWithStatus();
  const earnedBadges = allBadges.filter((b) => b.earned);
  const lockedBadges = allBadges.filter((b) => !b.earned);

  const rarityOrder = ["legendary", "epic", "rare", "common"] as const;
  const sortByRarity = (badges: typeof allBadges) =>
    [...badges].sort(
      (a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
    );

  const rarityLabels = {
    common: { name: "일반", color: "text-zinc-600" },
    rare: { name: "레어", color: "text-blue-600" },
    epic: { name: "에픽", color: "text-purple-600" },
    legendary: { name: "전설", color: "text-yellow-600" },
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
              <span className="text-zinc-900 dark:text-white">뱃지</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                뱃지 컬렉션
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                활동을 통해 뱃지를 수집하세요!
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <span className="text-2xl">🏆</span>
                <span className="font-medium text-purple-700 dark:text-purple-400">
                  {getEarnedCount()} / {allBadges.length} 획득
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  컬렉션 진행도
                </span>
                <span className="text-sm text-zinc-500">
                  {Math.round((getEarnedCount() / allBadges.length) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${(getEarnedCount() / allBadges.length) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-4 text-sm">
                {Object.entries(rarityLabels).map(([rarity, info]) => {
                  const count = allBadges.filter((b) => b.rarity === rarity).length;
                  const earned = earnedBadges.filter((b) => b.rarity === rarity).length;
                  return (
                    <div key={rarity} className="text-center">
                      <span className={`font-medium ${info.color}`}>
                        {info.name}
                      </span>
                      <p className="text-zinc-500 text-xs">
                        {earned}/{count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Earned Badges */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <span>✨</span> 획득한 뱃지 ({earnedBadges.length})
              </h2>
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {sortByRarity(earnedBadges).map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-white dark:bg-zinc-800 rounded-xl p-4 flex flex-col items-center hover:shadow-lg transition-shadow"
                    >
                      <Badge
                        name={badge.name}
                        icon={badge.icon}
                        rarity={badge.rarity}
                        earned={true}
                        size="lg"
                      />
                      <p className="mt-3 text-xs text-zinc-500 text-center">
                        {badge.description}
                      </p>
                      {badge.earnedAt && (
                        <p className="mt-1 text-xs text-green-600">
                          {new Date(badge.earnedAt).toLocaleDateString("ko-KR")} 획득
                        </p>
                      )}
                      <span
                        className={`mt-2 text-xs px-2 py-0.5 rounded-full ${
                          badge.rarity === "legendary"
                            ? "bg-yellow-100 text-yellow-700"
                            : badge.rarity === "epic"
                            ? "bg-purple-100 text-purple-700"
                            : badge.rarity === "rare"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {rarityLabels[badge.rarity].name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-12 text-center">
                  <span className="text-5xl block mb-4">🎯</span>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                    아직 획득한 뱃지가 없습니다
                  </p>
                  <p className="text-sm text-zinc-500">
                    활동을 시작하여 첫 번째 뱃지를 획득해보세요!
                  </p>
                </div>
              )}
            </section>

            {/* Locked Badges */}
            <section>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🔒</span> 미획득 뱃지 ({lockedBadges.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {sortByRarity(lockedBadges).map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white dark:bg-zinc-800 rounded-xl p-4 flex flex-col items-center opacity-60"
                  >
                    <Badge
                      name={badge.name}
                      icon={badge.icon}
                      rarity={badge.rarity}
                      earned={false}
                      size="lg"
                    />
                    <p className="mt-3 text-xs text-zinc-500 text-center">
                      {badge.description}
                    </p>
                    <div className="mt-2 p-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg w-full">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
                        <span className="font-medium">획득 조건:</span>
                        <br />
                        {badge.condition}
                      </p>
                    </div>
                    <span
                      className={`mt-2 text-xs px-2 py-0.5 rounded-full ${
                        badge.rarity === "legendary"
                          ? "bg-yellow-100 text-yellow-700"
                          : badge.rarity === "epic"
                          ? "bg-purple-100 text-purple-700"
                          : badge.rarity === "rare"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {rarityLabels[badge.rarity].name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

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
