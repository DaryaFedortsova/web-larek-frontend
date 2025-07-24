import { ICardItem } from '../types';
import { Api, ApiListResponse } from './base/api';

export class CardsApi extends Api {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCatalog(): Promise<ICardItem[]> {
		return this.get('/product').then((data: ApiListResponse<ICardItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getCardItem(id: string): Promise<ICardItem> {
		return this.get(`/product/${id}`).then((item: ICardItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	
}