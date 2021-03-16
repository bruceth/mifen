// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { runInAction } from "mobx";
import { ID, IX, Uq } from "tonva-react";
import { CList, MidIDListBase } from "../list";
import { IXBase } from "../base";

export class CIXList<T2 extends IXBase> extends CList<T2> {
	protected midIXList: MidIXList<T2>;
	constructor(midIXList: MidIXList<T2>) {
		super(midIXList);
		this.setRes(midIXList.res);
		this.midIXList = midIXList;
	}

	update(item:any) {
		this.midIXList.update(item);
	}
}

export class MidIXList<T extends IXBase> extends MidIDListBase<T> {
	readonly IX:IX;
	readonly ID:ID;
	readonly id: number;
	constructor(uq:Uq, IX:IX, ID:ID, id:number) {
		super(uq, undefined);
		this.IX = IX;
		this.ID = ID;
		this.id = id;
	}

	async init() {
		await this.IX.loadSchema();
	}

	//key:((item:T) => number|string) = item => item.id 2;

	protected async loadPageItems(pageStart:any, pageSize:number):Promise<T[]> {
		let ret = await this.uq.IX<T>({
			IX: this.IX,
			IDX: this.ID? [this.ID] : undefined,
			ix: this.id,
			page: {start:pageStart, size:pageSize},
		});
		return ret;
	}

	update(item:T) {
		runInAction(() => {
			let {_items} = this.listPageItems;
			if (!_items) return;
			let {ix, id} = item;
			if (id < 0) {
				let index = _items.findIndex(v => v.id === -id && v.id === id);
				if (index >= 0) _items.splice(index, 1);
			}
			else {
				let ret = _items.find(v => v.id === id && v.id === id);
				if (!ret) {
					_items.unshift({ix, id} as T);
				}
			}
		});
	}
}
