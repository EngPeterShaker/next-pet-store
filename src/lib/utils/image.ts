export const validateImageUrl = (url: string): boolean => {
	try {
		if (!url || url.trim().length === 0) {
			return false;
		}

		const lowercaseUrl = url.toLowerCase();
		if (
			lowercaseUrl.includes("example.com") ||
			lowercaseUrl.includes("placeholder") ||
			lowercaseUrl.includes("via.placeholder") ||
			lowercaseUrl.includes("lorem") ||
			lowercaseUrl.includes("dummy") ||
			(!url.startsWith("/") &&
				!url.startsWith("http://") &&
				!url.startsWith("https://"))
		) {
			return false;
		}

		if (url.startsWith("/")) {
			return true;
		}

		if (url.startsWith("http://") || url.startsWith("https://")) {
			const parsedUrl = new URL(url);
			return (
				parsedUrl.hostname.length > 0 &&
				!parsedUrl.hostname.includes("example.com")
			);
		}

		return false;
	} catch {
		return false;
	}
};
