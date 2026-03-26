import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import PageHero from "@/components/ui/PageHero";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "김치와 건강 | 김추페 김치백과",
    description:
      "김치의 건강 효능을 알아보세요. 유산균, 비타민, 항산화 물질 등 김치에 담긴 영양소와 건강 효과를 과학적으로 살펴봅니다.",
    openGraph: {
      title: "김치와 건강 | 김추페 김치백과",
      description:
        "김치의 건강 효능을 알아보세요. 유산균, 비타민, 항산화 물질 등 김치에 담긴 영양소와 건강 효과를 과학적으로 살펴봅니다.",
      type: "article",
    },
  };
}

interface NutritionInfo {
  calories?: number;
  carbohydrates?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
  vitaminC?: number;
  probiotics?: string;
}

const HEALTH_SECTIONS = [
  {
    icon: "🦠",
    title: "유산균과 장 건강",
    description:
      "김치는 자연 발효 과정에서 다양한 유산균(Lactobacillus)이 생성됩니다. 이 유산균은 장내 유익균의 균형을 유지하고, 소화를 촉진하며, 장 건강을 개선하는 데 도움을 줍니다. 특히 잘 숙성된 김치에는 1g당 약 1억 마리 이상의 유산균이 포함되어 있습니다.",
    highlights: [
      "장내 유익균 증가",
      "소화 기능 개선",
      "장 점막 보호",
      "변비 예방",
    ],
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
  {
    icon: "🥬",
    title: "비타민과 영양소",
    description:
      "김치의 주재료인 배추, 무, 파, 마늘 등에는 비타민 A, B, C와 칼슘, 철분 등 풍부한 영양소가 포함되어 있습니다. 발효 과정에서 비타민 B군이 증가하며, 고춧가루에 함유된 캡사이신은 신진대사를 활성화합니다.",
    highlights: [
      "비타민 A, B, C 풍부",
      "칼슘, 철분 함유",
      "발효 중 비타민 B 증가",
      "캡사이신의 신진대사 촉진",
    ],
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    icon: "🛡️",
    title: "항산화 효과",
    description:
      "김치에 사용되는 마늘, 생강, 고춧가루 등에는 강력한 항산화 물질이 포함되어 있습니다. 이 물질들은 체내 활성산소를 제거하고 세포 손상을 방지하는 데 도움을 줍니다. 특히 마늘의 알리신과 고추의 베타카로틴이 대표적입니다.",
    highlights: [
      "활성산소 제거",
      "세포 노화 방지",
      "알리신의 항균 작용",
      "베타카로틴 함유",
    ],
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    icon: "💪",
    title: "면역력 강화",
    description:
      "김치의 발효 과정에서 생성되는 유산균과 비타민은 면역 체계를 강화하는 데 기여합니다. 연구에 따르면, 정기적인 김치 섭취가 감기 등 호흡기 질환 예방에 도움이 될 수 있으며, 항염 효과도 보고되었습니다.",
    highlights: [
      "면역 세포 활성화",
      "항염 효과",
      "감기 예방 효과",
      "전반적 건강 증진",
    ],
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    textColor: "text-blue-700",
  },
];

export default async function HealthCategoryPage() {
  const t = await getTranslations("wiki");

  // DB에서 nutritionInfo가 있는 김치 목록 가져오기
  let kimchiWithNutrition: {
    slug: string;
    name: string;
    nameEn: string;
    imageUrl: string | null;
    nutritionInfo: NutritionInfo | null;
  }[] = [];

  try {
    const raw = await prisma.kimchi.findMany({
      where: { NOT: { nutritionInfo: { equals: undefined } } },
      select: {
        slug: true,
        name: true,
        nameEn: true,
        imageUrl: true,
        nutritionInfo: true,
      },
      orderBy: { name: "asc" },
    });
    kimchiWithNutrition = raw.map((k) => ({
      ...k,
      nutritionInfo: k.nutritionInfo as NutritionInfo | null,
    }));
  } catch (error) {
    console.error("DB 조회 실패:", error);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-info to-success text-white py-16">
        <div className="container mx-auto px-4">
          <PageHero
            title="💪 김치와 건강"
            description="과학적으로 입증된 김치의 건강 효능을 알아보세요. 유산균부터 항산화 물질까지, 김치가 우리 몸에 주는 선물을 소개합니다."
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
            <span className="text-foreground">김치와 건강</span>
          </nav>
        </div>
      </div>

      {/* Health Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-8">
            {HEALTH_SECTIONS.map((section) => (
              <div
                key={section.title}
                className={`${section.bg} rounded-[var(--radius-lg)] p-6 md:p-8`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    <div
                      className={`w-16 h-16 ${section.iconBg} rounded-full flex items-center justify-center text-3xl`}
                    >
                      {section.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2
                      className={`text-xl font-bold ${section.textColor} mb-3`}
                    >
                      {section.title}
                    </h2>
                    <p className="text-foreground/80 leading-relaxed mb-4">
                      {section.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {section.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className={`px-3 py-1 ${section.iconBg} ${section.textColor} text-sm rounded-full font-medium`}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition Grid */}
      {kimchiWithNutrition.length > 0 && (
        <section className="py-16 bg-card border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              김치별 영양 정보
            </h2>
            <p className="text-muted-foreground mb-8">
              100g 기준 영양 성분을 확인해 보세요.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kimchiWithNutrition.map((kimchi) => {
                const nutrition = kimchi.nutritionInfo;
                return (
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
                      {nutrition?.calories !== undefined && (
                        <div className="absolute bottom-2 right-2">
                          <span className="px-2 py-1 text-xs font-bold bg-white/90 text-foreground rounded-full shadow">
                            {nutrition.calories} kcal
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {kimchi.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {kimchi.nameEn}
                      </p>

                      {nutrition && (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {nutrition.carbohydrates !== undefined && (
                            <div className="p-2 bg-accent/10 rounded-[var(--radius)]">
                              <p className="text-sm font-bold text-accent-dark">
                                {nutrition.carbohydrates}g
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                탄수화물
                              </p>
                            </div>
                          )}
                          {nutrition.protein !== undefined && (
                            <div className="p-2 bg-info/10 rounded-[var(--radius)]">
                              <p className="text-sm font-bold text-info">
                                {nutrition.protein}g
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                단백질
                              </p>
                            </div>
                          )}
                          {nutrition.vitaminC !== undefined && (
                            <div className="p-2 bg-warning/10 rounded-[var(--radius)]">
                              <p className="text-sm font-bold text-warning">
                                {nutrition.vitaminC}mg
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                비타민C
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="bg-muted rounded-[var(--radius-lg)] p-6 text-center">
            <p className="text-sm text-muted-foreground">
              ※ 본 페이지의 건강 정보는 일반적인 참고 자료이며, 의학적 조언을
              대체하지 않습니다. 건강에 관한 구체적인 사항은 전문의와 상담하시기
              바랍니다.
            </p>
          </div>
        </div>
      </section>

      {/* Back to Wiki */}
      <section className="py-8">
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
