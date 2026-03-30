/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Heart, MessageCircle, Plus } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface GalleryPost {
  id: string;
  title: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  author: { nickname: string | null; image: string | null };
  createdAt: string;
}

interface GalleryClientProps {
  initialPosts: GalleryPost[];
}

export default function GalleryClient({ initialPosts }: GalleryClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (initialPosts.length === 0) {
    return (
      <div className="min-h-screen">
        <PageHero
          title="📸 김치 갤러리"
          description="김치 러버들의 작품을 구경하세요"
        />
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <EmptyState
            icon={Camera}
            title="아직 사진이 없어요"
            description="커뮤니티에 김치 사진을 올려보세요!"
            action={
              <Link href="/community/write">
                <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
                  사진 올리기
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="📸 김치 갤러리"
        description="김치 러버들의 작품을 구경하세요"
      >
        <Link href="/community/write">
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            사진 올리기
          </Button>
        </Link>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Masonry Grid */}
        <div className="masonry-grid">
          {initialPosts.map((post) =>
            post.images.map((image, imgIdx) => (
              <div
                key={`${post.id}-${imgIdx}`}
                className="masonry-item group relative overflow-hidden rounded-[var(--radius-lg)] bg-card border border-border cursor-pointer"
                onClick={() => openLightbox(post.images, imgIdx)}
              >
                {/* Image */}
                <img
                  src={image}
                  alt={post.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                    {post.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={post.author.image}
                        name={post.author.nickname || "익명"}
                        size="xs"
                      />
                      <span className="text-white/90 text-xs">
                        {post.author.nickname || "익명"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {post.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {post.commentCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Link to original post */}
                <Link
                  href={`/community/${post.id}`}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="원본 게시글 보기"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Masonry CSS */}
      <style jsx>{`
        .masonry-grid {
          column-count: 2;
          column-gap: 1rem;
        }
        @media (min-width: 768px) {
          .masonry-grid {
            column-count: 3;
          }
        }
        @media (min-width: 1024px) {
          .masonry-grid {
            column-count: 4;
          }
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
