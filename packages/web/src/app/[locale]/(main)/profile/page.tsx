"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Modal from "@/components/ui/Modal";
import LevelBadge from "@/components/ui/LevelBadge";
import XPProgressBar from "@/components/ui/XPProgressBar";
import Badge from "@/components/ui/Badge";
import AttendanceCalendar from "@/components/ui/AttendanceCalendar";
import ProfileImageUpload from "@/components/ui/ProfileImageUpload";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { toast } from "@/stores/toastStore";
import { LEVEL_EMOJIS, USER_LEVELS, XP_REWARDS } from "@/constants/levels";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAttendance } from "@/hooks/useAttendance";
import { useBookmarks } from "@/hooks/useBookmarks";
import { usePosts } from "@/hooks/usePosts";
import { useUserBadges } from "@/hooks/useBadges";
import { useFollowStatus } from "@/hooks/useFollow";
import { FileText, MessageSquare, Bookmark, Pencil, Settings, FlaskConical } from "lucide-react";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [activeTab, setActiveTab] = useState<"posts" | "comments" | "bookmarks">("posts");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editNickname, setEditNickname] = useState("");
  const [editBio, setEditBio] = useState("");

  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: attendanceData } = useAttendance();
  const { data: bookmarksData } = useBookmarks();
  const { data: postsData } = usePosts({ limit: 3 });
  const { data: userBadgesData } = useUserBadges();
  const updateProfile = useUpdateProfile();
  const { data: followData } = useFollowStatus(profileData?.data?.id);

  const profile = profileData?.data;
  const currentStreak = attendanceData?.data?.currentStreak ?? 0;
  const bookmarks = bookmarksData?.data ?? [];
  const posts = postsData?.data ?? [];
  const userBadges = userBadgesData?.data ?? [];

  if (profileLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const earnedBadges = userBadges.filter((b: { earned?: boolean }) => b.earned !== false);
  const lockedBadges = userBadges.filter((b: { earned?: boolean }) => b.earned === false);

  const stats = {
    posts: posts.length,
    comments: 0,
    likes: 0,
    followers: followData?.data?.followerCount ?? 0,
    following: followData?.data?.followingCount ?? 0,
    streak: currentStreak,
  };

  const currentLevelInfo = USER_LEVELS.find((l) => l.level === profile.level);
  const nextLevelInfo = USER_LEVELS.find((l) => l.level === profile.level + 1);

  const handleImageChange = (image: string | null) => {
    if (image) updateProfile.mutateAsync({ image });
  };

  const handleOpenEditModal = () => {
    setEditNickname(profile.nickname ?? "");
    setEditBio(profile.bio ?? "");
    setEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        nickname: editNickname,
        bio: editBio,
      });
      toast.success(t("editSuccess"));
      setEditModalOpen(false);
    } catch {
      toast.error(t("editError"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={{
        nickname: profile.nickname,
        level: profile.level,
        levelName: profile.levelName,
        xp: profile.xp,
        profileImage: profile.profileImage ?? undefined,
      }} />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-gradient-to-r from-primary to-accent pt-12 pb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <ProfileImageUpload
                currentImage={profile.profileImage ?? undefined}
                fallbackEmoji={LEVEL_EMOJIS[profile.level]}
                onImageChange={handleImageChange}
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
                <Button variant="ghost" icon={<Pencil className="h-4 w-4" />} className="text-white hover:bg-white/20" onClick={handleOpenEditModal}>
                  {t("editProfile")}
                </Button>
                <Button variant="ghost" icon={<Settings className="h-4 w-4" />} className="text-white hover:bg-white/20">
                  {t("settings")}
                </Button>
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
              <Card
                key={stat.label}
                padding="sm"
                className="text-center"
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* XP Progress */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("level.title")}
                </h2>
                <XPProgressBar xp={profile.xp} />

                {/* Next Level Benefits */}
                {nextLevelInfo && (
                  <div className="mt-6 p-4 bg-primary-50 rounded-[var(--radius)]">
                    <p className="text-sm font-medium text-primary-dark mb-2">
                      {t("level.nextBenefits")} (Lv.{nextLevelInfo.level} {USER_LEVELS[profile.level]?.name})
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
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
              </Card>

              {/* XP History */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-foreground mb-4">
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
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-sm text-foreground">
                          {item.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      <span className="text-sm font-medium text-success">
                        +{item.xp} XP
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/profile/xp-history"
                  className="block text-center text-sm text-primary mt-4 hover:underline"
                >
                  {t("xp.history")}
                </Link>
              </Card>

              {/* XP Guide */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("xp.howTo")}
                </h2>
                <div className="space-y-2">
                  {Object.entries(XP_REWARDS).map(([action, xp]) => {
                    return (
                      <div
                        key={action}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {t(`xp.rewards.${action}`)}
                        </span>
                        <span className="font-medium text-primary">+{xp} XP</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">
                    {t("badges.title")}
                  </h2>
                  <Link
                    href="/profile/badges"
                    className="text-sm text-primary hover:underline"
                  >
                    {t("badges.viewAll")}
                  </Link>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t("badges.earned")} ({earnedBadges.length})
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {earnedBadges.map((badge: { id: string; name: string; icon: string; rarity?: string }) => (
                      <Badge
                        key={badge.id}
                        name={badge.name}
                        icon={badge.icon}
                        rarity={badge.rarity as "common" | "rare" | "epic" | "legendary" | undefined}
                        earned={true}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t("badges.locked")} ({lockedBadges.length})
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {lockedBadges.map((badge: { id: string; name: string; icon: string; rarity?: string }) => (
                      <Badge
                        key={badge.id}
                        name={badge.name}
                        icon={badge.icon}
                        rarity={badge.rarity as "common" | "rare" | "epic" | "legendary" | undefined}
                        earned={false}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Activity Tabs */}
              <Card padding="none" className="overflow-hidden">
                <div className="flex border-b border-border">
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
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === "posts" && (
                    <div className="space-y-4">
                      {posts.length > 0 ? (
                        posts.map((post: { id: string; title: string; likeCount: number; commentCount: number; viewCount: number }) => (
                          <Link
                            key={post.id}
                            href={`/community/${post.id}`}
                            className="block p-4 bg-muted rounded-[var(--radius)] hover:bg-muted/80 transition-colors"
                          >
                            <h3 className="font-medium text-foreground mb-1">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>❤️ {post.likeCount ?? 0}</span>
                              <span>💬 {post.commentCount ?? 0}</span>
                              <span>👁️ {post.viewCount ?? 0}</span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <EmptyState
                          icon={FileText}
                          title={t("activity.noPosts")}
                          action={
                            <Link href="/community/write">
                              <Button variant="primary">
                                {t("activity.firstPost")}
                              </Button>
                            </Link>
                          }
                        />
                      )}
                    </div>
                  )}

                  {activeTab === "comments" && (
                    <div className="space-y-4">
                      <EmptyState
                        icon={MessageSquare}
                        title={t("activity.noComments")}
                        action={
                          <Link href="/community">
                            <Button variant="primary">
                              {t("activity.browseCommunity")}
                            </Button>
                          </Link>
                        }
                      />
                    </div>
                  )}

                  {activeTab === "bookmarks" && (
                    <div className="space-y-4">
                      {bookmarks.length > 0 ? (
                        <>
                          {bookmarks.slice(0, 5).map((bookmark: { id: string; post?: { id: string; title: string; likeCount: number; commentCount: number; viewCount: number }; title?: string; likeCount?: number; commentCount?: number; viewCount?: number }) => {
                            const post = bookmark.post ?? bookmark;
                            return (
                              <Link
                                key={bookmark.id}
                                href={`/community/${post.id ?? bookmark.id}`}
                                className="block p-4 bg-muted rounded-[var(--radius)] hover:bg-muted/80 transition-colors"
                              >
                                <h3 className="font-medium text-foreground mb-1">
                                  {post.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>❤️ {post.likeCount ?? 0}</span>
                                  <span>💬 {post.commentCount ?? 0}</span>
                                  <span>👁️ {post.viewCount ?? 0}</span>
                                </div>
                              </Link>
                            );
                          })}
                          {bookmarks.length > 5 && (
                            <Link
                              href="/profile/bookmarks"
                              className="block text-center text-sm text-primary hover:underline py-2"
                            >
                              {t("activity.viewAll", { count: bookmarks.length })}
                            </Link>
                          )}
                        </>
                      ) : (
                        <EmptyState
                          icon={Bookmark}
                          title={t("activity.noBookmarks")}
                          action={
                            <Link href="/community">
                              <Button variant="primary">
                                {t("activity.browseCommunity")}
                              </Button>
                            </Link>
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {/* Fermentation Journal Link */}
              <Link href="/profile/fermentation">
                <Card padding="lg" hover className="group">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                      <FlaskConical className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {t("fermentationLink.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("fermentationLink.description")}
                      </p>
                    </div>
                    <span className="text-2xl">{"\ud83e\udead"}</span>
                  </div>
                </Card>
              </Link>

              {/* Attendance */}
              <AttendanceCalendar />
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title={t("editProfile")}>
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-nickname" className="block text-sm font-medium text-foreground mb-1">
              {t("editNickname")}
            </label>
            <input
              id="edit-nickname"
              type="text"
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={20}
            />
          </div>
          <div>
            <label htmlFor="edit-bio" className="block text-sm font-medium text-foreground mb-1">
              {t("editBio")}
            </label>
            <textarea
              id="edit-bio"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              maxLength={200}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              {t("editCancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              disabled={updateProfile.isPending || !editNickname.trim()}
            >
              {updateProfile.isPending ? t("editSaving") : t("editSave")}
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
