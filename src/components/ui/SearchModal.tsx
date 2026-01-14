"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePostsStore } from "@/stores/postsStore";
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { posts } = usePostsStore();

  // 모달 열릴 때 input에 포커스
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
    }
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

  // 검색 실행
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // 게시글 검색
    if (activeTab === "all" || activeTab === "posts") {
      posts.forEach((post) => {
        if (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        ) {
          searchResults.push({
            type: "post",
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            url: `/community/${post.id}`,
          });
        }
      });
    }

    // 위키 검색
    if (activeTab === "all" || activeTab === "wiki") {
      KIMCHI_DATA.forEach((wiki) => {
        if (
          wiki.name.toLowerCase().includes(lowerQuery) ||
          wiki.nameEn.toLowerCase().includes(lowerQuery) ||
          wiki.description.toLowerCase().includes(lowerQuery) ||
          wiki.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        ) {
          searchResults.push({
            type: "wiki",
            id: wiki.id,
            title: wiki.name,
            excerpt: wiki.description,
            url: `/wiki/${wiki.id}`,
          });
        }
      });
    }

    setResults(searchResults);
  }, [query, activeTab, posts]);

  if (!isOpen) return null;

  const postResults = results.filter((r) => r.type === "post");
  const wikiResults = results.filter((r) => r.type === "wiki");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요 (최소 2글자)"
              className="flex-1 bg-transparent text-lg text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700">
          {[
            { id: "all", label: "전체" },
            { id: "posts", label: `게시글 (${postResults.length})` },
            { id: "wiki", label: `위키 (${wikiResults.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SearchTab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="p-8 text-center text-zinc-500">
              <span className="text-4xl block mb-2">🔍</span>
              <p>검색어를 입력하세요</p>
              <p className="text-sm mt-1">게시글과 위키에서 검색합니다</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <span className="text-4xl block mb-2">😕</span>
              <p>검색 결과가 없습니다</p>
              <p className="text-sm mt-1">다른 검색어로 시도해보세요</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  onClick={onClose}
                  className="block p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        result.type === "post"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {result.type === "post" ? "게시글" : "위키"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-zinc-900 dark:text-white truncate">
                        {result.title}
                      </h4>
                      <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
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
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>
              <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded">ESC</kbd>
              {" "}닫기
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded">↵</kbd>
              {" "}이동
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
