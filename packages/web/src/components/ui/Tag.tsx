"use client";

import { X } from "lucide-react";

type TagVariant = "default" | "primary" | "secondary" | "accent";

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-50 text-primary-dark",
  secondary: "bg-secondary-50 text-secondary-dark",
  accent: "bg-accent/10 text-accent-dark",
};

export default function Tag({
  children,
  variant = "default",
  removable = false,
  onRemove,
  className = "",
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
