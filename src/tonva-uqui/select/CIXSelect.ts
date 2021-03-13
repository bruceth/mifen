import { ID, IX, PageItems, Uq } from "tonva-react";
import { ListPageItems } from "../tools";
import { IDBase, IXBase } from "../base";
import { CIDSelect, MidIDSelectList } from "./CIDSelect";

export class CIXSelect<T extends IXBase> extends CIDSelect<T, MidIXSelectList<T>> {
}

export class MidIXSelectList<T extends IXBase> extends MidIDSelectList<T> {
	readonly IX:IX;
	readonly id:number;
	constructor(uq:Uq, ID:ID, IX:IX, id:number) {
		super(uq, ID);
		this.IX = IX;
		this.id = id;
	}

	async init() {
		await super.init();
		await this.IX.loadSchema();
	}

	key:((item:T) => number|string) = item => item.id;
	createPageItems():PageItems<T> {
		return this.listPageItems = new IDListPageItems<T>(
			(pageStart:any, pageSize:number) => this.loadPageItems(pageStart, pageSize)
		);
	}
	protected async loadPageItems(pageStart:any, pageSize:number):Promise<T[]> {
		let ret = await this.uq.IDinIX<T>({
			ID: this.ID,
			IX: this.IX,
			id: this.id,
			page: {start:pageStart, size:pageSize},
		});
		return ret as any[];
	}
}

class IDListPageItems<T extends IDBase> extends ListPageItems<T> {
	itemId(item:T):number {return item.id}
	newItem(id:number, item:T):T {return {...item, id}}
}
