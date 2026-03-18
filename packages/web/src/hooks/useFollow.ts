"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface FollowStatus {
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

export function useFollowStatus(userId: string | undefined) {
  return useQuery<{ success: boolean; data: FollowStatus }>({
    queryKey: ["follow", userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/follow`);
      if (!res.ok) throw new Error("Failed to fetch follow status");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/users/${userId}/follow`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to toggle follow");
      return res.json();
    },
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["follow", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
