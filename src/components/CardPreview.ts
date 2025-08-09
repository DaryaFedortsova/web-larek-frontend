import { ICardItem } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/components';
import { EventEmitter } from './base/events';

export class CardPreview extends Component<ICardItem> {
	protected _button: HTMLButtonElement;
	protected category: HTMLElement;
	protected title: HTMLElement;
	protected description: HTMLElement;
	protected image: HTMLImageElement;
	protected price: HTMLElement;
	protected cardId: string;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.category = ensureElement('.card__category', this.container);
		this.title = ensureElement('.card__title', this.container);
		this.description = ensureElement('.card__text', this.container);
		this.image = ensureElement(
			'.card__image',
			this.container
		) as HTMLImageElement;
		this.price = ensureElement('.card__price', this.container);
		this._button = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;

		this._button.addEventListener('click', () => {
			this.events.emit('preview:buttonChange', { id: this.cardId });
		});
	}
	set button(value: string) {
		this._button.textContent = value;
	}

	set buttonDisabled(value: boolean) {
		this._button.disabled = value;
	}

	render(data: ICardItem): HTMLElement {
		this.cardId = data.id;
		this.setImage(this.image, data.image, data.title);
		this.setText(this.category, data.category);
		this.setText(this.title, data.title);
		this.setText(this.description, data.description || '');
		this.setText(
			this.price,
			data.price ? `${data.price} синапсов` : `Бесценно`
		);

		return this.container;
	}
}
