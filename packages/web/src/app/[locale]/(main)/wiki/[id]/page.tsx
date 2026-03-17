import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { KIMCHI_DATA } from "@/constants/kimchi";
import TasteRadarChart from "@/components/ui/TasteRadarChart";
import KimchiDexButton from "@/components/ui/KimchiDexButton";
import prisma from "@/lib/prisma";

interface WikiDetailPageProps {
  params: Promise<{ id: string }>;
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

export async function generateStaticParams() {
  return KIMCHI_DATA.map((kimchi) => ({
    id: kimchi.id,
  }));
}

export default async function WikiDetailPage({ params }: WikiDetailPageProps) {
  const t = await getTranslations("wiki");
  const { id } = await params;

  // 상수 파일에서 기본 데이터 가져오기
  const kimchiConstant = KIMCHI_DATA.find((k) => k.id === id);

  if (!kimchiConstant) {
    notFound();
  }

  // DB에서 상세 데이터 가져오기
  let kimchiDB = null;
  try {
    kimchiDB = await prisma.kimchi.findUnique({
      where: { slug: id },
      include: {
        ingredients: true,
        pairings: true,
        healthBenefits: true,
        tags: true,
      },
    });
  } catch (error) {
    console.error("DB 조회 실패:", error);
  }

  // 상수 + DB 데이터 병합
  const kimchi = {
    ...kimchiConstant,
    imageUrl: kimchiDB?.imageUrl || kimchiConstant.imageUrl,
    history: kimchiDB?.history || null,
    makingProcess: kimchiDB?.makingProcess || null,
    storageMethod: kimchiDB?.storageMethod || null,
    nutritionInfo: kimchiDB?.nutritionInfo as NutritionInfo | null,
    variations: kimchiDB?.variations || null,
    descriptionEn: kimchiDB?.descriptionEn || kimchiConstant.nameEn,
  };

  const relatedKimchi = KIMCHI_DATA.filter(
    (k) =>
      k.id !== kimchi.id &&
      (k.region === kimchi.region ||
        k.spicyLevel === kimchi.spicyLevel ||
        k.tags.some((tag) => kimchi.tags.includes(tag)))
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">{t("detail.home")}</Link>
              <span>/</span>
              <Link href="/wiki" className="hover:text-primary">{t("title")}</Link>
              <span>/</span>
              <span className="text-foreground">{kimchi.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 bg-white/20 rounded-[var(--radius-lg)] overflow-hidden relative">
                {kimchi.imageUrl && kimchi.imageUrl.startsWith("http") ? (
                  <Image
                    src={kimchi.imageUrl}
                    alt={kimchi.name}
                    fill
                    className="object-cover"
                    sizes="192px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">🥬</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{kimchi.name}</h1>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {kimchi.region}
                  </span>
                </div>
                <p className="text-xl text-white/90 mb-4">{kimchi.nameEn}</p>
                <p className="text-white/80 max-w-2xl">{kimchi.description}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats */}
              <section className="bg-card rounded-[var(--radius-lg)] p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  {t("detail.characteristics")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("detail.spicyLevel")}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className={`text-xl ${level <= kimchi.spicyLevel ? "opacity-100" : "opacity-20"}`}
                        >
                          🌶️
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("detail.fermentation")}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className={`text-xl ${level <= kimchi.fermentationLevel ? "opacity-100" : "opacity-20"}`}
                        >
                          🫙
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("detail.crunchiness")}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className={`text-xl ${level <= kimchi.crunchiness ? "opacity-100" : "opacity-20"}`}
                        >
                          ✨
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t("detail.saltiness")}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className={`text-xl ${level <= kimchi.saltiness ? "opacity-100" : "opacity-20"}`}
                        >
                          🧂
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    {t("detail.tasteProfile")}
                  </h3>
                  <div className="flex justify-center">
                    <TasteRadarChart
                      data={{
                        spicyLevel: kimchi.spicyLevel,
                        fermentationLevel: kimchi.fermentationLevel,
                        saltiness: kimchi.saltiness,
                        crunchiness: kimchi.crunchiness,
                      }}
                      name={kimchi.name}
                      size="md"
                    />
                  </div>
                </div>
              </section>

              {/* History - DB 데이터 */}
              {kimchi.history && (
                <section className="bg-card rounded-[var(--radius-lg)] p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>📜</span> 역사 & 유래
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
                      {kimchi.history}
                    </p>
                  </div>
                </section>
              )}

              {/* Making Process - DB 데이터 */}
              {kimchi.makingProcess && (
                <section className="bg-card rounded-[var(--radius-lg)] p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>👨‍🍳</span> 만드는 방법
                  </h2>
                  <div className="prose max-w-none">
                    <div className="text-foreground/80 whitespace-pre-line leading-relaxed">
                      {kimchi.makingProcess}
                    </div>
                  </div>
                </section>
              )}

              {/* Storage Method - DB 데이터 */}
              {kimchi.storageMethod && (
                <section className="bg-card rounded-[var(--radius-lg)] p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>🧊</span> 보관 방법
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
                      {kimchi.storageMethod}
                    </p>
                  </div>
                </section>
              )}

              {/* Nutrition Info - DB 데이터 */}
              {kimchi.nutritionInfo && (
                <section className="bg-card rounded-[var(--radius-lg)] p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>🥗</span> 영양 정보 (100g 기준)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {kimchi.nutritionInfo.calories !== undefined && (
                      <div className="p-4 bg-primary-50 rounded-[var(--radius)] text-center">
                        <p className="text-2xl font-bold text-primary">
                          {kimchi.nutritionInfo.calories}
                        </p>
                        <p className="text-sm text-muted-foreground">kcal</p>
                      </div>
                    )}
                    {kimchi.nutritionInfo.carbohydrates !== undefined && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-[var(--radius)] text-center">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {kimchi.nutritionInfo.carbohydrates}g
                        </p>
                        <p className="text-sm text-muted-foreground">탄수화물</p>
                      </div>
                    )}
                    {kimchi.nutritionInfo.protein !== undefined && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-[var(--radius)] text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {kimchi.nutritionInfo.protein}g
                        </p>
                        <p className="text-sm text-muted-foreground">단백질</p>
                      </div>
                    )}
                    {kimchi.nutritionInfo.fiber !== undefined && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-[var(--radius)] text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {kimchi.nutritionInfo.fiber}g
                        </p>
                        <p className="text-sm text-muted-foreground">식이섬유</p>
                      </div>
                    )}
                    {kimchi.nutritionInfo.sodium !== undefined && (
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-[var(--radius)] text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {kimchi.nutritionInfo.sodium}mg
                        </p>
                        <p className="text-sm text-muted-foreground">나트륨</p>
                      </div>
                    )}
                    {kimchi.nutritionInfo.vitaminC !== undefined && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-[var(--radius)] text-center">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {kimchi.nutritionInfo.vitaminC}mg
                        </p>
                        <p className="text-sm text-muted-foreground">비타민 C</p>
                      </div>
                    )}
                    {kimchi.nutritionInfo.probiotics && (
                      <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-[var(--radius)] text-center col-span-2">
                        <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
                          {kimchi.nutritionInfo.probiotics}
                        </p>
                        <p className="text-sm text-muted-foreground">유산균</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Variations - DB 데이터 */}
              {kimchi.variations && (
                <section className="bg-card rounded-[var(--radius-lg)] p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span>🗺️</span> 지역별 특징
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
                      {kimchi.variations}
                    </p>
                  </div>
                </section>
              )}

              {/* Ingredients */}
              <section className="bg-card rounded-[var(--radius-lg)] p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t("detail.ingredients")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {kimchi.mainIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-4 py-2 bg-primary-50 text-primary rounded-lg"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </section>

              {/* Best With */}
              <section className="bg-card rounded-[var(--radius-lg)] p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t("detail.pairWith")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {kimchi.bestWith.map((food) => (
                    <div
                      key={food}
                      className="p-4 bg-muted rounded-[var(--radius)] text-center"
                    >
                      <span className="text-2xl block mb-2">🍽️</span>
                      <span className="text-sm text-foreground/80">
                        {food}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Health Benefits */}
              <section className="bg-card rounded-[var(--radius-lg)] p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  {t("detail.healthBenefits")}
                </h2>
                <ul className="space-y-3">
                  {kimchi.healthBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-3 text-foreground/80"
                    >
                      <span className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                        ✓
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Recipe Link */}
              <section className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-[var(--radius-lg)] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      {t("detail.tryMaking")}
                    </h2>
                    <p className="text-muted-foreground">
                      {t("detail.recipeHint", { name: kimchi.name })}
                    </p>
                  </div>
                  <Link
                    href={`/wiki/${kimchi.id}/recipe`}
                    className="px-6 py-3 bg-primary text-white rounded-[var(--radius)] hover:bg-primary-dark transition-colors font-medium"
                  >
                    {t("detail.viewRecipe")}
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Kimchi Dex Button */}
              <KimchiDexButton kimchiId={kimchi.id} kimchiName={kimchi.name} />

              {/* Buy Section */}
              <section className="bg-card rounded-[var(--radius-lg)] p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  🛒 {t("detail.buy")}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("detail.buyHint", { name: kimchi.name })}
                </p>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-foreground">Coupang</span>
                    <span className="text-sm text-muted-foreground">→</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-foreground">Naver Shopping</span>
                    <span className="text-sm text-muted-foreground">→</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-foreground">Amazon</span>
                    <span className="text-sm text-muted-foreground">→</span>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  {t("detail.affiliateNotice")}
                </p>
              </section>

              {/* Tags */}
              <section className="bg-card rounded-[var(--radius-lg)] p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("detail.tags")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {kimchi.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/wiki?tag=${tag}`}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm hover:bg-muted transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Related Kimchi */}
              <section className="bg-card rounded-[var(--radius-lg)] p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  {t("detail.relatedKimchi")}
                </h2>
                <div className="space-y-3">
                  {relatedKimchi.map((related) => (
                    <Link
                      key={related.id}
                      href={`/wiki/${related.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary-50 rounded-lg overflow-hidden relative">
                        {related.imageUrl && related.imageUrl.startsWith("http") ? (
                          <Image
                            src={related.imageUrl}
                            alt={related.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl">🥬</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {related.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{related.region}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Edit Wiki */}
              <section className="bg-muted rounded-[var(--radius-lg)] p-6">
                <p className="text-sm text-muted-foreground mb-3">
                  {t("detail.editSuggest")}
                </p>
                <button className="w-full py-2 border border-zinc-300 dark:border-zinc-600 text-foreground/80 rounded-lg hover:bg-white dark:hover:bg-zinc-600 transition-colors text-sm">
                  {t("detail.editButton")}
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
