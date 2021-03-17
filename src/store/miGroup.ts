import { IObservableArray, makeObservable, observable, runInAction} from "mobx";
import { EnumGroupType, Group, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { MiGroups } from "./miGroups";
import { sortStocks } from "./sortStocks";

export class MiGroup implements Group {
	protected readonly miGroups: MiGroups;
	id: number;
	name: string;
	count: number;
	type: EnumGroupType;
	stocks: IObservableArray<Stock & StockValue> = null;

	constructor(miGroups: MiGroups, group:Group) {
		makeObservable(this, {
			stocks: observable,
			count: observable,
		});
		this.miGroups = miGroups;
		Object.assign(this, group);
		this.calcCount();
	}

	async loadItems() {
		if (this.stocks) return;
		runInAction(() => {
			this.stocks = undefined;
		});
		let ret = await this.internalLoad();
		runInAction(() => {
			this.stocks = observable(ret, {deep: false});
			this.count = this.stocks.length;
		});
	}

	protected async internalLoad() {
		return await this.miGroups.loadGroupStocks(this);
	}

	calcCount() {
		runInAction(() => {
			this.count = this.stocks?
				this.stocks.length
				:
				this.miGroups.calcGroupStockCount(this);
		})
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

export class GroupMyAll extends MiGroup {
	constructor(miGroups: MiGroups, name:string) {
		super(miGroups, {name, type: undefined});
	}

	protected async internalLoad() {
		return await this.miGroups.loadMyAll();
	}
}

export class GroupMyBlock extends MiGroup {
	constructor(miGroups: MiGroups, name:string) {
		super(miGroups, {name, type: undefined});
	}

	protected async internalLoad() {
		return await this.miGroups.loadBlock();
	}
}
