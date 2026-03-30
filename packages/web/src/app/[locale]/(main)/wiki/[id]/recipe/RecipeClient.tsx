"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  ArrowLeft,
  Snowflake,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Ingredient {
  name: string;
  amount: string | null;
  isMain: boolean;
}

interface RecipeData {
  id: string;
  name: string;
  nameEn: string;
  imageUrl: string;
  makingProcess: string | null;
  ingredients: Ingredient[];
  storageMethod: string | null;
}

interface RecipeStep {
  number: number;
  description: string;
  timerMinutes: number | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseSteps(makingProcess: string): RecipeStep[] {
  const lines = makingProcess
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const steps: RecipeStep[] = [];
  let stepNumber = 1;

  for (const line of lines) {
    // Match numbered lines like "1. ...", "1) ...", "① ..."
    const numbered = line.match(
      /^(?:\d+[.)]\s*|[①②③④⑤⑥⑦⑧⑨⑩]\s*)(.*)/
    );
    const description = numbered ? numbered[1].trim() : line;

    // Skip empty descriptions or section headers
    if (!description || description.length < 3) continue;

    // Extract timer hints from the text
    const timerMinutes = extractTimerMinutes(description);

    steps.push({
      number: stepNumber++,
      description,
      timerMinutes,
    });
  }

  return steps;
}

function extractTimerMinutes(text: string): number | null {
  // Match patterns like "8-12시간", "30분", "1-2일", "약 10분"
  const hourMatch = text.match(/(\d+)[-~]?(\d+)?\s*시간/);
  if (hourMatch) {
    const hours = hourMatch[2]
      ? Math.round((parseInt(hourMatch[1]) + parseInt(hourMatch[2])) / 2)
      : parseInt(hourMatch[1]);
    return hours * 60;
  }

  const minuteMatch = text.match(/(\d+)[-~]?(\d+)?\s*분/);
  if (minuteMatch) {
    return minuteMatch[2]
      ? Math.round(
          (parseInt(minuteMatch[1]) + parseInt(minuteMatch[2])) / 2
        )
      : parseInt(minuteMatch[1]);
  }

  const dayMatch = text.match(/(\d+)[-~]?(\d+)?\s*일/);
  if (dayMatch) {
    const days = dayMatch[2]
      ? Math.round((parseInt(dayMatch[1]) + parseInt(dayMatch[2])) / 2)
      : parseInt(dayMatch[1]);
    return days * 24 * 60;
  }

  return null;
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatTimerLabel(minutes: number): string {
  if (minutes >= 1440) {
    const days = Math.round(minutes / 1440);
    return `${days}일`;
  }
  if (minutes >= 60) {
    const hours = Math.round(minutes / 60);
    return `${hours}시간`;
  }
  return `${minutes}분`;
}

// ---------------------------------------------------------------------------
// StepTimer (inline component)
// ---------------------------------------------------------------------------

function StepTimer({
  minutes,
  onComplete,
}: {
  minutes: number;
  onComplete: () => void;
}) {
  const [remaining, setRemaining] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setFinished(true);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining, onComplete]);

  const handleReset = () => {
    setRunning(false);
    setFinished(false);
    setRemaining(minutes * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const progress = ((minutes * 60 - remaining) / (minutes * 60)) * 100;

  return (
    <div
      className={`mt-3 p-4 rounded-[var(--radius)] border ${
        finished
          ? "bg-success/10 border-success/30"
          : "bg-primary-50 border-primary/20"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span
            className={`text-2xl font-mono font-bold ${
              finished ? "text-success" : "text-foreground"
            }`}
          >
            {formatTime(remaining)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!finished && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRunning(!running)}
              icon={
                running ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )
              }
            >
              {running ? "일시정지" : "시작"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            초기화
          </Button>
        </div>
      </div>
      <ProgressBar
        value={progress}
        size="sm"
        color={finished ? "success" : "primary"}
      />
      {finished && (
        <p className="text-sm text-success font-medium mt-2">
          타이머가 완료되었습니다!
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TimerModal
// ---------------------------------------------------------------------------

function TimerModal({
  stepNumber,
  minutes,
  onClose,
}: {
  stepNumber: number;
  minutes: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-[var(--radius-lg)] p-6 w-full max-w-sm mx-4 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-foreground mb-1">
          {stepNumber}단계 타이머
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {formatTimerLabel(minutes)}
        </p>
        <StepTimer minutes={minutes} onComplete={() => {}} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RecipeClient
// ---------------------------------------------------------------------------

export default function RecipeClient({ data }: { data: RecipeData }) {
  // const t = useTranslations("wiki"); // unused for now

  const steps = data.makingProcess ? parseSteps(data.makingProcess) : [];
  const hasSteps = steps.length > 0;

  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [activeTimer, setActiveTimer] = useState<{
    stepNumber: number;
    minutes: number;
  } | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);

  const allStepsComplete =
    hasSteps && completedSteps.size === steps.length;

  useEffect(() => {
    if (allStepsComplete && !showCongrats) {
      setShowCongrats(true);
    }
  }, [allStepsComplete, showCongrats]);

  const toggleIngredient = useCallback((name: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }, []);

  const toggleStep = useCallback((num: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  }, []);

  const completionPercent = hasSteps
    ? Math.round((completedSteps.size / steps.length) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                홈
              </Link>
              <span>/</span>
              <Link href="/wiki" className="hover:text-primary">
                김치백과
              </Link>
              <span>/</span>
              <Link
                href={`/wiki/${data.id}`}
                className="hover:text-primary"
              >
                {data.name}
              </Link>
              <span>/</span>
              <span className="text-foreground">레시피</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-12">
          <div className="container mx-auto px-4">
            <Link
              href={`/wiki/${data.id}`}
              className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {data.name} 백과로 돌아가기
            </Link>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-40 h-40 bg-white/20 rounded-[var(--radius-lg)] overflow-hidden relative shrink-0">
                {data.imageUrl && data.imageUrl.startsWith("http") ? (
                  <Image
                    src={data.imageUrl}
                    alt={data.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-7xl">🥬</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ChefHat className="w-8 h-8" />
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {data.name} 만들기
                  </h1>
                </div>
                <p className="text-xl text-white/90 mb-2">
                  {data.nameEn} Recipe
                </p>
                <p className="text-white/70">
                  단계별 레시피를 따라 직접 {data.name}을(를) 만들어보세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress bar (sticky) */}
        {hasSteps && (
          <div className="sticky top-16 z-40 bg-card border-b border-border">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground shrink-0">
                  진행률 {completionPercent}%
                </span>
                <ProgressBar
                  value={completionPercent}
                  size="md"
                  color={allStepsComplete ? "success" : "primary"}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground shrink-0">
                  {completedSteps.size}/{steps.length}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Ingredients Checklist */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-primary" />
                </span>
                재료 준비
              </h2>

              {data.ingredients.some((i) => i.isMain) && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    주재료
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.ingredients
                      .filter((i) => i.isMain)
                      .map((ingredient) => (
                        <label
                          key={ingredient.name}
                          className={`flex items-center gap-3 p-3 rounded-[var(--radius)] border cursor-pointer transition-colors ${
                            checkedIngredients.has(ingredient.name)
                              ? "bg-success/10 border-success/30"
                              : "bg-card border-border hover:bg-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checkedIngredients.has(ingredient.name)}
                            onChange={() =>
                              toggleIngredient(ingredient.name)
                            }
                            className="sr-only"
                          />
                          {checkedIngredients.has(ingredient.name) ? (
                            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                          )}
                          <span
                            className={`font-medium ${
                              checkedIngredients.has(ingredient.name)
                                ? "text-foreground line-through opacity-70"
                                : "text-foreground"
                            }`}
                          >
                            {ingredient.name}
                          </span>
                          {ingredient.amount && (
                            <span className="ml-auto text-sm text-muted-foreground">
                              {ingredient.amount}
                            </span>
                          )}
                        </label>
                      ))}
                  </div>
                </div>
              )}

              {data.ingredients.some((i) => !i.isMain) && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    부재료
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.ingredients
                      .filter((i) => !i.isMain)
                      .map((ingredient) => (
                        <label
                          key={ingredient.name}
                          className={`flex items-center gap-3 p-3 rounded-[var(--radius)] border cursor-pointer transition-colors ${
                            checkedIngredients.has(ingredient.name)
                              ? "bg-success/10 border-success/30"
                              : "bg-card border-border hover:bg-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checkedIngredients.has(ingredient.name)}
                            onChange={() =>
                              toggleIngredient(ingredient.name)
                            }
                            className="sr-only"
                          />
                          {checkedIngredients.has(ingredient.name) ? (
                            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                          )}
                          <span
                            className={`font-medium ${
                              checkedIngredients.has(ingredient.name)
                                ? "text-foreground line-through opacity-70"
                                : "text-foreground"
                            }`}
                          >
                            {ingredient.name}
                          </span>
                          {ingredient.amount && (
                            <span className="ml-auto text-sm text-muted-foreground">
                              {ingredient.amount}
                            </span>
                          )}
                        </label>
                      ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Steps */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-accent/15 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent-dark" />
                </span>
                만드는 방법
              </h2>

              {hasSteps ? (
                <div className="space-y-4">
                  {steps.map((step) => {
                    const isComplete = completedSteps.has(step.number);

                    return (
                      <div key={step.number} className="relative">
                        {/* Vertical line connector */}
                        {step.number < steps.length && (
                          <div
                            className={`absolute left-5 top-12 bottom-0 w-0.5 ${
                              isComplete ? "bg-success/40" : "bg-border"
                            }`}
                          />
                        )}

                        <div
                          className={`relative flex gap-4 p-4 rounded-[var(--radius-lg)] border transition-colors ${
                            isComplete
                              ? "bg-success/5 border-success/30"
                              : "bg-card border-border"
                          }`}
                        >
                          {/* Step number circle */}
                          <button
                            onClick={() => toggleStep(step.number)}
                            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                              isComplete
                                ? "bg-success text-white"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                            }`}
                            aria-label={`${step.number}단계 ${isComplete ? "완료 취소" : "완료 표시"}`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              step.number
                            )}
                          </button>

                          {/* Step content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-foreground leading-relaxed ${
                                  isComplete ? "line-through opacity-60" : ""
                                }`}
                              >
                                {step.description}
                              </p>
                            </div>

                            {/* Timer button */}
                            {step.timerMinutes && (
                              <button
                                onClick={() =>
                                  setActiveTimer({
                                    stepNumber: step.number,
                                    minutes: step.timerMinutes!,
                                  })
                                }
                                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                타이머 {formatTimerLabel(step.timerMinutes)}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChefHat className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    이 김치의 레시피는 아직 준비 중입니다.
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    곧 자세한 레시피가 추가될 예정입니다.
                  </p>
                </div>
              )}
            </Card>

            {/* Congratulations */}
            {showCongrats && allStepsComplete && (
              <Card padding="lg" className="text-center">
                <div className="py-4">
                  <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    축하합니다!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {data.name} 만들기를 완료했습니다!
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/profile/kimchi-dex">
                      <Button variant="primary" size="lg">
                        김치 도감에 등록
                      </Button>
                    </Link>
                    <Link href={`/wiki/${data.id}`}>
                      <Button variant="outline" size="lg">
                        {data.name} 백과 보기
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Storage tips */}
            {data.storageMethod && (
              <Card padding="lg">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-info/15 rounded-full flex items-center justify-center">
                    <Snowflake className="w-5 h-5 text-info" />
                  </span>
                  보관 방법
                </h2>
                <div className="p-4 bg-info/5 rounded-[var(--radius)] border border-info/20">
                  <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
                    {data.storageMethod}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Timer Modal */}
      {activeTimer && (
        <TimerModal
          stepNumber={activeTimer.stepNumber}
          minutes={activeTimer.minutes}
          onClose={() => setActiveTimer(null)}
        />
      )}
    </div>
  );
}
