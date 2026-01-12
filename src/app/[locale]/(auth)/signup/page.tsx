"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    console.log("Signup:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-red-600">
              김추페
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              김치 마스터가 되는 여정을 시작하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                placeholder="김치마스터"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">
                8자 이상, 영문, 숫자, 특수문자 포함
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-zinc-700 dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mr-2 mt-1 rounded border-zinc-300"
                  required
                />
                <span>
                  <Link href="/terms" className="text-red-600 hover:underline">
                    이용약관
                  </Link>
                  에 동의합니다 (필수)
                </span>
              </label>
              <label className="flex items-start text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleChange}
                  className="mr-2 mt-1 rounded border-zinc-300"
                  required
                />
                <span>
                  <Link href="/privacy" className="text-red-600 hover:underline">
                    개인정보처리방침
                  </Link>
                  에 동의합니다 (필수)
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors mt-6"
            >
              회원가입
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-300 dark:border-zinc-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-zinc-800 text-zinc-500">
                  간편 가입
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                <span className="text-xl">G</span>
              </button>
              <button className="flex items-center justify-center py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                <span className="text-xl">K</span>
              </button>
              <button className="flex items-center justify-center py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                <span className="text-xl">N</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-red-600 font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          가입 시 🌱 Lv.1 김치 새싹으로 시작합니다
        </p>
      </div>
    </div>
  );
}
