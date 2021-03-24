import { IObservableArray, makeObservable, observable } from "mobx";
import { IXBase } from "tonva-uqui";
import { MiNet } from "../net";
import { defaultGroupName } from "../consts";
import { MiConfigs, RegressionConfig, Stock as StockType, StockFindConfig } from "./types";
import { StockGroups } from "./stockGroups";
import { Accounts } from "./accounts";
import { UQs } from "uq-app";
import { MiAccounts } from "./miAccounts";
import { MiGroups } from "./miGroups";
import { Market, Stock, StockValue, UqExt } from "uq-app/uqs/BruceYuMi";
import { MiGroup } from "./miGroup";
import { MiAccount } from "./miAccount";
import { marketElements } from "./market";

export class Store {
	private readonly miNet: MiNet;
	readonly myAllColl: {[id:number]: boolean} = {};
	readonly yumi: UqExt;
	readonly markets: {[id:number]: {id?:number;name:string;currency:string;el:JSX.Element}} = {};
	stockGroups: StockGroups;
	accounts: Accounts;
	miAccounts: MiAccounts;
	miGroups: MiGroups;
	stocksMyAll: IObservableArray<Stock & StockValue> = null;
	stocksMyBlock: IObservableArray<Stock & StockValue> = null;
	groupIXs: IXBase[];
	
	constructor(miNet:MiNet, uqs: UQs) {
		makeObservable(this, {
			config: observable,
			myAllColl: observable,
			stocksMyAll: observable.shallow,
			stocksMyBlock: observable.shallow,
		});
		this.miNet = miNet;
		this.yumi = uqs.BruceYuMi;
		this.miAccounts = new MiAccounts(this);
		this.miGroups = new MiGroups(this);

		this.stockGroups = new StockGroups(miNet);
		this.accounts = new Accounts(miNet);
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
		let {miValue, earning, divident, price, market} = stock;
		if (miValue) stock.miValue = miValue;
		if (earning) stock.earning = earning;
		if (divident) stock.divident = divident / price;
		if (price) stock.price = price;
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
				{ix: undefined, id: stock.id}
			]
		});
		this.stocksMyAll.push(stock);
		this.myAllColl[stock.id] = true;
	}

	async removeMyAll(stock: Stock&StockValue): Promise<{miAccounts: MiAccount[], miGroups: MiGroup[]}> {
		if (!stock) return;

		let ret = await this.yumi.StockUsing.query({stock: stock.id});
		let {groups, accounts} = ret;
		if (groups.length > 0 || accounts.length > 0) {
			let miAccounts = this.miAccounts.accountsFromIds(accounts.map(v => v.account));
			let miGroups = this.miGroups.groupsFromIds(groups.map(v => v.group));
			return {miAccounts, miGroups};
		}

		await this.yumi.ActIX({
			IX: this.yumi.UserAllStock, 
			values: [
				{ix: undefined, id: -stock.id}
			]
		});
		let index = this.stocksMyAll.findIndex(v => v.id === stock.id);
		if (index >= 0) this.stocksMyAll.splice(index, 1);
		delete this.myAllColl[stock.id];
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
		let ret = this.stocksMyAll.filter(v => {
			let stockId = v.id;
			let ok = this.groupIXs.findIndex(gs => {
				let {ix, id:gStockId} = gs;
				return ix===groupId && gStockId===stockId;
			}) >= 0;
			return ok;
		});
		return ret;
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
				values: [{ix:undefined, id: -id}]
			})
			this.stocksMyBlock.splice(index, 1);
		}
		else {
			await this.yumi.ActIX({
				IX: this.yumi.UserBlockStock,
				values: [{ix:undefined, id}]
			})
			this.stocksMyBlock.push(stock);
		}
	}

	@observable config: MiConfigs = { 
		groupName: defaultGroupName, 
		stockFind: { sortType:'pe' },
		userStock: { sortType:'tagpe'},
		regression: {bmin:0, bmax:0.5, r2:0.7, lmin:0.01, lmax:0.5, lr2:0.7, mcount:2, lr4: 3, r210:0.6, irate:0.04}
	};
	//@observable blackList: any[] = [];
	//@observable defaultList: any[] = [];


	getHomeStockGroup() {
		let name = this.config.groupName;
		return this.stockGroups.groupFromName(name);
	}

	/*
	stockFromId(stockId: number): Stock&StockValue {
		return this.miGroups.stockFromId(stockId);
	}
	*/

	get findStockConfg(): StockFindConfig {
		return this.config.stockFind;
	}

	async load() {
		//await this.loadConfig();
		await this.loadMarkets();
		await Promise.all([
			this.miAccounts.load(),
			this.loadMyAll(),
			this.loadGroupIXs(),
			this.miGroups.load(),
		]);
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
			let {id} = groupIXs[i];
			if (id === stockId) ++nGroup;
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
			let {ix, id} = gs;
			if (id === stockId) inGroup[ix] = true;
		}
		return inGroup;
	}

	async saveConfig() {
		let v = JSON.stringify(this.config);
		//await this.miApi.call('t_usersettings$save', [this.user.id, 'config', v]);
		await this.miNet.t_usersettings$save(v);
	}

	protected async loadConfig() {
		let rets = await Promise.all([
			this.miNet.t_usersettings$query(),
			this.stockGroups.load(),
			this.accounts.load(),
		]);
		await this.stockGroups.init();
		let r = rets[0];
		if (r !== undefined) {
			let ret = r;
			if (ret !== undefined && ret.length > 0) {
				let cStr = ret[0].value;
				let c = JSON.parse(cStr);
				if (this.stockGroups) {
					let name = c.tagName;
					let group = this.stockGroups.groupFromName(name);
					if (!group) {
						group = this.stockGroups.groupFromName(defaultGroupName);
						if (group) {
							c.tagName = defaultGroupName;
						}
						else {
							c.tagName = this.stockGroups.group0;
						}
					}
					c.groupName = c.tagName;
				}
				this.config = c;
			}
		}
		if (this.config.stockFind === undefined) {
			this.config.stockFind = { sortType: 'pe' };
		}
		else {
			switch (this.config.stockFind.selectType) {
			case 'all': break;
			case 'peroe': break;
			case 'pe': break;
			case 'dp': break;
			default:
				this.config.stockFind.selectType = 'all';
				break;
			}
		}
		if (this.config.userStock === undefined) {
			this.config.userStock = { sortType: 'tagpe' };
		}
		if (this.config.regression === undefined) {
			this.config.regression = {bmin:0, bmax:0.5, r2:0.7, lmin:0.01, lmax:0.5, lr2:0.7, mcount:2, lr4: 3, r210:0.6, irate:0.04};
		}
		else {
			if (this.config.regression.r210 === undefined) {
				this.config.regression.r210 = 0.6;
			}
			if (this.config.regression.irate === undefined) {
				this.config.regression.irate = 0.04;
			}
		}
		/*
		await Promise.all([
			this.loadBlackList(), 
			this.loadDefaultList(),
		]);
		*/
	}

	setStockSortType = async (type:string)=> {
		if (this.config.stockFind.sortType === type)
			return;
		this.config.stockFind.sortType = type;
		await this.saveConfig();
	}

	setStockSelectType = async (type:string) => {
		if (this.config.stockFind.selectType === type)
			return;
		this.config.stockFind.selectType = type;
		await this.saveConfig();
	}

	setUserSortType = async (type:string)=> {
		if (this.config.userStock.sortType === type) return;
		this.config.userStock.sortType = type;
		await this.saveConfig();
	}

	selectTag = async (item:any) => {
		let {name} = item as {name:string, id:number};
		let group = this.stockGroups.groupFromName(name);
		if (group) {
			this.config.groupName = name;
			this.saveConfig();
		}
	}

	selectAccount = async (item:any) => {
		let {name} = item as {name:string, id:number};
		let account = this.accounts.setCurrentAccount(name);
		if (account) {
			this.config.accountName = name;
			this.saveConfig();
		}
	}

	setRegressionConfig = async (cfg: RegressionConfig) => {
		this.config.regression = cfg;
		await this.saveConfig();
	}

	async addTagStock(stock: StockType) {
		await this.stockGroups.defaultGroup.addStock(stock);
	}

	async removeTagStock(stock: StockType) {
		await this.stockGroups.defaultGroup.removeStock(stock);
	}

	async loadExportItems(queryName: string):Promise<any[]> {
		//let sName = this.store.config.stockFind.selectType;
		let {bmin, bmax, r2, lmin, lmax, lr2, mcount, lr4, r210} = this.config.regression;
		//if (sName !== undefined)
		//  queryName = sName;
		let query = {
			name: queryName,
			pageStart: 0,
			pageSize: 3000,
			user: this.miNet.userId,
			blackID: this.stockGroups.blackGroup.id,
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
		return rets;
	}
}
