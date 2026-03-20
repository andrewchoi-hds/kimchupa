"use client";

import { Heart, MessageCircle, Eye } from "lucide-react";
import Avatar from "./Avatar";
import Tag from "./Tag";

interface PostCardProps {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  author: { name?: string | null; nickname?: string | null; image?: string | null };
  likeCount: number;
  commentCount: number;
  viewCount: number;
  tags: { tag: string }[] | string[];
  createdAt: string;
  images?: string[];
  onClick?: () => void;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  recipe: { label: "레시피", color: "text-primary" },
  free: { label: "자유", color: "text-muted-foreground" },
  qna: { label: "Q&A", color: "text-info" },
  review: { label: "리뷰", color: "text-accent-dark" },
  diary: { label: "일기", color: "text-secondary" },
};

export default function PostCard({
  type,
  title,
  excerpt,
  author,
  likeCount,
  commentCount,
  viewCount,
  tags,
  createdAt,
  onClick,
}: PostCardProps) {
  const typeInfo = typeLabels[type] || typeLabels.free;
  const displayName = author.nickname || author.name || "익명";
  const timeAgo = getTimeAgo(createdAt);

  return (
    <article
      onClick={onClick}
      className="bg-card rounded-[var(--radius-lg)] border border-border p-5 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium ${typeInfo.color}`}>
          {typeInfo.label}
        </span>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>

      <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {excerpt}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 3).map((t) => {
            const tagStr = typeof t === "string" ? t : t.tag;
            return <Tag key={tagStr} variant="primary">{tagStr}</Tag>;
          })}
          {tags.length > 3 && (
            <span className="text-xs text-muted-foreground self-center">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Avatar src={author.image} name={displayName} size="xs" />
          <span className="text-sm text-muted-foreground">{displayName}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {likeCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {commentCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {viewCount}
          </span>
        </div>
      </div>
    </article>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}
