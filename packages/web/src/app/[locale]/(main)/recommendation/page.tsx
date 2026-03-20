"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "@/stores/toastStore";
import {
  QUIZ_QUESTIONS,
  recommendKimchi,
  getPersonalityType,
  type KimchiRecommendation,
  type PersonalityType,
} from "@/constants/kimchi";

type QuizState = "intro" | "quiz" | "result";

interface UserScores {
  spicy: number;
  fermented: number;
  crunchy: number;
  mild: number;
  refreshing: number;
}

export default function RecommendationPage() {
  const { data: session } = useSession();
  const levels = useTranslations("levels");

  const [state, setState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("left");
  const [isAnimating, setIsAnimating] = useState(false);
  const [scores, setScores] = useState<UserScores>({
    spicy: 0,
    fermented: 0,
    crunchy: 0,
    mild: 0,
    refreshing: 0,
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<KimchiRecommendation[]>([]);
  const [personality, setPersonality] = useState<PersonalityType | null>(null);
  const [savedLocally, setSavedLocally] = useState(false);

  // 세션에서 유저 정보 추출
  const user = session?.user
    ? {
        nickname: session.user.name || "사용자",
        level: 1,
        levelName: levels("1"),
        xp: 0,
        profileImage: session.user.image || undefined,
      }
    : null;

  const handleStartQuiz = () => {
    setState("quiz");
    setCurrentQuestion(0);
    setScores({ spicy: 0, fermented: 0, crunchy: 0, mild: 0, refreshing: 0 });
    setAnswers({});
    setSlideDirection("left");
  };

  const animateTransition = useCallback((direction: "left" | "right", callback: () => void) => {
    setSlideDirection(direction);
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 300);
  }, []);

  const handleAnswer = (optionId: string, optionScores: Record<string, number>) => {
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([key, value]) => {
      newScores[key as keyof UserScores] += value;
    });
    setScores(newScores);

    const questionId = QUIZ_QUESTIONS[currentQuestion].id;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      animateTransition("left", () => {
        setCurrentQuestion((prev) => prev + 1);
      });
    } else {
      // 퀴즈 완료 - 추천 결과 계산
      const recommended = recommendKimchi(newScores);
      setRecommendations(recommended);
      setPersonality(getPersonalityType(newScores));
      setState("result");
      toast.xp(30, "김치 추천 테스트 완료");
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      animateTransition("right", () => {
        setCurrentQuestion((prev) => prev - 1);
      });
    }
  };

  const handleRestart = () => {
    setState("intro");
    setCurrentQuestion(0);
    setScores({ spicy: 0, fermented: 0, crunchy: 0, mild: 0, refreshing: 0 });
    setAnswers({});
    setRecommendations([]);
    setPersonality(null);
    setSavedLocally(false);
  };

  const handleSaveResult = () => {
    const resultData = {
      answers,
      scores,
      personality,
      topKimchiIds: recommendations.map((r) => r.kimchi.id),
      matchScores: recommendations.map((r) => r.matchScore),
      savedAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("kimchi-quiz-results") || "[]");
      existing.push(resultData);
      localStorage.setItem("kimchi-quiz-results", JSON.stringify(existing));
      setSavedLocally(true);
      toast.success("결과가 저장되었습니다!");
    } catch {
      toast.error("저장에 실패했습니다.");
    }
  };

  const handleShareLink = async () => {
    const text = personality
      ? `나의 김치 유형: ${personality.emoji} ${personality.type}! ${personality.desc} #김추페 #김치추천`
      : "김치 추천 테스트를 해보세요! #김추페";
    try {
      await navigator.clipboard.writeText(text);
      toast.success("클립보드에 복사되었습니다!");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const questionEmojis = ["🌶️", "🥢", "🫙", "🍚", "🌸", "🎓", "💪", "🍳"];

  const getSlideClass = () => {
    if (!isAnimating) return "translate-x-0 opacity-100";
    return slideDirection === "left"
      ? "-translate-x-8 opacity-0"
      : "translate-x-8 opacity-0";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />

      <main className="flex-1">
        {/* Intro State */}
        {state === "intro" && (
          <div className="relative overflow-hidden">
            {/* Hero Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-yellow-500" />

            {/* Floating Emojis */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-[10%] text-6xl animate-float opacity-20">🥬</div>
              <div className="absolute top-40 right-[15%] text-5xl animate-float-delay opacity-20">🌶️</div>
              <div className="absolute bottom-40 left-[20%] text-4xl animate-float opacity-20">🧄</div>
              <div className="absolute top-1/3 right-[10%] text-7xl animate-float-delay opacity-20">🫙</div>
            </div>

            <div className="relative container mx-auto px-4 py-20 md:py-32">
              <div className="max-w-2xl mx-auto text-center">
                <div className="bg-card rounded-[var(--radius-lg)] shadow-2xl p-8 md:p-12">
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-[var(--radius-lg)] flex items-center justify-center shadow-lg">
                    <span className="text-5xl">🥬</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    나에게 맞는 김치 찾기
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    8가지 간단한 질문에 답하고
                    <br />
                    당신의 입맛에 딱 맞는 김치를 추천받으세요!
                  </p>

                  {/* Sample Kimchi Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {["배추김치", "깍두기", "총각김치", "동치미", "갓김치"].map(
                      (name) => (
                        <span
                          key={name}
                          className="px-3 py-1.5 bg-red-100 text-primary rounded-full text-sm font-medium"
                        >
                          {name}
                        </span>
                      )
                    )}
                    <span className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm">
                      +45 종류
                    </span>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                    <div className="p-3 bg-muted rounded-[var(--radius)]">
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-xs text-muted-foreground">맞춤 추천</div>
                    </div>
                    <div className="p-3 bg-muted rounded-[var(--radius)]">
                      <div className="text-2xl mb-1">🧬</div>
                      <div className="text-xs text-muted-foreground">김치 유형 분석</div>
                    </div>
                    <div className="p-3 bg-muted rounded-[var(--radius)]">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-xs text-muted-foreground">매칭률 표시</div>
                    </div>
                  </div>

                  {/* XP Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-sm font-medium text-amber-700 mb-6">
                    <span>✨</span>
                    <span>테스트 완료 시 +30 XP</span>
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-orange-500 text-white text-lg font-bold rounded-[var(--radius-lg)] hover:from-primary-dark hover:to-orange-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    🎯 테스트 시작하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz State */}
        {state === "quiz" && (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-[var(--radius-lg)] shadow-xl p-6 md:p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span className="font-medium">
                      질문 {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
                    </span>
                    <span>
                      {Math.round(
                        ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-3 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500 ease-out rounded-full"
                      style={{
                        width: `${
                          ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                  {/* Step indicators */}
                  <div className="flex justify-between mt-2">
                    {QUIZ_QUESTIONS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          idx < currentQuestion
                            ? "bg-green-500 text-white"
                            : idx === currentQuestion
                            ? "bg-gradient-to-r from-red-500 to-orange-500 text-white scale-110"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {idx < currentQuestion ? "✓" : idx + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question with slide animation */}
                <div className={`transition-all duration-300 ease-in-out ${getSlideClass()}`}>
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-[var(--radius-lg)] flex items-center justify-center">
                      <span className="text-4xl">
                        {questionEmojis[currentQuestion] || "❓"}
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      {QUIZ_QUESTIONS[currentQuestion].question}
                    </h2>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswer(option.id, option.scores)}
                        className="w-full p-4 text-left bg-muted rounded-[var(--radius)] hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 border-2 border-transparent hover:border-red-300 transition-all group"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <span className="text-lg text-foreground group-hover:text-primary transition-colors">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Back Button */}
                {currentQuestion > 0 && (
                  <button
                    onClick={handlePrevQuestion}
                    className="mt-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    이전 질문
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Result State */}
        {state === "result" && (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Personality Hero */}
              {personality && (
                <div className="mb-10 bg-gradient-to-br from-primary via-orange-500 to-yellow-500 rounded-[var(--radius-lg)] shadow-2xl overflow-hidden">
                  <div className="p-8 md:p-12 text-center text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                      <span>✅</span>
                      <span>+30 XP 획득!</span>
                    </div>

                    <div className="text-6xl md:text-8xl mb-4">{personality.emoji}</div>
                    <p className="text-sm uppercase tracking-wider opacity-80 mb-2">나의 김치 유형</p>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                      당신은 {personality.type}!
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-xl mx-auto">
                      {personality.desc}
                    </p>

                    {/* Score Summary */}
                    <div className="mt-8 grid grid-cols-5 gap-2 max-w-lg mx-auto">
                      {[
                        { label: "매운맛", value: scores.spicy, emoji: "🌶️" },
                        { label: "발효", value: scores.fermented, emoji: "🫙" },
                        { label: "아삭함", value: scores.crunchy, emoji: "✨" },
                        { label: "순한맛", value: scores.mild, emoji: "🥗" },
                        { label: "시원함", value: scores.refreshing, emoji: "💧" },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="text-2xl mb-1">{stat.emoji}</div>
                          <div className="text-xs opacity-70">{stat.label}</div>
                          <div className="font-bold text-lg">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Top Match - Hero Card */}
              {recommendations.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>👑</span> 최고의 매칭
                  </h2>
                  <div className="bg-card rounded-[var(--radius-lg)] shadow-xl overflow-hidden ring-2 ring-red-500 ring-offset-2">
                    <div className="bg-gradient-to-r from-primary to-orange-500 text-white text-center py-3 text-sm font-bold flex items-center justify-center gap-2">
                      <span>👑</span>
                      <span>매칭률 {recommendations[0].matchScore}%</span>
                      <span>- 당신에게 가장 잘 맞는 김치</span>
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Kimchi Image */}
                        <div className="w-full md:w-64 h-64 bg-gradient-to-br from-red-100 to-orange-100 rounded-[var(--radius-lg)] overflow-hidden shrink-0 relative">
                          {recommendations[0].kimchi.imageUrl ? (
                            <Image
                              src={recommendations[0].kimchi.imageUrl}
                              alt={recommendations[0].kimchi.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl">🥬</div>
                          )}
                        </div>

                        {/* Kimchi Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-bold text-foreground">
                              {recommendations[0].kimchi.name}
                            </h3>
                            <span className="text-muted-foreground text-sm">
                              {recommendations[0].kimchi.nameEn}
                            </span>
                          </div>

                          {/* Match Score Bar */}
                          <div className="mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-4 bg-border rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                                  style={{ width: `${recommendations[0].matchScore}%` }}
                                />
                              </div>
                              <span className="text-lg font-bold text-primary">
                                {recommendations[0].matchScore}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {recommendations[0].matchReason}
                            </p>
                          </div>

                          <p className="text-muted-foreground mb-4">
                            {recommendations[0].kimchi.description}
                          </p>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-muted-foreground">매운맛</span>
                              <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <span
                                    key={level}
                                    className={`text-lg transition-opacity ${
                                      level <= recommendations[0].kimchi.spicyLevel
                                        ? "opacity-100"
                                        : "opacity-20"
                                    }`}
                                  >
                                    🌶️
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">발효도</span>
                              <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <span
                                    key={level}
                                    className={`text-lg transition-opacity ${
                                      level <= recommendations[0].kimchi.fermentationLevel
                                        ? "opacity-100"
                                        : "opacity-20"
                                    }`}
                                  >
                                    🫙
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {recommendations[0].kimchi.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-muted text-muted-foreground rounded-lg text-sm"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Best With */}
                          <div className="p-3 bg-amber-50 rounded-[var(--radius)]">
                            <span className="text-sm text-amber-700 font-medium">
                              🍚 이 음식과 함께:
                            </span>
                            <p className="text-foreground mt-1">
                              {recommendations[0].kimchi.bestWith.join(", ")}
                            </p>
                          </div>

                          {/* Action */}
                          <div className="mt-4">
                            <Link
                              href={`/wiki/${recommendations[0].kimchi.id}`}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-[var(--radius)] hover:from-primary-dark hover:to-orange-600 transition-all font-medium shadow-lg hover:shadow-xl"
                            >
                              📖 자세히 보기
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Recommendations */}
              {recommendations.length > 1 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>🏆</span> 추천 김치 TOP 5
                  </h2>
                  <div className="space-y-4">
                    {recommendations.slice(1).map((rec, index) => (
                      <div
                        key={rec.kimchi.id}
                        className="bg-card rounded-[var(--radius-lg)] shadow-lg overflow-hidden transition-all hover:shadow-xl"
                      >
                        <div className="p-5">
                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                            {/* Rank Badge */}
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full flex items-center justify-center text-lg font-bold text-amber-700 shrink-0">
                              {index + 2}
                            </div>

                            {/* Image */}
                            <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-[var(--radius)] overflow-hidden shrink-0 relative">
                              {rec.kimchi.imageUrl ? (
                                <Image
                                  src={rec.kimchi.imageUrl}
                                  alt={rec.kimchi.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">🥬</div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-foreground">
                                  {rec.kimchi.name}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {rec.kimchi.nameEn}
                                </span>
                              </div>

                              {/* Match Score Bar */}
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-1 h-2.5 bg-border rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${rec.matchScore}%` }}
                                  />
                                </div>
                                <span className="text-sm font-bold text-amber-600">
                                  {rec.matchScore}%
                                </span>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">
                                {rec.matchReason}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {rec.kimchi.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Action */}
                            <Link
                              href={`/wiki/${rec.kimchi.id}`}
                              className="shrink-0 px-4 py-2 text-sm border border-border text-muted-foreground rounded-[var(--radius)] hover:bg-muted transition-colors"
                            >
                              자세히 보기
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <button
                  onClick={handleSaveResult}
                  disabled={savedLocally}
                  className={`px-8 py-4 rounded-[var(--radius)] font-medium shadow-lg transition-all ${
                    savedLocally
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-card text-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {savedLocally ? "✅ 저장 완료" : "💾 결과 저장하기"}
                </button>
                <button
                  onClick={handleShareLink}
                  className="px-8 py-4 bg-card text-muted-foreground rounded-[var(--radius)] hover:bg-muted transition-colors font-medium shadow-lg border border-border"
                >
                  📋 공유하기
                </button>
                <button
                  onClick={handleRestart}
                  className="px-8 py-4 bg-card text-muted-foreground rounded-[var(--radius)] hover:bg-muted transition-colors font-medium shadow-lg border border-border"
                >
                  🔄 다시 해보기
                </button>
              </div>

              {/* Browse All */}
              <div className="text-center">
                <Link
                  href="/wiki"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-orange-500 text-white rounded-[var(--radius)] hover:from-primary-dark hover:to-orange-600 transition-all font-medium shadow-lg"
                >
                  📚 모든 김치 보기
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
