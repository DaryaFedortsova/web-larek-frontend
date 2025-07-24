import { ICardItem } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/components";
import { EventEmitter } from "./base/events";


export class CardInBasket extends Component<ICardItem> {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected cardId: string;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this. _price = ensureElement<HTMLElement>('.card__price', container);

         this._button.addEventListener('click', () => {
            this.events.emit('card:remove-from-cart', { id: this.cardId});
        });
    }

    set index(value:string) {
        this.setText(this._index, value);
    }

    render(data?: Partial<ICardItem>): HTMLElement {
		if (data) {
			this.cardId = data.id;
			this.setText(this._title, data.title);
			this.setText(this._price, `${data.price} синапсов`)
		}
		return this.container;
	}

}