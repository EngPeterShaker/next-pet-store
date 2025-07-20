import PetList from "@/components/PetList";
import { PetListSkeleton } from "@/components/PetListSkeleton";
import { Suspense } from 'react';

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; name?: string }>;
}) {
  const { status, name } = await searchParams;
  const typedStatus = status as 'available' | 'pending' | 'sold' | undefined;

  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<PetListSkeleton />}>
        <PetList
          initialStatus={typedStatus}
          initialName={name}
        />
      </Suspense>
    </div>
  );
}