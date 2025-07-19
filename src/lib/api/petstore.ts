import { PetListParams, Pet, PetStatus } from "@/types/pet";
import { axiosInstance } from "@/lib/axiosInstance";

export const petstoreApi = {
	async getPets(params?: PetListParams): Promise<Pet[]> {
		const query = new URLSearchParams();
		if (params?.status) query.append("status", params.status);
		if (params?.name) query.append("name", params.name);

		const response = await axiosInstance.get(`/pet/findByStatus?${query.toString()}`);
		return Array.isArray(response.data) ? response.data : [];
	},

	async getPetById(id: number): Promise<Pet> {
		const response = await axiosInstance.get(`/pet/${id}`);
		return response.data;
	},

	async createPet(pet: Omit<Pet, "id">): Promise<Pet> {
		const response = await axiosInstance.post('/pet', pet);
		return response.data;
	},

	async updatePet(pet: Pet): Promise<Pet> {
		const response = await axiosInstance.put('/pet', pet);
		return response.data;
	},

	async getPetStatusCounts(): Promise<{
		available: number;
		pending: number;
		sold: number;
	}> {
		const response = await axiosInstance.get(
			`/pet/findByStatus?status=${[PetStatus.Available, PetStatus.Pending, PetStatus.Sold].join(',')}`
		);
		const pets: Pet[] = Array.isArray(response.data) ? response.data : [];

		return {
			available: pets.filter((p) => p.status === PetStatus.Available).length,
			pending: pets.filter((p) => p.status === PetStatus.Pending).length,
			sold: pets.filter((p) => p.status === PetStatus.Sold).length,
		};
	},

	async uploadImage(
		id: number,
		file: File
	): Promise<{ code: number; type: string; message: string }> {
		const formData = new FormData();
		formData.append("file", file);

	const response = await axiosInstance.post(`/pet/${id}/uploadImage`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
	},
};