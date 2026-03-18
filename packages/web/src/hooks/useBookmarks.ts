"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useBookmarks() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await fetch("/api/bookmarks");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      return res.json();
    },
    enabled: !!session?.user,
    retry: false,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/bookmarks/${postId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle bookmark");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
