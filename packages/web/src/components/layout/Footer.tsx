"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const community = useTranslations("community");
  const common = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <footer className="bg-foreground text-muted-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥬</span>
              <span className="text-xl font-bold text-background">{common("siteName")}</span>
            </Link>
            <p className="text-sm opacity-70">{common("siteDescription")}</p>
          </div>

          <div>
            <h4 className="text-background font-semibold mb-4">{locale === "ko" ? "서비스" : "Services"}</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/recommendation", label: nav("recommendation") },
                { href: "/wiki", label: nav("wiki") },
                { href: "/community", label: nav("community") },
                { href: "/shop", label: nav("shop") },
                { href: "/kimjang", label: locale === "ko" ? "김장 가이드" : "Kimjang Guide" },
                { href: "/faq", label: "FAQ" },
                { href: "/tools/calorie", label: locale === "ko" ? "칼로리 계산기" : "Calorie Calculator" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-background transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-background font-semibold mb-4">{locale === "ko" ? "도구" : "Tools"}</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/recommendation", label: locale === "ko" ? "김치 추천" : "Kimchi Recommendation" },
                { href: "/tools/ingredients", label: locale === "ko" ? "냉장고 파먹기" : "Fridge Ingredients" },
                { href: "/tools/calorie", label: locale === "ko" ? "칼로리 계산기" : "Calorie Calculator" },
                { href: "/ranking", label: locale === "ko" ? "랭킹" : "Ranking" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-background transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-background font-semibold mb-4">{nav("community")}</h4>
            <ul className="space-y-2 text-sm">
              {["recipe", "free", "qna", "diary"].map((board) => (
                <li key={board}>
                  <Link href={`/community?board=${board}`} className="hover:text-background transition-colors">
                    {community(`boards.${board}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-background font-semibold mb-4">{locale === "ko" ? "정보" : "Information"}</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: t("about") },
                { href: "/terms", label: t("terms") },
                { href: "/privacy", label: t("privacy") },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-background transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <select
              value={locale}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-background/10 text-sm px-3 py-1 rounded-[var(--radius-sm)] border border-background/20 focus:outline-none"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
            <p className="text-sm">{t("copyright", { year: new Date().getFullYear() })}</p>
            <p className="text-xs opacity-50">{t("madeWith")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
