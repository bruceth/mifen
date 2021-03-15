import { renderGroup } from "holding/renderGroup";
import { makeObservable, observable } from "mobx";
import { MiGroup } from "store/miGroup";
import { IDUI } from "tonva-react";
import { CID, MidIXID } from "tonva-uqui";
import { textSpanIntersectsWithPosition } from "typescript";
import { Group, Stock } from "uq-app/uqs/BruceYuMi";
import { CApp, CUqBase } from "../uq-app";
import { VGroup } from "./VGroup";

export class CGroup extends CUqBase {
	miGroup: MiGroup;

	constructor(cApp: CApp) {
		super(cApp);
		makeObservable(this, {
			miGroup: observable,
		});
	}

	async internalStart(param: any) {
		this.openVPage(VGroup);
	}

	tab = () => {
		return this.renderView(VGroup);
	}

	load = async () => {
		this.miGroup = this.cApp.store.miGroups.groups[0];
		await this.miGroup.loadItems();
	}

	async changeMiGroup(miGroup: MiGroup) {
		this.miGroup = miGroup;
		await this.miGroup.loadItems();
	}

	onStockClick = async (stock: Stock) => {

	}

	manageGroups = async () => {
		let uq = this.uqs.BruceYuMi;
		let IDUI: IDUI = {
			ID: uq.Group,
			fieldCustoms: {
				no: {hiden: true},
				type: {hiden: true, defaultValue: '0'}
			},
			t: this.t,
		}
		let mId = new MidIXID<Group>(uq, IDUI, uq.UserGroup);
		let cID = new CID(mId);
		let {renderItem, onItemClick} = cID;
		cID.renderItem = (item: Group, index:number) => renderGroup(item, index, renderItem);
		cID.onItemClick = (item: Group):void => {
			let {type} = item;
			switch (type) {
				//case EnumGroupType.all:
				//case EnumGroupType.black: break;
				default: onItemClick(item); break;
			}
		}
		let changed = await cID.call();
		if (changed === true) {
			await this.cApp.store.miGroups.load();
		}
	}
}
