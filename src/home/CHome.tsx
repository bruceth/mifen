/*eslint @typescript-eslint/no-unused-vars: ["off", { "vars": "all" }]*/
import { CApp, CUqBase } from '../UqApp';
import { CStockInfo, NStockInfo } from '../stockinfo';
import { VSiteHeader } from './VSiteHeader';
import { VSearchHeader } from './VSearchHeader';
import { VHome } from './VHome';
import { VSelectTag } from './VSelectTag';
import { CMarketPE } from './CMarketPE';
import { CStock } from 'stock';
import { Stock, StockGroup, Store } from '../store';
import { makeObservable, observable } from 'mobx';

export class CHome extends CUqBase {
	store: Store;
	stockGroup: StockGroup;
	sortType: string;

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

	manageGroups = async () => {
		this.cApp.showGroupsManage();
	}

	onSelectTag = async () => {
		this.openVPage(VSelectTag);
	}

	onAddStock = async () => {
		let cStock = new CStock(this.cApp);
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