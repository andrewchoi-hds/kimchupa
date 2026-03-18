import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@kimchupa/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
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

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다" },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: user });
}
