// src/lib/hooks/use-pet-status-counts.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { petstoreApi } from "../api/petstore";

export function usePetStatusCounts() {
	return useQuery({
		queryKey: ["pet-status-counts"],
		queryFn: petstoreApi.getPetStatusCounts,
	});
}
