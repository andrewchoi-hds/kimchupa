"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "오류가 발생했습니다.");
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              잘못된 접근입니다
            </h1>
            <p className="text-muted-foreground mb-6">
              비밀번호 재설정 링크가 올바르지 않습니다.
              <br />
              이메일에서 받은 링크를 다시 확인해주세요.
            </p>
            <Link href="/forgot-password">
              <Button size="lg" className="w-full">
                비밀번호 재설정 다시 요청
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">&#10003;</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              비밀번호가 변경되었습니다
            </h1>
            <p className="text-muted-foreground mb-6">
              새 비밀번호로 로그인할 수 있습니다.
              <br />
              잠시 후 로그인 페이지로 이동합니다.
            </p>
            <Link href="/login">
              <Button size="lg" className="w-full">
                로그인하러 가기
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card padding="lg">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-primary">
              김추페
            </Link>
            <h1 className="text-xl font-bold text-foreground mt-4 mb-2">
              새 비밀번호 설정
            </h1>
            <p className="text-muted-foreground text-sm">
              새로운 비밀번호를 입력해주세요.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-[var(--radius)] text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                새 비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border text-foreground placeholder-muted-foreground rounded-[var(--radius)] focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-colors"
                placeholder="8자 이상 입력해주세요"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-foreground mb-2"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border text-foreground placeholder-muted-foreground rounded-[var(--radius)] focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-colors"
                placeholder="비밀번호를 다시 입력해주세요"
                required
                minLength={8}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading || !password || !confirmPassword}
              size="lg"
              className="w-full"
            >
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              비밀번호가 기억나셨나요?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                로그인
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
