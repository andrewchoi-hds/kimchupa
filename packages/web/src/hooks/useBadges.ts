"use client";

import { useQuery } from "@tanstack/react-query";

export function useBadges() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges");
      if (!res.ok) throw new Error("Failed to fetch badges");
      return res.json();
    },
  });
}

export function useUserBadges() {
  return useQuery({
    queryKey: ["user-badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges/me");
      if (!res.ok) throw new Error("Failed to fetch user badges");
      return res.json();
    },
  });
}
