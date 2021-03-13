import { makeObservable, observable } from "mobx";
import { MiNet } from "../net";
import { defaultGroupName } from "../consts";
import { MiConfigs, RegressionConfig, Stock, StockFindConfig } from "./types";
import { StockGroups } from "./stockGroups";
import { Accounts } from "./accounts";
import { UQs } from "uq-app";
import { MiAccounts } from "./miAccount";
import { MiGroups } from "./miGroups";

export class Store {
	private miNet: MiNet;
	private uqs: UQs;
	//user: User;
	//userTag: UserTag;
	//homeItems: IObservableArray<any> = observable.array<any>([], { deep: true });
	stockGroups: StockGroups;
	accounts: Accounts;
	miAccounts: MiAccounts;
	miGroups: MiGroups;
	
	constructor(miNet:MiNet, uqs: UQs) {
		makeObservable(this, {
			config: observable,
		});
		//this.user = user;
		//let miHost = consts.miApiHost;
		//let token = this.user.token;
		//this.miApi = new MiApi(miHost, 'fsjs/', 'miapi', token, false);
		this.miNet = miNet;
		this.uqs = uqs;
		this.stockGroups = new StockGroups(miNet);
		this.accounts = new Accounts(miNet);
		this.miAccounts = new MiAccounts(uqs.BruceYuMi);
		this.miGroups = new MiGroups(uqs.BruceYuMi);
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
	@computed get tagID(): number {
		if (this.stockGroups) {
			let name = this.config.tagName;
			let i = this.stockGroups.findIndex(v => v.groupName === name);
			if (i >= 0) {
				return this.stockGroups[i].groupId as number;
			}
		}
		return -1;
	}
	*/

	get findStockConfg(): StockFindConfig {
		return this.config.stockFind;
	}
	/*
	get blackListTagID(): number {
		let group = this.stockGroups.groupFromName(defaultBlackListGroupName);
		return group?.groupId;
	}

	get defaultListTagID(): number {
		let group = this.stockGroups.groupFromName(defaultGroupName);
		return group?.groupId;
	}
	*/

	async load() {
		await this.loadConfig();
		//await this.loadHomeItems();
		await this.miAccounts.load();
		await this.miGroups.load();
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
	/*
	protected async loadBlackList(): Promise<void> {
		let blackid = this.blackListTagID;
		if (blackid <= 0) {
			this.blackList = [];
			return;
		}

		let param = { user:this.user.id, tag:blackid};
		try {
			let ret = await this.miNet.t_tagstock$query(blackid, undefined);//await this.uqs.mi.TagStock.query(param);
			let r = ret.map(item=> {
			return item.stock;
			});
			this.blackList = r;
		}
		catch (error) {
			let e = error;
		}
	}

	protected async loadDefaultList(): Promise<void> {
		let id = this.defaultListTagID;
		if (id <= 0) {
			this.defaultList = [];
			return;
		}

		let param = { user:this.user.id, tag:id};
		try {
			let ret = await this.miNet.t_tagstock$query(id, undefined);//await this.uqs.mi.TagStock.query(param);
			let r = ret.map(item => item.stock);
			this.defaultList = r;
		}
		catch (error) {
			let e = error;
		}
	}

	private addBlackID(id:number) {
		let i = this.blackList.findIndex(v=> v===id);
		if (i < 0) {
			this.blackList.push(id);
		}
	}

	private removeBlackID(id:number) {
		let i = this.blackList.findIndex(v=> v===id);
		if (i >= 0) {
			this.blackList.splice(i, 1);
		}
	}

	private addDefaultID(id:number) {
		let i = this.defaultList.findIndex(v=> v===id);
		if (i < 0) {
			this.defaultList.push(id);
		}
	}

	private removeDefaultID(id:number) {
		let i = this.defaultList.findIndex(v=> v===id);
		if (i >= 0) {
			this.defaultList.splice(i, 1);
		}
	}

	async addStock(stockId:number) {
		if (stockId <= 0) return;
		let tagid = this.defaultListTagID;
		await this.miNet.t_tagstock$add(tagid, stockId);
		await this.addTagStockID(tagid, stockId);
		let group = this.stockGroups.groupFromId(tagid);
		//await this.loadHomeItems();
		group.addStock(stockId);
	}
	*/

	async addTagStock(stock: Stock) {
		/*
		if (this.userTag && this.userTag.tagID === tagid) {
			if (tagid === this.blackListTagID) {
				this.addBlackID(stockID);
			}
			else if (tagid === this.defaultListTagID) {
				this.addDefaultID(stockID);
			}
		}
		*/
		await this.stockGroups.defaultGroup.addStock(stock);
	}

	/*
	async addTagStockIDs(tagid: number, stockIDs: number[]) {
		if (tagid === this.blackListTagID) {
			stockIDs.map(v=>this.addBlackID(v));
		}
		else if (tagid === this.defaultListTagID) {
			stockIDs.map(v=>this.addDefaultID(v));
		}
	}
	*/

	async removeTagStock(stock: Stock) {
		await this.stockGroups.defaultGroup.removeStock(stock);
		/*
		if (tagid === this.blackListTagID) {
			this.removeBlackID(stockID);
		}
		else if (tagid === this.defaultListTagID) {
			this.removeDefaultID(stockID);
		}
		if (this.userTag && this.userTag.tagID === tagid) {
			this.removeStock(stockID);
		}
		*/
	}

	/*
	async loadHomeItems() {
		// 距离上次
		let queryName = 'taguser';

		let query = {
			name: queryName,
			pageStart: 0,
			pageSize: 1000,
			user: this.user.id,
			tag: this.tagID,
			yearlen: 1,
		};
		let result = await this.miNet.process(query, []);
		if (Array.isArray(result) === false) return;

		let arr = result as {id:number, order:number, data?:string, v?:number, e:number, e3:number, ep:number, price:number, exprice:number, divyield:number, r2:number, lr2:number, predictpe?:number, dataArr?:number[]}[];
		for (let item of arr) {
			let dataArray = JSON.parse(item.data) as number[];
			item.dataArr = dataArray;
			let sl = new SlrForEarning(dataArray);
			item.ep = (sl.predict(4) + item.e) / 2;
			item.e3 = sl.predict(7);
			item.v = GFunc.calculateVN(sl.slopeR, item.ep, item.divyield * item.price, item.exprice);
			item.predictpe = item.price / item.e3;
		}
		this.sortStocks(arr);

		runInAction(() => {
			this.homeItems.clear();
			this.homeItems.push(...arr);	
		});
	}
	*/

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

	isMySelect(id:number): boolean {
		return this.stockGroups.isMySelect(id);
	}

	isMyBlack(id:number): boolean {
		return this.stockGroups.isMyBlack(id);
	}
}
