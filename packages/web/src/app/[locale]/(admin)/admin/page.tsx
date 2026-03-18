import { prisma } from "@kimchupa/db";
import Link from "next/link";

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground mt-1">
        {value.toLocaleString()}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export default async function AdminDashboard() {
  const [userCount, postCount, commentCount, pendingReportCount, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.report.count({ where: { status: "pending" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          email: true,
          nickname: true,
          createdAt: true,
          role: true,
        },
      }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        관리자 대시보드
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="전체 사용자" value={userCount} href="/admin/users" />
        <StatCard label="전체 게시글" value={postCount} href="/admin/posts" />
        <StatCard label="전체 댓글" value={commentCount} />
        <StatCard
          label="대기 중 신고"
          value={pendingReportCount}
          href="/admin/reports"
        />
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          최근 가입자
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-muted-foreground font-medium">
                  이메일
                </th>
                <th className="pb-2 pr-4 text-muted-foreground font-medium">
                  닉네임
                </th>
                <th className="pb-2 pr-4 text-muted-foreground font-medium">
                  역할
                </th>
                <th className="pb-2 text-muted-foreground font-medium">
                  가입일
                </th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-foreground">{user.email}</td>
                  <td className="py-2 pr-4 text-foreground">
                    {user.nickname || "-"}
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {user.createdAt.toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
