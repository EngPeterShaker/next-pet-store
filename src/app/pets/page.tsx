import PetList from "@/components/PetList";
import { PetListSkeleton } from "@/components/PetListSkeleton";
import { Suspense } from 'react';

export default async function PetsPage({
  searchParams,
}: {
  searchParams: { status?: string; name?: string }
}) {
  // Await searchParams before accessing its properties
  const { status, name } = await searchParams;
  const typedStatus = status as 'available' | 'pending' | 'sold' | undefined;

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<PetListSkeleton />}>
        <PetList
          initialStatus={typedStatus}
          initialName={name}
        />
      </Suspense>
    </div>
  );
}