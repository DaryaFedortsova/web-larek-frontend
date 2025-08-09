import { IBasketView } from '../../types';
import { createElement, ensureElement, formatNumber } from '../../utils/utils';
import { Component } from '../base/components';
import { EventEmitter } from '../base/events';

export class Basket extends Component<IBasketView> {
	protected list: HTMLElement;
	protected _total: HTMLElement;
	protected button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.list = ensureElement<HTMLElement>('.basket__list', container);
		this._total = ensureElement<HTMLElement>('.basket__price', container);
		this.button = ensureElement<HTMLElement>('.basket__button', container);

		this.button.addEventListener('click', () => {
			events.emit('order:open');
		});
	}

	set listItems(items: HTMLElement[]) {
		if (items.length) {
			this.list.replaceChildren(...items);
			this.setDisabled(this.button, false);
		} else {
			this.list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this.button, true);
		}
	}

	set total(total: number) {
		this.setText(this._total, `${formatNumber(total)} синапсов`);
	}

	clear() {
		this.listItems = [];
		this.total = 0;
	}
}
