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
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, "") || "/";
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <footer className="bg-zinc-900 text-zinc-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥬</span>
              <span className="text-xl font-bold text-white">{common("siteName")}</span>
            </Link>
            <p className="text-sm">
              {common("siteDescription")}
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
                aria-label="Instagram"
              >
                <span className="text-sm">📷</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
                aria-label="Twitter"
              >
                <span className="text-sm">🐦</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
                aria-label="YouTube"
              >
                <span className="text-sm">📺</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {locale === "ko" ? "서비스" : "Services"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recommendation" className="hover:text-white transition-colors">
                  {nav("recommendation")}
                </Link>
              </li>
              <li>
                <Link href="/wiki" className="hover:text-white transition-colors">
                  {nav("wiki")}
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  {nav("community")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  {nav("shop")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4">{nav("community")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/community?board=recipe" className="hover:text-white transition-colors">
                  {community("boards.recipe")}
                </Link>
              </li>
              <li>
                <Link href="/community?board=free" className="hover:text-white transition-colors">
                  {community("boards.free")}
                </Link>
              </li>
              <li>
                <Link href="/community?board=qna" className="hover:text-white transition-colors">
                  {community("boards.qna")}
                </Link>
              </li>
              <li>
                <Link href="/community?board=diary" className="hover:text-white transition-colors">
                  {community("boards.diary")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {locale === "ko" ? "정보" : "Information"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">🌐</span>
              <select
                value={locale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-zinc-800 text-sm px-3 py-1 rounded border border-zinc-700 focus:outline-none focus:border-red-500"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </div>
            <p className="text-sm text-center">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="text-xs text-zinc-500">
              {t("madeWith")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
