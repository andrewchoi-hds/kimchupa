import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const locale = useLocale();
  const common = useTranslations("common");
  const nav = useTranslations("nav");
  const hero = useTranslations("hero");
  const features = useTranslations("features");
  const levels = useTranslations("levels");
  const footer = useTranslations("footer");

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">{common("siteName")}</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-zinc-700 hover:text-red-600 dark:text-zinc-300"
            >
              {nav("login")}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {nav("signup")}
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero */}
        <section className="py-20 text-center">
          <h2 className="text-5xl font-bold text-zinc-900 dark:text-white mb-6">
            {hero("title")}
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            {hero("subtitle")}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/recommendation"
              className="px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              {hero("cta")}
            </Link>
            <Link
              href="/wiki"
              className="px-8 py-4 border-2 border-red-600 text-red-600 text-lg font-semibold rounded-xl hover:bg-red-50 transition-colors"
            >
              {hero("exploreCta")}
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <h3 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">
            {locale === "ko" ? "주요 기능" : "Key Features"}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🥬</span>
              </div>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {features("recommendation.title")}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                {features("recommendation.description")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {features("wiki.title")}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                {features("wiki.description")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {features("community.title")}
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                {features("community.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Level System Preview */}
        <section className="py-16">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-6 text-center">
              {features("level.title")}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { level: 1, emoji: "🌱" },
                { level: 2, emoji: "🥬" },
                { level: 3, emoji: "👨‍🍳" },
                { level: 4, emoji: "🧑‍🍳" },
                { level: 5, emoji: "⭐" },
                { level: 6, emoji: "🏆" },
                { level: 7, emoji: "👑" },
              ].map((item) => (
                <div
                  key={item.level}
                  className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium"
                >
                  {item.emoji} Lv.{item.level} {levels(String(item.level))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            {locale === "ko" ? "지금 바로 시작하세요" : "Get Started Now"}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            {locale === "ko"
              ? "무료로 가입하고 김치의 세계를 탐험하세요"
              : "Sign up for free and explore the world of kimchi"}
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            {nav("signup")}
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">{common("siteName")}</h4>
              <p className="text-sm">{common("siteDescription")}</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">
                {locale === "ko" ? "서비스" : "Services"}
              </h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/recommendation" className="hover:text-white">
                    {nav("recommendation")}
                  </Link>
                </li>
                <li>
                  <Link href="/wiki" className="hover:text-white">
                    {nav("wiki")}
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white">
                    {nav("community")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">
                {locale === "ko" ? "고객지원" : "Support"}
              </h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="hover:text-white">
                    {locale === "ko" ? "자주 묻는 질문" : "FAQ"}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    {footer("contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-3">
                {locale === "ko" ? "법적 고지" : "Legal"}
              </h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    {footer("terms")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    {footer("privacy")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm">
            {footer("copyright", { year: 2026 })}
          </div>
        </div>
      </footer>
    </div>
  );
}
