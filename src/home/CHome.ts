import { CApp, CUqBase } from "uq-app";
import { IDUI } from "tonva-react";
import { CID, MidIXID } from "tonva-uqui";
import { renderGroup } from "../tool";
import { Group, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { VHome } from "./VHome";
import { CAccount } from "./account";
import { CGroup } from "./group";
import { IObservableArray, makeObservable, observable, runInAction } from "mobx";
import { VStockList } from "./VStockList";
import { VPinStock } from "./VPinStock";
import { VKeepStock } from "./VKeepStock";

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

	async internalStart(param: any) {
		this.openVPage(VHome);
	}

	tab = () => {
		return this.renderView(VHome);
	}

	setStockToGroup = (stock: Stock&StockValue) => {
		this.cGroup.setStockToGroup(stock);
	}

	manageGroups = async () => {
		let uq = this.uqs.BruceYuMi;
		let IDUI: IDUI = {
			ID: uq.Group,
			fieldCustoms: {
				no: {hiden: true},
				type: {hiden: true, defaultValue: '0'}
			},
			t: this.t,
		}
		let mId = new MidIXID<Group>(uq, IDUI, uq.UserGroup);
		let cID = new CID(mId);
		let {renderItem, onItemClick} = cID;
		cID.renderItem = (item: Group, index:number) => renderGroup(item, index, renderItem);
		cID.onItemClick = (item: Group):void => onItemClick(item);
		let changed = await cID.call();
		if (changed === true) {
			await this.cApp.store.miGroups.load();
		}
	}

	manageAccounts = async () => {
		let uq = this.uqs.BruceYuMi;
		let IDUI:IDUI = {
			ID: uq.Account,
			fieldCustoms: {
				no: {hiden: true},
			},
			t: this.t,
		}
		let mId = new MidIXID(uq, IDUI, uq.UserAccount);
		let cID = new CID(mId);
		let changed = await cID.call();
		if (changed === true) {
			await this.cApp.store.miAccounts.load();
		}
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
			this.stocks = stocks;
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

	isMySelect(stock: Stock & StockValue):boolean {
		return this.cApp.store.isMySelect(stock.id);
	}

	async addMySelect(stock: Stock & StockValue) {
		await this.cApp.store.addStockToMyAll(stock);
	}

	async removeMySelect(stock: Stock & StockValue) {
		let ret = await this.cApp.store.removeStockFromMyAll(stock);
		if (ret) {
			(ret as any).stock = stock;
			this.openVPage(VKeepStock, ret);
		}
	}

	selectStock(stock: Stock & StockValue) {
		if (this.isMySelect(stock)) {
			this.removeMySelect(stock);
		}
		else {
			this.addMySelect(stock);
		}
	}

	renderPinStock(stock: Stock & StockValue) {
		return this.renderView(VPinStock, stock);
	}
}
