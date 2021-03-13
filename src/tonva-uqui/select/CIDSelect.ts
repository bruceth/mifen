import { ID, PageItems, Uq } from "tonva-react";
import { IDBase } from "../base/IDBase";
import { CList, MidList } from "../list";
import { ListPageItems } from "../tools";
import { renderSelectItem } from "./parts";

/*
export interface IDSelectProps<T extends IDBase> {
	uq: Uq;
	ID: ID;
	renderItem: (item:T, index:number)=>JSX.Element;
	onSelectChange: (item:T, isSelected:boolean)=>any;
}
*/
export class CIDSelect<T extends IDBase, P extends MidIDSelectList<T>> extends CList<T> {
	midIDSelectList: P;
	constructor(midIDSelectList: P) {
		super(midIDSelectList);
		this.setRes(midIDSelectList.res);
		this.midIDSelectList = midIDSelectList;
	}

	protected createMidList(): MidList<T> {
		return new MidIDSelectList(this.midIDSelectList.uq, this.midIDSelectList.ID);
	}
	protected onItemClick(item:any):void {
		return; //this.props.onItemClick(item);
	}

	protected renderRight():JSX.Element {
		return null;
	}

	protected renderItem(item:any, index:number):JSX.Element {
		let onChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
			let {onSelectChange} = this.midIDSelectList;
			onSelectChange?.(item, evt.currentTarget.checked);
		}
		let {renderItem, ID} = this.midIDSelectList;
		let content = (renderItem ?? ID.render)(item, index);
		let {$in} = item;
		return renderSelectItem(onChange, content, $in===1);
	}
}

export class MidIDSelectList<T extends IDBase> extends MidList<T> {
	readonly ID:ID;
	onSelectChange: (item:T, isSelected:boolean)=>any;

	constructor(uq:Uq, ID:ID) {
		super(uq);
		this.ID = ID;
	}

	async init() {
		await this.ID.loadSchema();
	}
	key:((item:T) => number|string) = item => item.id;
	createPageItems():PageItems<T> {
		return this.listPageItems = new IDListPageItems<T>(
			(pageStart:any, pageSize:number) => this.loadPageItems(pageStart, pageSize)
		);
	}
	protected async loadPageItems(pageStart:any, pageSize:number):Promise<T[]> {
		let ret = await this.uq.ID<T>({
			IDX: this.ID,
			id: undefined,
			page: {start:pageStart, size:pageSize},
		});
		return ret;
	}
}

class IDListPageItems<T extends IDBase> extends ListPageItems<T> {
	itemId(item:T):number {return item.id}
	newItem(id:number, item:T):T {return {...item, id}}
}
