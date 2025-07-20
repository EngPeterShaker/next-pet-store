export interface Category {
	id?: number;
	name: string;
}

export interface Tag {
	id?: number;
	name: string;
}

export enum PetStatus {
	Available = "available",
	Pending = "pending",
	Sold = "sold",
}

export interface Pet {
	id: number;
	name: string;
	category?: Category;
	photoUrls?: string[];
	tags?: Tag[];
	status: PetStatus;
}

export interface PetListParams {
	status?: PetStatus;
	name?: string;
	page?: number;
	limit?: number;
}
