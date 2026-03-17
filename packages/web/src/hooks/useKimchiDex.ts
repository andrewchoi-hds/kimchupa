"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useKimchiDex() {
  return useQuery({
    queryKey: ["kimchi-dex"],
    queryFn: async () => {
      const res = await fetch("/api/kimchi-dex");
      if (!res.ok) throw new Error("Failed to fetch KimchiDex");
      return res.json();
    },
  });
}

export function useUpdateKimchiDex() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      kimchiId: string;
      status: "want_to_try" | "tried" | "favorite";
      rating?: number;
      memo?: string;
    }) => {
      const res = await fetch("/api/kimchi-dex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update KimchiDex");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kimchi-dex"] });
    },
  });
}
