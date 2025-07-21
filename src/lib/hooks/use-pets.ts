// src/lib/hooks/use-pets.ts
"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { petstoreApi } from "../api/petstore";
import { PetListParams, Pet, PetStatus } from "@/types/pet";

// Query keys factory for better organization
export const petKeys = {
  all: ['pets'] as const,
  lists: () => [...petKeys.all, 'list'] as const,
  list: (params?: PetListParams) => [...petKeys.lists(), params] as const,
  details: () => [...petKeys.all, 'detail'] as const,
  detail: (id: number) => [...petKeys.details(), id] as const,
};

// Hook for fetching pets list with optional filtering
export function usePets(
  params?: PetListParams,
  options?: Omit<UseQueryOptions<Pet[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Pet[], Error>({
    queryKey: petKeys.list(params),
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Hook for fetching a single pet by ID
export function usePet(
  id: number,
  options?: Omit<UseQueryOptions<Pet, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Pet, Error>({
    queryKey: petKeys.detail(id),
    queryFn: () => petstoreApi.getPetById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Hook for creating a new pet with optimistic updates
export function useCreatePet(
  options?: UseMutationOptions<Pet, Error, Omit<Pet, 'id'>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<Pet, Error, Omit<Pet, 'id'>>({
    mutationFn: petstoreApi.createPet,
    onMutate: async (newPet) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: petKeys.lists() });
      
      // Snapshot the previous value
      const previousPets = queryClient.getQueryData(petKeys.list());
      
      // Optimistically update to the new value
      if (previousPets) {
        queryClient.setQueryData<Pet[]>(petKeys.list(), (old) => [
          ...(old || []),
          { ...newPet, id: Date.now() } as Pet, // Temporary ID
        ]);
      }
      
      // Return a context with the previous and new data
      return { previousPets };
    },
    onError: (err, newPet, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousPets) {
        queryClient.setQueryData(petKeys.list(), context.previousPets);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
    ...options,
  });
}

// Hook for updating a pet with optimistic updates
export function useUpdatePet(
  options?: UseMutationOptions<Pet, Error, Pet>
) {
  const queryClient = useQueryClient();
  
  return useMutation<Pet, Error, Pet>({
    mutationFn: petstoreApi.updatePet,
    onMutate: async (updatedPet) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: petKeys.detail(updatedPet.id) });
      await queryClient.cancelQueries({ queryKey: petKeys.lists() });
      
      // Snapshot the previous values
      const previousPet = queryClient.getQueryData(petKeys.detail(updatedPet.id));
      const previousPets = queryClient.getQueryData(petKeys.list());
      
      // Optimistically update to the new value
      queryClient.setQueryData(petKeys.detail(updatedPet.id), updatedPet);
      queryClient.setQueriesData<Pet[]>(
        { queryKey: petKeys.lists() },
        (old) => old?.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
      );
      
      // Return a context with the previous values
      return { previousPet, previousPets };
    },
    onError: (err, updatedPet, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousPet) {
        queryClient.setQueryData(petKeys.detail(updatedPet.id), context.previousPet);
      }
      if (context?.previousPets) {
        queryClient.setQueryData(petKeys.list(), context.previousPets);
      }
    },
    onSettled: (data) => {
      // Always refetch after error or success
      if (data) {
        queryClient.invalidateQueries({ queryKey: petKeys.detail(data.id) });
      }
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
    ...options,
  });
}

// Hook for deleting a pet
export function useDeletePet(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: petstoreApi.deletePet,
    onMutate: async (petId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: petKeys.lists() });
      
      // Snapshot the previous value
      const previousPets = queryClient.getQueryData(petKeys.list());
      
      // Optimistically remove the pet
      queryClient.setQueriesData<Pet[]>(
        { queryKey: petKeys.lists() },
        (old) => old?.filter((pet) => pet.id !== petId)
      );
      
      // Remove from cache
      queryClient.removeQueries({ queryKey: petKeys.detail(petId) });
      
      return { previousPets };
    },
    onError: (err, petId, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousPets) {
        queryClient.setQueryData(petKeys.list(), context.previousPets);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: petKeys.lists() });
    },
    ...options,
  });
}

// Hook to prefetch a pet (useful for hovering over links)
export function usePrefetchPet() {
  const queryClient = useQueryClient();
  
  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: petKeys.detail(id),
      queryFn: () => petstoreApi.getPetById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}
