'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';
import { Pet } from '@/types/pet';
import { Badge } from '@/components/ui/badge';
import { getPetStatusColor, getPetMainImage } from '@/lib/utils/pet';

export function PetCard({ pet, priority = false }: { pet: Pet; priority?: boolean }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const mainImage = useMemo(() => getPetMainImage(pet.photoUrls), [pet.photoUrls]);
  const showPlaceholder = !mainImage || imageError;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-100 relative">
        {isLoading && !showPlaceholder && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}

        {showPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <svg
              className="w-12 h-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
        ) : (
          <Image
            src={mainImage!}
            alt={`Photo of ${pet.name}`}
            fill
            className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
              }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              console.warn(`Failed to load image for pet ${pet.name}:`, mainImage);
              setIsLoading(false);
              setImageError(true);
            }}
            priority={priority}
            unoptimized={mainImage!.startsWith('http')} // Disable optimization for external URLs that might fail
          />
        )}

        <Badge
          className={`absolute top-2 right-2 capitalize ${getPetStatusColor(pet.status)}`}
        >
          {pet.status}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate" title={pet.name}>
          {pet.name}
        </h3>

        <div className="min-h-[4rem] mb-2">
          {pet.category?.name && (
            <p className="text-sm text-muted-foreground mt-1 truncate" title={pet.category.name}>
              {pet.category.name}
            </p>
          )}

          {pet.tags && pet.tags.length > 0 && (
            <div className="flex gap-1 mt-3 flex-wrap">
              {pet.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={`${tag.id}-${index}`}
                  variant="secondary"
                  className="text-xs"
                  title={tag.name}
                >
                  {tag.name}
                </Badge>
              ))}
              {pet.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{pet.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <Button asChild className="w-full mt-4">
          <Link href={`/pets/${pet.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
}