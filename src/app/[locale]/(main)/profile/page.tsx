"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LevelBadge from "@/components/ui/LevelBadge";
import XPProgressBar from "@/components/ui/XPProgressBar";
import Badge from "@/components/ui/Badge";
import { CURRENT_USER, MOCK_POSTS, MOCK_BADGES } from "@/constants/mockData";
import { LEVEL_EMOJIS, USER_LEVELS, XP_REWARDS } from "@/constants/levels";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "bookmarks">("posts");

  const userPosts = MOCK_POSTS.filter((post) => post.author.id === "demo").slice(0, 3);

  // Mock user badges (earned)
  const earnedBadges = MOCK_BADGES.slice(0, 5);
  const lockedBadges = MOCK_BADGES.slice(5);

  // Mock stats
  const stats = {
    posts: 12,
    comments: 48,
    likes: 156,
    followers: 23,
    following: 45,
    streak: 7,
  };

  const currentLevelInfo = USER_LEVELS.find((l) => l.level === CURRENT_USER.level);
  const nextLevelInfo = USER_LEVELS.find((l) => l.level === CURRENT_USER.level + 1);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={CURRENT_USER} />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 pt-12 pb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-6xl">{LEVEL_EMOJIS[CURRENT_USER.level]}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700">
                  📷
                </button>
              </div>

              {/* Info */}
              <div className="text-center md:text-left text-white">
                <h1 className="text-3xl font-bold mb-2">{CURRENT_USER.nickname}</h1>
                <LevelBadge
                  level={CURRENT_USER.level}
                  levelName={CURRENT_USER.levelName}
                  size="lg"
                />
                <p className="mt-3 text-white/80">
                  김치를 사랑하는 요리 입문자입니다 🥬
                </p>
              </div>

              {/* Actions */}
              <div className="md:ml-auto flex gap-2">
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                  프로필 수정
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                  설정
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="container mx-auto px-4 -mt-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: "게시글", value: stats.posts, icon: "📝" },
              { label: "댓글", value: stats.comments, icon: "💬" },
              { label: "받은 좋아요", value: stats.likes, icon: "❤️" },
              { label: "팔로워", value: stats.followers, icon: "👥" },
              { label: "팔로잉", value: stats.following, icon: "👤" },
              { label: "연속 출석", value: `${stats.streak}일`, icon: "🔥" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center shadow-sm"
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* XP Progress */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  레벨 진행도
                </h2>
                <XPProgressBar xp={CURRENT_USER.xp} />

                {/* Next Level Benefits */}
                {nextLevelInfo && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
                      다음 레벨 혜택 (Lv.{nextLevelInfo.level} {USER_LEVELS[CURRENT_USER.level]?.name})
                    </p>
                    <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                      {nextLevelInfo.permissions.canPost && !currentLevelInfo?.permissions.canPost && (
                        <li>✓ 게시글 작성 가능</li>
                      )}
                      {nextLevelInfo.permissions.canSuggestWikiEdit && !currentLevelInfo?.permissions.canSuggestWikiEdit && (
                        <li>✓ 위키 편집 제안 가능</li>
                      )}
                      {nextLevelInfo.permissions.canEditWiki && !currentLevelInfo?.permissions.canEditWiki && (
                        <li>✓ 위키 직접 편집 가능</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* XP History */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  최근 XP 획득
                </h2>
                <div className="space-y-3">
                  {[
                    { action: "출석 체크", xp: 5, time: "오늘" },
                    { action: "댓글 작성", xp: 5, time: "오늘" },
                    { action: "게시글 좋아요 받음", xp: 2, time: "어제" },
                    { action: "게시글 작성", xp: 20, time: "어제" },
                    { action: "출석 체크", xp: 5, time: "2일 전" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-700 last:border-0"
                    >
                      <div>
                        <p className="text-sm text-zinc-900 dark:text-white">
                          {item.action}
                        </p>
                        <p className="text-xs text-zinc-500">{item.time}</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        +{item.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/profile/xp-history"
                  className="block text-center text-sm text-purple-600 mt-4 hover:underline"
                >
                  전체 기록 보기
                </Link>
              </div>

              {/* XP Guide */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  XP 획득 방법
                </h2>
                <div className="space-y-2">
                  {Object.entries(XP_REWARDS).map(([action, xp]) => {
                    const labels: Record<string, string> = {
                      attendance: "출석 체크",
                      post_created: "게시글 작성",
                      comment_created: "댓글 작성",
                      recipe_shared: "레시피 공유",
                      wiki_edit: "위키 편집",
                      wiki_suggestion: "위키 제안",
                      post_liked: "좋아요 받음",
                      challenge_completed: "챌린지 완료",
                    };
                    return (
                      <div
                        key={action}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {labels[action] || action}
                        </span>
                        <span className="font-medium text-purple-600">+{xp} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    뱃지 컬렉션
                  </h2>
                  <Link
                    href="/profile/badges"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    전체 보기
                  </Link>
                </div>

                <div>
                  <p className="text-sm text-zinc-500 mb-3">
                    획득한 뱃지 ({earnedBadges.length})
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {earnedBadges.map((badge) => (
                      <Badge
                        key={badge.id}
                        name={badge.name}
                        icon={badge.icon}
                        rarity={badge.rarity}
                        earned={true}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-zinc-500 mb-3">
                    미획득 뱃지 ({lockedBadges.length})
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {lockedBadges.map((badge) => (
                      <Badge
                        key={badge.id}
                        name={badge.name}
                        icon={badge.icon}
                        rarity={badge.rarity}
                        earned={false}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Tabs */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden">
                <div className="flex border-b border-zinc-200 dark:border-zinc-700">
                  {[
                    { id: "posts", label: "내 게시글" },
                    { id: "comments", label: "내 댓글" },
                    { id: "bookmarks", label: "북마크" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex-1 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-zinc-500 hover:text-zinc-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === "posts" && (
                    <div className="space-y-4">
                      {userPosts.length > 0 ? (
                        userPosts.map((post) => (
                          <Link
                            key={post.id}
                            href={`/community/${post.id}`}
                            className="block p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <h3 className="font-medium text-zinc-900 dark:text-white mb-1">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                              <span>❤️ {post.likeCount}</span>
                              <span>💬 {post.commentCount}</span>
                              <span>👁️ {post.viewCount}</span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-12 text-zinc-500">
                          <span className="text-4xl block mb-2">📝</span>
                          <p>아직 작성한 게시글이 없습니다</p>
                          <Link
                            href="/community/write"
                            className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            첫 글 작성하기
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "comments" && (
                    <div className="text-center py-12 text-zinc-500">
                      <span className="text-4xl block mb-2">💬</span>
                      <p>작성한 댓글 목록이 표시됩니다</p>
                    </div>
                  )}

                  {activeTab === "bookmarks" && (
                    <div className="text-center py-12 text-zinc-500">
                      <span className="text-4xl block mb-2">⭐</span>
                      <p>북마크한 게시글이 표시됩니다</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  이번 달 출석
                </h2>
                <div className="grid grid-cols-7 gap-2">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const isAttended = day <= 12 && day !== 5 && day !== 8;
                    const isToday = day === 12;
                    return (
                      <div
                        key={day}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                          isToday
                            ? "bg-purple-600 text-white font-bold"
                            : isAttended
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400"
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-zinc-500 mt-4 text-center">
                  이번 달 출석: <span className="font-medium text-purple-600">10일</span> | 연속: <span className="font-medium text-orange-500">7일 🔥</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
