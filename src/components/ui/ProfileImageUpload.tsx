"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ProfileImageUploadProps {
  currentImage?: string;
  fallbackEmoji: string;
  onImageChange: (url: string | null) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
};

const emojiSizes = {
  sm: "text-3xl",
  md: "text-4xl",
  lg: "text-6xl",
};

const buttonSizes = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

export default function ProfileImageUpload({
  currentImage,
  fallbackEmoji,
  onImageChange,
  size = "lg",
  disabled = false,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("지원하지 않는 파일 형식입니다.");
      return;
    }

    // Validate file size (2MB for profile)
    if (file.size > 2 * 1024 * 1024) {
      setError("파일 크기는 2MB 이하여야 합니다.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "업로드 실패");
      }

      onImageChange(data.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError("업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    setError(null);
  };

  return (
    <div className="relative inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Profile Image Container */}
      <div
        onClick={handleClick}
        className={`${sizeClasses[size]} rounded-full bg-white flex items-center justify-center shadow-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isUploading ? (
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full" />
        ) : currentImage ? (
          <Image
            src={currentImage}
            alt="Profile"
            fill
            className="object-cover"
            sizes={size === "lg" ? "128px" : size === "md" ? "96px" : "64px"}
          />
        ) : (
          <span className={emojiSizes[size]}>{fallbackEmoji}</span>
        )}
      </div>

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className={`absolute bottom-0 right-0 ${buttonSizes[size]} bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        📷
      </button>

      {/* Remove Button (if has image) */}
      {currentImage && !isUploading && (
        <button
          type="button"
          onClick={handleRemove}
          className={`absolute top-0 right-0 ${buttonSizes[size]} bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 opacity-0 hover:opacity-100 transition-opacity`}
        >
          ✕
        </button>
      )}

      {/* Error Message */}
      {error && (
        <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
