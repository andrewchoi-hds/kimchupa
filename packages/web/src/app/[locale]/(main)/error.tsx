"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function MainError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <span className="text-6xl block mb-4">😵</span>
        <h2 className="text-2xl font-bold text-foreground mb-2">오류가 발생했습니다</h2>
        <p className="text-muted-foreground mb-6">
          페이지를 불러오는 중 문제가 생겼습니다. 다시 시도해주세요.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" onClick={() => window.location.href = "/"}>홈으로</Button>
        </div>
      </div>
    </div>
  );
}
