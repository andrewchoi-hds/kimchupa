import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥬</span>
              <span className="text-xl font-bold text-white">김추페</span>
            </Link>
            <p className="text-sm">
              김치의 모든 것을 담은
              <br />
              종합 플랫폼
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <span className="text-sm">📷</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <span className="text-sm">🐦</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
              >
                <span className="text-sm">📺</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/recommendation" className="hover:text-white transition-colors">
                  김치 추천
                </Link>
              </li>
              <li>
                <Link href="/wiki" className="hover:text-white transition-colors">
                  김치피디아
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  구매처
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4">커뮤니티</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/community/recipe" className="hover:text-white transition-colors">
                  레시피
                </Link>
              </li>
              <li>
                <Link href="/community/free" className="hover:text-white transition-colors">
                  자유게시판
                </Link>
              </li>
              <li>
                <Link href="/community/qna" className="hover:text-white transition-colors">
                  Q&A
                </Link>
              </li>
              <li>
                <Link href="/community/diary" className="hover:text-white transition-colors">
                  김치 일기
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  이용 가이드
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-white transition-colors">
                  피드백
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">법적 고지</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-white transition-colors">
                  제휴 링크 고지
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mt-8 pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">🌐 언어:</span>
              <select className="bg-zinc-800 text-sm px-3 py-1 rounded border border-zinc-700 focus:outline-none focus:border-red-500">
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
                <option value="es">Español</option>
              </select>
            </div>
            <p className="text-sm text-center">
              © 2026 김추페 (KimchuPa). All rights reserved.
            </p>
            <p className="text-xs text-zinc-500">
              일부 링크는 제휴 링크이며, 구매 시 수수료를 받을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
