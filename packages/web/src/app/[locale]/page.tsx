"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Sparkles, BookOpen, Users, ArrowRight, TrendingUp, Award, BookMarked, ChefHat } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { requestAnimationFrame(step); observer.disconnect(); }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function Home() {
  const { data: session } = useSession();
  const common = useTranslations("common");
  const hero = useTranslations("hero");
  const features = useTranslations("features");
  const levels = useTranslations("levels");
  const revealRef = useScrollReveal();

  const user = session?.user
    ? { nickname: session.user.name || "사용자", level: 1, levelName: levels("1"), xp: 0, profileImage: session.user.image || undefined }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background" ref={revealRef}>
      <Header user={user} />

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-accent py-24 md:py-32">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIvPjwvc3ZnPg==')] opacity-50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-8 animate-fade-in">
                <TrendingUp className="w-4 h-4" />
                대한민국 No.1 김치 커뮤니티
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
                {hero("title")}
              </h1>
              <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
                {hero("subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Link href="/recommendation">
                  <Button variant="outline" size="lg" className="px-8 shadow-lg" style={{ background: "white", color: "var(--primary)", borderColor: "white" }}>
                    <Sparkles className="w-5 h-5" /> 나에게 맞는 김치 찾기
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="lg" className="px-8" style={{ background: "transparent", color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
                    <Users className="w-5 h-5" /> 커뮤니티 참여하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 -mt-8 relative z-20">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-[var(--radius-lg)] shadow-lg border border-border p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: 127, suffix: "+", label: "공유된 레시피", color: "text-primary" },
                  { value: 1842, suffix: "", label: "김치 러버", color: "text-accent-dark" },
                  { value: 350, suffix: "+", label: "커뮤니티 글", color: "text-secondary" },
                  { value: 55, suffix: "", label: "김치백과 항목", color: "text-info" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-1`}>
                      <CountUp target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features - Bento Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{features("section.title")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">김추페에서 김치의 모든 것을 경험하세요</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 reveal">
              {[
                { href: "/recommendation", icon: Sparkles, title: features("recommendation.title"), desc: features("recommendation.description"), gradient: "from-primary to-primary-dark", cta: "시작하기" },
                { href: "/wiki", icon: BookOpen, title: features("wiki.title"), desc: features("wiki.description"), gradient: "from-accent to-accent-dark", cta: "둘러보기" },
                { href: "/community", icon: Users, title: features("community.title"), desc: features("community.description"), gradient: "from-secondary to-secondary-dark", cta: "참여하기" },
              ].map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className={`group relative bg-gradient-to-br ${f.gradient} p-8 rounded-[var(--radius-lg)] text-white overflow-hidden hover:scale-[1.02] transition-all shadow-md hover:shadow-xl`}
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-[var(--radius)] flex items-center justify-center mb-4">
                      <f.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                    <p className="text-white/80 mb-6">{f.desc}</p>
                    <span className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                      {f.cta} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Level System */}
        <section className="py-16 reveal">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary via-accent to-secondary rounded-[var(--radius-lg)] p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{features("level.title")}</h2>
                <p className="text-white/80 max-w-xl mx-auto mb-8">{features("level.description")}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { level: 1, emoji: "🌱", name: "김치 새싹" },
                    { level: 2, emoji: "🥬", name: "김치 입문자" },
                    { level: 3, emoji: "👨‍🍳", name: "김치 수습생" },
                    { level: 4, emoji: "🧑‍🍳", name: "김치 요리사" },
                    { level: 5, emoji: "⭐", name: "김치 장인" },
                    { level: 6, emoji: "🏆", name: "김치 달인" },
                    { level: 7, emoji: "👑", name: "김치 명인" },
                  ].map((item) => (
                    <div key={item.level} className="bg-white/15 backdrop-blur-sm px-4 py-3 rounded-[var(--radius)] hover:bg-white/25 transition-colors">
                      <span className="text-2xl mr-2">{item.emoji}</span>
                      <span className="font-medium">Lv.{item.level}</span>
                      <span className="text-white/70 ml-1 hidden sm:inline">{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Link href="/profile">
                    <Button className="bg-white text-primary hover:bg-white/90">
                      <Award className="w-4 h-4" /> 내 레벨 확인하기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        {!session && (
          <section className="py-20 reveal">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{common("cta.title")}</h2>
                <p className="text-muted-foreground mb-8 text-lg">{common("cta.description")}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="px-8">{common("cta.button")}</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="px-8">이미 계정이 있어요</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
