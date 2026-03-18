"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["user-badges"],
    queryFn: async () => {
      const res = await fetch("/api/badges/me");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user badges");
      return res.json();
    },
    enabled: !!session?.user,
    retry: false,
  });
}
