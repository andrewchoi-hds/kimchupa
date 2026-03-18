"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
// Local validation (replaces authStore functions)
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: "비밀번호는 8자 이상이어야 합니다." };
  if (!/[a-zA-Z]/.test(password)) return { valid: false, message: "비밀번호에 영문자가 포함되어야 합니다." };
  if (!/[0-9]/.test(password)) return { valid: false, message: "비밀번호에 숫자가 포함되어야 합니다." };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, message: "비밀번호에 특수문자가 포함되어야 합니다." };
  return { valid: true, message: "" };
}
import { toast } from "@/stores/toastStore";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    agreeTerms: false,
    agreePrivacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 실시간 유효성 검사
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        if (value && !validateEmail(value)) {
          newErrors.email = "올바른 이메일 형식이 아닙니다.";
        } else {
          delete newErrors.email;
        }
        break;
      case "nickname":
        if (value && value.trim().length < 2) {
          newErrors.nickname = "닉네임은 2자 이상이어야 합니다.";
        } else if (value && value.trim().length > 20) {
          newErrors.nickname = "닉네임은 20자 이하여야 합니다.";
        } else {
          delete newErrors.nickname;
        }
        break;
      case "password":
        const passwordValidation = validatePassword(value);
        if (value && !passwordValidation.valid) {
          newErrors.password = passwordValidation.message;
        } else {
          delete newErrors.password;
        }
        // 비밀번호 확인도 다시 체크
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // 텍스트 필드에 대해 실시간 유효성 검사
    if (type !== "checkbox") {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전체 유효성 검사
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (formData.nickname.trim().length < 2) {
      newErrors.nickname = "닉네임은 2자 이상이어야 합니다.";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "이용약관에 동의해주세요.";
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = "개인정보처리방침에 동의해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // 회원가입 API 호출
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
        }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        const msg = result.error?.message || "다시 시도해주세요.";
        toast.error("회원가입 실패", msg);
        setErrors({ submit: msg });
        return;
      }

      toast.success("회원가입 성공!", "김추페에 오신 것을 환영합니다.");

      // 자동 로그인
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // 로그인 실패해도 회원가입은 성공했으므로 로그인 페이지로 이동
        router.push("/login");
      } else {
        // 로그인 성공 시 메인 페이지로 이동
        toast.xp(10, "회원가입 보너스");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("오류 발생", "회원가입 중 문제가 발생했습니다.");
      setErrors({ submit: "회원가입 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  // 비밀번호 강도 표시
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { level: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-zA-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    const levels = [
      { level: 0, text: "", color: "" },
      { level: 1, text: "약함", color: "bg-error" },
      { level: 2, text: "보통", color: "bg-warning" },
      { level: 3, text: "좋음", color: "bg-success/70" },
      { level: 4, text: "강함", color: "bg-success" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength();

  const inputBaseClass =
    "w-full px-4 py-3 bg-muted border text-foreground placeholder-muted-foreground rounded-[var(--radius)] focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card padding="lg">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-primary">
              김추페
            </Link>
            <p className="text-muted-foreground mt-2">
              김치 마스터가 되는 여정을 시작하세요
            </p>
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-[var(--radius)] text-error text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputBaseClass} ${
                  errors.email
                    ? "border-error"
                    : "border-border"
                }`}
                placeholder="email@example.com"
                required
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-foreground mb-2"
              >
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className={`${inputBaseClass} ${
                  errors.nickname
                    ? "border-error"
                    : "border-border"
                }`}
                placeholder="김치마스터"
                required
                disabled={isLoading}
              />
              {errors.nickname && (
                <p className="text-error text-xs mt-1">{errors.nickname}</p>
              )}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputBaseClass} ${
                  errors.password
                    ? "border-error"
                    : "border-border"
                }`}
                placeholder="8자 이상, 영문+숫자+특수문자"
                required
                disabled={isLoading}
              />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength.level
                            ? passwordStrength.color
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    비밀번호 강도: {passwordStrength.text}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-error text-xs mt-1">{errors.password}</p>
              )}
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${inputBaseClass} ${
                  errors.confirmPassword
                    ? "border-error"
                    : "border-border"
                }`}
                placeholder="비밀번호를 다시 입력하세요"
                required
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>
              )}
              {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-success text-xs mt-1">비밀번호가 일치합니다.</p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mr-2 mt-1 rounded-[var(--radius-sm)] border-border"
                  disabled={isLoading}
                />
                <span>
                  <Link href="/terms" className="text-primary hover:underline">
                    이용약관
                  </Link>
                  에 동의합니다 (필수)
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-error text-xs ml-5">{errors.agreeTerms}</p>
              )}
              <label className="flex items-start text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleChange}
                  className="mr-2 mt-1 rounded-[var(--radius-sm)] border-border"
                  disabled={isLoading}
                />
                <span>
                  <Link href="/privacy" className="text-primary hover:underline">
                    개인정보처리방침
                  </Link>
                  에 동의합니다 (필수)
                </span>
              </label>
              {errors.agreePrivacy && (
                <p className="text-error text-xs ml-5">{errors.agreePrivacy}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={isLoading}
              size="lg"
              className="w-full mt-6"
            >
              {isLoading ? "회원가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  간편 가입
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
                HireVisa 계정으로 가입
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleSocialLogin("google")}
                title="Google로 가입"
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
                title="카카오로 가입"
              >
                <span className="text-lg font-bold text-foreground">K</span>
              </button>
              <button
                onClick={() => handleSocialLogin("naver")}
                className="inline-flex items-center justify-center h-12 rounded-[var(--radius)] bg-green-500 hover:bg-green-600 transition-colors"
                title="네이버로 가입"
              >
                <span className="text-lg font-bold text-white">N</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          가입 시 Lv.1 김치 새싹으로 시작합니다
        </p>
      </div>
    </div>
  );
}
