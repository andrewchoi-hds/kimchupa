"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "@/stores/toastStore";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        toast.error("로그인 실패", "이메일 또는 비밀번호를 확인해주세요.");
      } else {
        toast.success("로그인 성공!", "김추페에 오신 것을 환영합니다.");
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card padding="lg">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-primary">
              김추페
            </Link>
            <p className="text-muted-foreground mt-2">
              김치의 세계에 오신 것을 환영합니다
            </p>
          </div>

          {error && (
            <div
              role="alert"
              id="login-error"
              className="mb-4 p-3 bg-error/10 border border-error/30 rounded-[var(--radius)] text-error text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border text-foreground placeholder-muted-foreground rounded-[var(--radius)] focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-colors"
                placeholder="email@example.com"
                required
                disabled={isLoading}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border text-foreground placeholder-muted-foreground rounded-[var(--radius)] focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-colors"
                placeholder="••••••••"
                required
                disabled={isLoading}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-muted-foreground">
                <input
                  type="checkbox"
                  className="mr-2 rounded-[var(--radius-sm)] border-border"
                />
                로그인 상태 유지
              </label>
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                비밀번호 찾기
              </Link>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* Demo Account Notice */}
          <div className="mt-4 p-3 bg-muted rounded-[var(--radius)] text-sm text-muted-foreground">
            <p className="font-medium">데모 계정:</p>
            <p>이메일: demo@kimchupa.com</p>
            <p>비밀번호: demo1234</p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  또는
                </span>
              </div>
            </div>

            {/* HireVisa SSO */}
            <div className="mt-6">
              <button
                onClick={() => handleSocialLogin("hirevisa")}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-[var(--radius)] bg-[#1a1a2e] hover:bg-[#16213e] text-white font-medium transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                HireVisa 계정으로 로그인
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleSocialLogin("google")}
                title="Google로 로그인"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>
              <button
                onClick={() => handleSocialLogin("kakao")}
                className="inline-flex items-center justify-center h-12 rounded-[var(--radius)] bg-yellow-400 hover:bg-yellow-500 transition-colors"
                title="카카오로 로그인"
              >
                <span className="text-lg font-bold text-foreground">K</span>
              </button>
              <button
                onClick={() => handleSocialLogin("naver")}
                className="inline-flex items-center justify-center h-12 rounded-[var(--radius)] bg-green-500 hover:bg-green-600 transition-colors"
                title="네이버로 로그인"
              >
                <span className="text-lg font-bold text-white">N</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              회원가입
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
