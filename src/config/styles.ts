import { PetStatus } from "@/types/pet";

export const STATUS_STYLES = {
	base: "rounded-full px-2 py-1 text-xs font-medium dark:bg-opacity-90 dark:text-opacity-90",
	variants: {
		[PetStatus.Available]: {
			background: "bg-green-100 dark:bg-green-900",
			text: "text-green-800 dark:text-green-200",
			border: "border-green-200",
		},
		[PetStatus.Pending]: {
			background: "bg-yellow-100 dark:bg-yellow-900",
			text: "text-yellow-800 dark:text-yellow-200",
			border: "border-yellow-200",
		},
		[PetStatus.Sold]: {
			background: "bg-red-100 dark:bg-red-900",
			text: "text-red-800 dark:text-red-200",
			border: "border-red-200",
		},
	},
	default: {
		background: "bg-gray-100 dark:bg-gray-900",
		text: "text-gray-800 dark:text-gray-200",
		border: "border-gray-200",
	},
} as const;
