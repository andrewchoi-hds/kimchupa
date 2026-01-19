"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LevelBadge from "@/components/ui/LevelBadge";
import XPProgressBar from "@/components/ui/XPProgressBar";
import Badge from "@/components/ui/Badge";
import AttendanceCalendar from "@/components/ui/AttendanceCalendar";
import ProfileImageUpload from "@/components/ui/ProfileImageUpload";
import { LEVEL_EMOJIS, USER_LEVELS, XP_REWARDS } from "@/constants/levels";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { useUserStore } from "@/stores/userStore";
import { useBookmarksStore } from "@/stores/bookmarksStore";
import { usePostsStore } from "@/stores/postsStore";
import { useBadgesStore } from "@/stores/badgesStore";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "bookmarks">("posts");
  const currentStreak = useAttendanceStore((state) => state.currentStreak);
  const { profile, setProfileImage } = useUserStore();
  const { bookmarkedPosts } = useBookmarksStore();
  const { getPostById, getUserStats, getUserPosts, getUserComments } = usePostsStore();
  const { getAllBadgesWithStatus, getEarnedCount } = useBadgesStore();

  // Real user statistics
  const userStats = getUserStats(profile.id);
  const userPosts = getUserPosts(profile.id).slice(0, 3);
  const userComments = getUserComments(profile.id);

  // Get bookmarked posts data
  const bookmarkedPostsData = bookmarkedPosts
    .map((postId) => getPostById(postId))
    .filter((post) => post !== undefined)
    .slice(0, 5);

  // Real badge data from badgesStore
  const allBadges = getAllBadgesWithStatus();
  const earnedBadges = allBadges.filter((b) => b.earned);
  const lockedBadges = allBadges.filter((b) => !b.earned);

  // Stats with real data
  const stats = {
    posts: userStats.posts,
    comments: userStats.comments,
    likes: userStats.likesReceived,
    followers: 0, // TODO: Phase 3에서 팔로우 기능 구현
    following: 0, // TODO: Phase 3에서 팔로우 기능 구현
    streak: currentStreak,
  };

  const currentLevelInfo = USER_LEVELS.find((l) => l.level === profile.level);
  const nextLevelInfo = USER_LEVELS.find((l) => l.level === profile.level + 1);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={{
        nickname: profile.nickname,
        level: profile.level,
        levelName: profile.levelName,
        xp: profile.xp,
        profileImage: profile.profileImage ?? undefined,
      }} />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 pt-12 pb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <ProfileImageUpload
                currentImage={profile.profileImage ?? undefined}
                fallbackEmoji={LEVEL_EMOJIS[profile.level]}
                onImageChange={setProfileImage}
                size="lg"
              />

              {/* Info */}
              <div className="text-center md:text-left text-white">
                <h1 className="text-3xl font-bold mb-2">{profile.nickname}</h1>
                <LevelBadge
                  level={profile.level}
                  levelName={profile.levelName}
                  size="lg"
                />
                <p className="mt-3 text-white/80">
                  {profile.bio} 🥬
                </p>
              </div>

              {/* Actions */}
              <div className="md:ml-auto flex gap-2">
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                  {t("editProfile")}
                </button>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
                  {t("settings")}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="container mx-auto px-4 -mt-12">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: t("stats.posts"), value: stats.posts, icon: "📝" },
              { label: t("stats.comments"), value: stats.comments, icon: "💬" },
              { label: t("stats.likes"), value: stats.likes, icon: "❤️" },
              { label: t("stats.followers"), value: stats.followers, icon: "👥" },
              { label: t("stats.following"), value: stats.following, icon: "👤" },
              { label: t("stats.streak"), value: stats.streak > 0 ? `${stats.streak}` : "-", icon: "🔥" },
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
                  {t("level.title")}
                </h2>
                <XPProgressBar xp={profile.xp} />

                {/* Next Level Benefits */}
                {nextLevelInfo && (
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-2">
                      {t("level.nextBenefits")} (Lv.{nextLevelInfo.level} {USER_LEVELS[profile.level]?.name})
                    </p>
                    <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                      {nextLevelInfo.permissions.canPost && !currentLevelInfo?.permissions.canPost && (
                        <li>✓ {t("level.canPost")}</li>
                      )}
                      {nextLevelInfo.permissions.canSuggestWikiEdit && !currentLevelInfo?.permissions.canSuggestWikiEdit && (
                        <li>✓ {t("level.canSuggestWiki")}</li>
                      )}
                      {nextLevelInfo.permissions.canEditWiki && !currentLevelInfo?.permissions.canEditWiki && (
                        <li>✓ {t("level.canEditWiki")}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* XP History */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  {t("xp.title")}
                </h2>
                <div className="space-y-3">
                  {[
                    { action: t("xp.rewards.attendance"), xp: 5, time: "today" },
                    { action: t("xp.rewards.comment_created"), xp: 5, time: "today" },
                    { action: t("xp.rewards.post_liked"), xp: 2, time: "yesterday" },
                    { action: t("xp.rewards.post_created"), xp: 20, time: "yesterday" },
                    { action: t("xp.rewards.attendance"), xp: 5, time: "2d" },
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
                  {t("xp.history")}
                </Link>
              </div>

              {/* XP Guide */}
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  {t("xp.howTo")}
                </h2>
                <div className="space-y-2">
                  {Object.entries(XP_REWARDS).map(([action, xp]) => {
                    return (
                      <div
                        key={action}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {t(`xp.rewards.${action}`)}
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
                    {t("badges.title")}
                  </h2>
                  <Link
                    href="/profile/badges"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    {t("badges.viewAll")}
                  </Link>
                </div>

                <div>
                  <p className="text-sm text-zinc-500 mb-3">
                    {t("badges.earned")} ({earnedBadges.length})
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
                    {t("badges.locked")} ({lockedBadges.length})
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
                    { id: "posts", label: t("activity.posts") },
                    { id: "comments", label: t("activity.comments") },
                    { id: "bookmarks", label: t("activity.bookmarks") },
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
                          <p>{t("activity.noPosts")}</p>
                          <Link
                            href="/community/write"
                            className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            {t("activity.firstPost")}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "comments" && (
                    <div className="space-y-4">
                      {userComments.length > 0 ? (
                        userComments.slice(0, 5).map((comment) => (
                          <Link
                            key={comment.id}
                            href={`/community/${comment.postId}`}
                            className="block p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <p className="text-zinc-900 dark:text-white line-clamp-2">
                              {comment.content}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-zinc-500 mt-2">
                              <span>❤️ {comment.likeCount}</span>
                              <span className="text-xs">
                                {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                              </span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-12 text-zinc-500">
                          <span className="text-4xl block mb-2">💬</span>
                          <p>{t("activity.noComments")}</p>
                          <Link
                            href="/community"
                            className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            {t("activity.browseCommunity")}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "bookmarks" && (
                    <div className="space-y-4">
                      {bookmarkedPostsData.length > 0 ? (
                        <>
                          {bookmarkedPostsData.map((post) => (
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
                          ))}
                          {bookmarkedPosts.length > 5 && (
                            <Link
                              href="/profile/bookmarks"
                              className="block text-center text-sm text-purple-600 hover:underline py-2"
                            >
                              {t("activity.viewAll", { count: bookmarkedPosts.length })}
                            </Link>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-12 text-zinc-500">
                          <span className="text-4xl block mb-2">⭐</span>
                          <p>{t("activity.noBookmarks")}</p>
                          <Link
                            href="/community"
                            className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            {t("activity.browseCommunity")}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance */}
              <AttendanceCalendar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
