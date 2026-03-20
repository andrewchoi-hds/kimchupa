"use client";

import { useState } from "react";
import { toast } from "@/stores/toastStore";

interface ShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

export default function ShareButtons({
  url,
  title,
  description,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("링크가 복사되었어요!", "친구에게 공유해보세요");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했어요", "다시 시도해주세요");
    }
  };

  const handleKakaoShare = async () => {
    // For now, copy the link and show a toast
    try {
      await navigator.clipboard.writeText(url);
      toast.info(
        "링크가 복사되었어요!",
        "카카오톡에 붙여넣기로 공유해보세요"
      );
    } catch {
      toast.error("복사에 실패했어요", "다시 시도해주세요");
    }
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${title}\n${description}`);
    const tweetUrl = encodeURIComponent(url);
    const twitterIntent = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
    window.open(twitterIntent, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex justify-center gap-3">
      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-5 py-3 bg-muted rounded-[var(--radius)] hover:bg-muted/80 transition-colors font-medium text-foreground"
        title="링크 복사"
      >
        <span className="text-xl">{copied ? "✅" : "📋"}</span>
        <span className="text-sm">링크 복사</span>
      </button>

      {/* Kakao */}
      <button
        onClick={handleKakaoShare}
        className="flex items-center gap-2 px-5 py-3 bg-yellow-400 rounded-[var(--radius)] hover:bg-yellow-500 transition-colors font-medium text-black"
        title="카카오톡 공유"
      >
        <span className="text-xl font-bold">K</span>
        <span className="text-sm">카카오톡</span>
      </button>

      {/* Twitter */}
      <button
        onClick={handleTwitterShare}
        className="flex items-center gap-2 px-5 py-3 bg-blue-400 rounded-[var(--radius)] hover:bg-blue-500 transition-colors font-medium text-white"
        title="트위터 공유"
      >
        <span className="text-xl">🐦</span>
        <span className="text-sm">트위터</span>
      </button>
    </div>
  );
}
