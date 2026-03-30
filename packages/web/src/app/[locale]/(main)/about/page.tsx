"use client";

import { useLocale } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const features = {
  ko: [
    { icon: "📚", title: "25종 김치백과", desc: "역사, 레시피, 영양정보를 담은 종합 김치 백과사전" },
    { icon: "🤖", title: "AI 맞춤 김치 추천", desc: "8문항 퀴즈로 나에게 딱 맞는 김치를 찾아보세요" },
    { icon: "💬", title: "커뮤니티", desc: "게시글, 댓글, 좋아요, 팔로우로 김치 애호가들과 소통" },
    { icon: "🏆", title: "게이미피케이션", desc: "XP, 뱃지, 출석, 랭킹, 챌린지로 즐거운 참여" },
    { icon: "🔧", title: "실용 도구", desc: "칼로리 계산기, 냉장고 파먹기, 발효 타이머" },
    { icon: "🥬", title: "김장 시즌 가이드", desc: "김장 시즌에 필요한 모든 정보를 한눈에" },
    { icon: "❓", title: "FAQ", desc: "20개 이상의 자주 묻는 질문과 답변" },
    { icon: "🔐", title: "HireVisa SSO", desc: "HireVisa 계정으로 간편 로그인" },
    { icon: "🌙", title: "다크 모드 & PWA", desc: "다크 모드, PWA, 다국어(한/영) 지원" },
  ],
  en: [
    { icon: "📚", title: "25 Kimchi Encyclopedia", desc: "Comprehensive kimchi encyclopedia with history, recipes, and nutrition" },
    { icon: "🤖", title: "AI Kimchi Recommendation", desc: "Find your perfect kimchi with an 8-question quiz" },
    { icon: "💬", title: "Community", desc: "Connect with kimchi lovers through posts, comments, likes, and follows" },
    { icon: "🏆", title: "Gamification", desc: "Engage with XP, badges, attendance, rankings, and challenges" },
    { icon: "🔧", title: "Practical Tools", desc: "Calorie calculator, fridge ingredients matcher, fermentation timer" },
    { icon: "🥬", title: "Kimjang Season Guide", desc: "Everything you need for kimjang season at a glance" },
    { icon: "❓", title: "FAQ", desc: "20+ frequently asked questions and answers" },
    { icon: "🔐", title: "HireVisa SSO", desc: "Easy login with your HireVisa account" },
    { icon: "🌙", title: "Dark Mode & PWA", desc: "Dark mode, PWA, and multilingual (KR/EN) support" },
  ],
};

export default function AboutPage() {
  const locale = useLocale();
  const isKo = locale === "ko";
  const featureList = isKo ? features.ko : features.en;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={null} />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {isKo ? "김추페 소개" : "About KimchuPa"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isKo
                ? "김추페는 한국의 전통 발효 음식인 김치의 모든 것을 담은 종합 플랫폼입니다."
                : "KimchuPa is a comprehensive platform dedicated to kimchi, Korea's traditional fermented food."}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {isKo ? "우리의 미션" : "Our Mission"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {isKo
                  ? "김치의 다양성과 매력을 전 세계에 알리고, 누구나 자신에게 맞는 김치를 찾을 수 있도록 돕는 것입니다."
                  : "To share the diversity and charm of kimchi with the world and help everyone find the perfect kimchi for them."}
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              {isKo ? "주요 기능" : "Key Features"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {featureList.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card rounded-[var(--radius-lg)] p-6 border border-border hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isKo ? "지금 시작하세요" : "Get Started Now"}
            </h2>
            <p className="text-muted-foreground mb-8">
              {isKo
                ? "나에게 맞는 김치를 찾고, 커뮤니티에 참여해 보세요."
                : "Find your perfect kimchi and join the community."}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/recommendation"
                className="inline-flex items-center justify-center h-12 px-6 bg-primary text-white font-medium rounded-[var(--radius)] shadow-sm hover:bg-primary-dark transition-colors"
              >
                {isKo ? "김치 추천 받기" : "Get Kimchi Recommendation"}
              </Link>
              <Link
                href="/wiki"
                className="inline-flex items-center justify-center h-12 px-6 border border-border text-foreground font-medium rounded-[var(--radius)] hover:bg-muted transition-colors"
              >
                {isKo ? "김치백과 둘러보기" : "Browse Kimchi Wiki"}
              </Link>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {isKo ? "연락처" : "Contact"}
            </h2>
            <p className="text-muted-foreground">
              {isKo
                ? "문의사항이 있으시면 hello@kimchupa.com으로 연락해 주세요."
                : "For inquiries, please contact us at hello@kimchupa.com"}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
