import { Store } from "store";
import { PageItems } from "tonva-react";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { SearchParam } from './CFind';

export class StockPageItems extends PageItems<Stock & StockValue> {
	private store: Store;

	constructor(store: Store) {
		super(false);
		this.store = store;
		this.firstSize = 50;
		this.pageSize = 20;
	}
	
	protected getPageId(item:Stock):any {
		return (item as unknown as any)?.$order;
	}

	protected async loadResults (param:SearchParam, pageStart:any, pageSize:number):Promise<{[name:string]:any[]}> {
		let ret = await this.store.searchStock(
			{...param, smooth: param.smooth + 1}
			, pageStart, pageSize);
		return ret as any;
	}
}
