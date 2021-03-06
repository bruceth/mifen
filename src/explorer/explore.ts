import { makeObservable, observable, runInAction } from "mobx";
import { SlrForEarning } from "regression";
import { GFunc } from "../tool";
import { Store, sortStocks } from "../store";

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
	//private oldSelectType: string;
	selectedItems: any[] = [];
  
	constructor(store: Store) {
		this.store = store;
		makeObservable(this, {
			avgs: observable,
			items: observable,
		});
	}
	
	load = async () => {
		this.selectedItems = [];
		let items = await this.loadItems();
		sortStocks(undefined, items);
		runInAction(() => {
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
		let arr = result as {id:number, data?:string, v:number, pe:number, e:number, ep:number, price:number, exprice:number, divyield:number, r2:number, lr2:number, e3:number, predictpe:number, order:number, ma:number, dataArr?:number[]}[];
		for (let item of arr) {
			let dataArray = JSON.parse(item.data) as number[];
			item.dataArr = dataArray;
			let sl = new SlrForEarning(dataArray);
			//let ep = GFunc.evaluatePricePrice(irate, sl.predict(5), sl.predict(6), sl.predict(7));
			item.ep = (sl.predict(4) + item.e) / 2;
			item.v = GFunc.calculateVN(sl.slopeR, item.ep, item.divyield * item.price, item.exprice);
			item.e3 = sl.predict(7);
		}
		runInAction(() => {
			if (queryName === 'all') {
				this.avgs = GFunc.CalculateValueAvg(arr);
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
		this.store.setUserSortType(type);
		let arr = this.items.slice();
		sortStocks(type, arr);
		this.items.splice(0, this.items.length, arr);
	}
}
