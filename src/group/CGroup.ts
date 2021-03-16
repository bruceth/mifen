import { renderGroup } from "holding/renderGroup";
import { makeObservable, observable } from "mobx";
import { MiGroup } from "store/miGroup";
import { IDUI } from "tonva-react";
import { CID, MidIXID } from "tonva-uqui";
import { Group, Stock, StockValue } from "uq-app/uqs/BruceYuMi";
import { CApp, CUqBase } from "../uq-app";
import { VGroup } from "./VGroup";
import { VStockInGroup } from "./VStockInGroup";

export class CGroup extends CUqBase {
	miGroup: MiGroup;
	stock: Stock & StockValue;

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
		await this.miGroup?.loadItems();
	}

	changeMiGroup = async (miGroup: MiGroup) => {
		this.miGroup = miGroup;
		await this.miGroup.loadItems();
	}

	onStockClick = async (stock: Stock) => {
		let {name, code, market, rawId} = stock;	  
		rawId = 1;
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let dt = date.getDate();
		this.cApp.showStock({
			id: rawId, 
			name,
			code,
			symbol: market,
			day: year*10000 + month*100 + dt,
			stock
		} as any);
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

	setStockGroup = (stock: Stock&StockValue) => {
		this.stock = stock;
		this.openVPage(VStockInGroup);
	}

	setGroup = async (checked:boolean, group: MiGroup) => {
		let {miGroups} = this.cApp.store;
		let {groupStocks, groupAll, groupBlack} = miGroups;
		let stockId = this.stock.id;
		let groupId = group.id;
		if (checked === true) {
			groupStocks.push({ix:groupId, id:stockId});
			group.stocks?.push(this.stock as any);
			let index = groupAll.stocks.findIndex(v => v.id === stockId);
			if (index < 0) groupAll.stocks.push(this.stock);
		}
		else {
			let nGroup = 0; // 在组数
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
					if (ix !== groupAll.id && ix !== groupBlack.id) {
						++nGroup;
					}
				}
			}
		}
	}

	setMyAll = async (checked: boolean) => {
		alert('my All');
	}

	setBlock = (checked: boolean) => {
		alert('block');
	}

}
