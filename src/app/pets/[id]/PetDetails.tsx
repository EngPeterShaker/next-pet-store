'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Pet } from '@/types/pet';
import { validateImageUrl } from '@/lib/utils/image';
import { getPetStatusColor } from '@/lib/utils/pet';
import { useState } from 'react';
import { ArrowLeft, Edit, Tag} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { sanitizeText } from '@/lib/utils/sanitize';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header with Back and Edit buttons */}
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/pets" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Pets</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href={`/pets/${pet.id}/edit`} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
          </Button>
        </div>

        {/* Pet Name as Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {sanitizeText(pet.name)}
        </h1>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-full">
              <CardContent className="p-0 h-full">
                <div className="relative h-full min-h-[400px] lg:min-h-[600px] bg-gray-100 dark:bg-gray-800">
                  {showImage ? (
                    <Image
                      src={imageUrl!}
                      alt={sanitizeText(pet.name)}
                      fill
                      className="object-contain p-6"
                      priority
                      onError={() => {
                        console.warn(`Failed to load image for pet ${pet.name}:`, imageUrl);
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/images/placeholder-image.png"
                        alt="Pet placeholder"
                        width={400}
                        height={400}
                        className="opacity-30"
                        priority
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Section - Takes 1 column */}
          <div className="lg:h-[600px] flex flex-col gap-4">
            {/* Pet Info Card */}
            <Card className="flex-1">
              <CardContent className="pt-6 h-full flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Status</p>
                    <Badge 
                      className={`${getPetStatusColor(pet.status)} text-sm px-3 py-1`}
                    >
                      {pet.status}
                    </Badge>
                  </div>
                  
                  {/* Category */}
                  {pet.category && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {sanitizeText(pet.category.name)}
                      </p>
                    </div>
                  )}

                  {/* Pet ID */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pet ID</p>
                    <p className="font-mono text-lg text-gray-700 dark:text-gray-300">#{pet.id}</p>
                  </div>
                </div>

                {/* Tags Section */}
                {pet.tags && pet.tags.length > 0 && (
                  <div className="mt-auto pt-6 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-4 w-4 text-gray-500" />
                      <h2 className="text-sm font-semibold text-gray-500">Tags</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pet.tags.map(tag => (
                        <Badge 
                          key={tag.id} 
                          variant="secondary" 
                          className="px-3 py-1 text-sm"
                        >
                        {sanitizeText(tag.name)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}