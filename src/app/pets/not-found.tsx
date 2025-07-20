import Link from "next/link";

export type NotFoundError = {
  message?: string;
  status?: number;
};

// Global store for the error details that we can set from other components through `setNotFoundError`
let errorDetails: NotFoundError | null = null;

export function setNotFoundError(error: NotFoundError) {
  errorDetails = error;
}

export default function PetNotFound() {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-xl font-bold">Pet Not Found</h2>
      <p className="my-4">The requested pet could not be found</p>
      
      {errorDetails && errorDetails.message && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
          <p className="font-medium">Error details:</p>
          <p>{errorDetails.message}</p>
          {errorDetails.status && <p>Status: {errorDetails.status}</p>}
        </div>
      )}
      
      <Link href="/pets" className="text-primary underline">
        Back to Pets
      </Link>
    </div>
  );
}
