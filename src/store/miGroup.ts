import { IObservableArray, makeObservable, observable} from "mobx";
import { EnumGroupType, Group, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { MiGroups } from "./miGroups";
import { sortStocks } from "./sortStocks";

export class MiGroup implements Group {
	private readonly miGroups: MiGroups;
	id: number;
	name: string;
	tName: string|JSX.Element;
	type: EnumGroupType;
	stocks: IObservableArray<Stock & StockValue> = null;

	constructor(miGroups: MiGroups, group:Group) {
		makeObservable(this, {
			stocks: observable,
		});
		this.miGroups = miGroups;
		Object.assign(this, group);
		//this.stocks = observable.array<Stock & StockValue>([], { deep: true });
	}

	async loadItems() {
		let ret = await this.miGroups.loadGroupStocks(this);
		if (!ret) return;
		//this.stocks.spliceWithArray(0, this.stocks.length, ret);
		this.stocks = observable(ret, {deep: false});
	}

	sort(sortType: string) {
		//this.sortType = sortType;
		sortStocks(sortType, this.stocks);
	}

	async addStock(stock: Stock) {
		/*
		await this.miNet.t_tagstock$add(this.id, stock.id);
		let index = this.stocks.findIndex(v => v.id === stock.id);
		if (index >= 0) {
			let rows = this.stocks.splice(index, 1);
			this.stocks.unshift(rows[0]);
		}
		else {
			// 重新加载stock的其它值
			// await ...
			//this.stocks.unshift(stock);
			await this.loadItems();
			sortStocks(this.sortType, this.stocks);
		}
		*/
	}

	async removeStock(stock: Stock) {
		/*
		await this.miNet.t_tagstock$del(this.id, stock.id);
		let index = this.stocks.findIndex(v => v.id === stock.id);
		if (index >= 0) this.stocks.splice(index, 1);
		*/
	}

	exists(stockId: number): boolean {
		for (let stock of this.stocks) {
			if (stock.id === stockId) return true;
		}
		return false;
	}
}
