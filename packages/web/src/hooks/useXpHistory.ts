"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useXpHistory() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["xp-history"],
    queryFn: async () => {
      const res = await fetch("/api/xp");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch XP history");
      return res.json();
    },
    enabled: !!session?.user,
    retry: false,
  });
}
