import { IObservableArray, makeObservable, observable, runInAction} from "mobx";
import { Group, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { Store } from "./store";

export abstract class MGroup implements Group {
	protected readonly store: Store;
	id: number;
	name: string = null;
	count: number = null;
	stocks: IObservableArray<Stock & StockValue> = null;

	constructor(store:Store, group:Group) {
		makeObservable(this, {
			stocks: observable,
			count: observable,
			name: observable,
		});
		this.store = store;
		Object.assign(this, group);
	}

	abstract get type(): string;

	async loadItems() {
		if (this.stocks) return;
		let ret = await this.internalLoadItems();
		runInAction(() => {
			this.stocks = observable(ret, {deep: false});
			this.count = this.stocks.length;
		});
	}

	protected abstract internalLoadItems(): Promise<any[]>;
}

export class MiGroup extends MGroup {
	get type(): string {return 'group'}

	protected async internalLoadItems() {
		let ret = await this.store.loadGroupStocks(this.id);
		return ret;
	}

	addStock(stock: Stock & StockValue, stockCount: number) {
		if (this.stocks) {
			this.stocks.push(stock);
			this.count = this.stocks.length + 1;
		}
	}

	removeStock(stock: Stock & StockValue, stockCount: number) {
		if (this.stocks) {
			let stockId = stock.id;
			let index = this.stocks.findIndex(v => v.id === stockId);
			if (index >= 0) this.stocks.splice(index, 1);
		}
	}

	exists(stockId: number) {
		return this.stocks?.findIndex(v => v.id === stockId) 
	}
}

export class MIndustry extends MGroup {
	get type(): string {return 'industry'}
	protected async internalLoadItems() {
		let ret = await this.store.loadIndustryStocks(this.id);
		return ret;
	}
}
