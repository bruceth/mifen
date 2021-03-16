import { IObservableArray, observable } from "mobx";
import { ID, ParamIX } from "tonva-react";
import { IXBase } from "tonva-uqui/base";
import { BruceYuMi } from "uq-app";
import { EnumGroupType, Stock, StockValue, UqExt } from "uq-app/uqs/BruceYuMi";
import { MiGroup } from "./miGroup";

const myAll = 'myAll';
const myBlack = 'myBlack';

export class MiGroups {
	private readonly yumi: UqExt;
	private readonly ID: ID;
	groupStocks: IXBase[];
	readonly groups: IObservableArray<MiGroup>;
	groupAll: MiGroup;
	groupBlack: MiGroup;

	constructor(yumi: UqExt) {
		this.yumi = yumi;
		this.ID = yumi.Group;
		this.groups = observable.array<MiGroup>([], { deep: true });
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
		let [groups, groupStocks] = ret;
		this.groupStocks = groupStocks;
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
		let miGroups = groups.map(v => {
			let g = new MiGroup(this, v);
			let {type, name} = v;
			switch (type) {
				default:
					g.tName = name;
					return g;
				case EnumGroupType.all: 
					this.groupAll = g; 
					break;
				case EnumGroupType.black: 
					this.groupBlack = g; 
					break;
			}
			g.tName = this.yumi.Group.t(name);
			return g;
		});
		this.groups.splice(0, this.groups.length, ...miGroups);
	}

	async loadGroupStocks(group:MiGroup):Promise<(Stock&StockValue)[]> {
		let {id, type} = group;
		switch (type) {
			case EnumGroupType.all:
			case EnumGroupType.black:
				if (group.stocks) return;
				let param:ParamIX = {
					IX: this.yumi.GroupStock,
					ix: id,
					IDX: [this.yumi.Stock, this.yumi.StockValue],
				}
				let ret = await this.yumi.IX<(Stock&StockValue)>(param);
				return ret;
		}
		if (group.stocks) return;
		let ret = this.groupAll.stocks.filter(v => {
			let stockId = v.id;
			let ok = this.groupStocks.findIndex(gs => {
				let {ix, id:gStockId} = gs;
				return ix===id && gStockId===stockId;
			}) >= 0;
			return ok;
		});
		return ret;
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
