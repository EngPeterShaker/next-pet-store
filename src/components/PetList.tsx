'use client';

import { usePets } from '@/lib/hooks/use-pets';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { PetListSkeleton } from './PetListSkeleton';
import { PetCard } from './PetCard';
import PetFilters from './PetFilters';
import { PetStatus, Pet } from '@/types/pet';

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

  const [status, setStatus] = useState<PetStatus | undefined>(initialStatus as PetStatus | undefined);
  const [searchQuery, setSearchQuery] = useState(initialName || '');

  // Fetch all pets without filtering (server-side)
  const { data: allPets, isLoading, error } = usePets();

  // Filter pets on the client side
  const filteredPets = useMemo(() => {
    if (!allPets || !Array.isArray(allPets)) return [];
    
    return allPets.filter((pet: Pet) => {
      // Filter by status
      if (status && pet.status !== status) return false;
      
      // Filter by search query (name, tags, or category)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        
        // Check name
        const nameMatch = pet.name?.toLowerCase().includes(query);
        
        // Check tags
        const tagMatch = pet.tags?.some(tag => 
          tag.name?.toLowerCase().includes(query)
        );
        
        // Check category/description
        const categoryMatch = pet.category?.name?.toLowerCase().includes(query);
        
        // Return true if any field matches
        if (!nameMatch && !tagMatch && !categoryMatch) return false;
      }
      
      return true;
    });
  }, [allPets, status, searchQuery]);

  // Handle filter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (status) params.set('status', status);
    else params.delete('status');

    if (searchQuery) params.set('name', searchQuery);
    else params.delete('name');

    router.push(`${pathname}?${params.toString()}`);
  }, [status, searchQuery, pathname, router, searchParams]);

  return (
    <div className="space-y-6">
      <PetFilters
        status={status}
        searchQuery={searchQuery}
        onStatusChange={setStatus}
        onSearchChange={setSearchQuery}
      />

      {isLoading && <PetListSkeleton />}

      {error && (
        <div className="text-red-500 p-4 rounded-lg bg-red-50">
          Error loading pets: {error.message}
        </div>
      )}

      {!isLoading && filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet, index) => (
            <PetCard key={`${pet.id}-${index}`} pet={pet} priority={index === 0} />
          ))}
        </div>
      ) : !isLoading ? (
        <div className="text-gray-500 p-4">
          {searchQuery || status ? 'No pets found matching your filters' : 'No pets available'}
        </div>
      ) : null}
    </div>
  );
}