
import { notFound } from 'next/navigation';
import { petstoreApi } from '@/lib/api/petstore';
import PetDetails from './PetDetails';

export default async function PetDetailsPage({
  params,
}: {
  params: any
}) {
  const resolvedParams = await Promise.resolve(params);

  // Validate and convert ID
  const petId = parseInt(resolvedParams.id);
  if (isNaN(petId)) return notFound();

  try {
    const pet = await petstoreApi.getPetById(petId);
    return <PetDetails pet={pet} />;
  } catch (error) {
    return notFound();
  }
}