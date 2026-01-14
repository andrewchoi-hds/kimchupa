"use client";

import Link from "next/link";
import { useState } from "react";
import { validateEmail } from "@/stores/authStore";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              이메일을 확인해주세요
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              <strong className="text-zinc-900 dark:text-white">{email}</strong>
              <br />
              위 이메일 주소로 비밀번호 재설정 링크를 발송했습니다.
            </p>
            <p className="text-sm text-zinc-500 mb-8">
              이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.
              <br />
              몇 분 후에도 이메일이 오지 않으면 다시 시도해주세요.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full py-3 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              >
                다른 이메일로 다시 시도
              </button>
              <Link
                href="/login"
                className="block w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-center"
              >
                로그인으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-red-600">
              김추페
            </Link>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white mt-4 mb-2">
              비밀번호를 잊으셨나요?
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              가입한 이메일 주소를 입력하시면
              <br />
              비밀번호 재설정 링크를 보내드립니다.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                placeholder="email@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  전송 중...
                </span>
              ) : (
                "비밀번호 재설정 링크 받기"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              비밀번호가 기억나셨나요?{" "}
              <Link href="/login" className="text-red-600 font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-red-600 font-semibold hover:underline">
              회원가입
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          이 기능은 현재 데모 버전입니다.
          <br />
          실제 이메일은 발송되지 않습니다.
        </p>
      </div>
    </div>
  );
}
