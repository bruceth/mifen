import { IObservableArray, observable, runInAction } from "mobx";
import { SlrForEarning } from "regression";
import { GFunc } from "tool";
import { MiNet } from "../net";
import { sortStocks } from "./sortStocks";
import { Stock } from "./types";

export class StockGroup {
	private miNet: MiNet;

	id: number;
	name: string;
	stocks: IObservableArray<Stock>;
	sortType: string;

	constructor(groupName:string, groupId:number, miNet: MiNet) {
		this.name = groupName;
		this.id = groupId;
		this.miNet = miNet;
		this.stocks = observable.array<Stock>([], { deep: true });
	}

	async loadItems() {
		// 距离上次
		let queryName = 'taguser';

		let query = {
			name: queryName,
			pageStart: 0,
			pageSize: 1000,
			user: this.miNet.userId,
			tag: this.id,
			yearlen: 1,
		};
		let result = await this.miNet.process(query, []);
		if (Array.isArray(result) === false) return;

		let arr: Stock[] = result;
		for (let item of arr) {
			let dataArray = JSON.parse(item.data) as number[];
			item.dataArr = dataArray;
			let sl = new SlrForEarning(dataArray);
			item.ep = (sl.predict(4) + item.e) / 2;
			item.e3 = sl.predict(7);
			item.v = GFunc.calculateVN(sl.slopeR, item.ep, item.divyield * item.price, item.exprice);
			item.predictpe = item.price / item.e3;
		}
		//sortStocks(this. arr);
		/*
		let o = 1;
		for (let item of arr) {
			item.order = o;
			++o;
		}
		*/

		runInAction(() => {
			this.stocks.clear();
			this.stocks.push(...arr);	
		});
	}

	sort(sortType: string) {
		this.sortType = sortType;
		sortStocks(sortType, this.stocks);
	}

	async addStock(stockId:number) {
		if (stockId <= 0) return;
		//let tagid = this.defaultListTagID;
		await this.miNet.t_tagstock$add(this.id, stockId);
		//await this.addTagStockID(tagid, stockId);
		//let group = this.stockGroups.groupFromId(tagid);
		//await this.loadHomeItems();
		//group.addStock(stockId);
		this.stocks.push();
	}

	async removeStock(stockId: number) {
		await this.miNet.t_tagstock$del(this.id, stockId);
		let index = this.stocks.findIndex(v => v.id === stockId);
		if (index >= 0) this.stocks.splice(index, 1);
	}

	exists(stockId: number): boolean {
		for (let stock of this.stocks) {
			if (stock.id === stockId) return true;
		}
		return false;
	}
}
