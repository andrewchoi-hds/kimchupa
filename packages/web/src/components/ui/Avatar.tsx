"use client";

import Image from "next/image";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; px: number }> = {
  xs: { container: "h-6 w-6", text: "text-[10px]", px: 24 },
  sm: { container: "h-8 w-8", text: "text-xs", px: 32 },
  md: { container: "h-10 w-10", text: "text-sm", px: 40 },
  lg: { container: "h-14 w-14", text: "text-lg", px: 56 },
  xl: { container: "h-20 w-20", text: "text-2xl", px: 80 },
};

function getInitials(name?: string): string {
  if (!name) return "?";
  return name.slice(0, 1).toUpperCase();
}

function getColorFromName(name?: string): string {
  if (!name) return "bg-muted";
  const colors = [
    "bg-primary/20 text-primary",
    "bg-secondary/20 text-secondary",
    "bg-accent/20 text-accent-dark",
    "bg-info/20 text-info",
    "bg-success/20 text-success",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const { container, text, px } = sizeMap[size];

  if (src) {
    return (
      <div className={`relative ${container} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <Image
          src={src}
          alt={name || "Avatar"}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`${container} rounded-full flex items-center justify-center flex-shrink-0 font-medium ${getColorFromName(name)} ${text} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
