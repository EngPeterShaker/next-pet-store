'use client';

import { usePets } from '@/lib/hooks/use-pets';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PetListSkeleton } from './PetListSkeleton';
import { PetCard } from './PetCard';
import PetFilters from './PetFilters';
import { PetStatus } from '@/types/pet';

export default function PetList({
  initialStatus,
  initialName
}: {
  initialStatus?: 'available' | 'pending' | 'sold';
  initialName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<PetStatus | undefined>(initialStatus);
  const [name, setName] = useState(initialName || '');

  const { data: pets, isLoading, error } = usePets({
    status,
    name: name || undefined
  });

  // Handle filter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (status) params.set('status', status);
    else params.delete('status');

    if (name) params.set('name', name);
    else params.delete('name');

    router.push(`${pathname}?${params.toString()}`);
  }, [status, name, pathname, router, searchParams]);

  return (
    <div className="space-y-6">
      <PetFilters
        status={status}
        name={name}
        onStatusChange={setStatus}
        onNameChange={setName}
      />

      {isLoading && <PetListSkeleton />}

      {error && (
        <div className="text-red-500 p-4 rounded-lg bg-red-50">
          Error loading pets: {error.message}
        </div>
      )}

      {Array.isArray(pets) && pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet, index) => (
            <PetCard key={`${pet.id}-${index}`} pet={pet} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 p-4">No pets available</div>
      )}
    </div>
  );
}