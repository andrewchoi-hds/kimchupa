import { prisma } from "@kimchupa/db";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      nickname: true,
      name: true,
      level: true,
      xp: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">사용자 관리</h1>
        <span className="text-sm text-muted-foreground">
          총 {users.length}명
        </span>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  이메일
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  닉네임
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  이름
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  레벨
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  XP
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  역할
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  가입일
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-foreground">
                    {user.nickname || "-"}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {user.name || "-"}
                  </td>
                  <td className="px-4 py-3 text-foreground">{user.level}</td>
                  <td className="px-4 py-3 text-foreground">
                    {user.xp.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.createdAt.toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    등록된 사용자가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
