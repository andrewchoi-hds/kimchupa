"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "업로드 실패");
      }

      return {
        url: data.url,
        filename: data.filename,
        size: data.size,
      };
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - images.length;

      if (remainingSlots <= 0) {
        setError(`최대 ${maxImages}개까지 업로드 가능합니다.`);
        return;
      }

      const filesToUpload = fileArray.slice(0, remainingSlots);
      setIsUploading(true);
      setError(null);

      const uploadedImages: UploadedImage[] = [];

      for (const file of filesToUpload) {
        const result = await uploadFile(file);
        if (result) {
          uploadedImages.push(result);
        }
      }

      if (uploadedImages.length > 0) {
        onImagesChange([...images, ...uploadedImages]);
      }

      if (uploadedImages.length < filesToUpload.length) {
        setError("일부 파일이 업로드되지 않았습니다.");
      }

      setIsUploading(false);
    },
    [disabled, images, maxImages, onImagesChange]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-purple-500 bg-purple-50"
            : disabled
            ? "border-border bg-muted cursor-not-allowed"
            : "border-border hover:border-purple-400 hover:bg-muted"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        {isUploading ? (
          <div className="py-4">
            <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">업로드 중...</p>
          </div>
        ) : (
          <>
            <span className="text-4xl block mb-2">📷</span>
            <p className="text-sm text-muted-foreground mb-1">
              클릭하거나 이미지를 드래그하여 업로드
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, GIF, WebP (최대 5MB, {maxImages}개까지)
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <div
              key={image.filename}
              className="relative group aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <Image
                src={image.url}
                alt={`Uploaded ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* File size badge */}
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white text-xs rounded">
                {formatFileSize(image.size)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image count */}
      {images.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {images.length} / {maxImages} 이미지
        </p>
      )}
    </div>
  );
}
