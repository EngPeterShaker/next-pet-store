'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Pet } from '@/types/pet';
import { validateImageUrl } from '@/lib/utils/image';
import { getPetStatusColor } from '@/lib/utils/pet';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function PetDetails({ pet }: { pet: Pet }) {
  const [imageError, setImageError] = useState(false);

  const getValidImageUrl = () => {
    if (!pet.photoUrls || pet.photoUrls.length === 0) {
      return null;
    }

    // Find first valid image URL
    const validImage = pet.photoUrls.find(validateImageUrl);
    return validImage || null;
  };

  const imageUrl = getValidImageUrl();
  const showImage = imageUrl && !imageError;
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Button asChild variant="link" className="p-2">
          <Badge variant="outline" className="capitalize">
            <Link href="/pets" className="flex items-center text-blue-600 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />Back to Pets
            </Link>
          </Badge>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {showImage ? (
            <Image
              src={imageUrl!}
              alt={pet.name}
              width={500}
              height={500}
              className="rounded-lg max-h-[500px] object-contain"
              onError={() => {
                console.warn(`Failed to load image for pet ${pet.name}:`, imageUrl);
                setImageError(true);
              }}
            />
          ) : (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{pet.name}</h1>
            <Badge variant="outline" className={`capitalize ${getPetStatusColor(pet.status)}`}>
              {pet.status}
            </Badge>
          </div>

          {pet.category && (
            <div>
              <h2 className="font-semibold">Category</h2>
              <p>{pet.category.name}</p>
            </div>
          )}

          {pet.tags && pet.tags.length > 0 && (
            <div>
              <h2 className="font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {pet.tags.map(tag => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}