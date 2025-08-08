import { FormErrorsContacts, FormErrorsOrder, IAppState, ICardItem, IContacts, IOrder } from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';

export class AppData extends Model<IAppState> {
	basket: string[] = [];
	cards: ICardItem[] = [];
	order: IOrder = {
		payment: undefined,
		address: '',
	};
	contacts: IContacts = {
		email: '',
		phone: '',
	};
	FormErrorsOrder: FormErrorsOrder = {};
	FormErrorsContacts: FormErrorsContacts = {};

	constructor(protected events: IEvents) {
		super({ basket: [] }, events);

		this.events.on('card:select', (data: { id: string }) => {
			this.openCard(data.id);
		});

		this.events.on('card:add-to-cart', (data: { id: string }) => {
			this.addToBasket(data);
		});

		this.events.on('card:remove-from-cart', (data: { id: string }) => {
			this.removeFromBasket(data);
		});
		
	}

	addCards(items: ICardItem[]) {
		this.cards.push(...items);
		this.events.emit('cards:changed', this.cards);
	}

	getCardById(id: string): ICardItem {
		return this.cards.find((item) => item.id === id);
	}

	getCards(): ICardItem[] {
		return this.cards;
	}

	openCard(id: string) {
		const card = this.cards.find((items) => items.id === id);
		if (card) {
			this.events.emit('card:open', { ...card });
		}
	}

	addToBasket(item: { id: string }) {
		if (!this.basket.includes(item.id)) {
			this.basket.push(item.id);
			this.emitChanges('basket:changed')
		}
	}

	removeFromBasket(item: { id: string }) {
		this.basket = this.basket.filter((id) => id !== item.id);
		this.emitChanges('basket:changed', {
			items: this.basket,
			total: this.getTotal()
		});
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed', this.basket);
	}

	getTotal(): number {
		return this.basket.reduce(
			(a, c) => a + this.cards.find((it) => it.id === c).price,
			0
		);
	}

	setOrderField(field: keyof IOrder, value: string) {
		if ( field === 'payment') {
			this.order.payment = value;
		};
		if ( field === 'address') {
			this.order.address = value;
		}
		this.validateOrder()
	}

	validateOrder() {
		const errors: typeof this.FormErrorsOrder = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.FormErrorsOrder = errors;
		this.events.emit('formErrorsOrder:change', this.FormErrorsOrder);
		return Object.keys(errors).length === 0;
	}

	setContactsField(field: keyof IContacts, value: string) {
		this.contacts[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:change', this.contacts);
		}
	}

	validateContacts() {
		const errors: typeof this.FormErrorsContacts = {};
		if (!this.contacts.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.contacts.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.FormErrorsContacts = errors;
		this.events.emit('formErrorsContacts:change', this.FormErrorsContacts);
		return Object.keys(errors).length === 0;
	}

}
