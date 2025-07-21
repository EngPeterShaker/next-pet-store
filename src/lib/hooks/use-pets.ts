// src/lib/hooks/use-pets.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { petstoreApi } from "../api/petstore";
import { PetListParams, Pet, PetStatus } from "@/types/pet";

export function usePets(params?: PetListParams) {
	return useQuery({
		queryKey: ["pets", params],
		queryFn: async () => {
			// If no status is specified, fetch all three statuses in parallel
			if (!params?.status) {
				const [available, pending, sold] = await Promise.all([
					petstoreApi.getPets({ ...params, status: PetStatus.Available }),
					petstoreApi.getPets({ ...params, status: PetStatus.Pending }),
					petstoreApi.getPets({ ...params, status: PetStatus.Sold })
				]);
				
				// Concatenate all results and shuffle randomly
				const allPets = [...available, ...pending, ...sold];
				// Fisher-Yates shuffle algorithm for random mixing
				for (let i = allPets.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[allPets[i], allPets[j]] = [allPets[j], allPets[i]];
				}
				return allPets;
			}
			
			// If status is specified, just fetch that status
			return petstoreApi.getPets(params);
		},
	});
}

export function usePet(id: number, options?: { initialData?: Pet }) {
	return useQuery({
		queryKey: ["pet", id],
		queryFn: () => petstoreApi.getPetById(id),
		initialData: options?.initialData,
		enabled: !!id,
	});
}


export function useCreatePet() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: petstoreApi.createPet,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pets"] });
		},
	});
}

export function useUpdatePet() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: petstoreApi.updatePet,
		onSuccess: (updatedPet) => {
			queryClient.setQueryData(["pets"], (oldPets: Pet[] | undefined) =>
				oldPets?.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
			);
			queryClient.setQueryData(["pet", updatedPet.id], updatedPet);
		},
	});
}
