import { prisma } from "@kimchupa/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicProfileClient from "./PublicProfileClient";

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { nickname: true, bio: true },
  });
  if (!user) return { title: "사용자를 찾을 수 없습니다" };
  return {
    title: `${user.nickname} | 김추페`,
    description: user.bio || undefined,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      name: true,
      image: true,
      level: true,
      xp: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          comments: true,
          followers: true,
          following: true,
        },
      },
      badges: {
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
        take: 6,
      },
    },
  });

  if (!user) notFound();

  // Serialize to plain object (Date → string) for client component
  return <PublicProfileClient user={JSON.parse(JSON.stringify(user))} />;
}
