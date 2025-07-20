'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePet, useUpdatePet } from '@/lib/hooks/use-pets';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PetForm from '@/components/PetForm';
import { Pet } from '@/types/pet';
import { useToast } from '@/components/ui/use-toast';

export default function EditPetPage() {
  const params = useParams();
  const router = useRouter();
  const petId = Number(params.id);
  const { toast } = useToast();


  const { data: pet, isLoading, error: fetchError } = usePet(petId);
  
 
  const { mutate: updatePet, isPending: isUpdating } = useUpdatePet();

  // Handle form submission
  const handleSubmit = (updatedPet: Pet) => {
    updatePet(updatedPet, {
      onSuccess: () => {
        toast({
          title: 'Pet Updated',
          description: "The pet's details have been successfully updated.",
        });
        setTimeout(() => {
          router.push(`/pets/${petId}`);
        }, 1500);
      },
      onError: (error: Error | unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update pet. Please try again.';
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: errorMessage,
        });
      }
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading pet data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (fetchError || !pet) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {fetchError?.message || 'Pet not found'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link href={`/pets/${petId}`}><ArrowLeft className="mr-2 h-4 w-4" />Back to Pet Details</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/pets/${petId}`} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />Back to Pet Details
          </Link>
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Edit Pet: {pet.name}</h1>
      
      <PetForm 
        pet={pet} 
        onSubmit={handleSubmit} 
        isSubmitting={isUpdating}
      />
    </div>
  );
}
