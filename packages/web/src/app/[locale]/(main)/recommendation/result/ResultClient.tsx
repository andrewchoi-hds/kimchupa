"use client";

import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShareButtons from "@/components/ui/ShareButtons";
import { shareResult } from "@/lib/share";
import { toast } from "@/stores/toastStore";

interface ResultClientProps {
  params: Record<string, string>;
}

function ResultCard({ params }: ResultClientProps) {
  const type = params.type || "김치 올라운더";
  const emoji = params.emoji || "🥬";
  const desc = params.desc || "나에게 맞는 김치를 찾았어요!";
  const kimchiNames = params.kimchi ? params.kimchi.split(",") : [];
  const scores = params.scores
    ? params.scores.split(",").map(Number)
    : [];

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  const handleShare = async () => {
    const result = await shareResult({
      type,
      emoji,
      desc,
      kimchiNames,
      scores,
    });
    if (result?.copied) {
      toast.success("링크가 복사되었어요!", "친구에게 공유해보세요");
    }
  };

  // Medal emojis for rank
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Result Card */}
            <div className="bg-card rounded-[var(--radius-lg)] shadow-2xl overflow-hidden">
              {/* Card Header - Gradient Banner */}
              <div className="bg-gradient-to-r from-primary via-orange-500 to-yellow-500 p-8 text-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-5xl">{emoji}</span>
                  </div>
                  <p className="text-white/80 text-sm font-medium mb-1">
                    나의 김치 유형은
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {type}
                  </h1>
                  <p className="text-white/90 text-base max-w-md mx-auto leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Kimchi Recommendations */}
              {kimchiNames.length > 0 && (
                <div className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                    <span>🥬</span>
                    <span>추천 김치 TOP {kimchiNames.length}</span>
                  </h2>

                  <div className="space-y-3">
                    {kimchiNames.map((name, index) => {
                      const score = scores[index];
                      const medal = medals[index] || "🏅";
                      const barWidth = score ? `${Math.min(score, 100)}%` : "0%";

                      // Gradient colors based on rank
                      const barColors = [
                        "from-red-500 to-orange-500",
                        "from-orange-400 to-amber-400",
                        "from-amber-400 to-yellow-400",
                      ];

                      return (
                        <div
                          key={name}
                          className={`p-4 rounded-[var(--radius)] border transition-all ${
                            index === 0
                              ? "border-red-200 bg-gradient-to-r from-red-50/50 to-orange-50/50 shadow-sm"
                              : "border-border bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{medal}</span>
                              <span
                                className={`font-bold ${
                                  index === 0
                                    ? "text-lg text-foreground"
                                    : "text-base text-foreground"
                                }`}
                              >
                                {name.trim()}
                              </span>
                            </div>
                            {score > 0 && (
                              <span
                                className={`text-sm font-bold ${
                                  index === 0
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {score}%
                              </span>
                            )}
                          </div>

                          {/* Score bar */}
                          {score > 0 && (
                            <div className="h-2.5 bg-border/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${
                                  barColors[index] || barColors[2]
                                } rounded-full transition-all duration-700 ease-out`}
                                style={{ width: barWidth }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border mx-6" />

              {/* Actions */}
              <div className="p-6 md:p-8 space-y-4">
                {/* Primary CTA */}
                <Link
                  href="/recommendation"
                  className="block w-full py-4 text-center bg-gradient-to-r from-primary to-orange-500 text-white text-lg font-bold rounded-[var(--radius)] hover:from-primary-dark hover:to-orange-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01]"
                >
                  🎯 나도 해보기
                </Link>

                {/* Share button using Web Share API */}
                <button
                  onClick={handleShare}
                  className="block w-full py-4 text-center border-2 border-border text-foreground rounded-[var(--radius)] hover:bg-muted transition-colors font-medium"
                >
                  📤 결과 공유하기
                </button>
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-8 p-6 bg-card rounded-[var(--radius-lg)] shadow-lg">
              <p className="text-center text-muted-foreground font-medium mb-4">
                친구에게 공유하기
              </p>
              <ShareButtons
                url={shareUrl}
                title={`${emoji} 나의 김치 유형: ${type}`}
                description={`${desc} 나에게 맞는 김치를 찾아봤어요!`}
              />
            </div>

            {/* Footer Links */}
            <div className="flex justify-center gap-4 mt-8">
              <Link
                href="/wiki"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                📚 모든 김치 보기
              </Link>
              <span className="text-border">|</span>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                🏠 홈으로
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResultClient({ params }: ResultClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-3xl">🥬</span>
            </div>
            <p className="text-muted-foreground">결과를 불러오는 중...</p>
          </div>
        </div>
      }
    >
      <ResultCard params={params} />
    </Suspense>
  );
}
