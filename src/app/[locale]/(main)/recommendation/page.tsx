"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "@/stores/toastStore";
import {
  QUIZ_QUESTIONS,
  recommendKimchi,
  type KimchiType,
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
  const [scores, setScores] = useState<UserScores>({
    spicy: 0,
    fermented: 0,
    crunchy: 0,
    mild: 0,
    refreshing: 0,
  });
  const [recommendations, setRecommendations] = useState<KimchiType[]>([]);

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
  };

  const handleAnswer = (optionScores: Record<string, number>) => {
    const newScores = { ...scores };
    Object.entries(optionScores).forEach(([key, value]) => {
      newScores[key as keyof UserScores] += value;
    });
    setScores(newScores);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // 퀴즈 완료 - 추천 결과 계산
      const recommended = recommendKimchi(newScores);
      setRecommendations(recommended);
      setState("result");
      toast.xp(30, "김치 추천 테스트 완료");
    }
  };

  const handleRestart = () => {
    setState("intro");
    setCurrentQuestion(0);
    setScores({ spicy: 0, fermented: 0, crunchy: 0, mild: 0, refreshing: 0 });
    setRecommendations([]);
  };

  const questionEmojis = ["🌶️", "🥢", "🫙", "🍚", "🌸"];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={user} />

      <main className="flex-1">
        {/* Intro State */}
        {state === "intro" && (
          <div className="relative overflow-hidden">
            {/* Hero Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500" />

            {/* Floating Emojis */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-[10%] text-6xl animate-float opacity-20">🥬</div>
              <div className="absolute top-40 right-[15%] text-5xl animate-float-delay opacity-20">🌶️</div>
              <div className="absolute bottom-40 left-[20%] text-4xl animate-float opacity-20">🧄</div>
              <div className="absolute top-1/3 right-[10%] text-7xl animate-float-delay opacity-20">🫙</div>
            </div>

            <div className="relative container mx-auto px-4 py-20 md:py-32">
              <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl p-8 md:p-12">
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-lg">
                    <span className="text-5xl">🥬</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                    나에게 맞는 김치 찾기
                  </h1>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                    5가지 간단한 질문에 답하고
                    <br />
                    당신의 입맛에 딱 맞는 김치를 추천받으세요!
                  </p>

                  {/* Sample Kimchi Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {["배추김치", "깍두기", "총각김치", "동치미", "갓김치"].map(
                      (name) => (
                        <span
                          key={name}
                          className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium"
                        >
                          {name}
                        </span>
                      )
                    )}
                    <span className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-full text-sm">
                      +7 종류
                    </span>
                  </div>

                  {/* XP Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full text-sm font-medium text-amber-700 dark:text-amber-400 mb-6">
                    <span>✨</span>
                    <span>테스트 완료 시 +30 XP</span>
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-lg font-bold rounded-2xl hover:from-red-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
              <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl p-6 md:p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-2">
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
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500 ease-out rounded-full"
                      style={{
                        width: `${
                          ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">{questionEmojis[currentQuestion]}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
                    {QUIZ_QUESTIONS[currentQuestion].question}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.scores)}
                      className="w-full p-4 text-left bg-zinc-50 dark:bg-zinc-700/50 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 border-2 border-transparent hover:border-red-300 dark:hover:border-red-700 transition-all group"
                    >
                      <span className="text-lg text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Back Button */}
                {currentQuestion > 0 && (
                  <button
                    onClick={() => setCurrentQuestion((prev) => prev - 1)}
                    className="mt-6 flex items-center gap-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
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
              {/* Result Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-4">
                  <span>✅</span>
                  <span>+30 XP 획득!</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                  🎉 추천 결과
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  당신의 입맛에 맞는 김치를 찾았어요!
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-6">
                {recommendations.map((kimchi, index) => (
                  <div
                    key={kimchi.id}
                    className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                      index === 0 ? "ring-2 ring-red-500 ring-offset-2 dark:ring-offset-zinc-900" : ""
                    }`}
                  >
                    {index === 0 && (
                      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-2.5 text-sm font-bold">
                        👑 당신에게 가장 잘 맞는 김치
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Kimchi Image Placeholder */}
                        <div className="w-full md:w-48 h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl flex items-center justify-center text-6xl shrink-0">
                          🥬
                        </div>

                        {/* Kimchi Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                              {kimchi.name}
                            </h2>
                            <span className="text-zinc-500 text-sm">
                              {kimchi.nameEn}
                            </span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                            {kimchi.description}
                          </p>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-zinc-500">매운맛</span>
                              <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <span
                                    key={level}
                                    className={`text-lg transition-opacity ${
                                      level <= kimchi.spicyLevel
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
                              <span className="text-sm text-zinc-500">발효도</span>
                              <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <span
                                    key={level}
                                    className={`text-lg transition-opacity ${
                                      level <= kimchi.fermentationLevel
                                        ? "opacity-100"
                                        : "opacity-20"
                                    }`}
                                  >
                                    🫙
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-zinc-500">아삭함</span>
                              <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <span
                                    key={level}
                                    className={`text-lg transition-opacity ${
                                      level <= kimchi.crunchiness
                                        ? "opacity-100"
                                        : "opacity-20"
                                    }`}
                                  >
                                    ✨
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-zinc-500">지역</span>
                              <p className="text-zinc-900 dark:text-white mt-1 font-medium">
                                {kimchi.region}
                              </p>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {kimchi.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-lg text-sm"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Best With */}
                          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <span className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                              🍚 이 음식과 함께:
                            </span>
                            <p className="text-zinc-900 dark:text-white mt-1">
                              {kimchi.bestWith.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                        <Link
                          href={`/wiki/${kimchi.id}`}
                          className="flex-1 py-3 text-center bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:from-red-700 hover:to-orange-600 transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                          📖 자세히 보기
                        </Link>
                        <button className="flex-1 py-3 text-center border-2 border-zinc-200 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors font-medium">
                          🛒 구매처 보기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <button
                  onClick={handleRestart}
                  className="px-8 py-4 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-medium shadow-lg border border-zinc-200 dark:border-zinc-700"
                >
                  🔄 다시 테스트하기
                </button>
                <Link
                  href="/wiki"
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:from-red-700 hover:to-orange-600 transition-all font-medium text-center shadow-lg"
                >
                  📚 모든 김치 보기
                </Link>
              </div>

              {/* Share */}
              <div className="text-center mt-10 p-6 bg-white dark:bg-zinc-800 rounded-2xl">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4 font-medium">결과 공유하기</p>
                <div className="flex justify-center gap-3">
                  <button className="p-4 bg-zinc-100 dark:bg-zinc-700 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors">
                    <span className="text-xl">📋</span>
                  </button>
                  <button className="p-4 bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-colors">
                    <span className="text-xl font-bold text-zinc-900">K</span>
                  </button>
                  <button className="p-4 bg-blue-400 rounded-xl hover:bg-blue-500 transition-colors">
                    <span className="text-xl">🐦</span>
                  </button>
                </div>
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
