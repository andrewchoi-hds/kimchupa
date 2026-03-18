"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useKimchiDex, useUpdateKimchiDex, useDeleteKimchiDex } from "@/hooks/useKimchiDex";
import { toast } from "@/stores/toastStore";
import { KIMCHI_DATA } from "@/constants/kimchi";

export type CollectionStatus = "want_to_try" | "tried" | "favorite" | null;

const STATUS_CONFIG: Record<
  NonNullable<CollectionStatus>,
  { label: string; emoji: string; color: string; borderColor: string }
> = {
  tried: {
    label: "먹어봤어요",
    emoji: "😋",
    color: "bg-green-100 text-green-700",
    borderColor: "border-green-500",
  },
  favorite: {
    label: "담가봤어요",
    emoji: "👨‍🍳",
    color: "bg-blue-100 text-blue-700",
    borderColor: "border-blue-500",
  },
  want_to_try: {
    label: "도전할래요",
    emoji: "🎯",
    color: "bg-amber-100 text-amber-700",
    borderColor: "border-amber-500",
  },
};

interface KimchiDexButtonProps {
  kimchiId: string;
  kimchiName: string;
}

export default function KimchiDexButton({
  kimchiId,
  kimchiName,
}: KimchiDexButtonProps) {
  const t = useTranslations("profile.kimchiDex");
  const [showOptions, setShowOptions] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [memoText, setMemoText] = useState("");

  const { data: dexRes, isLoading } = useKimchiDex();
  const updateMutation = useUpdateKimchiDex();
  const deleteMutation = useDeleteKimchiDex();

  // API returns { success: true, data: KimchiDexEntry[] }
  const dexEntries: Array<{
    kimchiId: string;
    status: string;
    rating?: number | null;
    memo?: string | null;
  }> = dexRes?.success ? (Array.isArray(dexRes.data) ? dexRes.data : []) : [];

  const entry = dexEntries.find((e) => e.kimchiId === kimchiId) ?? null;
  const currentEntry: { status: CollectionStatus; rating?: number; memo?: string } | null = entry
    ? {
        status: entry.status as CollectionStatus,
        rating: entry.rating ?? undefined,
        memo: entry.memo ?? undefined,
      }
    : null;
  const collected = dexEntries.filter(
    (e) => e.status === "tried" || e.status === "favorite"
  ).length;
  const total = KIMCHI_DATA.length;
  const progress = total > 0 ? Math.round((collected / total) * 100) : 0;

  const handleStatusChange = (status: CollectionStatus) => {
    if (status) {
      updateMutation.mutate(
        { kimchiId, status },
        {
          onSuccess: () => {
            const config = STATUS_CONFIG[status];
            toast.success(
              `${config.emoji} ${t("addedToDex")}`,
              t("addedToDexDesc", { name: kimchiName, status: config.label })
            );
          },
        }
      );
    } else {
      deleteMutation.mutate(kimchiId, {
        onSuccess: () => {
          toast.success(t("removedFromDex"), t("removedFromDexDesc", { name: kimchiName }));
        },
      });
    }
    setShowOptions(false);
  };

  const handleRating = (rating: number) => {
    if (currentEntry?.status) {
      updateMutation.mutate({ kimchiId, status: currentEntry.status, rating });
    }
  };

  const handleSaveMemo = () => {
    if (currentEntry?.status) {
      updateMutation.mutate(
        { kimchiId, status: currentEntry.status, memo: memoText },
        {
          onSuccess: () => {
            toast.success(t("memoSaved"), t("memoSavedDesc"));
          },
        }
      );
    }
    setShowMemo(false);
  };

  const currentStatus = currentEntry?.status ?? null;

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-2 bg-muted rounded" />
          <div className="h-12 bg-muted rounded" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">📖</span>
          {t("title")}
        </h2>
        <Link
          href="/profile/kimchi-dex"
          className="text-sm text-amber-600 hover:underline"
        >
          {t("viewDetails")} →
        </Link>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>{t("collectionProgress")}</span>
          <span>
            {collected}/{total} ({progress}%)
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Status */}
      {currentStatus ? (
        <div className="space-y-4">
          <div
            className={`p-3 rounded-lg ${STATUS_CONFIG[currentStatus].color} flex items-center justify-between`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{STATUS_CONFIG[currentStatus].emoji}</span>
              <span className="font-medium">
                {STATUS_CONFIG[currentStatus].label}
              </span>
            </div>
            <button
              onClick={() => setShowOptions(true)}
              className="text-sm opacity-70 hover:opacity-100"
            >
              {t("change")}
            </button>
          </div>

          {/* Rating */}
          {(currentStatus === "tried" || currentStatus === "favorite") && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t("myRating")}
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`text-2xl transition-transform hover:scale-110 ${
                      currentEntry?.rating && star <= currentEntry.rating
                        ? "opacity-100"
                        : "opacity-30"
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Memo */}
          <div>
            {showMemo ? (
              <div className="space-y-2">
                <textarea
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                  placeholder="이 김치에 대한 메모를 남겨보세요..."
                  className="w-full p-3 border border-border rounded-lg bg-card text-foreground resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveMemo}
                    className="flex-1 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    {t("saveMemo")}
                  </button>
                  <button
                    onClick={() => setShowMemo(false)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    {t("cancelMemo")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMemoText(currentEntry?.memo || "");
                  setShowMemo(true);
                }}
                className="w-full p-3 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-amber-500 hover:text-amber-500 transition-colors text-left"
              >
                {currentEntry?.memo ? (
                  <span className="text-muted-foreground">
                    &quot;{currentEntry.memo}&quot;
                  </span>
                ) : (
                  `📝 ${t("addMemo")}`
                )}
              </button>
            )}
          </div>

          {/* Remove from dex */}
          <button
            onClick={() => handleStatusChange(null)}
            className="w-full py-2 text-sm text-muted-foreground hover:text-red-500 transition-colors"
          >
            {t("removeFromDex")}
          </button>
        </div>
      ) : (
        <>
          {/* Status Selection */}
          {showOptions ? (
            <div className="space-y-2">
              {(Object.keys(STATUS_CONFIG) as NonNullable<CollectionStatus>[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full p-3 rounded-lg border-2 ${STATUS_CONFIG[status].borderColor} ${STATUS_CONFIG[status].color} hover:opacity-80 transition-opacity flex items-center gap-3`}
                  >
                    <span className="text-xl">{STATUS_CONFIG[status].emoji}</span>
                    <span className="font-medium">{STATUS_CONFIG[status].label}</span>
                  </button>
                )
              )}
              <button
                onClick={() => setShowOptions(false)}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {t("cancelMemo")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowOptions(true)}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>➕</span>
              {t("addToDex")}
            </button>
          )}
        </>
      )}
    </section>
  );
}
