import { Skeleton } from "@/components/ui/skeleton";

export default function OffersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="space-y-2 rounded-xl border border-border p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
