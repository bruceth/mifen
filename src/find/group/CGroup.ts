import { computed, IObservableArray, makeObservable, observable, runInAction } from "mobx";
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
	stocks: IObservableArray<Stock & StockValue>;

	constructor(cFind: CFind) {
		super(cFind);
		makeObservable(this, {
			miGroup: observable,
			miAccount: observable,
			stocks: observable,
			listCaption: computed,
		});
	}

	async internalStart(param: any) {
	}

	private _listCaption: string;
	get listCaption(): string {
		return this._listCaption?? this.miGroup?.name;
	}

	renderGroups() {return this.renderView(VGroups);}

	showMiGroup = async (miGroup: MiGroup) => {
		this._listCaption = undefined;
		this.miGroup = miGroup;

		let renderPageRight = () => {
			let cID = this.cApp.cCommon.buildCIDUserGroup();
			return cID.renderViewRight(miGroup);
		}
		this.openStocksList(undefined, renderPageRight);
		await miGroup.loadItems();
		this.setStocksList(miGroup.stocks);
	}

	showStocksAll = async () => {
		let {store} = this.cApp;
		this._listCaption = store.myAllCaption;
		this.miGroup = undefined;
		this.openStocksList();
		this.setStocksList(store.stocksMyAll);
	}

	showStocksBlock = async () => {
		let {store} = this.cApp;
		let renderRowRight = this.cApp.cCommon.renderBlockStock;
		this._listCaption = store.myBlockCaption;
		this.miGroup = undefined;
		this.openStocksList(renderRowRight);
		await this.cApp.store.loadMyBlock();
		this.setStocksList(store.stocksMyBlock);
	}

	private openStocksList(renderRowRight?: (stock:Stock & StockValue) => JSX.Element, 
		renderPageRight?: () => JSX.Element) {
		runInAction(() => {
			//this.listCaption = caption;
			this.stocks = undefined;
			this.openVPage(VStockList, {renderRowRight, renderPageRight});
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
