"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { KIMCHI_DATA } from "@/constants/kimchi";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchTab = "all" | "posts" | "wiki";

interface SearchResult {
  type: "post" | "wiki";
  id: string;
  title: string;
  excerpt: string;
  url: string;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [postResults, setPostResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search for posts via API
  const searchPosts = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setPostResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        const apiData = json.success ? json.data : null;
        const postResults: SearchResult[] = (
          Array.isArray(apiData?.posts) ? apiData.posts : []
        ).map(
          (post: { id: string; title: string; excerpt?: string }) => ({
            type: "post" as const,
            id: post.id,
            title: post.title,
            excerpt: post.excerpt || "",
            url: `/community/${post.id}`,
          })
        );
        setPostResults(postResults);
      }
    } catch {
      setPostResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle query changes with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchPosts(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchPosts]);

  // 모달 열릴 때 input에 포커스 및 상태 초기화
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      // 모달이 열릴 때 포커스 및 쿼리 초기화 (microtask로 지연)
      inputRef.current?.focus();
      queueMicrotask(() => setQuery(""));
      setPostResults([]);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Wiki search (local, no debounce needed)
  const wikiResults: SearchResult[] = (() => {
    if (query.trim().length < 2) return [];
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];
    KIMCHI_DATA.forEach((wiki) => {
      if (
        wiki.name.toLowerCase().includes(lowerQuery) ||
        wiki.nameEn.toLowerCase().includes(lowerQuery) ||
        wiki.description.toLowerCase().includes(lowerQuery) ||
        wiki.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          type: "wiki",
          id: wiki.id,
          title: wiki.name,
          excerpt: wiki.description,
          url: `/wiki/${wiki.id}`,
        });
      }
    });
    return results;
  })();

  // Combine results based on active tab
  const results: SearchResult[] = (() => {
    if (activeTab === "posts") return postResults;
    if (activeTab === "wiki") return wikiResults;
    return [...postResults, ...wikiResults];
  })();

  const filteredPostResults = results.filter((r) => r.type === "post");
  const filteredWikiResults = results.filter((r) => r.type === "wiki");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요 (최소 2글자)"
              className="flex-1 bg-transparent text-lg text-foreground placeholder-muted-foreground focus:outline-none"
            />
            {isSearching && (
              <span className="text-sm text-muted-foreground animate-pulse">검색중...</span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: "all", label: "전체" },
            { id: "posts", label: `게시글 (${filteredPostResults.length})` },
            { id: "wiki", label: `위키 (${filteredWikiResults.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SearchTab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="p-8 text-center text-muted-foreground">
              <span className="text-4xl block mb-2">🔍</span>
              <p>검색어를 입력하세요</p>
              <p className="text-sm mt-1">게시글과 위키에서 검색합니다</p>
            </div>
          ) : results.length === 0 && !isSearching ? (
            <div className="p-8 text-center text-muted-foreground">
              <span className="text-4xl block mb-2">😕</span>
              <p>검색 결과가 없습니다</p>
              <p className="text-sm mt-1">다른 검색어로 시도해보세요</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  onClick={onClose}
                  className="block p-4 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        result.type === "post"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {result.type === "post" ? "게시글" : "위키"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">
                        {result.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {result.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              <kbd className="px-1.5 py-0.5 bg-background rounded">ESC</kbd>
              {" "}닫기
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-background rounded">↵</kbd>
              {" "}이동
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
