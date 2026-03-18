"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useAttendance() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const res = await fetch("/api/attendance");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return res.json();
    },
    enabled: !!session?.user,
    retry: false,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/attendance", { method: "POST" });
      if (!res.ok) throw new Error("Failed to check in");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["xp"] });
    },
  });
}
