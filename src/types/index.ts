export interface ICardItem {
	id: string;
	category: string;
	title: string;
	description?: string;
	image: string;
	price: number | null;
	button?: HTMLButtonElement;
}

export interface ICart {
	products: ICardItem[];
	price: number;
}

export interface IOrder {
	payment: string;
    address: string;
}

export interface IContacts {
	email: string;
	phone: string;
}

export interface ISuccess {
	id: string;
	price: number;
}

export interface IAppState {
	cards: ICardItem[];
	basket: string[];
	order: IOrder | null;
	contacts: IContacts | null;
}
