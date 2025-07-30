import { IAppState, ICardItem, IContacts, IOrder } from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';
import { CardItem } from './CardItem';

export type GalleryChangeEvent = {
	gallery: CardItem[];
};

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
			this.emitChanges('basket:changed');
		}
	}

	removeFromBasket(item: { id: string }) {
		this.basket = this.basket.filter((id) => id !== item.id);
		this.emitChanges('basket:changed', {
			items: this.basket,
			total: this.getTotal()
		});
		this.events.emit('basket:open');
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
}
