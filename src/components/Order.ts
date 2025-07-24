import { IOrder } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IOrder> {
	protected paymentCard: HTMLButtonElement;
	protected paymentCash: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.paymentCard = ensureElement<HTMLButtonElement>('button[name="card"]', container);
		this.paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
		this._address = ensureElement<HTMLInputElement>('input[name="address"]', container);
		this.button = ensureElement<HTMLButtonElement>('.order__button', container);


		this.paymentCard.addEventListener('click', () => {
			
			   this.toggleClass(this.paymentCard, 'button_alt-active', true);
			   this.toggleClass(this.paymentCash, 'button_alt-active', false);
			// this.payment = 'card';
			// this.onInputChange('payment','card');
		});
		this.paymentCash.addEventListener('click', () => {
			
			   this.toggleClass(this.paymentCard, 'button_alt-active', false);
			   this.toggleClass(this.paymentCash, 'button_alt-active', true);
			// this.payment = 'cash';
			// this.onInputChange('payment', 'cash');
		});
	}

	// set payment(value: 'card' | 'cash') {
	// 	this.toggleClass(this.paymentCard, 'button_alt-active', value === 'card');
	// 	this.toggleClass(this.paymentCash, 'button_alt-active', value === 'cash');
	// }

	set address(value: string) {
		this._address.value = value;
	}
}
