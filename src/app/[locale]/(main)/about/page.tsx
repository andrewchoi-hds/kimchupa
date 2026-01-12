"use client";

import { useTranslations, useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const locale = useLocale();
  const common = useTranslations("common");

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={null} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">
              {locale === "ko" ? "김추페 소개" : "About KimchuPa"}
            </h1>

            <div className="prose dark:prose-invert max-w-none">
              {locale === "ko" ? (
                <>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                    김추페는 한국의 전통 발효 음식인 김치의 모든 것을 담은 종합 플랫폼입니다.
                  </p>

                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    우리의 미션
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    김치의 다양성과 매력을 전 세계에 알리고, 누구나 자신에게 맞는 김치를 찾을 수 있도록 돕는 것입니다.
                  </p>

                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    주요 서비스
                  </h2>
                  <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2">
                    <li>AI 기반 맞춤형 김치 추천</li>
                    <li>50가지 이상의 김치 정보 백과사전</li>
                    <li>레시피 공유 및 커뮤니티</li>
                    <li>엄선된 김치 제품 구매 가이드</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    연락처
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    문의사항이 있으시면 hello@kimchupa.com으로 연락해 주세요.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                    KimchuPa is a comprehensive platform dedicated to kimchi, Korea&apos;s traditional fermented food.
                  </p>

                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    Our Mission
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    To share the diversity and charm of kimchi with the world and help everyone find the perfect kimchi for them.
                  </p>

                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    Main Services
                  </h2>
                  <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2">
                    <li>AI-powered personalized kimchi recommendations</li>
                    <li>Encyclopedia of 50+ types of kimchi</li>
                    <li>Recipe sharing and community</li>
                    <li>Curated kimchi product buying guide</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    Contact
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    For inquiries, please contact us at hello@kimchupa.com
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
