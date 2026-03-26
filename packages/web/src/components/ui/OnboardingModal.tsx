"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "kimchupa-onboarding-seen";

interface Step {
  emoji: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    emoji: "\u{1F96C}",
    title: "\uD658\uC601\uD569\uB2C8\uB2E4!",
    description: "\uAE40\uCD94\uD398\uC5D0\uC11C \uAE40\uCE58\uC758 \uBAA8\uB4E0 \uAC83\uC744 \uB9CC\uB098\uBCF4\uC138\uC694",
  },
  {
    emoji: "\u{1F3AF}",
    title: "\uB9DE\uCDA4 \uAE40\uCE58 \uCD94\uCC9C",
    description: "8\uAC00\uC9C0 \uC9C8\uBB38\uC73C\uB85C \uB098\uC5D0\uAC8C \uB531 \uB9DE\uB294 \uAE40\uCE58\uB97C \uCC3E\uC544\uBCF4\uC138\uC694",
  },
  {
    emoji: "\u{1F4DA}",
    title: "\uAE40\uCE58\uBC31\uACFC",
    description: "25\uC885 \uAE40\uCE58\uC758 \uC5ED\uC0AC, \uB808\uC2DC\uD53C, \uC601\uC591 \uC815\uBCF4\uB97C \uD0D0\uD5D8\uD558\uC138\uC694",
  },
  {
    emoji: "\u{1F465}",
    title: "\uCEE4\uBBA4\uB2C8\uD2F0",
    description: "\uB808\uC2DC\uD53C\uB97C \uACF5\uC720\uD558\uACE0, \uC9C8\uBB38\uD558\uACE0, \uD568\uAED8 \uC131\uC7A5\uD558\uC138\uC694",
  },
];

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        setVisible(true);
        document.body.style.overflow = "hidden";
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    document.body.style.overflow = "";
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable
    }
  }, []);

  const goTo = useCallback(
    (nextIndex: number, dir: "next" | "prev") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrentStep(nextIndex);
        setAnimating(false);
      }, 200);
    },
    [animating]
  );

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      goTo(currentStep + 1, "next");
    }
  }, [currentStep, goTo]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      goTo(currentStep - 1, "prev");
    }
  }, [currentStep, goTo]);

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, close, handleNext, handlePrev]);

  if (!visible) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-card rounded-[var(--radius-lg)] shadow-2xl overflow-hidden animate-scale-in">
        {/* Skip button */}
        {!isLastStep && (
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            건너뛰기
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Content */}
        <div className="px-8 pt-12 pb-6">
          <div
            className={`flex flex-col items-center text-center transition-all duration-200 ${
              animating
                ? direction === "next"
                  ? "opacity-0 translate-x-8"
                  : "opacity-0 -translate-x-8"
                : "opacity-100 translate-x-0"
            }`}
          >
            {/* Emoji */}
            <div className="text-7xl mb-6 select-none">{step.emoji}</div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-3">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-base leading-relaxed max-w-xs">
              {step.description}
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 py-4">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > currentStep ? "next" : "prev")}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 pt-2">
          {isLastStep ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={close}
                className="w-full h-12 bg-primary text-white font-semibold rounded-[var(--radius)] hover:bg-primary-dark transition-colors"
              >
                시작하기
              </button>
              <Link
                href="/recommendation"
                onClick={close}
                className="w-full h-11 flex items-center justify-center gap-2 bg-primary/10 text-primary font-medium rounded-[var(--radius)] hover:bg-primary/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                김치 추천 먼저 받기
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex items-center gap-1 h-10 px-4 rounded-[var(--radius)] font-medium transition-colors ${
                  currentStep === 0
                    ? "text-transparent cursor-default"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 h-10 px-6 bg-primary text-white font-medium rounded-[var(--radius)] hover:bg-primary-dark transition-colors"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
