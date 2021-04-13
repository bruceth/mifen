import { makeObservable, observable } from "mobx";
import { BruceYuMi } from "uq-app";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { MGroup, MiGroup, MIndustry, MRootIndustry } from "./mGroup";
import { Store } from "./store";

export abstract class MGroups<T extends MGroup> {
	protected store: Store;
	//private readonly ID: ID;
	groups: T[];

	constructor(store: Store) {
		this.store = store;
		//this.ID = store.yumi.Group;
		makeObservable(this, {
			groups: observable,
		})
	}

	abstract load(): Promise<void>;

	groupsFromIds(ids: number[]): MGroup[] {
		let ret:MGroup[] = [];
		let len = this.groups.length;
		for (let i=0; i<len; i++) {			
			let group = this.groups[i];
			if (ids.findIndex(v => v === group.id) >= 0) {
				ret.push(group);
			}
		}
		return ret;
	}

	calcStockCount() {}
}

export class MiGroups extends MGroups<MiGroup> {
	async load(): Promise<void> {
		let {yumi} = this.store;
		let ret = await yumi.IX<BruceYuMi.Group>({
			IX: yumi.UserGroup,
			IDX: [yumi.Group],
			ix: undefined,
		});
		this.groups = ret.map(v => new MiGroup(this.store, v));
	}

	calcStockCount() {
		this.groups.forEach(v => {
			let stockCount = this.store.calcGroupStockCount(v.id);
			v.count = stockCount;
		});
	}

	async addStockToGroup(stock:Stock&StockValue, group: MiGroup) {
		let {yumi} = this.store;
		let {stocksMyAll, groupIXs} = this.store;
		let stockId = stock.id;
		let groupId = group.id;
		await yumi.Acts({
			groupStock: [{ix: groupId, xi: stockId, order: undefined}],
			userAllStock: [{ix: undefined, xi: stockId}],
		});
		groupIXs.push({ix:groupId, xi:stockId});
		let index = stocksMyAll.findIndex(v => v.id === stockId);
		if (index < 0) stocksMyAll.push(stock);
		let stockCount = this.store.calcGroupStockCount(groupId);
		group.addStock(stock, stockCount);
	}

	async removeStockFromGroup(stock:Stock&StockValue, group: MiGroup) {
		let {yumi} = this.store;
		let stockId = stock.id;
		let groupId = group.id;
		await yumi.Acts({
			groupStock: [{ix: groupId, xi: -stockId, order: undefined}],
		});
		let {groupIXs} = this.store;
		for (let i=0; i<groupIXs.length; i++) {
			let {ix, xi} = groupIXs[i];
			if (xi !== stockId) continue;
			if (ix !== groupId) continue;
			groupIXs.splice(i, 1);
			let stockCount = this.store.calcGroupStockCount(groupId);
			group.removeStock(stock, stockCount);
			break;
		}
	}
}

export class MIndustries extends MGroups<MIndustry> {
	async load(): Promise<void> {
		let {yumi} = this.store;
		let ret = await yumi.ID<BruceYuMi.Group>({
			IDX: [yumi.Industry],
			id: undefined,
		});
		this.groups = ret.map(v => new MIndustry(this.store, v));
	}
}

export class MRootIndustries extends MGroups<MRootIndustry> {
	async load(): Promise<void> {
		let {yumi} = this.store;
		let ret = await yumi.IX<BruceYuMi.Group>({
			IX: yumi.IXIndustry,
			IDX: [yumi.Industry],
			ix: 0,
		});
		this.groups = ret.map(v => new MRootIndustry(this.store, v));
	}
}
