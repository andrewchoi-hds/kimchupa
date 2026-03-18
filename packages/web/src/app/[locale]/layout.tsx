import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import SessionProvider from "@/components/providers/SessionProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import GlobalProvider from "@/components/providers/GlobalProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "김추페 - 종합 김치 플랫폼",
  description: "AI 기반 김치 추천, 김치피디아, 커뮤니티까지. 전 세계 김치 애호가들을 위한 종합 플랫폼",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: "'Pretendard Variable', var(--font-inter), system-ui, sans-serif" }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-primary focus:text-white focus:p-4 focus:top-0 focus:left-0"
        >
          Skip to content
        </a>
        <SessionProvider>
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <GlobalProvider>
                {children}
              </GlobalProvider>
            </NextIntlClientProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
