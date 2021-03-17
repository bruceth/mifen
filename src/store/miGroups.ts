import { IObservableArray, observable } from "mobx";
import { ID, t } from "tonva-react";
import { IXBase } from "tonva-uqui/base";
import { BruceYuMi } from "uq-app";
import { EnumGroupType, Stock, StockValue, UqExt } from "uq-app/uqs/BruceYuMi";
import { GroupMyAll, GroupMyBlock, MiGroup } from "./miGroup";

//const myAll = 'myAll';
//const myBlack = 'myBlack';

export class MiGroups {
	private readonly yumi: UqExt;
	private readonly ID: ID;
	groupStocks: IXBase[];
	readonly groups: IObservableArray<MiGroup>;
	//groupAll: MiGroup;
	//groupBlack: MiGroup;
	//stocksAll: IObservableArray<Stock & StockValue> = null;
	//stocksBlock: IObservableArray<Stock & StockValue> = null;
	//groupAllName: string|JSX.Element;
	//groupBlockName: string|JSX.Element;
	groupMyAll: MiGroup;
	groupBlock: MiGroup;

	constructor(yumi: UqExt) {
		this.yumi = yumi;
		this.ID = yumi.Group;
		this.groups = observable.array<MiGroup>([], { deep: true });
		this.groupMyAll = new GroupMyAll(this, t('myAll') as string);
		this.groupBlock = new GroupMyBlock(this, t('myBlack') as string);
	}

	getSelected(tags:{tag:number}[]) {
		let ret = this.groups.filter(v => {
			let i = tags.findIndex(st => st.tag === v.id);
			return i >= 0;
		});
		return ret;
	}

	add(group: MiGroup) {
		this.groups.push(group);
	}

	exists(id:number, name:string): boolean {
		return this.groups.findIndex(v => v.id === id && v.name === name) >= 0;
	}
	
	isMySelect(id:number): boolean {
		/*
		for (let group of this.groups) {
			if (group.exists(id) === true) return true;
		}
		*/
		return false;
	}
	
	/*
	isMyBlack(id:number): boolean {
		if (!this.blackGroup) return false;
		return this.blackGroup.exists(id);
	}
	*/

	async load(): Promise<void> {
		let ret = await Promise.all([
			this.groupMyAll.loadItems(),
			this.yumi.IX<BruceYuMi.Group>({
				IX: this.yumi.UserGroup,
				IDX: [this.yumi.Group],
				ix: undefined,
			}),
			this.yumi.IX<IXBase>({
				IX: this.yumi.UserGroup,
				IX1: this.yumi.GroupStock,
				ix: undefined,
			}),
		]);
		let [, groups, groupStocks] = ret;
		this.groupStocks = groupStocks;
		/*
		let groupArr:BruceYuMi.Group[] = [];
		if (groups.findIndex(v => v.type === BruceYuMi.EnumGroupType.all) < 0) {
			let no = undefined;
			groupArr.push({no, name: myAll, type: BruceYuMi.EnumGroupType.all})
		}
		if (groups.findIndex(v => v.type === BruceYuMi.EnumGroupType.black) < 0) {
			let no = undefined;
			groupArr.push({no, name: myBlack, type: BruceYuMi.EnumGroupType.black})
		}
		if (groupArr.length > 0) {
			//let retActIX = 
			await this.yumi.ActIX({
				IX: this.yumi.UserGroup, 
				ID: this.yumi.Group, 
				values: groupArr.map(v => ({ix:undefined, id: v})),
			});
			groups = await this.yumi.IX<BruceYuMi.Group>({
				IX: this.yumi.UserGroup,
				IDX: [this.yumi.Group],
				ix: undefined,
			});
		}
		*/
		let miGroups = groups.map(v => new MiGroup(this, v));
		this.groups.splice(0, this.groups.length, ...miGroups);
	}

	async loadGroupStocks(group:MiGroup):Promise<(Stock&StockValue)[]> {
		if (group.stocks) return;
		let {id} = group;
		let ret = this.groupMyAll.stocks.filter(v => {
			let stockId = v.id;
			let ok = this.groupStocks.findIndex(gs => {
				let {ix, id:gStockId} = gs;
				return ix===id && gStockId===stockId;
			}) >= 0;
			return ok;
		});
		return ret;
	}

	async loadMyAll() {
		let ret = await this.yumi.IX<(Stock&StockValue)>({
			IX: this.yumi.UserAllStock,
			IDX: [this.yumi.Stock, this.yumi.StockValue],
			ix: undefined,
		});
		return ret;
	}

	async loadBlock() {
		let ret = await this.yumi.IX<(Stock&StockValue)>({
			IX: this.yumi.UserBlockStock,
			IDX: [this.yumi.Stock, this.yumi.StockValue],
			ix: undefined,
		});
		return ret;
	}

	async addStockToGroup(stock:Stock&StockValue, group: MiGroup) {
		let {groupStocks, groupMyAll} = this;
		let {stocks} = groupMyAll;
		let stockId = stock.id;
		let groupId = group.id;
		await this.yumi.Acts({
			groupStock: [{ix: groupId, id: stockId, order: undefined}],
			userAllStock: [{ix: undefined, id: stockId}],
		});
		groupStocks.push({ix:groupId, id:stockId});
		group.stocks?.push(stock);
		let index = stocks.findIndex(v => v.id === stockId);
		if (index < 0) stocks.push(stock);
		group.calcCount();
	}

	async removeStockFromGroup(stock:Stock, group: MiGroup) {
		let {groupStocks} = this;
		let stockId = stock.id;
		let groupId = group.id;
		await this.yumi.Acts({
			groupStock: [{ix: groupId, id: -stockId, order: undefined}],
		});
		for (let i=0; i<groupStocks.length; i++) {
			let {ix, id} = groupStocks[i];				
			if (id === stockId) {
				if (ix === groupId) {
					groupStocks.splice(i, 1);
					if (group.stocks) {
						let index = group.stocks.findIndex(v => v.id === stockId);
						if (index >= 0) group.stocks.splice(index, 1);
					}
				}
			}
		}
		group.calcCount();
	}

	stockInNGroup(stock:Stock): number {
		let nGroup = 0;
		let {groupStocks} = this;
		let stockId = stock.id;
		for (let i=0; i<groupStocks.length; i++) {
			let {id} = groupStocks[i];				
			if (id === stockId) ++nGroup;
		}
		return nGroup;
	}

	calcGroupStockCount(group: MiGroup): number {
		if (!this.groupStocks) return;
		let count = 0;
		let groupId = group.id;
		for (let gs of this.groupStocks) {
			let {ix} = gs;
			if (ix === groupId) ++count;
		}
		return count;
	}

	private async checkDefaultTags(list:any[]): Promise<boolean> {
		/*
		let br = false;
		if (list === undefined) {
			await this.miNet.t_tag$save(defaultGroupName);
			await this.miNet.t_tag$save(defaultBlackListGroupName);
			br = true;
		}
		else {
			let i = list.findIndex(v => v.name === defaultGroupName);
			if (i < 0) {
				await this.miNet.t_tag$save(defaultGroupName);
				br = true;
			}
			i = list.findIndex(v => v.name === defaultBlackListGroupName);
			if (i < 0) {
				await this.miNet.t_tag$save(defaultBlackListGroupName);
				br = true;
			}
		}

		return br;
		*/
		return false;
	}

	getMemuItems(action: (group: MiGroup) => Promise<void>) {
		let groups = this.groups.map(v => {
			let {name, type} = v;
			let icon = 'list-alt', iconClass:string = undefined;
			switch (type) {
				case EnumGroupType.all:
					icon = 'home';
					iconClass = 'text-primary'
					break;
				case EnumGroupType.black:
					icon = 'ban';
					iconClass = 'text-black';
					break;
			}
			return {
				caption: this.ID.t(name) as string,
				action: () => action(v),
				icon,
				iconClass,
			};
		});
		return groups;
	}
}
