import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/adminGuard";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-foreground text-background px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              김추페
            </Link>
            <span className="text-sm opacity-70">관리자</span>
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="hover:opacity-80">
              대시보드
            </Link>
            <Link href="/admin/users" className="hover:opacity-80">
              사용자
            </Link>
            <Link href="/admin/posts" className="hover:opacity-80">
              게시글
            </Link>
            <Link href="/admin/reports" className="hover:opacity-80">
              신고
            </Link>
            <Link href="/" className="hover:opacity-80">
              사이트로
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
