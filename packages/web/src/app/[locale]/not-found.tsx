import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <span className="text-8xl block mb-4">🥬</span>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">페이지를 찾을 수 없습니다</p>
        <Link href="/" className="inline-flex items-center justify-center h-10 px-6 bg-primary text-white rounded-[var(--radius)] hover:bg-primary-dark transition-colors">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
