
import { notFound } from 'next/navigation';
import { petstoreApi } from '@/lib/api/petstore';
import PetDetails from './PetDetails';
import { setNotFoundError } from '../not-found';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  try {
    // Asynchronous access of params.id
    const { id } = await params;

    // Parse the ID as a number
    const petId = Number(id);

    // Validate the ID
    if (isNaN(petId)) {
      setNotFoundError({ message: `Invalid pet ID: ${id}` });
      return notFound();
    }

    // Fetch pet data
    const pet = await petstoreApi.getPetById(petId);

    // Return the component with pet data
    return <PetDetails pet={pet} />;
  } catch (error: unknown) {
    // Handle errors
    const apiError = error as { message?: string; response?: { status?: number } };
    const message = apiError.message || 'Unknown error occurred';

    // Set error for not-found page
    setNotFoundError({
      message: message,
      status: apiError.response?.status || 404
    });

    // Return not found
    return notFound();
  }
}
