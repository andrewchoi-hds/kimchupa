"use client";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterBar({ options, value, onChange, className = "" }: FilterBarProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 scrollbar-hide ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-shrink-0 px-4 py-2 text-sm rounded-full transition-colors ${
            value === option.value
              ? "bg-primary text-white font-medium"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ml-1.5 opacity-70">({option.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}
