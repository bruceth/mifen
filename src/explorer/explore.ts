import { IObservableArray, makeObservable, observable } from "mobx";
import { MiNet } from "../net";
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
	private miNet: MiNet;
	items: IObservableArray<any> = observable.array<any>([], { deep: true });
	avgs: Avg = {};
	lastTradeDay: number;
	//private oldSelectType: string;
	selectedItems: any[] = [];
  
	constructor(store: Store, miNet: MiNet) {
		this.store = store;
		this.miNet = miNet;
		makeObservable(this, {
			avgs: observable,
		});
	}

	/*
	disposeAutorun = autorun(async () => {
		let newSelectType = this.store.config.stockFind.selectType;
		if (newSelectType === this.oldSelectType)
		  return;
		if (this.oldSelectType === undefined) {
		  this.oldSelectType = newSelectType;
		  return;
		}
		this.oldSelectType = newSelectType;
		await this.load();
	});
	*/

	/*
	reload = async () => {
		await this.load();
	}
	*/
	
	load = async () => {
		this.selectedItems = [];
		let items = await this.loadItems();
		sortStocks(undefined, items);
		this.items.replace(items);
	}

	private async loadItems():Promise<any[]> {
		let queryName = 'all';
		let rets = await this.store.loadExportItems(queryName);
		/*
		let queryName = 'all';
		//let sName = this.store.config.stockFind.selectType;
		let {bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, r210, irate} = this.store.config.regression;
		//if (sName !== undefined)
		//  queryName = sName;
		let query = {
			name: queryName,
			pageStart: 0,
			pageSize: 3000,
			user: this.store.user.id,
			blackID: this.store.blackListTagID,
			bMin: bmin,
			bMax: bmax,
			r2: r2,
			lMin: lmin,
			lMax: lmax,
			lr2: lr2,
			mcount: mcount,
			lr4: lr4,
			r210: r210,
		};
		let rets = await Promise.all([
			this.miNet.process(query, []),
			//this.store.miApi.call('q_getlasttradeday', [])
			this.miNet.q_getlasttradeday(),
		]);
		*/
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
		if (queryName === 'all') {
			this.avgs = GFunc.CalculateValueAvg(arr);
		}
		else {
			this.avgs = {};
		}
		return arr;
	}

	async onItemSelected(item:any) {
		this.store.itemSelected(item);
	}

	async onItemUnselected(item:any) {
		this.store.itemUnselected(item);
	}

	setSortType(type:string) {
		this.store.setUserSortType(type);
		let arr = this.items.slice();
		sortStocks(type, arr);
		this.items.replace(arr);
	}
}
