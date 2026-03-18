"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statusActions = [
  { status: "reviewed", label: "검토" },
  { status: "resolved", label: "처리" },
  { status: "dismissed", label: "기각" },
];

export function ReportStatusButtons({
  reportId,
  currentStatus,
}: {
  reportId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (currentStatus === "resolved" || currentStatus === "dismissed") {
    return (
      <span className="text-xs text-muted-foreground">처리 완료</span>
    );
  }

  return (
    <div className="flex gap-1">
      {statusActions
        .filter((a) => a.status !== currentStatus)
        .map((action) => (
          <button
            key={action.status}
            onClick={() => handleStatusChange(action.status)}
            disabled={loading}
            className="px-2 py-1 text-xs rounded border border-border bg-background text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}
