import { CardsApi } from './components/CardsApi';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { CardItem } from './components/CardItem';
import { CardPreview } from './components/CardPreview';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { AppData } from './components/AppData';
import { CardInBasket } from './components/CardInBasket';
import { Order } from './components/Order';
import { IContacts, IOrder } from './types';
import { Contact } from './components/Contact';
import { Success } from './components/common/Success';

const templateCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const listBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateOrder = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const templateSuccess = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new CardsApi(API_URL, CDN_URL);
const appData = new AppData(events);
const page = new Page(
	document.querySelector('.page__wrapper') as HTMLElement,
	events
);
const modal = new Modal(ensureElement('#modal-container'), events);
const order = new Order(cloneTemplate(templateOrder), events);
const contact = new Contact(cloneTemplate(contactTemplate), events);
const templatePreview = cloneTemplate(templateCardPreview);
const preview = new CardPreview(templatePreview, events);
const template = cloneTemplate(templateBasket);
const basket = new Basket(template, events);
const success = new Success(cloneTemplate(templateSuccess), {
	onClick: () => {
		modal.close();
	},
});

//мониторинг событий
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//выводим данные товаров в галерею
events.on('cards:changed', () => {
	const itemsHTMLArray = appData.getCards().map((item) => {
		const card = new CardItem(cloneTemplate(templateCardCatalog), events);
		return card.render(item);
	});

	page.render({ gallery: itemsHTMLArray });
});

//открыть карточку в модальном окне предпросмотра
events.on('card:open', ({ id }: { id: string }) => {
	const card = appData.getCardById(id);

	preview.render(card);
	modal.content = templatePreview;
	modal.open();

	const inBasket = appData.basket.includes(id);
	preview.button = inBasket ? 'Удалить' : 'В корзину';

	preview.buttonDisabled = false;

	if (card.price === null) {
		preview.button = 'Недоступно';
		preview.buttonDisabled = true;
	}
});

events.on('preview:buttonChange', ({ id }: { id: string }) => {
	const inBasket = appData.basket.includes(id);
	if (inBasket) {
		events.emit('card:remove-from-cart', { id });
		preview.button = 'В корзину';
	} else {
		events.emit('card:add-to-cart', { id });
		preview.button = 'Удалить';
	}
});

//закрытие прокрутки страницы при открытии модалки
events.on('modal:open', () => {
	page.locked = true;
});
events.on('modal:close', () => {
	page.locked = false;
});

//открытие корзины
events.on('basket:open', () => {
	modal.content = template;
	modal.open();
});

events.on('basket:changed', () => {
	basket.listItems = appData.basket.map((id, index) => {
		const card = appData.getCardById(id);
		const basketItem = new CardInBasket(cloneTemplate(listBasket), events);
		basketItem.index = String(index + 1);
		return basketItem.render(card);
	});
	basket.total = appData.getTotal();
	page.counter = appData.basket.length;
});

events.on('card:add-to-cart', (data: { id: string }) => {
	appData.addToBasket(data);
	modal.close();
});

events.on('card:remove-from-cart', (data: { id: string }) => {
	appData.removeFromBasket(data);
	events.emit('basket:changed');
});

events.on('order:open', () => {
	appData.clearOrderField();
	order.resetPayment();
	modal.render({
		content: order.render({
			payment: undefined,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:open', () => {
	appData.clearContactField();
	modal.render({
		content: contact.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('payment:change', (data: { field: keyof IOrder; value: string }) => {
	appData.setOrderField(data.field, data.value);
});

events.on('formErrorsOrder:change', (errors: Partial<IOrder>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment }).filter(Boolean).join('; ');
});

events.on('formErrorsContacts:change', (errors: Partial<IContacts>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({ email, phone }).filter(Boolean).join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContacts; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

//отправить форму заказа
events.on('contacts:submit', () => {
	const orderData = {
		...appData.order,
		...appData.contacts,
		items: appData.basket,
		total: appData.getTotal(),
	};
	api
		.orderSend(orderData)
		.then((result) => {
			appData.clearBasket();
			appData.clearOrderField();
			appData.clearContactField();
			modal.render({ content: success.render({ total: result.total }) });
		})
		.catch((err) => {
			console.error(err);
		});
});

api
	.getCatalog()
	.then((data) => {
		appData.addCards(data);
		console.log(appData);
	})
	.catch((err) => {
		console.log(err);
	});
