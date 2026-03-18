"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, FileText, MessageSquare, Users, UserPlus, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import LevelBadge from "@/components/ui/LevelBadge";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FollowButton from "@/components/ui/FollowButton";
import { LEVEL_EMOJIS } from "@/constants/levels";
import { useProfile } from "@/hooks/useProfile";

interface UserBadge {
  id: string;
  earnedAt: string;
  badge: {
    id: string;
    name: string;
    icon: string;
    description?: string;
    rarity?: string;
  };
}

interface PublicUser {
  id: string;
  nickname: string | null;
  name: string | null;
  image: string | null;
  level: number;
  xp: number;
  bio: string | null;
  createdAt: string | Date;
  _count: {
    posts: number;
    comments: number;
    followers: number;
    following: number;
  };
  badges: UserBadge[];
}

interface Props {
  user: PublicUser;
}

export default function PublicProfileClient({ user }: Props) {
  const { data: session } = useSession();
  const { data: profileData } = useProfile();
  const profile = profileData?.data;
  const isOwnProfile = session?.user?.id === user.id;

  const headerUser =
    session?.user && profile
      ? {
          nickname: profile.nickname,
          level: profile.level,
          levelName: profile.levelName,
          xp: profile.xp,
          profileImage: profile.profileImage || undefined,
        }
      : null;

  const joinDate = new Date(user.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const levelName = `Lv.${user.level}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={headerUser} />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-gradient-to-r from-primary to-accent pt-12 pb-24">
          <div className="container mx-auto px-4">
            <Link
              href="/community"
              className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>커뮤니티로 돌아가기</span>
            </Link>

            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <Avatar
                src={user.image}
                name={user.nickname ?? user.name ?? "?"}
                size="xl"
                className="ring-4 ring-white/30"
              />

              {/* Info */}
              <div className="text-center md:text-left text-white flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">
                    {user.nickname ?? user.name ?? "사용자"}
                  </h1>
                  <LevelBadge level={user.level} levelName={levelName} size="md" />
                </div>
                {user.bio && (
                  <p className="mt-2 text-white/80 max-w-lg">{user.bio}</p>
                )}
                <p className="mt-2 text-white/60 text-sm flex items-center gap-1 justify-center md:justify-start">
                  <Calendar className="h-3.5 w-3.5" />
                  {joinDate} 가입
                </p>
              </div>

              {/* Follow Button */}
              {!isOwnProfile && session?.user && (
                <div className="md:ml-auto">
                  <FollowButton userId={user.id} size="lg" />
                </div>
              )}
              {isOwnProfile && (
                <div className="md:ml-auto">
                  <Link href="/profile">
                    <Button variant="outline" className="text-white border-white/50 hover:bg-white/20">
                      내 프로필 편집
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="container mx-auto px-4 -mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "게시글", value: user._count.posts, icon: FileText },
              { label: "댓글", value: user._count.comments, icon: MessageSquare },
              { label: "팔로워", value: user._count.followers, icon: Users },
              { label: "팔로잉", value: user._count.following, icon: UserPlus },
            ].map((stat) => (
              <Card key={stat.label} padding="sm" className="text-center">
                <stat.icon className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Level & Info */}
            <div className="space-y-6">
              {/* Level Card */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-foreground mb-4">레벨 정보</h2>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{LEVEL_EMOJIS[user.level] || "🌱"}</span>
                  <div>
                    <p className="text-lg font-bold text-foreground">Lv.{user.level}</p>
                    <p className="text-sm text-muted-foreground">{user.xp} XP</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                    style={{ width: `${Math.min((user.xp % 100) / 100 * 100, 100)}%` }}
                  />
                </div>
              </Card>

              {/* Join Info */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-foreground mb-3">회원 정보</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">가입일</span>
                    <span className="text-foreground">{joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">레벨</span>
                    <span className="text-foreground">Lv.{user.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">경험치</span>
                    <span className="text-foreground">{user.xp} XP</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Badges */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges Section */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">획득 배지</h2>
                  {user.badges.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {user.badges.length}개
                    </span>
                  )}
                </div>

                {user.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {user.badges.map((userBadge) => (
                      <Badge
                        key={userBadge.id}
                        name={userBadge.badge.name}
                        icon={userBadge.badge.icon}
                        description={userBadge.badge.description}
                        rarity={
                          userBadge.badge.rarity as
                            | "common"
                            | "rare"
                            | "epic"
                            | "legendary"
                            | undefined
                        }
                        earned={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">
                      아직 획득한 배지가 없습니다
                    </p>
                  </div>
                )}
              </Card>

              {/* Activity Summary */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-foreground mb-4">활동 요약</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-[var(--radius)]">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">게시글</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {user._count.posts}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-[var(--radius)]">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-accent-dark" />
                      <span className="text-sm font-medium text-foreground">댓글</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {user._count.comments}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-[var(--radius)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-info" />
                      <span className="text-sm font-medium text-foreground">팔로워</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {user._count.followers}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-[var(--radius)]">
                    <div className="flex items-center gap-2 mb-2">
                      <UserPlus className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-foreground">팔로잉</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {user._count.following}
                    </p>
                  </div>
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
