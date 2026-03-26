import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import PageHero from "@/components/ui/PageHero";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "김치의 역사 | 김추페 김치백과",
    description:
      "삼국시대부터 현대까지, 김치의 유구한 역사를 타임라인으로 살펴보세요. 유네스코 인류무형문화유산에 등재된 김장 문화의 흐름을 알아봅니다.",
    openGraph: {
      title: "김치의 역사 | 김추페 김치백과",
      description:
        "삼국시대부터 현대까지, 김치의 유구한 역사를 타임라인으로 살펴보세요.",
      type: "article",
    },
  };
}

const TIMELINE = [
  {
    era: "삼국시대",
    period: "BC 37~",
    title: "소금 절임 채소의 시작",
    description:
      "한반도에서 채소를 소금에 절여 보관하는 방법이 시작되었습니다. 중국 문헌에 고구려인들이 발효 식품을 잘 만든다는 기록이 남아 있으며, 이것이 김치의 원형으로 여겨집니다.",
    icon: "🏛️",
    color: "bg-amber-500",
  },
  {
    era: "고려시대",
    period: "918~",
    title: "양념을 넣은 김치의 등장",
    description:
      "단순한 소금 절임에서 벗어나 마늘, 생강, 파 등의 양념을 넣기 시작했습니다. 이 시기 문헌에 '침채(沈菜)'라는 단어가 등장하며, 이것이 '김치'의 어원이 되었습니다.",
    icon: "🫙",
    color: "bg-emerald-500",
  },
  {
    era: "조선시대",
    period: "1392~",
    title: "고춧가루 전래, 현대 김치의 탄생",
    description:
      "16세기 말 일본을 통해 고추가 전래되면서 김치에 고춧가루를 사용하기 시작했습니다. 18세기에는 배추가 널리 재배되면서 오늘날 우리가 알고 있는 배추김치의 원형이 완성되었습니다.",
    icon: "🌶️",
    color: "bg-red-500",
  },
  {
    era: "근현대",
    period: "1900~",
    title: "김치냉장고와 김장 문화",
    description:
      "산업화와 함께 김치 생산이 대규모화되었습니다. 1995년 김치냉장고가 등장하면서 가정에서의 김치 보관이 혁신적으로 변화했고, 김장 문화는 한국의 대표적인 공동체 문화로 자리잡았습니다.",
    icon: "🏭",
    color: "bg-blue-500",
  },
  {
    era: "2013년",
    period: "유네스코 등재",
    title: "유네스코 인류무형문화유산 등재",
    description:
      "대한민국의 '김장, 김치를 담그고 나누는 문화'가 유네스코 인류무형문화유산에 등재되었습니다. 이는 김치 자체가 아닌, 김치를 함께 만들고 나누는 공동체 문화의 가치를 세계적으로 인정받은 것입니다.",
    icon: "🏆",
    color: "bg-yellow-500",
  },
];

export default async function HistoryPage() {
  const t = await getTranslations("wiki");

  // DB에서 역사 데이터가 있는 김치 목록 가져오기
  let kimchiWithHistory: {
    slug: string;
    name: string;
    nameEn: string;
    imageUrl: string | null;
    history: string | null;
  }[] = [];

  try {
    kimchiWithHistory = await prisma.kimchi.findMany({
      where: { history: { not: null } },
      select: {
        slug: true,
        name: true,
        nameEn: true,
        imageUrl: true,
        history: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("DB 조회 실패:", error);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-accent to-primary text-white py-16">
        <div className="container mx-auto px-4">
          <PageHero
            title="📜 김치의 역사"
            description="삼국시대부터 현대까지, 수천 년에 걸친 김치의 유구한 역사를 타임라인으로 살펴보세요."
          />
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              {t("detail.home")}
            </Link>
            <span>/</span>
            <Link href="/wiki" className="hover:text-primary">
              {t("title")}
            </Link>
            <span>/</span>
            <span className="text-foreground">김치의 역사</span>
          </nav>
        </div>
      </div>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-12">
              {TIMELINE.map((item, index) => (
                <div
                  key={item.era}
                  className={`relative flex flex-col md:flex-row items-start gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-xl shadow-lg`}
                    >
                      {item.icon}
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`ml-16 md:ml-0 md:w-[calc(50%-3rem)] ${
                      index % 2 === 0 ? "md:pr-0" : "md:pl-0"
                    }`}
                  >
                    <div className="bg-card rounded-[var(--radius-lg)] border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-primary-50 text-primary text-sm font-bold rounded-full">
                          {item.era}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.period}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kimchi with History Data */}
      {kimchiWithHistory.length > 0 && (
        <section className="py-16 bg-card border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              역사가 기록된 김치
            </h2>
            <p className="text-muted-foreground mb-8">
              각 김치의 고유한 역사와 유래를 알아보세요.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kimchiWithHistory.map((kimchi) => (
                <Link
                  key={kimchi.slug}
                  href={`/wiki/${kimchi.slug}`}
                  className="bg-background rounded-[var(--radius-lg)] border border-border overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    {kimchi.imageUrl &&
                    kimchi.imageUrl.startsWith("http") ? (
                      <Image
                        src={kimchi.imageUrl}
                        alt={kimchi.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        🥬
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full">
                        📜 역사
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {kimchi.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {kimchi.nameEn}
                    </p>
                    {kimchi.history && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {kimchi.history}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Wiki */}
      <section className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/wiki"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-[var(--radius)] hover:bg-primary-dark transition-colors font-medium"
          >
            ← {t("title")}으로 돌아가기
          </Link>
        </div>
      </section>
    </>
  );
}
