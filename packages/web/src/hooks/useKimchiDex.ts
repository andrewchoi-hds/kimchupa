"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useKimchiDex() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["kimchi-dex"],
    queryFn: async () => {
      const res = await fetch("/api/kimchi-dex");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch KimchiDex");
      return res.json();
    },
    enabled: !!session?.user,
    retry: false,
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

export function useDeleteKimchiDex() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kimchiId: string) => {
      const res = await fetch("/api/kimchi-dex", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kimchiId }),
      });
      if (!res.ok) throw new Error("Failed to delete KimchiDex entry");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kimchi-dex"] });
    },
  });
}
