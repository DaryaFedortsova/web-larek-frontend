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
import { IOrder } from './types';

const events = new EventEmitter();
const api = new CardsApi(API_URL, CDN_URL);

//мониторинг событий
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

const appData = new AppData(events);
const page = new Page(document.querySelector('.page__wrapper') as HTMLElement,events);
const templateCardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const modal = new Modal(document.querySelector('#modal-container'), events);
const templateCardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const basket = new Basket(cloneTemplate(templateBasket), events);
const listBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateOrder = document.querySelector<HTMLTemplateElement>('#order');
const orderForm = cloneTemplate(templateOrder) as HTMLFormElement;
const order = new Order(orderForm, events);



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
	const templatePreview = cloneTemplate(templateCardPreview);
	const preview = new CardPreview(templatePreview, events);
	preview.render(card);
	modal.content = templatePreview;
	modal.open();
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
	const template = cloneTemplate(templateBasket);
	const basket = new Basket(template, events);

	basket.items = appData.basket.map((id, index) => {
		const card = appData.getCardById(id);
         const basketItem = new CardInBasket(cloneTemplate(listBasket), events);
		 basketItem.index = String(index + 1);
		 basket.total = appData.getTotal();
		return basketItem.render(card);
	});
	modal.content = template;
	modal.open();
});

events.on('basket:changed', () => {
	page.counter = appData.basket.length;
})


events.on('card:add-to-cart', (data: {id: string}) => {
	appData.addToBasket(data);
	modal.close();
})

events.on('card:remove-from-cart', (data: {id: string}) => {
	appData.removeFromBasket(data);
	events.emit('basket:changed');
});

events.on('order:open', () => {
	modal.content = orderForm;
	modal.render({content: orderForm})
	
});

events.on('payment:change', ({ field, value }: { field: keyof IOrder, value: string }) => {
    appData.order[field] = value;});

api
	.getCatalog()
	.then((data) => {
		appData.addCards(data);
		console.log(appData);
	})
	.catch((err) => {
		console.log(err);
	});
