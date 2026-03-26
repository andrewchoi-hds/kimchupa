import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import prisma from "@/lib/prisma";
import PageHero from "@/components/ui/PageHero";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "김치 레시피 모음 | 김추페 김치백과",
    description:
      "다양한 김치 만드는 법을 단계별로 알아보세요. 배추김치부터 깍두기, 동치미까지 전통 김치 레시피를 제공합니다.",
    openGraph: {
      title: "김치 레시피 모음 | 김추페 김치백과",
      description:
        "다양한 김치 만드는 법을 단계별로 알아보세요.",
      type: "article",
    },
  };
}

export default async function RecipeCategoryPage() {
  const t = await getTranslations("wiki");

  // DB에서 makingProcess가 있는 김치 목록 가져오기
  let kimchiWithRecipe: {
    slug: string;
    name: string;
    nameEn: string;
    imageUrl: string | null;
    makingProcess: string | null;
    region: string;
    spicyLevel: number;
  }[] = [];

  try {
    kimchiWithRecipe = await prisma.kimchi.findMany({
      where: { makingProcess: { not: null } },
      select: {
        slug: true,
        name: true,
        nameEn: true,
        imageUrl: true,
        makingProcess: true,
        region: true,
        spicyLevel: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("DB 조회 실패:", error);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-accent text-white py-16">
        <div className="container mx-auto px-4">
          <PageHero
            title="👨‍🍳 김치 레시피 모음"
            description="전통 방식부터 현대적 레시피까지, 다양한 김치 만드는 법을 단계별로 알아보세요."
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
            <span className="text-foreground">김치 레시피 모음</span>
          </nav>
        </div>
      </div>

      {/* Recipe Tips */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-[var(--radius-lg)] border border-border p-6 text-center">
              <span className="text-4xl block mb-3">🧂</span>
              <h3 className="font-bold text-foreground mb-2">절임이 핵심</h3>
              <p className="text-sm text-muted-foreground">
                좋은 김치는 적절한 소금 절임에서 시작됩니다. 배추의 숨이 죽을
                때까지 충분히 절여주세요.
              </p>
            </div>
            <div className="bg-card rounded-[var(--radius-lg)] border border-border p-6 text-center">
              <span className="text-4xl block mb-3">🌡️</span>
              <h3 className="font-bold text-foreground mb-2">온도 관리</h3>
              <p className="text-sm text-muted-foreground">
                발효 온도에 따라 김치 맛이 달라집니다. 실온에서 하루, 이후
                냉장고에서 숙성하세요.
              </p>
            </div>
            <div className="bg-card rounded-[var(--radius-lg)] border border-border p-6 text-center">
              <span className="text-4xl block mb-3">🫙</span>
              <h3 className="font-bold text-foreground mb-2">용기 선택</h3>
              <p className="text-sm text-muted-foreground">
                전통 옹기부터 밀폐 용기까지, 보관 용기에 따라 발효 속도가
                달라집니다.
              </p>
            </div>
          </div>

          {/* Recipe Grid */}
          <h2 className="text-2xl font-bold text-foreground mb-2">
            레시피가 있는 김치
          </h2>
          <p className="text-muted-foreground mb-8">
            {kimchiWithRecipe.length > 0
              ? `총 ${kimchiWithRecipe.length}가지 김치의 레시피를 확인할 수 있습니다.`
              : "레시피 데이터를 불러오는 중입니다."}
          </p>

          {kimchiWithRecipe.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {kimchiWithRecipe.map((kimchi) => (
                <Link
                  key={kimchi.slug}
                  href={`/wiki/${kimchi.slug}/recipe`}
                  className="bg-card rounded-[var(--radius-lg)] border border-border overflow-hidden hover:shadow-md transition-shadow group"
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
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full">
                        {kimchi.region}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
                        👨‍🍳 레시피
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {kimchi.name}
                      </h3>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < kimchi.spicyLevel
                                ? "text-primary"
                                : "text-muted/50"
                            }`}
                          >
                            🌶
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {kimchi.nameEn}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      레시피 보기 →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-[var(--radius-lg)] border border-border">
              <span className="text-6xl block mb-4">👨‍🍳</span>
              <h3 className="text-xl font-bold text-foreground mb-2">
                레시피를 준비 중입니다
              </h3>
              <p className="text-muted-foreground">
                곧 다양한 김치 레시피가 추가될 예정입니다.
              </p>
            </div>
          )}
        </div>
      </section>

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
