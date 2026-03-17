"use client";

import Link from "next/link";
import { useState } from "react";
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setIsLoading(true);

    // Mock API call - simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              이메일을 확인해주세요
            </h1>
            <p className="text-muted-foreground mb-6">
              <strong className="text-foreground">{email}</strong>
              <br />
              위 이메일 주소로 비밀번호 재설정 링크를 발송했습니다.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.
              <br />
              몇 분 후에도 이메일이 오지 않으면 다시 시도해주세요.
            </p>
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
              >
                다른 이메일로 다시 시도
              </Button>
              <Link href="/login" className="block">
                <Button size="lg" className="w-full">
                  로그인으로 돌아가기
                </Button>
              </Link>
            </div>
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
              비밀번호를 잊으셨나요?
            </h1>
            <p className="text-muted-foreground text-sm">
              가입한 이메일 주소를 입력하시면
              <br />
              비밀번호 재설정 링크를 보내드립니다.
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
              />
            </div>

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading || !email}
              size="lg"
              className="w-full"
            >
              {isLoading ? "전송 중..." : "비밀번호 재설정 링크 받기"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              비밀번호가 기억나셨나요?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              회원가입
            </Link>
          </p>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          이 기능은 현재 데모 버전입니다.
          <br />
          실제 이메일은 발송되지 않습니다.
        </p>
      </div>
    </div>
  );
}
