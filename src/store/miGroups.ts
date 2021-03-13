//import { defaultBlackListGroupName, defaultGroupName } from "consts";
import { IObservableArray, observable } from "mobx";
import { BruceYuMi } from "uq-app";
import { UqExt } from "uq-app/uqs/BruceYuMi";
import { MiGroup } from "./miGroup";

const myAll = 'myAll';
const myBlack = 'myBlack';

export class MiGroups {
	private yumi: UqExt;
	readonly groups: IObservableArray<MiGroup>;
	defaultGroup: MiGroup;
	blackGroup: MiGroup;

	constructor(yumi: UqExt) {
		this.yumi = yumi;
		this.groups = observable.array<MiGroup>([], { deep: true });
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

	add(group: MiGroup) {
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
		let ret = await this.yumi.IX<BruceYuMi.Group>({
			IX: this.yumi.UserGroup,
			IDX: [this.yumi.Group],
			id: undefined,
		});
		let groupArr:BruceYuMi.Group[] = [];
		if (ret.findIndex(v => v.type === BruceYuMi.EnumGroupType.all) < 0) {
			//let no = await this.yumi.IDNO({ID: this.yumi.Group});
			let no = undefined;
			groupArr.push({no, name: myAll, type: BruceYuMi.EnumGroupType.all})
		}
		if (ret.findIndex(v => v.type === BruceYuMi.EnumGroupType.black) < 0) {
			//let no = await this.yumi.IDNO({ID: this.yumi.Group});
			let no = undefined;
			groupArr.push({no, name: myBlack, type: BruceYuMi.EnumGroupType.black})
		}
		if (groupArr.length > 0) {
			//let retActIX = 
			await this.yumi.ActIX({
				IX: this.yumi.UserGroup, 
				ID: this.yumi.Group, 
				values: groupArr.map(v => ({id:undefined, id2: v})),
			});
		}
		/*
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
		this.groups.replace(r1.map(v => new MiGroup(v.name, v.id, this.miNet)));

		this.defaultGroup = this.groupFromName(defaultGroupName);
		this.blackGroup = this.groupFromName(defaultBlackListGroupName);
		await Promise.all([
			this.defaultGroup?.loadItems(),
			this.blackGroup?.loadItems(),
		]);
		*/
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
}
