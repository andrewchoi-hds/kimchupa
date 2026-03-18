import { SkeletonList } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-muted rounded animate-shimmer mb-8" />
        <SkeletonList count={5} />
      </div>
    </div>
  );
}
