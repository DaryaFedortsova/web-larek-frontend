import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/components";
import { EventEmitter } from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected list: HTMLElement;
    protected _total: HTMLElement;
    protected button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this.button = ensureElement<HTMLElement>('.basket__button', container);

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
        this.items = []
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            items.forEach((item, index) => {
                const itemIndex = item.querySelector('.basket__item-index');
                if (itemIndex) {
                    itemIndex.textContent = (index + 1).toString()
                }
            });
            this.list.replaceChildren(...items);
            this.setDisabled(this.button, false);

        } else {
            this.list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста',
            }));
            this.setDisabled(this.button, true);
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this.button, false);
        } else {
            this.setDisabled(this.button, true);
        }
    }

    set total(total: number) {
   this.setText(this._total, `${formatNumber(total)} синапсов`);
    }
    
    clear() {
        this.items = [];
        this.total = 0;
    }
}