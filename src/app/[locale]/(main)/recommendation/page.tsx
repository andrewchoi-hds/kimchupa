"use client";

import { useState } from "react";
import Link from "next/link";
import {
  QUIZ_QUESTIONS,
  KIMCHI_DATA,
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
    }
  };

  const handleRestart = () => {
    setState("intro");
    setCurrentQuestion(0);
    setScores({ spicy: 0, fermented: 0, crunchy: 0, mild: 0, refreshing: 0 });
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-red-600">
            김추페
          </Link>
          <div className="flex gap-4">
            <Link
              href="/wiki"
              className="px-4 py-2 text-zinc-700 hover:text-red-600 dark:text-zinc-300"
            >
              김치피디아
            </Link>
            <Link
              href="/community"
              className="px-4 py-2 text-zinc-700 hover:text-red-600 dark:text-zinc-300"
            >
              커뮤니티
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Intro State */}
        {state === "intro" && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl p-12">
              <div className="text-6xl mb-6">🥬</div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                나에게 맞는 김치 찾기
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                5가지 간단한 질문에 답하고
                <br />
                당신의 입맛에 딱 맞는 김치를 추천받으세요!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {["배추김치", "깍두기", "총각김치", "동치미", "갓김치"].map(
                  (name) => (
                    <span
                      key={name}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm"
                    >
                      {name}
                    </span>
                  )
                )}
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-full text-sm">
                  +7 종류
                </span>
              </div>
              <button
                onClick={handleStartQuiz}
                className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 transition-colors"
              >
                테스트 시작하기
              </button>
            </div>
          </div>
        )}

        {/* Quiz State */}
        {state === "quiz" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl p-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-zinc-500 mb-2">
                  <span>
                    질문 {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
                  </span>
                  <span>
                    {Math.round(
                      ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-300"
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
                <div className="text-4xl mb-4">
                  {currentQuestion === 0 && "🌶️"}
                  {currentQuestion === 1 && "🥢"}
                  {currentQuestion === 2 && "🫙"}
                  {currentQuestion === 3 && "🍚"}
                  {currentQuestion === 4 && "🌸"}
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.scores)}
                    className="w-full p-4 text-left bg-zinc-50 dark:bg-zinc-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 border-2 border-transparent transition-all"
                  >
                    <span className="text-lg text-zinc-900 dark:text-white">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Back Button */}
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                  className="mt-6 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  ← 이전 질문
                </button>
              )}
            </div>
          </div>
        )}

        {/* Result State */}
        {state === "result" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
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
                  className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden ${
                    index === 0 ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  {index === 0 && (
                    <div className="bg-red-600 text-white text-center py-2 text-sm font-semibold">
                      👑 최고의 추천
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Kimchi Image Placeholder */}
                      <div className="w-full md:w-48 h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-xl flex items-center justify-center text-6xl">
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
                                  className={`text-lg ${
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
                                  className={`text-lg ${
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
                                  className={`text-lg ${
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
                            <p className="text-zinc-900 dark:text-white mt-1">
                              {kimchi.region}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {kimchi.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded text-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Best With */}
                        <div>
                          <span className="text-sm text-zinc-500">
                            이 음식과 함께:
                          </span>
                          <p className="text-zinc-900 dark:text-white">
                            {kimchi.bestWith.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                      <Link
                        href={`/wiki/${kimchi.id}`}
                        className="flex-1 py-3 text-center bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        자세히 보기
                      </Link>
                      <button className="flex-1 py-3 text-center border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors font-medium">
                        구매처 보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors font-medium shadow"
              >
                다시 테스트하기
              </button>
              <Link
                href="/wiki"
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-center"
              >
                모든 김치 보기
              </Link>
            </div>

            {/* Share */}
            <div className="text-center mt-8">
              <p className="text-zinc-500 mb-3">결과 공유하기</p>
              <div className="flex justify-center gap-3">
                <button className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
                  📋
                </button>
                <button className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
                  💬
                </button>
                <button className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
                  🐦
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm">
          © 2026 김추페. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
