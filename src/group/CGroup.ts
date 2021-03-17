import { renderGroup } from "holding/renderGroup";
import { makeObservable, observable, runInAction } from "mobx";
import { HoldingStock, MiAccount } from "store/miAccount";
import { MiGroup } from "store/miGroup";
import { IDUI } from "tonva-react";
import { CID, MidIXID } from "tonva-uqui";
import { Group, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CApp, CUqBase } from "../uq-app";
import { VAccount } from "./VAccount";
import { VBuy, VBuyNew, VCashAdjust, VCashIn, VCashOut, VSell } from "./VForm";
import { VGroups } from "./VGroups";
import { VStockInGroup } from "./VStockInGroup";
import { VStockList } from "./VStockList";

export class CGroup extends CUqBase {
	miGroup: MiGroup = null;
	stock: Stock & StockValue;
	miAccount: MiAccount = null;
	holdingStock: HoldingStock;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			miGroup: observable,
			miAccount: observable,
		});
	}

	async internalStart(param: any) {
		this.openVPage(VGroups);
	}

	tab = () => {
		return this.renderView(VGroups);
	}

	load = async () => {
		this.miGroup = this.cApp.store.miGroups.groups[0];
		await this.miGroup?.loadItems();
	}

	showMiGroup = async (miGroup: MiGroup) => {
		runInAction(() => {
			this.miGroup = miGroup;
			this.openVPage(VStockList);
		});
		await miGroup.loadItems();
	}

	showStocksAll = async () => {
		let {miGroups} = this.cApp.store;
		runInAction(() => {
			this.miGroup =miGroups.groupMyAll;
			this.openVPage(VStockList);	
		})
	}

	showStocksBlock = async () => {
		let {miGroups} = this.cApp.store;
		let miGroup = miGroups.groupBlock;
		runInAction(() => {
			this.miGroup = miGroup;
			this.openVPage(VStockList);
		});
		await miGroup.loadItems();
	}

	showAccount = async (item: MiAccount) => {
		this.miAccount = item;
		this.openVPage(VAccount);
		await item.loadItems();
	};
	
	showHolding = async (item: HoldingStock) => {
		this.onStockClick(item.stockObj);
	}

	showBuy = async (item?: HoldingStock) => {
		if (item) {
			this.holdingStock = item;
			this.openVPage(VBuy);
		}
		else {
			this.holdingStock = undefined;
			this.openVPage(VBuyNew);
		}
	}

	submitBuy = async (value:number) => {
		this.miAccount.addHolding(this.cApp.store.miGroups.groupMyAll.stocks[0], value);
	}

	showSell = async (item: HoldingStock) => {
		this.holdingStock = item;
		this.openVPage(VSell);
	}

	submitSell = async (value:number) => {

	}
	
	showCashIn = async () => {
		this.openVPage(VCashIn);
	}

	submitCashIn = async (value:number) => {
		this.miAccount.changeCash(value);
	}
	
	showCashOut = async () => {
		this.openVPage(VCashOut);
	}

	submitCashOut = async (value:number) => {		
		this.miAccount.changeCash(-value);
	}
	
	showCashAdjust = async () => {
		this.openVPage(VCashAdjust);
	}

	submitCashAdjust = async (value:number) => {
		this.miAccount.changeCash(value);
	}

	changeMiGroup = async (miGroup: MiGroup) => {
		runInAction(() => {
			this.miGroup = miGroup;
		});
		await miGroup.loadItems();
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
		cID.onItemClick = (item: Group):void => {
			let {type} = item;
			switch (type) {
				//case EnumGroupType.all:
				//case EnumGroupType.black: break;
				default: onItemClick(item); break;
			}
		}
		let changed = await cID.call();
		if (changed === true) {
			await this.cApp.store.miGroups.load();
		}
	}

	setStockGroup = (stock: Stock&StockValue) => {
		this.stock = stock;
		this.openVPage(VStockInGroup);
	}

	setGroup = async (checked:boolean, group: MiGroup) => {
		let {miGroups} = this.cApp.store;
		if (checked === true) {
			await miGroups.addStockToGroup(this.stock, group);
		}
		else {
			await miGroups.removeStockFromGroup(this.stock, group);
		}
	}

	setMyAll = async (checked: boolean) => {
		alert('my All');
	}

	setBlock = async (checked: boolean) => {
		let {store} = this.cApp;
		// block 操作之前，确保载入。还有显示之前，确保载入
		await store.miGroups.loadBlock();
		alert('block');
	}

}
