"use client";

import Image from "next/image";
import Tag from "./Tag";

interface KimchiCardProps {
  name: string;
  nameEn: string;
  description: string;
  imageUrl?: string | null;
  region: string;
  spicyLevel: number;
  fermentationLevel: number;
  tags: { tag: string }[] | string[];
  onClick?: () => void;
}

function SpicyIndicator({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-xs ${i < level ? "text-primary" : "text-muted/50"}`}
        >
          🌶
        </span>
      ))}
    </div>
  );
}

export default function KimchiCard({
  name,
  nameEn,
  description,
  imageUrl,
  region,
  spicyLevel,
  tags,
  onClick,
}: KimchiCardProps) {
  return (
    <article
      onClick={onClick}
      className="bg-card rounded-[var(--radius-lg)] border border-border overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="relative aspect-[4/3] bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            🥬
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full">
            {region}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {name}
          </h3>
          <SpicyIndicator level={spicyLevel} />
        </div>

        <p className="text-xs text-muted-foreground mb-2">{nameEn}</p>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => {
              const tagStr = typeof t === "string" ? t : t.tag;
              return <Tag key={tagStr} variant="secondary">{tagStr}</Tag>;
            })}
          </div>
        )}
      </div>
    </article>
  );
}
