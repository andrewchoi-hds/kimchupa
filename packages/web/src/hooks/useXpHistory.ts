"use client";

import { useQuery } from "@tanstack/react-query";

export function useXpHistory() {
  return useQuery({
    queryKey: ["xp-history"],
    queryFn: async () => {
      const res = await fetch("/api/xp");
      if (!res.ok) throw new Error("Failed to fetch XP history");
      return res.json();
    },
  });
}
