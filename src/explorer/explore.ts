import { makeObservable, observable, runInAction } from "mobx";
import { GFunc } from "../tool";
import { Store, sortStocks, Stock } from "../store";

interface Avg {
	avg20?: number;
	avg50?: number;
	avg100?: number;
	avg?: number;
}

export class Explore {
	private store: Store;
	items: any[]; // = observable.array<any>([], { deep: true });
	avgs: Avg = {};
	lastTradeDay: number;
	sortType: string;
	selectedItems: any[] = [];
  
	constructor(store: Store) {
		this.store = store;
		makeObservable(this, {
			avgs: observable,
			items: observable,
			sortType: observable,
		});
	}
	
	load = async () => {
		this.selectedItems = [];
		let items = await this.loadItems();
		runInAction(() => {
			this.sortType = this.store.config.userStock.sortType;
			sortStocks(this.sortType, items);
			if (!this.items) {
				this.items = items;
			}
			else {
				this.items.splice(0, this.items.length, items);
			}	
		});
	}

	private async loadItems():Promise<any[]> {
		let queryName = 'all';
		let rets = await this.store.loadExportItems(queryName);
		let lastDayRet = rets[1] as {day:number}[];
		if (Array.isArray(lastDayRet) && lastDayRet.length > 0) {
			this.lastTradeDay = lastDayRet[0].day;
		}
		else {
			this.lastTradeDay = undefined;
		}
		let result = rets[0];
		if (Array.isArray(result) === false) {
			return;
		};
		let arr: Stock[] = result;
		for (let item of arr) {
			let dataArray = JSON.parse(item.data) as number[];
			item.dataArr = dataArray;
            let e = item.e * item.eshares;
            let p = item.price * item.pshares;
            let c = item.capital * item.eshares;
            let b = item.bonus * item.bshares;
			item.v = GFunc.calculateVS(item.ev * item.eshares, b, p);
            item.pe = p / e;
            item.roe = e / c;
            item.divyield = b / p;
		}
		runInAction(() => {
			if (queryName === 'all') {
				this.avgs = GFunc.CalculateValueAvg(arr as  {v:number}[]);
			}
			else {
				this.avgs = {};
			}
		});
		return arr;
	}

	async onItemSelected(item:any) {
		this.store.addTagStock(item);
	}

	async onItemUnselected(item:any) {
		this.store.removeTagStock(item);
	}

	setSortType(type:string) {
		runInAction(() => {
			sortStocks(type, this.items);
			this.store.setUserSortType(type);	
		});
	}
}
