import { makeObservable, observable } from "mobx";
import { ID } from "tonva-react";
import { BruceYuMi } from "uq-app";
import { Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { MiGroup } from "./miGroup";
import { Store } from "./store";

export class MiGroups {
	private store: Store;
	private readonly ID: ID;
	//readonly groups: IObservableArray<MiGroup>;
	groups: MiGroup[];

	constructor(store: Store) {
		this.store = store;
		this.ID = store.yumi.Group;
		makeObservable(this, {
			groups: observable,
		})
		//this.groups = observable.array<MiGroup>([], { deep: true });
	}

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

	groupsFromIds(ids: number[]): MiGroup[] {
		let ret:MiGroup[] = [];
		let len = this.groups.length;
		for (let i=0; i<len; i++) {			
			let group = this.groups[i];
			if (ids.findIndex(v => v === group.id) >= 0) {
				ret.push(group);
			}
		}
		return ret;
	}
}
