import { IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { MiAccount, MiGroup, HoldingStock } from "../../store";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CApp, CUqSub, UQs } from "../../uq-app";
import { CFind } from "../CFind";
import { VGroups } from "./VGroups";
import { VStockList } from "./VStockList";

export class CGroup extends CUqSub<CApp, UQs, CFind> {
	miGroup: MiGroup = null;
	miAccount: MiAccount = null;
	holdingStock: HoldingStock;
	listCaption: string;
	stocks: IObservableArray<Stock & StockValue>;

	constructor(cFind: CFind) {
		super(cFind);
		makeObservable(this, {
			miGroup: observable,
			miAccount: observable,
			stocks: observable,
		});
	}

	async internalStart(param: any) {
	}

	renderGroups() {return this.renderView(VGroups);}

	showMiGroup = async (miGroup: MiGroup) => {
		this.openStocksList(miGroup.name);
		await miGroup.loadItems();
		this.setStocksList(miGroup.stocks);
	}

	showStocksAll = async () => {
		let {store} = this.cApp;
		this.openStocksList(store.myAllCaption);
		this.setStocksList(store.stocksMyAll);
	}

	showStocksBlock = async () => {
		let {store} = this.cApp;
		let renderRowRight = this.cApp.cCommon.renderBlockStock;
		this.openStocksList(store.myBlockCaption, renderRowRight);
		await this.cApp.store.loadMyBlock();
		this.setStocksList(store.stocksMyBlock);
	}

	private openStocksList(caption: string, renderRowRight?: (stock:Stock & StockValue) => JSX.Element) {
		runInAction(() => {
			this.listCaption = caption;
			this.stocks = undefined;
			this.openVPage(VStockList, renderRowRight);
		});
	}

	private setStocksList(stocks: IObservableArray<Stock&StockValue>) {
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

	onStockClick = async (stock: Stock) => {
		this.cApp.cCommon.showStock(stock);
	}
}
