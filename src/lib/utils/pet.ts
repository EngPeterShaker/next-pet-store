import { PetStatus } from "@/types/pet";
import { validateImageUrl } from "./image";
import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/config/styles";

export const getPetStatusColor = (status: PetStatus): string => {
	const variant = STATUS_STYLES.variants[status] || STATUS_STYLES.default;
	return cn(
		STATUS_STYLES.base,
		variant.background,
		variant.text,
		variant.border
	);
};

export const getPetMainImage = (
	photoUrls: string[] | undefined
): string | null => {
	if (!photoUrls?.length) {
		return null;
	}

	// Try to find a local image first (starting with /)
	const localImage = photoUrls.find(
		(url) => url.startsWith("/") && validateImageUrl(url)
	);
	if (localImage) {
		return localImage;
	}

	// Then try to find any valid external image
	const externalImage = photoUrls.find(validateImageUrl);
	return externalImage || null;
};
