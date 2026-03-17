import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export default function StatCard({ label, value, icon: Icon, trend, className = "" }: StatCardProps) {
  return (
    <div className={`bg-card rounded-[var(--radius-lg)] border border-border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <div className={`text-xs mt-1 ${trend.positive ? "text-success" : "text-error"}`}>
          {trend.positive ? "+" : ""}{trend.value}%
        </div>
      )}
    </div>
  );
}
