"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { useFermentationStore, type FermentationEntry } from "@/stores/fermentationStore";
import { KIMCHI_DATA } from "@/constants/kimchi";
import { Plus, Trash2, Check, ChevronDown, ChevronUp, Clock, Thermometer, StickyNote } from "lucide-react";

const ESTIMATED_DAYS_OPTIONS = [1, 3, 7, 14, 30];
const TEMPERATURE_OPTIONS = ["실온", "냉장", "김치냉장고"] as const;

function getDaysSince(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function getFermentationStage(percent: number): { emoji: string; label: string; description: string; color: "primary" | "secondary" | "accent" | "success" } {
  if (percent > 100) {
    return { emoji: "\u2705", label: "발효 완료", description: "냉장 보관을 권장합니다", color: "success" };
  }
  if (percent >= 80) {
    return { emoji: "\ud83d\udfe0", label: "완숙 단계", description: "곧 완성! 맛을 확인해보세요", color: "accent" };
  }
  if (percent >= 50) {
    return { emoji: "\ud83d\udfe1", label: "적정 숙성", description: "맛이 깊어지고 있어요", color: "secondary" };
  }
  if (percent >= 20) {
    return { emoji: "\ud83d\udfe2", label: "숙성 중", description: "유산균이 활발하게 활동 중", color: "primary" };
  }
  return { emoji: "\ud83d\udfe2", label: "초기 발효", description: "소금이 김치에 스며드는 중", color: "primary" };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function getTemperatureEmoji(temp: string): string {
  switch (temp) {
    case "\uc2e4\uc628": return "\ud83c\udf21\ufe0f";
    case "\ub0c9\uc7a5": return "\u2744\ufe0f";
    case "\uae40\uce58\ub0c9\uc7a5\uace0": return "\ud83e\uddc8";
    default: return "\ud83c\udf21\ufe0f";
  }
}

export default function FermentationPage() {
  const t = useTranslations("fermentation");
  const { entries, addEntry, removeEntry, completeEntry, updateMemo } = useFermentationStore();
  const [showForm, setShowForm] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState("");

  // Form state
  const [formKimchiName, setFormKimchiName] = useState("");
  const [formCustomName, setFormCustomName] = useState("");
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [formEstimatedDays, setFormEstimatedDays] = useState(7);
  const [formTemperature, setFormTemperature] = useState<string>("냉장");
  const [formMemo, setFormMemo] = useState("");

  const activeEntries = entries.filter((e) => !e.completed);
  const completedEntries = entries.filter((e) => e.completed);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formKimchiName === "__custom" ? formCustomName : formKimchiName;
    if (!name.trim()) return;

    const kimchiData = KIMCHI_DATA.find((k) => k.name === name);
    addEntry({
      kimchiName: name,
      kimchiId: kimchiData?.id,
      startDate: new Date(formStartDate).toISOString(),
      estimatedDays: formEstimatedDays,
      temperature: formTemperature,
      memo: formMemo,
    });

    // Reset form
    setFormKimchiName("");
    setFormCustomName("");
    setFormStartDate(new Date().toISOString().split("T")[0]);
    setFormEstimatedDays(7);
    setFormTemperature("냉장");
    setFormMemo("");
    setShowForm(false);
  };

  const handleStartMemoEdit = (entry: FermentationEntry) => {
    setEditingMemo(entry.id);
    setMemoText(entry.memo);
  };

  const handleSaveMemo = (id: string) => {
    updateMemo(id, memoText);
    setEditingMemo(null);
    setMemoText("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
          <PageHero
            title={t("title")}
            description={t("description")}
          />
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/profile" className="hover:text-primary transition-colors">
              {t("breadcrumb.profile")}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t("breadcrumb.fermentation")}</span>
          </nav>

          {/* Add New Entry Toggle */}
          <div className="mb-8">
            <Button
              variant={showForm ? "outline" : "primary"}
              icon={showForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? t("form.close") : t("form.add")}
            </Button>

            {/* Add Form */}
            {showForm && (
              <Card padding="lg" className="mt-4">
                <h2 className="text-lg font-bold text-foreground mb-4">{t("form.title")}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Kimchi Type */}
                  <div>
                    <label htmlFor="kimchi-name" className="block text-sm font-medium text-foreground mb-1">
                      {t("form.kimchiType")}
                    </label>
                    <select
                      id="kimchi-name"
                      value={formKimchiName}
                      onChange={(e) => setFormKimchiName(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t("form.selectKimchi")}</option>
                      {KIMCHI_DATA.map((kimchi) => (
                        <option key={kimchi.id} value={kimchi.name}>
                          {kimchi.name}
                        </option>
                      ))}
                      <option value="__custom">{t("form.customKimchi")}</option>
                    </select>
                  </div>

                  {/* Custom Name */}
                  {formKimchiName === "__custom" && (
                    <div>
                      <label htmlFor="custom-name" className="block text-sm font-medium text-foreground mb-1">
                        {t("form.customName")}
                      </label>
                      <input
                        id="custom-name"
                        type="text"
                        value={formCustomName}
                        onChange={(e) => setFormCustomName(e.target.value)}
                        placeholder={t("form.customNamePlaceholder")}
                        className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        maxLength={30}
                      />
                    </div>
                  )}

                  {/* Start Date */}
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-foreground mb-1">
                      {t("form.startDate")}
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Estimated Days */}
                  <div>
                    <label htmlFor="estimated-days" className="block text-sm font-medium text-foreground mb-1">
                      {t("form.estimatedDays")}
                    </label>
                    <select
                      id="estimated-days"
                      value={formEstimatedDays}
                      onChange={(e) => setFormEstimatedDays(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {ESTIMATED_DAYS_OPTIONS.map((days) => (
                        <option key={days} value={days}>
                          {t("form.days", { count: days })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t("form.storageMethod")}
                    </label>
                    <div className="flex gap-3">
                      {TEMPERATURE_OPTIONS.map((temp) => (
                        <label
                          key={temp}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-[var(--radius)] cursor-pointer transition-colors ${
                            formTemperature === temp
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="temperature"
                            value={temp}
                            checked={formTemperature === temp}
                            onChange={(e) => setFormTemperature(e.target.value)}
                            className="sr-only"
                          />
                          <span>{getTemperatureEmoji(temp)}</span>
                          <span className="text-sm font-medium">{t(`temperature.${temp}`)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Memo */}
                  <div>
                    <label htmlFor="memo" className="block text-sm font-medium text-foreground mb-1">
                      {t("form.memo")}
                    </label>
                    <textarea
                      id="memo"
                      value={formMemo}
                      onChange={(e) => setFormMemo(e.target.value)}
                      placeholder={t("form.memoPlaceholder")}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      maxLength={200}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!formKimchiName || (formKimchiName === "__custom" && !formCustomName.trim())}
                  >
                    {t("form.submit")}
                  </Button>
                </form>
              </Card>
            )}
          </div>

          {/* Active Fermentation List */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {t("active.title")} ({activeEntries.length})
            </h2>

            {activeEntries.length === 0 ? (
              <Card padding="lg" className="text-center">
                <p className="text-4xl mb-3">{"\ud83e\udead"}</p>
                <p className="text-muted-foreground">{t("active.empty")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("active.emptyHint")}</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeEntries.map((entry) => {
                  const days = getDaysSince(entry.startDate);
                  const percent = Math.round((days / entry.estimatedDays) * 100);
                  const stage = getFermentationStage(percent);

                  return (
                    <Card key={entry.id} padding="lg" className="relative">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">
                            {"\ud83e\uddc0"} {entry.kimchiName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(entry.startDate)} {t("active.started")}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">
                            D+{days}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            / {entry.estimatedDays}{t("active.daysUnit")}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {stage.emoji} {stage.label}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {Math.min(percent, 100)}%
                          </span>
                        </div>
                        <ProgressBar
                          value={Math.min(percent, 100)}
                          size="md"
                          color={stage.color}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {stage.description}
                        </p>
                      </div>

                      {/* Info badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                          <Thermometer className="h-3 w-3" />
                          {getTemperatureEmoji(entry.temperature)} {t(`temperature.${entry.temperature}`)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {t("active.estimated", { days: entry.estimatedDays })}
                        </span>
                      </div>

                      {/* Memo */}
                      {editingMemo === entry.id ? (
                        <div className="mb-3">
                          <textarea
                            value={memoText}
                            onChange={(e) => setMemoText(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-border rounded-[var(--radius)] bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            maxLength={200}
                          />
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="primary" onClick={() => handleSaveMemo(entry.id)}>
                              {t("active.saveMemo")}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingMemo(null)}>
                              {t("active.cancelMemo")}
                            </Button>
                          </div>
                        </div>
                      ) : entry.memo ? (
                        <div
                          className="mb-3 p-3 bg-muted rounded-[var(--radius)] text-sm text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                          onClick={() => handleStartMemoEdit(entry)}
                        >
                          <div className="flex items-start gap-2">
                            <StickyNote className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>{entry.memo}</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartMemoEdit(entry)}
                          className="mb-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          + {t("active.addMemo")}
                        </button>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button
                          size="sm"
                          variant="primary"
                          icon={<Check className="h-4 w-4" />}
                          onClick={() => completeEntry(entry.id)}
                        >
                          {t("active.complete")}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<Trash2 className="h-4 w-4" />}
                          onClick={() => removeEntry(entry.id)}
                        >
                          {t("active.delete")}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* Completed List */}
          {completedEntries.length > 0 && (
            <section className="mb-8">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center gap-2 text-xl font-bold text-foreground mb-4 hover:text-primary transition-colors"
              >
                {showCompleted ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                {t("completed.title")} ({completedEntries.length})
              </button>

              {showCompleted && (
                <div className="space-y-3">
                  {completedEntries.map((entry) => {
                    const totalDays = entry.completedAt
                      ? Math.floor((new Date(entry.completedAt).getTime() - new Date(entry.startDate).getTime()) / (1000 * 60 * 60 * 24))
                      : entry.estimatedDays;

                    return (
                      <Card key={entry.id} padding="md" className="opacity-80">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">
                              {"\u2705"} {entry.kimchiName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(entry.startDate)} ~ {entry.completedAt ? formatDate(entry.completedAt) : "-"}
                              {" "}({totalDays}{t("active.daysUnit")})
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                              {getTemperatureEmoji(entry.temperature)} {t(`temperature.${entry.temperature}`)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={<Trash2 className="h-4 w-4" />}
                              onClick={() => removeEntry(entry.id)}
                            />
                          </div>
                        </div>
                        {entry.memo && (
                          <p className="text-sm text-muted-foreground mt-2 pl-6">
                            {entry.memo}
                          </p>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Tips Section */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">
              {"\ud83d\udca1"} {t("tips.title")}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Card padding="md" hover>
                <h3 className="font-bold text-foreground mb-2">{t("tips.tempTitle")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{"\u2022"} {t("tips.temp1")}</li>
                  <li>{"\u2022"} {t("tips.temp2")}</li>
                  <li>{"\u2022"} {t("tips.temp3")}</li>
                </ul>
              </Card>
              <Card padding="md" hover>
                <h3 className="font-bold text-foreground mb-2">{t("tips.speedTitle")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{"\u2022"} {t("tips.speed1")}</li>
                  <li>{"\u2022"} {t("tips.speed2")}</li>
                  <li>{"\u2022"} {t("tips.speed3")}</li>
                </ul>
              </Card>
              <Card padding="md" hover>
                <h3 className="font-bold text-foreground mb-2">{t("tips.checkTitle")}</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{"\u2022"} {t("tips.check1")}</li>
                  <li>{"\u2022"} {t("tips.check2")}</li>
                  <li>{"\u2022"} {t("tips.check3")}</li>
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
