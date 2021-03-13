import { runInAction } from "mobx";
import { PageItems } from "tonva-react";
import { ListPageItems } from "../tools";
import { IDBase, Mid } from "../base";

export abstract class MidList<T> extends Mid {
	protected listPageItems: ListPageItems<T>;	
	abstract createPageItems():PageItems<T>;
	async init():Promise<void> {}
	protected abstract loadPageItems(pageStart:any, pageSize:number):Promise<T[]>;
	abstract key:((item:T) => number|string);

	onRightClick: ()=>any;
	renderItem: (item:T, index:number)=>JSX.Element;
	onItemClick: (item:T)=>any;
	renderRight: ()=>JSX.Element;
}

export abstract class MidIDListBase<T extends IDBase> extends MidList<T> {
	protected listPageItems: IDListPageItems<T>;
	key:((item:T) => number|string) = item => {
		return item.id;
	}
	createPageItems():PageItems<T> {
		return this.listPageItems = new IDListPageItems<T>(
			(pageStart:any, pageSize:number) => this.loadPageItems(pageStart, pageSize)
		);
	}
}

class IDListPageItems<T extends IDBase> extends ListPageItems<T> {
	itemId(item:T):number {return item.id}
	newItem(id:number, item:T):T {return {...item, id}}

	update(id:number, item:T) {
		let ret = this._items.find(v => this.itemId(v) === id);
		if (ret === undefined) {
			let data = this.newItem(id, item);
			this._items.unshift(data);
		}
		else {
			runInAction(() => {
				Object.assign(ret, item);
			});
		}
	}
}
