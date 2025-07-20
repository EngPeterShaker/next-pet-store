
import { notFound } from 'next/navigation';
import { petstoreApi } from '@/lib/api/petstore';
import PetDetails from './PetDetails';
import { setNotFoundError } from '../not-found';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PetDetailsPage(props: any) {
  const { params: { id } } = props;
  // Validate and convert ID
  const petId = parseInt(id);
  if (isNaN(petId)) {
    setNotFoundError({ message: `Invalid pet ID: ${id}` });
    return notFound();

  }
  try {
    const pet = await petstoreApi.getPetById(petId);
    return <PetDetails pet={pet} />;
  } catch (error) {
    // Define a type for our API error
    type ApiError = Error & {
      response?: { status?: number, data?: { message?: string } }
    };
    // Cast to our API error type
    const apiError = error as ApiError;
    const errorMessage = apiError.message || 'Unknown error occurred';
    console.error(`Error fetching pet ${petId}:`, errorMessage);

    // Set error details for not-found page
    setNotFoundError({
      message: `Failed to fetch pet #${petId}: ${errorMessage}`,
      status: apiError.response?.status || 404
    });

    return notFound();
  }
}