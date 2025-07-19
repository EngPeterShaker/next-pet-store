'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function PetListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              {Array.from({ length: 2 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-16" />
              ))}
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}