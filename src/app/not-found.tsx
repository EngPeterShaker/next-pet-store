import Link from "next/link";

// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-xl font-bold">Not Found</h2>
      <p className="my-4">The requested resource could not be found</p>
      <Link href="/pets" className="text-primary underline">
        Back to Pets
      </Link>
    </div>
  );
}