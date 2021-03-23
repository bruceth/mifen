import { IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { CApp, CUqBase } from "uq-app";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { VHome } from "./VHome";
import { CAccount } from "./account";
import { CGroup } from "./group";
import { VStockList } from "./VStockList";

export class CHome extends CUqBase {
	readonly cAccount: CAccount;
	readonly cGroup: CGroup;
	stocks: IObservableArray<Stock & StockValue> = null;
	listCaption: string = null;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			stocks: observable.ref,
			listCaption: observable,
		});
		this.cAccount = new CAccount(this.cApp, this);
		this.cGroup = new CGroup(this.cApp, this);
	}

	protected async internalStart(param: any) {
		this.openVPage(VHome);
	}

	tab = () => {
		return this.renderView(VHome);
	}

	openStocksList(caption: string) {
		runInAction(() => {
			this.listCaption = caption;
			this.stocks = undefined;
			this.openVPage(VStockList);	
		});
	}

	setStocksList(stocks: IObservableArray<Stock&StockValue>) {
		runInAction(() => {
			this.stocks = stocks.sort((a, b) => {
				let am = a.miRate;
				let bm = b.miRate;
				if (am < bm) return 1;
				if (am > bm) return -1;
				return 0;
			});
			let len = this.stocks.length;
			for (let i=0; i<len; i++) (this.stocks[i] as any).$order = i+1;
		})
	}

	showStocksAll = async () => {
		let {store} = this.cApp;
		this.openStocksList(store.myAllCaption);
		this.setStocksList(store.stocksMyAll);
	}

	showStocksBlock = async () => {
		let {store} = this.cApp;
		this.openStocksList(store.myBlockCaption);
		await this.cApp.store.loadMyBlock();
		this.setStocksList(store.stocksMyBlock);
	}

	onStockClick = async (stock: Stock) => {
		
		let {name, code, market, rawId} = stock;
		rawId = 1;
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let dt = date.getDate();
		this.cApp.showStock({
			id: rawId, 
			name,
			code,
			symbol: market,
			day: year*10000 + month*100 + dt,
			stock
		} as any);
	}
}
