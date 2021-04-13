import { MiAccount, MiGroup } from "store";
import { IDUI } from "tonva-react";
import { CID, MidIXID } from "tonva-uqui";
import { renderGroup } from "tool";
import { CUqBase } from "uq-app";
import { Account, Group, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { VBlockStock } from "./VBlockStock";
import { VEmpty } from "./VEmpty";
import { VKeepStock } from "./VKeepStock";
import { VPinStock } from "./VPinStock";
import { VStockInGroup } from "./VStockInGroup";
import { VStockLink } from "./VStockLink";

export class CCommon extends CUqBase {
	stock: Stock & StockValue;
	
	protected async internalStart(param: any) {
	}

	isMyAll(stock: Stock & StockValue):boolean {
		return this.cApp.store.isMyAll(stock);
	}

	async addMyAll(stock: Stock & StockValue) {
		await this.cApp.store.addMyAll(stock);
	}

	async removeMyAll(stock: Stock & StockValue, callbackWhenRemoved?: () => any) {
		let ret = await this.cApp.store.removeMyAll(stock);
		if (ret) {
			(ret as any).stock = stock;
			this.openVPage(VKeepStock, ret);
		}
		else {
			callbackWhenRemoved?.();
		}
	}

	toggleMyAll(stock: Stock & StockValue) {
		if (this.isMyAll(stock)) {
			this.removeMyAll(stock);
		}
		else {
			this.addMyAll(stock);
		}
	}

	isMyBlock(stock: Stock & StockValue):boolean {
		return this.cApp.store.isMyBlock(stock);
	}

	toggleBlock = async (stock: Stock & StockValue) => {
		let {store} = this.cApp;
		// block 操作之前，确保载入。还有显示之前，确保载入
		await store.toggleBlock(stock);
	}

	setStockToGroup = (stock: Stock&StockValue, closeLevelWhenRemoved: number) => {
		this.stock = stock;
		this.openVPage(VStockInGroup, closeLevelWhenRemoved);
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

	setStockToAccount = async (checked:boolean, account: MiAccount) => {
	}

	showEmptyPage = () => {
		this.openVPage(VEmpty);
	}

	renderPinStock = (stock: Stock & StockValue, closeLevelWhenRemoved: number) => {
		if (!stock) return null;
		return this.renderView(VPinStock, {stock, closeLevelWhenRemoved});
	}

	renderBlockStock = (stock: Stock & StockValue) => {
		if (!stock) return null;
		return this.renderView(VBlockStock, stock);
	}

	showStock = async (stock: Stock) => {
		let {name, no, rawId} = stock;
        let market = (stock as any).$market;
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let dt = date.getDate();
		this.cApp.showStock({
			id: rawId, 
			name,
			code: no,
            market: market.name,
			symbol: market.name + no,
			day: year*10000 + month*100 + dt,
			stock
		} as any);
	}

	buildCIDUserGroup(): CID<Group> {
		let uq = this.uqs.BruceYuMi;
		let IDUI: IDUI = {
			ID: uq.Group,
			fieldCustoms: {
				no: {hiden: true},
				type: {hiden: true, defaultValue: '0'}
			},
			t: this.t,
		}
		let ix = undefined;
		let mId = new MidIXID<Group>(uq, IDUI, uq.UserGroup, ix);
		mId.listHeader = '管理股票分组';
		mId.itemHeader = '股票分组';
		let cID = new CID(mId);
		return cID;
	}

	manageGroups = async () => {
		let cID = this.buildCIDUserGroup();
		let {renderItem, onItemClick} = cID;
		cID.renderItem = (item: Group, index:number) => renderGroup(item, index, renderItem);
		cID.onItemClick = (item: Group):void => onItemClick(item);
		let changed = await cID.call();
		if (changed === true) {
			await this.cApp.store.miGroups.load();
		}
	}

	buildCIDUserAccount(): CID<Account> {
		let uq = this.uqs.BruceYuMi;
		let IDUI:IDUI = {
			ID: uq.Account,
			fieldCustoms: {
				no: {hiden: true},
			},
			t: this.t,
		}
		let ix = undefined;
		let mId = new MidIXID<Account>(uq, IDUI, uq.UserAccount, ix);
		mId.listHeader = '管理持仓账号';
		mId.itemHeader = '持仓账号';
		let cID = new CID(mId);
		return cID;
	}

	manageAccounts = async () => {
		let cID = this.buildCIDUserAccount();
		let changed = await cID.call();
		if (changed === true) {
			await this.cApp.store.miAccounts.load();
		}
	}

	renderStockLink(stock:Stock) {
		return this.renderView(VStockLink, stock);
	}
}
