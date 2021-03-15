/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { CApp, CUqBase } from '../uq-app';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';
import { VSelectTag } from './VSelectTag';
import { CMarketPE } from './CMarketPE';
import { CSelectStock } from 'selectStock';
import { Stock, StockGroup, Store } from '../store';
import { makeObservable, observable } from 'mobx';
import { CID, MidIXID } from 'tonva-uqui';
import { EnumGroupType, Group } from 'uq-app/uqs/BruceYuMi';
import { renderGroup } from 'holding/renderGroup';
import { IDUI } from 'tonva-react';
import { MiGroup } from 'store/miGroup';

export class CHome extends CUqBase {
	store: Store;
	stockGroup: StockGroup;
	sortType: string;
	miGroup: MiGroup;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			stockGroup: observable,
			sortType: observable,
		});
		let {store} = cApp;
		this.store = store;
	}

	load = async () => {
		this.stockGroup = this.store.getHomeStockGroup();
		if (!this.stockGroup) debugger;
		this.sortType = this.store.config.userStock.sortType;
		if (!this.sortType) this.sortType = '';
		await this.stockGroup.loadItems();
		this.stockGroup.sort(this.sortType)
		/*
		let tagID = this.store.tagID;
		if (tagID > 0) {
			if (this.lastLoadTick && Date.now() - this.lastLoadTick < 300*1000) return;
				await this.store.loadHomeItems();
			this.lastLoadTick = Date.now();
		}
		*/
	}

	async changeGroup(stockGroup: StockGroup) {
		this.stockGroup = stockGroup;
		await this.stockGroup.loadItems();
	}

	async changeMiGroup(group: Group) {
		let {id, name} = group;
		this.miGroup = new MiGroup(name, id);
		await this.miGroup.loadItems();
	}

	manageGroups = async () => {
		let uq = this.uqs.BruceYuMi;
		let IDUI:IDUI = {
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

	onSelectTag = async () => {
		this.openVPage(VSelectTag);
	}

	onAddStock = async () => {
		let cStock = new CSelectStock(this.cApp);
		let r = await cStock.call() as Stock;

		if (r !== undefined) {
			await this.stockGroup.addStock(r);
		}
	}

	onClickTag = async (item:any) => {
		await this.cApp.store.selectTag(item);
		this.closePage();
	}

	onPage = async () => {
		//this.PageItems.more();
	}

	onWarningConfg = () => {
		this.cApp.cWarning.onWarningConfg();
	}


	// async searchMain(key: any) {
	//   if (key !== undefined) await this.PageItems.first(key);
	// }

		//作为tabs中的首页，internalStart不会被调用
	async internalStart(param: any) {
	}

	renderSiteHeader = () => {
		return this.renderView(VSiteHeader);
	}

	renderSearchHeader = (size?: string) => {
		return this.renderView(VSearchHeader, size);
	}

	tab = () => this.renderView(VHome);

	openStockInfo = (item: NStockInfo) => {
		let cStockInfo = this.newC(CStockInfo);
		cStockInfo.start(item);
	}

	openMarketPE = () => {
		let cm = this.newC(CMarketPE);
		cm.start();
	}

	setSortType = (type:string) => {
		this.stockGroup.sort(type);
		this.store.setUserSortType(type);
	}
}