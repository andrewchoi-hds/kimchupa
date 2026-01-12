import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { KIMCHI_DATA } from "@/constants/kimchi";

interface WikiDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return KIMCHI_DATA.map((kimchi) => ({
    id: kimchi.id,
  }));
}

export default async function WikiDetailPage({ params }: WikiDetailPageProps) {
  const { id } = await params;
  const kimchi = KIMCHI_DATA.find((k) => k.id === id);

  if (!kimchi) {
    notFound();
  }

  const relatedKimchi = KIMCHI_DATA.filter(
    (k) =>
      k.id !== kimchi.id &&
      (k.region === kimchi.region ||
        k.spicyLevel === kimchi.spicyLevel ||
        k.tags.some((tag) => kimchi.tags.includes(tag)))
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-red-600">홈</Link>
              <span>/</span>
              <Link href="/wiki" className="hover:text-red-600">김치피디아</Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-white">{kimchi.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-8xl">🥬</span>
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
              <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
                  특성
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-zinc-500 mb-2">매운맛</p>
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
                    <p className="text-sm text-zinc-500 mb-2">발효도</p>
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
                    <p className="text-sm text-zinc-500 mb-2">아삭함</p>
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
                    <p className="text-sm text-zinc-500 mb-2">짠맛</p>
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
              </section>

              {/* Ingredients */}
              <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                  주요 재료
                </h2>
                <div className="flex flex-wrap gap-2">
                  {kimchi.mainIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </section>

              {/* Best With */}
              <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                  이 음식과 함께
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {kimchi.bestWith.map((food) => (
                    <div
                      key={food}
                      className="p-4 bg-zinc-50 dark:bg-zinc-700 rounded-xl text-center"
                    >
                      <span className="text-2xl block mb-2">🍽️</span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {food}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Health Benefits */}
              <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
                  건강 효능
                </h2>
                <ul className="space-y-3">
                  {kimchi.healthBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300"
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
              <section className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                      직접 담가보세요!
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      단계별 레시피로 {kimchi.name}를 만들어보세요
                    </p>
                  </div>
                  <Link
                    href={`/wiki/${kimchi.id}/recipe`}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    레시피 보기
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Buy Section */}
              <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  🛒 구매하기
                </h2>
                <p className="text-sm text-zinc-500 mb-4">
                  신뢰할 수 있는 판매처에서 {kimchi.name}를 구매하세요
                </p>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <span className="font-medium text-zinc-900 dark:text-white">쿠팡</span>
                    <span className="text-sm text-zinc-500">→</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <span className="font-medium text-zinc-900 dark:text-white">네이버 쇼핑</span>
                    <span className="text-sm text-zinc-500">→</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <span className="font-medium text-zinc-900 dark:text-white">Amazon</span>
                    <span className="text-sm text-zinc-500">→</span>
                  </a>
                </div>
                <p className="text-xs text-zinc-400 mt-4">
                  * 제휴 링크를 통한 구매 시 소정의 수수료를 받을 수 있습니다
                </p>
              </section>

              {/* Tags */}
              <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  태그
                </h2>
                <div className="flex flex-wrap gap-2">
                  {kimchi.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/wiki?tag=${tag}`}
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-full text-sm hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Related Kimchi */}
              <section className="bg-white dark:bg-zinc-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">
                  관련 김치
                </h2>
                <div className="space-y-3">
                  {relatedKimchi.map((related) => (
                    <Link
                      key={related.id}
                      href={`/wiki/${related.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🥬</span>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {related.name}
                        </p>
                        <p className="text-xs text-zinc-500">{related.region}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Edit Wiki */}
              <section className="bg-zinc-100 dark:bg-zinc-700 rounded-2xl p-6">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  정보가 잘못되었거나 추가할 내용이 있나요?
                </p>
                <button className="w-full py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-white dark:hover:bg-zinc-600 transition-colors text-sm">
                  편집 제안하기 (Lv.4+)
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
