"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

interface PostsQueryOptions {
  type?: string;
  tag?: string;
  limit?: number;
  sort?: "latest" | "popular";
}

export function useInfinitePosts(options: PostsQueryOptions = {}) {
  const limit = options.limit || 10;

  return useInfiniteQuery({
    queryKey: ["posts-infinite", options],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.set("page", String(pageParam));
      params.set("limit", String(limit));
      if (options.type) params.set("type", options.type);
      if (options.tag) params.set("tag", options.tag);
      if (options.sort) params.set("sort", options.sort);

      const res = await fetch(`/api/posts?${params}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (!meta) return undefined;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
