"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useUserStore } from "@/stores/userStore";
import { useXpHistoryStore } from "@/stores/xpHistoryStore";
import { XP_REWARDS } from "@/constants/levels";

export default function XpHistoryPage() {
  const { profile } = useUserStore();
  const { history, getTodayXp, getWeekXp, getTotalXp } = useXpHistoryStore();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  const xpGuide = Object.entries(XP_REWARDS).map(([action, xp]) => {
    const labels: Record<string, { label: string; icon: string }> = {
      attendance: { label: "출석 체크", icon: "📅" },
      post_created: { label: "게시글 작성", icon: "📝" },
      comment_created: { label: "댓글 작성", icon: "💬" },
      recipe_shared: { label: "레시피 공유", icon: "🍳" },
      wiki_edit: { label: "위키 편집", icon: "📖" },
      wiki_suggestion: { label: "위키 제안", icon: "💡" },
      post_liked: { label: "좋아요 받음", icon: "❤️" },
      challenge_completed: { label: "챌린지 완료", icon: "🏆" },
    };
    return { action, xp, ...labels[action] };
  });

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
              <span className="text-zinc-900 dark:text-white">XP 기록</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                XP 획득 기록
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                경험치를 쌓아 레벨업하세요!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center">
                <p className="text-sm text-zinc-500 mb-1">오늘 획득</p>
                <p className="text-2xl font-bold text-green-600">
                  +{getTodayXp()} XP
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center">
                <p className="text-sm text-zinc-500 mb-1">이번 주</p>
                <p className="text-2xl font-bold text-blue-600">
                  +{getWeekXp()} XP
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 text-center">
                <p className="text-sm text-zinc-500 mb-1">누적 XP</p>
                <p className="text-2xl font-bold text-purple-600">
                  {profile.xp} XP
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* XP History */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                    최근 기록
                  </h2>

                  {history.length > 0 ? (
                    <div className="space-y-3">
                      {history.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-700 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold">+{entry.amount}</span>
                            </div>
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-white">
                                {entry.reason}
                              </p>
                              <p className="text-sm text-zinc-500">
                                {formatDate(entry.timestamp)}
                              </p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-green-600">
                            +{entry.amount} XP
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <span className="text-5xl block mb-4">📊</span>
                      <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                        아직 XP 획득 기록이 없습니다
                      </p>
                      <p className="text-sm text-zinc-500">
                        활동을 시작하여 경험치를 쌓아보세요!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* XP Guide */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 sticky top-4">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                    XP 획득 방법
                  </h2>
                  <div className="space-y-3">
                    {xpGuide.map((item) => (
                      <div
                        key={item.action}
                        className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-700 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-purple-600">
                          +{item.xp} XP
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      <span className="font-bold">Tip:</span> 매일 출석 체크와 커뮤니티 활동으로
                      꾸준히 XP를 쌓아보세요!
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
