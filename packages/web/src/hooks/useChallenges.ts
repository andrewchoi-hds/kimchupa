"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useChallenges(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["challenges", page, limit],
    queryFn: async () => {
      const res = await fetch(`/api/challenges?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch challenges");
      return res.json();
    },
  });
}

export function useActiveChallenge() {
  return useQuery({
    queryKey: ["challenges", "active"],
    queryFn: async () => {
      const res = await fetch("/api/challenges?active=true");
      if (!res.ok) throw new Error("Failed to fetch active challenge");
      return res.json();
    },
  });
}

export function useChallengeDetail(id: string | null) {
  return useQuery({
    queryKey: ["challenges", id],
    queryFn: async () => {
      const res = await fetch(`/api/challenges/${id}`);
      if (!res.ok) throw new Error("Failed to fetch challenge");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: string) => {
      const res = await fetch(`/api/challenges/${challengeId}/join`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "참여에 실패했습니다");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

export function useCompleteChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ challengeId, postId }: { challengeId: string; postId?: string }) => {
      const res = await fetch(`/api/challenges/${challengeId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "완료 처리에 실패했습니다");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["xp"] });
    },
  });
}
