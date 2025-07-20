'use client';

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-xl font-bold text-destructive">Something went wrong!</h2>
      <p className="my-4">{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}