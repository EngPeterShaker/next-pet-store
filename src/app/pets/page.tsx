import PetList from "@/components/PetList";
import { PetListSkeleton } from "@/components/PetListSkeleton";
import { Suspense } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PetsPage(props: any) {
  const { searchParams } = props;
  const { status, name } = searchParams;
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