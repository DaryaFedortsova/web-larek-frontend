import { ensureElement } from '../../utils/utils';
import { Component } from '../base/components';
import { IEvents } from '../base/events';

interface IModal {
	content: HTMLElement;
}

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	toggleModal(eve: boolean = true) {
		this.toggleClass(this.container, 'modal_active', eve);
	}

	open() {
		this.toggleModal();
		this.events.emit('modal:open');
	}

	close() {
		this.toggleModal(false);
		this.events.emit('modal:close');
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
