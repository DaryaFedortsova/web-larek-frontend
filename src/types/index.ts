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

export interface IOrderResult {
    id: string;
	total: number;
}

export type FormErrorsOrder = Partial<Record<keyof IOrder, string>>;
export type FormErrorsContacts = Partial<Record<keyof IContacts, string>>;

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export interface IPage {
	counter: number;
	gallery: HTMLElement[];
}