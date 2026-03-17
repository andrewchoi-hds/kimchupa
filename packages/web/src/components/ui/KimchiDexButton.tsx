"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useKimchiDex, useUpdateKimchiDex } from "@/hooks/useKimchiDex";
import { toast } from "@/stores/toastStore";

export type CollectionStatus = "want_to_try" | "tried" | "favorite" | null;

const STATUS_CONFIG: Record<
  NonNullable<CollectionStatus>,
  { label: string; emoji: string; color: string; borderColor: string }
> = {
  tried: {
    label: "먹어봤어요",
    emoji: "😋",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    borderColor: "border-green-500",
  },
  favorite: {
    label: "담가봤어요",
    emoji: "👨‍🍳",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    borderColor: "border-blue-500",
  },
  want_to_try: {
    label: "도전할래요",
    emoji: "🎯",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
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

  const dexData = dexRes?.success ? dexRes.data : null;
  const entries: Record<string, { status: CollectionStatus; rating?: number; memo?: string }> =
    dexData?.entries ?? {};
  const entry = entries[kimchiId] ?? null;
  const collected = dexData?.collectedCount ?? 0;
  const total = dexData?.totalCount ?? 0;
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
    }
    setShowOptions(false);
  };

  const handleRating = (rating: number) => {
    if (entry?.status) {
      updateMutation.mutate({ kimchiId, status: entry.status, rating });
    }
  };

  const handleSaveMemo = () => {
    if (entry?.status) {
      updateMutation.mutate(
        { kimchiId, status: entry.status, memo: memoText },
        {
          onSuccess: () => {
            toast.success(t("memoSaved"), t("memoSavedDesc"));
          },
        }
      );
    }
    setShowMemo(false);
  };

  const currentStatus = entry?.status ?? null;

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">📖</span>
          {t("title")}
        </h2>
        <Link
          href="/profile/kimchi-dex"
          className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
        >
          {t("viewDetails")} →
        </Link>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-1">
          <span>{t("collectionProgress")}</span>
          <span>
            {collected}/{total} ({progress}%)
          </span>
        </div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
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
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                {t("myRating")}
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`text-2xl transition-transform hover:scale-110 ${
                      entry?.rating && star <= entry.rating
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
                  className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white resize-none"
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
                    className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {t("cancelMemo")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMemoText(entry?.memo || "");
                  setShowMemo(true);
                }}
                className="w-full p-3 border border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-sm text-zinc-500 hover:border-amber-500 hover:text-amber-500 transition-colors text-left"
              >
                {entry?.memo ? (
                  <span className="text-zinc-700 dark:text-zinc-300">
                    &quot;{entry.memo}&quot;
                  </span>
                ) : (
                  `📝 ${t("addMemo")}`
                )}
              </button>
            )}
          </div>

          {/* Reset - remove from dex not supported via API mutation, just change status */}
          <button
            onClick={() => handleStatusChange(null)}
            className="w-full py-2 text-sm text-zinc-500 hover:text-red-500 transition-colors"
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
                className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
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
