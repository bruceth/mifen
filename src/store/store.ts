import { IObservableArray, makeObservable, observable } from "mobx";
import { IXBase } from "tonva-uqui";
import { UQs } from "uq-app";
import { MiAccounts } from "./miAccounts";
import { MGroups, MIndustries, MiGroups } from "./mGroups";
import { Market, Stock, StockValue, UqExt } from "uq-app/uqs/BruceYuMi";
import { MGroup, MiGroup, MIndustry } from "./mGroup";
import { MiAccount } from "./miAccount";
import { marketElements } from "./market";

export class Store {
	readonly myAllColl: {[id:number]: boolean} = {};
	readonly yumi: UqExt;
	readonly markets: {[id:number]: {id?:number;name:string;currency:string;el:JSX.Element}} = {};
	miAccounts: MiAccounts;
	miGroups: MiGroups;
	industries: MIndustries;

	stocksMyAll: IObservableArray<Stock & StockValue> = null;
	stocksMyBlock: IObservableArray<Stock & StockValue> = null;
	groupIXs: IXBase[];
	
	constructor(uqs: UQs) {
		makeObservable(this, {
			myAllColl: observable,
			stocksMyAll: observable.shallow,
			stocksMyBlock: observable.shallow,
		});
		this.yumi = uqs.BruceYuMi;
		this.miAccounts = new MiAccounts(this);
		this.miGroups = new MiGroups(this);
		this.industries = new MIndustries(this);
	}

	stockFromId(stockId: number): Stock&StockValue {
		return this.stocksMyAll.find(v => v.id === stockId);
	}

	async loadStock(stockId: number): Promise<Stock&StockValue> {
		let ret = await this.yumi.ID<Stock&StockValue>({
			IDX: [this.yumi.Stock, this.yumi.StockValue],
			id: stockId,
		});
		let stock = ret[0];
		this.buildStockValues(stock);
		return stock;
	}

	private buildStockValues(stock: Stock & StockValue) {
		if (stock === undefined) return;
		let {market} = stock;
		(stock as any).$market = this.markets[market];
	}
	
	async searchStock(param:any, pageStart:any, pageSize:number):Promise<{[name:string]:any[]}> {
		let ret = await this.yumi.SearchStock.page(param, pageStart, pageSize, true);
		let {$page} = ret;
		$page.forEach(v => this.buildStockValues(v as unknown as (Stock & StockValue)));
		return ret as any;
	}

	isMyAll(stock: Stock): boolean {
		return this.myAllColl[stock.id] === true;
	}
	
	async addMyAll(stock:Stock&StockValue) {
		if (!stock) return;
		await this.yumi.ActIX({
			IX: this.yumi.UserAllStock, 
			values: [
				{ix: undefined, xi: stock.id}
			]
		});
		let stockId = stock.id;
		if (this.stocksMyAll.findIndex(v => v.id === stockId) < 0) {
			this.stocksMyAll.push(stock);
		}
		this.myAllColl[stockId] = true;
	}

	async removeMyAll(stock: Stock&StockValue): Promise<{miAccounts: MiAccount[], miGroups: MGroup[]}> {
		if (!stock) return;
		let stockId = stock.id;
		let ret = await this.yumi.StockUsing.query({stock: stockId});
		let {groups, accounts} = ret;
		if (groups.length > 0 || accounts.length > 0) {
			let miAccounts = this.miAccounts.accountsFromIds(accounts.map(v => v.account));
			let miGroups = this.miGroups.groupsFromIds(groups.map(v => v.group));
			return {miAccounts, miGroups};
		}

		await this.yumi.ActIX({
			IX: this.yumi.UserAllStock, 
			values: [
				{ix: undefined, xi: -stockId}
			]
		});
		let index = this.stocksMyAll.findIndex(v => v.id === stockId);
		if (index >= 0) this.stocksMyAll.splice(index, 1);
		delete this.myAllColl[stockId];
	}

	myAllCaption: string = '自选股';
	myBlockCaption: string = '黑名单';

	async loadMyAll() {
		let ret = await this.yumi.IX<(Stock&StockValue)>({
			IX: this.yumi.UserAllStock,
			IDX: [this.yumi.Stock, this.yumi.StockValue],
			ix: undefined,
		});
		ret.forEach(v => {
			this.buildStockValues(v);
			this.myAllColl[v.id] = true;
		});
		this.stocksMyAll = observable(ret, {deep: false});
	}

	async loadMyBlock() {
		if (this.stocksMyBlock) return;
		let {yumi} = this;
		let ret = await yumi.IX<(Stock&StockValue)>({
			IX: yumi.UserBlockStock,
			IDX: [yumi.Stock, yumi.StockValue],
			ix: undefined,
		});
		ret.forEach(v => this.buildStockValues(v));
		this.stocksMyBlock = observable(ret, {deep: false});
	}

	async loadGroupStocks(groupId: number):Promise<(Stock&StockValue)[]> {
		let unloadArr: number[] = [];
		let ret: (Stock&StockValue)[] = [];
		this.groupIXs.forEach(gs => {
			let {ix, xi:gStockId} = gs;
			if (ix !== groupId) return;
			let stock = this.stocksMyAll.find(v => v.id === gStockId);
			if (stock) ret.push(stock);
			else unloadArr.push(gStockId);
		});
		if (unloadArr.length > 0) {
			let stockArr = await this.yumi.ID<Stock&StockValue>({
				IDX: [this.yumi.Stock, this.yumi.StockValue],
				id: unloadArr,
			});
			for (let stock of stockArr) {
				this.buildStockValues(stock);
				this.stocksMyAll.push(stock);
				ret.push(stock);
			}
		}
		return ret;
	}

	async loadIndustryStocks(industryId: number):Promise<(Stock&StockValue)[]> {
		let stockArr = await this.yumi.IX<Stock&StockValue>({			
			IX: this.yumi.GroupStock,
			IDX: [this.yumi.Stock, this.yumi.StockValue],
			ix: industryId,
		});
		return stockArr;
}

	async loadMarkets() {
		let {yumi} = this;
		let ret = await yumi.ID<Market>({
			IDX: [yumi.Market],
			id: undefined,
		});
		for (let m of ret) {
			let {id, name} = m;
			this.markets[id] = {...m, el: marketElements[name]};
		}
	}

	isMyBlock(stock: Stock): boolean {
		let index = this.stocksMyBlock.findIndex(v => v.id === stock.id);
		return index >= 0;
	}

	async toggleBlock(stock: Stock&StockValue) {
		if (!stock) return;
		await this.loadMyBlock();
		let {id} = stock;
		let index = this.stocksMyBlock.findIndex(v => v.id === id);
		if (index >= 0) {
			await this.yumi.ActIX({
				IX: this.yumi.UserBlockStock,
				values: [{ix:undefined, xi: -id}]
			})
			this.stocksMyBlock.splice(index, 1);
		}
		else {
			await this.yumi.ActIX({
				IX: this.yumi.UserBlockStock,
				values: [{ix:undefined, xi: id}]
			})
			this.stocksMyBlock.push(stock);
		}
	}

	async load() {
		await this.loadMarkets();
		await Promise.all([
			this.miAccounts.load(),
			this.loadMyAll(),
			this.loadGroupIXs(),
			this.miGroups.load(),
			this.industries.load(),
		]);
		this.miGroups.calcStockCount();
	}

	private async loadGroupIXs() {
		let {yumi} = this;
		let ret = await yumi.IX<IXBase>({
			IX: yumi.UserGroup,
			IX1: yumi.GroupStock,
			ix: undefined,
		});
		this.groupIXs = ret;
	}

	stockInNGroup(stock:Stock): number {
		let nGroup = 0;
		let {groupIXs} = this;
		let stockId = stock.id;
		for (let i=0; i<groupIXs.length; i++) {
			let {xi} = groupIXs[i];
			if (xi === stockId) ++nGroup;
		}
		return nGroup;
	}

	calcGroupStockCount(groupId: number): number {
		if (!this.groupIXs) return;
		let count = 0;
		for (let gs of this.groupIXs) {
			let {ix} = gs;
			if (ix === groupId) ++count;
		}
		return count;
	}

	buildInGroup(stockId: number): {[groupId:number]:boolean} {
		let inGroup:{[groupId:number]:boolean} = {};
		for (let gs of this.groupIXs) {
			let {ix, xi} = gs;
			if (xi === stockId) inGroup[ix] = true;
		}
		return inGroup;
	}
}
