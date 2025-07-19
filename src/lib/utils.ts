import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function validatePetId(id: unknown): number {
	const petId = Number(id);
	if (isNaN(petId)) {
		throw new Error("Invalid pet ID");
	}
	return petId;
}

export async function handleApiError(response: Response) {
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "API request failed");
	}
	return response.json();
}
