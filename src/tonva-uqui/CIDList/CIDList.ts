import { ID, PageItems, Uq } from "tonva-react";
import { IDBase } from "../base";
import { CIDEdit } from "../CIDEdit";
import { CIDView } from "../CIDView";
import { CUqUi, IDListUiProps } from "../props";
import { VIDList } from "./VIDList";

export class CIDList<T extends IDBase> extends CUqUi<IDListUiProps<T>> {
	pageItems: IDPageItems<T>;

	protected async beforeStart(): Promise<boolean> {
		this.pageItems = new IDPageItems<T>(this.uq, this.props.ID);
		return true;
	}

	protected async internalStart() {
		await this.pageItems.first({});
		this.openVPage(VIDList);
	}

	onAddItem = async () => {
		let {onAddItem} = this.props;
		if (onAddItem === null) return;
		if (onAddItem !== undefined) {
			await onAddItem();
			return;
		}
		let cIDEdit = new CIDEdit({
			...this.props, 
			renderRight: undefined,
			onItemChanged: this.onItemChanged
		});
		await cIDEdit.start();
	}

	onClickItem = async (item:any) => {
		let {props} = this;
		let {onClickItem} = props;
		if (onClickItem === null) return;
		if (onClickItem !== undefined) return await onClickItem(item);
		let cIDView = new CIDView<any>({
			...props, 
			renderRight: undefined,
			onItemChanged: this.onItemChanged
		});
		await cIDView.start(item);
	}

	private onItemChanged = async (item:T) => {
		this.pageItems.update(item);
	}
}

class IDPageItems<T extends IDBase> extends PageItems<T> {
	private uq:Uq;
	private ID: ID;
	constructor(uq:Uq, ID: ID) {
		super(true);
		this.uq = uq;
		this.ID = ID;
	}
	async loadResults(param:any, pageStart:any, pageSize:number): Promise<{[name:string]:any[]}> {
		let ret = await this.uq.ID<T>({
			IDX: this.ID,
			id: undefined,
			page: {start:pageStart, size:pageSize},
		});
		return {$page:ret};
	}
	update(item:T) {
		let orgItem = this._items.find(v => v.id === item.id);
		if (orgItem) {
			Object.assign(orgItem, item);
		}
		else {
			this._items.unshift(item);
		}
	}
}
