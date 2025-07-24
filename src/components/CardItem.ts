import { ICardItem } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/components';
import { EventEmitter } from './base/events';

export class CardItem extends Component<ICardItem> {
	protected category: HTMLElement;
	protected title: HTMLElement;
	protected image: HTMLImageElement;
	protected price: HTMLElement;
	protected cardId: string;


	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.category = ensureElement('.card__category', this.container);
		this.title = ensureElement('.card__title', this.container);
		this.image = ensureElement('.card__image',this.container) as HTMLImageElement;
		this.price = ensureElement('.card__price', this.container);

		this.container.addEventListener('click', () =>
			this.events.emit('card:open', { id: this.cardId })
		);
	}

	set id(value: string) {
		this.cardId = value;
		this.container.dataset.id = value;
	}

    get id(): string {
        return this.cardId;
    }

	set cardTitle(value: string) {
		this.setText(this.title, value);
	}

	set cardImage(value: string) {
		this.setImage(this.image, value, this.cardTitle);
	}

	set cardCategory(value: string) {
		this.setText(this.category, value);
	}

	set cardPrice(price: number | null) {
		if (typeof price === 'number') {
			this.price.textContent = `${price} синапсов`;
		} else if (price === null) {
          this.price.textContent = `Бесценно`
		}
	}

	render(data?: Partial<ICardItem>): HTMLElement {
		if (data) {
			this.id = data.id;
			this.cardTitle = data.title;
			this.cardImage = data.image;
			this.cardCategory = data.category;
			this.cardPrice = data.price;
		}
		return this.container;
	}
}
