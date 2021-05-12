import { ID, IX, PageItems, Uq } from "tonva-react";
import { IDBase } from "../base";
import { CIDEdit } from "../CIDEdit";
import { CIDView } from "../CIDView";
import { CUqUi, IXListUiProps } from "../props";
import { VIXIDList } from "./VIXList";

export class CIXList<TIX extends IDBase, TXI extends IDBase> extends CUqUi<IXListUiProps<TIX, TXI>> {
	pageItems: IXIDPageItems<TIX, TXI>;

	protected async internalStart() {
		let {ID, IX, ix} = this.props;
		this.pageItems = new IXIDPageItems<TIX, TXI>(this.uq, ID, IX, ix);
		await this.pageItems.first({});
		this.openVPage(VIXIDList);
	}

	onAddItem = async () => {
		let {onAddItem} = this.props;
		if (onAddItem === null) return;
		if (onAddItem !== undefined) {
			await onAddItem();
			return;
		}
		let saveItem = async (item: TXI):Promise<number> => {
			let {IX, ID, ix} = this.props;
			let ret = await this.uq.ActIX({
				IX,
				ID,
				values: [{ix:ix?.id, xi:item}]
			});
			return ret[0];
		}
		let cIDEdit = new CIDEdit({
			...this.props, 
			renderRight: undefined,
			onItemChanged: this.onItemChanged,
			saveItem,
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

	private onItemChanged = async (item:TXI) => {
		this.pageItems.update(item);
	}
}

class IXIDPageItems<TIX extends IDBase, TXI extends IDBase> extends PageItems<TXI> {
	private uq:Uq;
	private ID: ID;
	private IX: IX;
	private ix: TIX;
	constructor(uq:Uq, ID:ID, IX:IX, ix:TIX) {
		super(true);
		this.uq = uq;
		this.ID = ID;
		this.IX = IX;
		this.ix = ix;
	}
	async loadResults(param:any, pageStart:any, pageSize:number): Promise<{[name:string]:any[]}> {
		let ret = await this.uq.QueryID<TXI>({
			IX: [this.IX],
			IDX: [this.ID],
			ix: this.ix?.id,
			page: {start:pageStart, size:pageSize},
		});
		return {$page:ret};
	}
	update(item:TXI) {
		let orgItem = this._items.find(v => v.id === item.id);
		if (orgItem) {
			Object.assign(orgItem, item);
		}
		else {
			this._items.unshift(item);
		}
	}
}
