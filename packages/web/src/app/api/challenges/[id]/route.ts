import { NextRequest, NextResponse } from "next/server";
import { challengeService } from "@kimchupa/api";
import { auth } from "@/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const challenge = await challengeService.getById(id);
  if (!challenge) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "챌린지를 찾을 수 없습니다" } },
      { status: 404 }
    );
  }

  // If user is logged in, include their participation status
  const session = await auth();
  let participantStatus = null;
  if (session?.user?.id) {
    participantStatus = await challengeService.getParticipantStatus(id, session.user.id);
  }

  return NextResponse.json({
    success: true,
    data: {
      ...challenge,
      participantStatus: participantStatus?.status ?? null,
    },
  });
}
