"use client";

import { useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={null} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">
              {locale === "ko" ? "이용약관" : "Terms of Service"}
            </h1>

            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
              {locale === "ko" ? (
                <>
                  <p className="mb-4">
                    최종 수정일: 2026년 1월 12일
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    제1조 (목적)
                  </h2>
                  <p className="mb-4">
                    본 약관은 김추페(이하 &quot;회사&quot;)가 제공하는 서비스의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    제2조 (서비스의 내용)
                  </h2>
                  <p className="mb-4">
                    회사는 다음과 같은 서비스를 제공합니다:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>김치 정보 제공 서비스</li>
                    <li>김치 추천 서비스</li>
                    <li>커뮤니티 서비스</li>
                    <li>제휴 쇼핑 연결 서비스</li>
                  </ul>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    제3조 (이용자의 의무)
                  </h2>
                  <p className="mb-4">
                    이용자는 다음 행위를 하여서는 안 됩니다:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>타인의 정보 도용</li>
                    <li>서비스에 게시된 정보의 무단 변경</li>
                    <li>회사가 금지한 정보의 게시</li>
                    <li>기타 불법적이거나 부당한 행위</li>
                  </ul>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    제4조 (면책조항)
                  </h2>
                  <p className="mb-4">
                    회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    Last updated: January 12, 2026
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    Article 1 (Purpose)
                  </h2>
                  <p className="mb-4">
                    These Terms of Service define the rights, obligations, and responsibilities between KimchuPa (hereinafter &quot;Company&quot;) and users regarding the use of services provided by the Company.
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    Article 2 (Services)
                  </h2>
                  <p className="mb-4">
                    The Company provides the following services:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Kimchi information services</li>
                    <li>Kimchi recommendation services</li>
                    <li>Community services</li>
                    <li>Affiliate shopping connection services</li>
                  </ul>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    Article 3 (User Obligations)
                  </h2>
                  <p className="mb-4">
                    Users must not engage in the following activities:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Misappropriation of others&apos; information</li>
                    <li>Unauthorized modification of service content</li>
                    <li>Posting prohibited information</li>
                    <li>Other illegal or improper activities</li>
                  </ul>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    Article 4 (Disclaimer)
                  </h2>
                  <p className="mb-4">
                    The Company is not responsible for any expected profits that users fail to obtain or lose through the use of the service.
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
