"use client";

import { useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header user={null} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">
              {locale === "ko" ? "개인정보처리방침" : "Privacy Policy"}
            </h1>

            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
              {locale === "ko" ? (
                <>
                  <p className="mb-4">
                    최종 수정일: 2026년 1월 12일
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    1. 수집하는 개인정보 항목
                  </h2>
                  <p className="mb-4">
                    회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>이메일 주소</li>
                    <li>닉네임</li>
                    <li>프로필 이미지 (선택)</li>
                    <li>서비스 이용 기록</li>
                  </ul>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    2. 개인정보의 수집 및 이용목적
                  </h2>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>회원 가입 및 관리</li>
                    <li>서비스 제공 및 개선</li>
                    <li>맞춤형 콘텐츠 제공</li>
                    <li>고객 문의 응대</li>
                  </ul>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    3. 개인정보의 보유 및 이용기간
                  </h2>
                  <p className="mb-4">
                    회원 탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다. 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    4. 개인정보의 제3자 제공
                  </h2>
                  <p className="mb-4">
                    회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    5. 쿠키 사용
                  </h2>
                  <p className="mb-4">
                    서비스 이용 편의를 위해 쿠키를 사용합니다. 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    Last updated: January 12, 2026
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    1. Personal Information Collected
                  </h2>
                  <p className="mb-4">
                    We collect the following personal information to provide our services:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Email address</li>
                    <li>Nickname</li>
                    <li>Profile image (optional)</li>
                    <li>Service usage records</li>
                  </ul>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    2. Purpose of Collection and Use
                  </h2>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Member registration and management</li>
                    <li>Service provision and improvement</li>
                    <li>Personalized content delivery</li>
                    <li>Customer support</li>
                  </ul>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    3. Retention Period
                  </h2>
                  <p className="mb-4">
                    Personal information is retained until account deletion and is immediately destroyed upon deletion. However, if required by applicable laws, information may be retained for the legally required period.
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    4. Third-Party Disclosure
                  </h2>
                  <p className="mb-4">
                    We do not provide personal information to third parties without user consent.
                  </p>

                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white mt-8 mb-4">
                    5. Cookie Usage
                  </h2>
                  <p className="mb-4">
                    We use cookies for service convenience. You can refuse cookie storage through your browser settings.
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
