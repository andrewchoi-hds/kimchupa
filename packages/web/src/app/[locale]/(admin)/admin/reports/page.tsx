import { prisma } from "@kimchupa/db";
import Link from "next/link";
import { ReportStatusButtons } from "./ReportStatusButtons";

const statusLabels: Record<string, string> = {
  pending: "대기",
  reviewed: "검토됨",
  resolved: "처리됨",
  dismissed: "기각",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  dismissed: "bg-muted text-muted-foreground",
};

const reasonLabels: Record<string, string> = {
  spam: "스팸",
  harassment: "괴롭힘",
  inappropriate: "부적절",
  copyright: "저작권",
  other: "기타",
};

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status;

  const where: Record<string, unknown> = {};
  if (statusFilter) where.status = statusFilter;

  const reports = await prisma.report.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      reporter: {
        select: { id: true, nickname: true, email: true },
      },
    },
  });

  const filterStatuses = ["all", "pending", "reviewed", "resolved", "dismissed"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">신고 관리</h1>
        <span className="text-sm text-muted-foreground">
          총 {reports.length}건
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        {filterStatuses.map((s) => {
          const isActive =
            s === "all" ? !statusFilter : statusFilter === s;
          return (
            <Link
              key={s}
              href={
                s === "all" ? "/admin/reports" : `/admin/reports?status=${s}`
              }
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "all" ? "전체" : statusLabels[s] || s}
            </Link>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  대상
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  사유
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  설명
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  신고자
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  상태
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  신고일
                </th>
                <th className="px-4 py-3 text-muted-foreground font-medium">
                  처리
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-foreground">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                      {report.targetType}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      {report.targetId.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {reasonLabels[report.reason] || report.reason}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {report.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {report.reporter.nickname || report.reporter.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        statusColors[report.status] || statusColors.pending
                      }`}
                    >
                      {statusLabels[report.status] || report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {report.createdAt.toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <ReportStatusButtons
                      reportId={report.id}
                      currentStatus={report.status}
                    />
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    신고 내역이 없습니다.
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
