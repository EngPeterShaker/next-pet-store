// src/lib/hooks/use-pets.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { petstoreApi } from "../api/petstore";
import { PetListParams, Pet } from "@/types/pet";

export function usePets(params?: PetListParams) {
	return useQuery({
		queryKey: ["pets", params],
		queryFn: () => petstoreApi.getPets(params),
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

export function useUploadPetImage() {
	return useMutation({
		mutationFn: ({ id, file }: { id: number; file: File }) =>
			petstoreApi.uploadImage(id, file),
	});
}
