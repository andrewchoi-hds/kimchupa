"use client";

import { useFollowStatus, useToggleFollow } from "@/hooks/useFollow";
import Button from "@/components/ui/Button";
import { UserPlus, UserCheck } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  size?: "sm" | "md" | "lg";
}

export default function FollowButton({ userId, size = "md" }: FollowButtonProps) {
  const { data } = useFollowStatus(userId);
  const toggleFollow = useToggleFollow();

  const isFollowing = data?.data?.isFollowing ?? false;

  const handleClick = () => {
    toggleFollow.mutate(userId);
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "primary"}
      size={size}
      loading={toggleFollow.isPending}
      icon={isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
      onClick={handleClick}
    >
      {isFollowing ? "팔로잉" : "팔로우"}
    </Button>
  );
}
