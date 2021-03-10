import { defaultBlackListGroupName, defaultGroupName } from "consts";
import { IObservableArray, observable } from "mobx";
import { MiNet } from "../net";
import { StockGroup } from "./stockGroup";

export class StockGroups {
	private miNet: MiNet;
	readonly groups: IObservableArray<StockGroup>;
	defaultGroup: StockGroup;
	blackGroup: StockGroup;

	constructor(miNet: MiNet) {
		this.miNet = miNet;
		this.groups = observable.array<StockGroup>([], { deep: true });
	}

	async init() {
		this.defaultGroup = this.groupFromName(defaultGroupName);
		this.blackGroup = this.groupFromName(defaultBlackListGroupName);
		await Promise.all([
			this.defaultGroup?.loadItems(),
			this.blackGroup?.loadItems(),
		]);
	}
	
	groupFromName(groupName:string) {
		return this.groups.find(v => v.name === groupName);
	}

	groupFromId(id:number) {
		return this.groups.find(v => v.id === id);
	}

	get group0() {return this.groups[0]}

	getSelected(tags:{tag:number}[]) {
		let ret = this.groups.filter(v => {
			let i = tags.findIndex(st => st.tag === v.id);
			return i >= 0;
		});
		return ret;
	}

	add(group: StockGroup) {
		this.groups.push(group);
	}

	exists(id:number, name:string): boolean {
		return this.groups.findIndex(v => v.id === id && v.name === name) >= 0;
	}
	
	isMySelect(id:number): boolean {
		for (let group of this.groups) {
			if (group.exists(id) === true) return true;
		}
		return false;
	}
	
	isMyBlack(id:number): boolean {
		if (!this.blackGroup) return false;
		return this.blackGroup.exists(id);
	}

	async load(): Promise<void> {
		let r = await this.miNet.t_tag$all();
		let ret = r as any[];
		let bc = await this.checkDefaultTags(ret);
		if (bc) {
			//r = await this.miApi.query('t_tag$all', [this.user.id]);
			r = await this.miNet.t_tag$all();
			ret = r as any[];
		}
		let r1 = [];
		let i = ret.findIndex(v=>v.name === defaultGroupName);
		if (i >= 0) {
			r1.push(ret[i]);
			ret.splice(i, 1);
		}
		i = ret.findIndex(v=> v.name === defaultBlackListGroupName);
		if (i >= 0) {
			r1.push(ret[i]);
			ret.splice(i, 1);
		}
		r1.push(...ret);
		this.groups.replace(r1.map(v => new StockGroup(v.name, v.id, this.miNet)));
	}

	private async checkDefaultTags(list:any[]): Promise<boolean> {
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
	}
}
