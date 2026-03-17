"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchProfile() {
  const res = await fetch("/api/users/me");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      nickname?: string;
      bio?: string;
      image?: string;
    }) => {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
